document.addEventListener('DOMContentLoaded', function() {
  let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  fetch(url)
    .then( (response) => response.json())
    .then( (json) => {
    dataset = json;
    })
    .then( () => generateGraph(dataset) );
});

const generateGraph = function(data) {
  const height = 500;
  const width = 700;
  const padding = 35;
  
  const getColor = function(value) {
    if(/.+/.test(value)){
      return '#d7816a';
    }
    else {
      return '#91c7b1'
    }
  }
  
  let years = data.map( (d) => new Date(d.Year, 0, 1));
  //let times = data.map( (d) => parseInt(d.Time.slice(0,2)) + (parseInt(d.Time.slice(3)) / 60));
  let times = data.map( (d) => new Date(2000, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1]))
  
  //let temp = data.map( (d) => new Date(2000, 0, 1, 1, d.Time.split(':')[0], d.Time.split(':')[1]));
  //console.log(temp)
  
  minYear = new Date(d3.min(years).getTime())
  minYear.setFullYear(d3.min(years).getFullYear() - 1)
  
  maxYear = new Date(d3.max(years).getTime())
  maxYear.setFullYear(d3.max(years).getFullYear() + 1)
  
  const startTime = d3.min(times);
  startTime.setSeconds(0);
  const endTime = d3.max(times);
  endTime.setSeconds(0);
  endTime.setMinutes(endTime.getMinutes() + 1)
    
  const xScale = d3.scaleTime()
    .domain([minYear, maxYear]) 
    .range([padding, width - padding]);
    
  const yScale = d3.scaleTime()
    //.domain([Math.floor(d3.min(times)), Math.round(d3.max(times))])
    .domain(d3.extent(times))
    .range([height - padding, padding])
  
  const svg = d3
    .selectAll('body')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
  
  svg
    .append('text')
    .attr('id', 'title')
    .text('Doping in Cycling')
    .attr('x', width / 2)
    .attr('y', padding)
    .attr('text-anchor', 'middle')
  
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);    
  
  svg.append("g")
    .attr('id', 'x-axis')
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis)
  
  svg.append("g")
    .attr('id', 'y-axis')
    .attr("transform", "translate(" + (padding) + ", 0)")
    .call(yAxis)
    .call(yAxis.tickFormat(d3.timeFormat("%M:%S")))
  
  let tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);
  
  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', (d) => xScale(new Date(d.Year, 0, 1)))
    .attr('cy', (d) => yScale(new Date(2000, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1])))
    .attr('r', 5)
    .attr('data-xvalue', (d) => d.Year)
    .attr('data-yvalue', (d) => new Date(2000, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1]))
    .attr('fill', (d) => getColor(d.Doping))
    .attr('stroke', 'black')
    .on('mouseover', function(e, data) {
      let attributes = ['Name: ' + data.Name, 
                        'Time: ' + data.Time, 
                        'Place: ' + data.Place, 
                        'Seconds: ' + data.Seconds, 
                        'Year: ' + data.Year, 
                        'Nationality: ' + data.Nationality, 
                        'Doping: ' + data.Doping.replace(/^$/, 'None')];
      let display = attributes.join('<br/>')
      tooltip
        .transition()
        .style('opacity', 1)
      tooltip
        .html(display)
        .style('left', e.pageX + 20 + 'px')
        .style('top', e.pageY + 20 + 'px')
        .attr('data-year', d3.select(this).attr('data-xvalue'))
    })
    .on('mouseout', function(e, data) {
      tooltip
        .transition()
        .style('opacity', 0)
    })
  
  const legendW = 110;
  const legendH = 80;
  const legendY = height * 2 / 3;
  const legendX = width - legendW - padding;

  const legend = svg
    .append('g')
    .attr('id', 'legend')
  
  legend
    .append('rect')
    .attr('class', 'legend-box')
    .attr('height', height / 4)
    .attr('width', width / 4)
    .attr('x', legendX)
    .attr('y', legendY)
    .attr('height', legendH)
    .attr('width', legendW)
  
  legend
    .append('text')
    .text('Legend:')
    .attr('x', legendX + (legendW / 4))
    .attr('y', legendY + (legendH / 4))
    .attr('font-weight', 'bold')
  
  legend
    .append('circle')
    .attr('cx', legendX + (legendW / 8))
    .attr('cy', legendY + (legendH / 2))
    .attr('class', 'legend-dot')
    .attr('fill', getColor(''))
    
  legend
    .append('circle')
    .attr('cx', legendX + (legendW / 8))
    .attr('cy', legendY + (legendH / 2) + (legendH / 3))
    .attr('class', 'legend-dot')
    .attr('fill', getColor('a'))
  
  legend
    .append('text')
    .text('Doping')
    .attr('x', legendX + (legendW / 8) + 12)
    .attr('y', legendY + (legendH / 2) + (legendH / 3) + 5)
  
  legend
    .append('text')
    .text('No Doping')
    .attr('x', legendX + (legendW / 8) + 12)
    .attr('y', legendY + (legendH / 2) + 5)
    
};