import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

createBarChart();

async function createBarChart() {
  // TODO: error handling
  const data = await fetchData();
  drawBarChart(data);
}

async function fetchData() {
  // TODO: error handling
  const response = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  );
  const data = await response.json();
  return data;
}

function drawBarChart(dataSet) {
  const chartWidth = 900;
  const chartHeight = 450;
  const chartPadding = 40;

  // add a svg inside .chart-container
  const svg = d3
    .select(".chart-container")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight);

  // add x and y axis inside svg
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataSet.data, (d) => getYear(d[0])),
      d3.max(dataSet.data, (d) => getYear(d[0])),
    ])
    .range([0, chartWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataSet.data, (d) => d[1])])
    .range([chartHeight, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr(
      "transform",
      `translate(${chartPadding}, ${chartHeight - chartPadding})`
    )
    .call(xAxis);

  svg.selectAll("#x-axis text").attr("class", "tick");

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${chartPadding}, ${-chartPadding})`)
    .call(yAxis);

  svg.selectAll("#y-axis text").attr("class", "tick");

  // add rect inside the svg for represet each data
  svg
    .selectAll("rect")
    .data(dataSet.data)
    .enter()
    .append("rect")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d, i) => i * 3 + chartPadding)
    .attr("y", (d, i) => chartHeight - chartPadding - d[1] / 50)
    .attr("width", 2)
    .attr("height", (d, i) => d[1] / 50)
    .attr("fill", "navy")
    .attr("class", "bar")
    .append("title")
    .text((d) => d)
    .attr("id", "tooltip");
}

function getYear(date) {
  // date must be a string with "yyyy-mm-dd" format
  const year = date.slice(0, 4);
  return parseInt(year);
}
