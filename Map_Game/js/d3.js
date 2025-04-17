<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D3.js Bar Chart Example</title>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <style>
      body {
        font-family: sans-serif;
      }
      svg {
        border: 1px solid #ddd;
        margin-bottom: 20px;
      }
      .bar {
        fill: steelblue;
      }
      .bar-label {
        fill: black;
        font-size: 12px;
        alignment-baseline: middle; /* Vertically center the label */
      }
      .axis path,
      .axis line {
        fill: none;
        stroke: #333;
        shape-rendering: crispEdges;
      }
      .axis text {
        fill: black;
        font-size: 10px;
      }
    </style>
</head>
<body>
    <svg width="400" height="200"></svg>
    <script>
      // 1. Data:  An array of objects.  Each object has a 'name' and a 'value'.
      const data = [
        { name: 'A', value: 20 },
        { name: 'B', value: 35 },
        { name: 'C', value: 15 },
        { name: 'D', value: 40 },
        { name: 'E', value: 25 },
      ];

      // 2. Select the SVG element where we'll put the chart.
      const svg = d3.select('svg');

      // 3. Define the chart's dimensions and margins.
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = svg.attr('width') - margin.left - margin.right;
      const height = svg.attr('height') - margin.top - margin.bottom;

      // 4. Create a group element ('g') inside the SVG.  This will hold the chart.
      //    The 'transform' attribute moves the group to the correct position.
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      // 5. Create scales.  Scales map data values to visual values (e.g., pixel positions).
      //    - xScale:  A band scale for the x-axis (for the names 'A', 'B', 'C', etc.).
      //    - yScale:  A linear scale for the y-axis (for the values 20, 35, 15, etc.).
      const x = d3.scaleBand()
        .domain(data.map(d => d.name))  // The domain is the set of input values.
        .rangeRound([0, width])        // The range is the set of output values (pixels).
        .padding(0.1);               // Add some padding between the bars.

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]) // Domain: from 0 to the maximum value in the data.
        .rangeRound([height, 0]);       // Range: from the top of the chart to the bottom.
                                       // In SVG, y increases downwards, so we reverse the range.

      // 6. Create the axes.  Axes are visual components that show the scales.
      //    - xAxis:  The x-axis, positioned at the bottom of the chart.
      //    - yAxis:  The y-axis, positioned on the left of the chart.
      g.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`) // Move the x-axis to the bottom.
        .call(d3.axisBottom(x));                   // Create the x-axis using the xScale.

      g.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(y).ticks(5));      // Create the y-axis using the yScale.
                                           // .ticks(5) suggests showing 5 tick marks.

      // 7. Create the bars.  Each bar is a rectangle ('rect') element in the SVG.
      g.selectAll('.bar')
        .data(data)             // Bind the data to the bars.  For each data point,
        .enter().append('rect')  // create a new 'rect' element.
        .attr('class', 'bar')    // Add a class name so we can style the bars in CSS.
        .attr('x', d => x(d.name))         // Set the x-position of the bar based on its name.
        .attr('y', d => y(d.value))         // Set the y-position of the bar based on its value.
        .attr('width', x.bandwidth())     // Set the width of the bar.
        .attr('height', d => height - y(d.value)); // Set the height of the bar.
                                                  // y(d.value) is the y-position, and height is the bottom of the chart.

      // 8. Add labels to the bars.
      g.selectAll('.bar-label')
        .data(data)
        .enter().append('text')
        .attr('class', 'bar-label')
        .attr('x', d => x(d.name) + x.bandwidth() / 2)  // Center the label horizontally within the bar.
        .attr('y', d => y(d.value) - 5)                // Position the label above the bar.
        .text(d => d.value);                           // Set the text of the label to the bar's value.

    </script>
</body>
</html>
