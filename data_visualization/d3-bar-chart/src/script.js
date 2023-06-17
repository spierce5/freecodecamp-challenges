var data;

document.addEventListener("DOMContentLoaded", function () {
  let url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      dataset = json;
    })
    .then(() => generateGraph(dataset.data));
});

const getQuarter = (date) => {
  let quarter = ''
  switch(date.getMonth()){
    case 0: 
    case 1:
    case 2:
      quarter = 'Qtr 1';
      break;
    case 3:
    case 4:
    case 5:
      quarter = 'Qtr 2';
      break;
    case 6:
    case 7:
    case 8:
      quarter = 'Qtr 3';
      break;
    case 9:
    case 10:
    case 11:
      quarter = 'Qtr 4';
      break;
    default:
      break;
  }
  return quarter;
}

const generateGraph = function (data) {
  const height = 300;
  const barWidth = 2.5;
  const gap = 2;
  const width = data.length * (barWidth + gap);
  const padding = 40;
  
  let dates = data.map((d) => new Date(d[0]));

  const xScale = d3.scaleTime()
                    .domain(d3.extent(dates))
                    .range([padding, width - padding]);
                    

  const yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, (d) => d[1])])
                    .range([height - padding, padding]);

  const svg = d3
    .selectAll("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width);
  /*
  svg
    .append("rect")
    .attr("height", height - 2 * padding)
    .attr("width", width - 2 * padding + barWidth + gap)
    .attr("x", padding)
    .attr("y", padding)
    .attr("fill", "#f7f5f5")*/
  // title
  svg
    .append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", height - 5)
    .text("Quarterly Gross Domestic Product");
  
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  svg.append("g")
    .attr('id', 'x-axis')
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis)
    .call(xAxis.tickFormat(d3.timeFormat("%Y")))
    
  
  svg.append("g")
    .attr('id', 'y-axis')
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);
  
  let tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

  // bars
  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(new Date(d[0])))
    .attr('y', (d) => yScale(d[1]))
    .attr('width', barWidth)
    .attr('height', (d) => height - yScale(d[1]) - padding)
    .attr('class', 'bar')
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('fill', '#607D8B')
    .on("mouseover", function(e, data) {
      date = new Date(data[0] + 'T00:00:00')
      year = date.getFullYear()
      display = 'Date: '+ year + ' ' + getQuarter(date) + '\nGDP: ' + data[1];
        tooltip
          .transition()
          .style("opacity", 1);
        tooltip
          .html(display)
          .style("left", e.pageX + 20 + "px")
          .style("top", e.pageY + 20 + "px");
        tooltip.attr("data-date", data[0]);
      })
    .on("mouseout", function(d) {
    tooltip
      .transition()
      .style("opacity", 0);
  });

  
    
  // This works, but doesn't pass tests
  /*
    // bars
  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(new Date(d[0])))
    .attr('y', (d) => yScale(d[1]))
    .attr('width', barWidth)
    .attr('height', (d) => height - yScale(d[1]) - padding)
    .attr('class', 'bar')
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('fill', '#373F47')
    .append('title')
    .text( (d) => {
      date = new Date(d[0] + 'T00:00:00')
      year = date.getFullYear()
      return 'Date: '+ year + ' ' + getQuarter(date) + '\nGDP: ' + d[1];
    })
    .attr('id', 'tooltip')
    .attr('data-date', (d) => d[0])
  */
  
  
  };
