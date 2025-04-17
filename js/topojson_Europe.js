נראה שהקישור לקובץ TopoJSON של מפת אירופה שהשתמשנו בו אינו תקף עוד. לכן, נשתמש בקובץ TopoJSON זמין אחר ממקור אמין.

---

### ✅ קובץ `index.html` מעודכן עם קובץ TopoJSON תקין:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Europe Map Quiz</title>
  <script src="https://d3js.org/d3.v5.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/topojson-client@3"></script>
  <style>
    body {
      font-family: sans-serif;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    #map-container {
      width: 100%;
      height: 600px;
      position: relative;
    }
    svg {
      border: 1px solid #ddd;
      width: 100%;
      height: 100%;
    }
    path {
      fill: #f0f0f0;
      stroke: #333;
      stroke-width: 0.5px;
      transition: all 0.3s ease;
    }
    path:hover {
      fill: steelblue;
      cursor: pointer;
    }
    .guessed {
      stroke: #0077cc !important;
      stroke-width: 3px !important;
      fill-opacity: 1 !important;
    }
    #country-list {
      list-style: none;
      padding: 0;
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      width: 100%;
    }
    #country-list li {
      background-color: #fff;
      border: 1px solid #ddd;
      padding: 8px 15px;
      cursor: pointer;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      user-select: none;
      position: relative;
      z-index: 2;
    }
    #country-list li:active {
      cursor: grabbing;
    }
    .matched {
      background-color: lightgreen;
      border-color: green;
      color: gray;
      cursor: not-allowed;
    }
    .selected {
      background-color: lightblue;
    }
    .error {
      color: red;
    }
    #scoreboard {
      margin-top: 10px;
      font-size: 1.1em;
    }
    #restart-button {
      margin-top: 10px;
      padding: 8px 16px;
      font-size: 1em;
      cursor: pointer;
      background-color: #0077cc;
      color: white;
      border: none;
      border-radius: 5px;
    }
    #restart-button:hover {
      background-color: #005fa3;
    }
  </style>
</head>
<body>
  <div id="map-container">
    <svg></svg>
  </div>
  <ul id="country-list"></ul>
  <div id="feedback"></div>
  <div id="scoreboard">
    <strong>Score:</strong> <span id="score">0</span> |
    <strong>Attempts:</strong> <span id="attempts">0</span>
  </div>
  <button id="restart-button">Restart Game</button>
  <div id="victory-message" style="display: none; font-size: 1.3em; color: green; margin-top: 10px;"></div>

  <script>
    const mapContainer = d3.select('#map-container');
    const svg = d3.select('svg');
    const width = mapContainer.node().getBoundingClientRect().width;
    const height = mapContainer.node().getBoundingClientRect().height;

    const projection = d3.geoMercator()
      .center([20, 55])
      .scale(500)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    let selectedCountry = null;
    let score = 0;
    let attempts = 0;
    let correctGuesses = 0;

    d3.json('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson')
      .then(data => {
        const countries = topojson.feature(data, data.objects.europe);
        const countryPaths = svg.selectAll('path')
          .data(countries.features)
          .enter().append('path')
          .attr('d', path)
          .attr('id', d => 'country-' + d.id);

        const countryList = d3.select('#country-list');
        const countryNames = countries.features.map(d => ({
          id: d.id,
          name: d.properties.NAME,
          centroid: path.centroid(d)
        }));

        const countryItems = countryList.selectAll('li')
          .data(countryNames)
          .enter().append('li')
          .attr('id', d => 'country-' + d.id)
          .text(d => d.name)
          .on('click', function(d) {
            if (!d3.select(this).classed('matched')) {
              countryList.selectAll('li').classed('selected', false);
              selectedCountry = d;
              d3.select(this).classed('selected', true);
              d3.select('#feedback').text('');
            }
          });

        countryPaths.on('click', function(d) {
          const feedbackElement = d3.select('#feedback');

          if (selectedCountry) {
            attempts++;
            d3.select('#attempts').text(attempts);

            if (d.id === selectedCountry.id) {
              score += 10;
              correctGuesses++;
              d3.select('#score').text(score);
              feedbackElement.text('Correct!').classed('error', false);

              d3.select(this)
                .classed('guessed', true)
                .style('pointer-events', 'none');

              const matchedItem = d3.select('#country-' + selectedCountry.id);
              matchedItem
                .classed('matched', true)
                .classed('selected', false)
                .on('click', null);

              selectedCountry = null;

              if (correctGuesses === countryNames.length) {
                d3.select('#victory-message')
                  .text(`🎉 You won! Final score: ${score} in ${attempts} attempts.`)
                  .style('display', 'block');
              }

            } else {
              feedbackElement.text('Incorrect! Try again.').classed('error', true);
            }
          } else {
            feedbackElement
              .text('Please select a country name first.')
              .classed('error', true);
          }
        });

        d3.select('#restart-button').on('click', () => {
          location.reload();
 