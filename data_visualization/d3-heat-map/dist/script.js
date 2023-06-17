document.addEventListener('DOMContentLoaded', function() {
  let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
  fetch(url)
    .then(response => response.json())
    .then( (json) => generateGraph(json))
});

const generateGraph = function(data) {
  let height = 550;
  let width = 1500;
  let paddingTop = 20;
  let paddingSide = 60;
  let titlePadding = 70;
  
  const getColor = function(variance) {
    if(variance >= 3){
      return '#DD2C00'
    }
    else if(variance >= 2){
      return '#FF6D00'
    }
    else if(variance >= 1){
      return '#FFD600'
    }
    else if(variance <= -3){
      return '#01579B'
    }
    else if(variance <= -2){
      return '#039BE5'
    }
    else if(variance <= -1){
      return '#81D4FA'
    }
    else{
      return '#FFF9C4'
    }
  }
  
  let months = data.monthlyVariance.map( (d) => new Date(2000, d.month - 1, 1));
  let years = data.monthlyVariance.map( (d) => new Date(d.year, 0, 1));
  
  const xScale = d3.scaleTime()
    .domain(d3.extent(years))
    .range([paddingSide, width - paddingSide])
  
  const yScale = d3.scaleTime()
    .domain(d3.extent(months))
    .range([height - titlePadding, paddingTop])
  
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3
                  .axisLeft(yScale)
                  .tickFormat( (d) => d3.timeFormat('%B')(d));
  
  let svg = d3
    .selectAll('body')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
  
  svg
    .append('text')
    .attr('id', 'title')
    .text('Heat Map')
    .attr('x', width / 2)
    .attr('text-anchor', 'middle')
    .attr('y', height - titlePadding + 40)
    .attr('font-weight', 'bold')
    .attr('font-size', '22px')
  svg
    .append('text')
    .attr('id', 'description')
    .text('Description of the graph')
    .attr('x', width / 2)
    .attr('text-anchor', 'middle')
    .attr('y', height - titlePadding + 26 + 40)
    .attr('font-size', '18px')
  
  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, ' + (height - titlePadding) + ')')
    .call(xAxis);
  
  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + paddingSide + ', 0)')
    .call(yAxis);
  
  svg
    .selectAll('rect')
    .data(data.monthlyVariance)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('x', (d) => xScale(new Date(d.year, 01, 01)))
    .attr('y', (d) => yScale(new Date(2000, d.month, 01)))
    .attr('width', 60)
    .attr('height', 40)
    .attr('fill', (d) => getColor(d.variance))
    .attr('data-month', (d) => d.month - 1)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => data.baseTemperature + d.variance);
  
  const legendW = width / 3;
  const legendH = titlePadding / 2;
  const legendY = height - titlePadding / 2;
  const legendX = paddingSide;

  const legend = svg
    .append('g')
    .attr('id', 'legend');
  
  legend
    .append('rect')
    .attr('class', 'legend-box')
    .attr('x', legendX)
    .attr('y', legendY)
    .attr('height', legendH)
    .attr('width', legendW)
    .attr('fill', '#263238');
  for(let i = -3; i < 4; i++){
    legend
      .append('rect')
      .attr('x', legendX + (legendW * (i + 3) / 7))
      .attr('y', legendY)
      .attr('height', legendH)
      .attr('width', legendW / 7)
      .attr('fill', getColor(i));
    legend
      .append('text')
      .text(i == 0 ? '' : i < 0 ? '<' + (data.baseTemperature + i) : '>' + (data.baseTemperature + i))
      .attr('x', legendX + (legendW * (i + 3) / 7) + legendW / 14)
      .attr('y', legendY + legendH / 2)
      .style("text-anchor", 'middle')
      .style('alignment-baseline', "central")
      .attr('font-weight', 'bold')
      
  }
  
  
  
};