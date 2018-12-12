import 'babel-polyfill'
import * as d3 from 'd3'
import axios from 'axios'

const fetchData = async () => {
  const data = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
  return data
}

const main = async () => {
  const meta = await fetchData()
  const { data } = meta
  console.log(meta)
  console.log(data)
  const w = 900, h = 460, padding = 40

  const xScale = d3.scaleLinear()
  xScale.domain([
    +d3.min(data, d => d[0].split('-')[0]),
    +d3.max(data, d => d[0].split('-')[0]) + 1
  ])
  xScale.range([padding, w - padding])

  const yScale = d3.scaleLinear()
  console.log(d3.min(data, d => d[1]), d3.max(data, d => d[1]))
  yScale.domain([d3.max(data, d => d[1]), 0])
  yScale.range([padding, h - padding])

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
  
  d3
    .select('body')
    .append('h1')
    .attr('id', 'title')
    .text('United States GDP')
  
  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

  svg
    .append('text')
    .text('Gross Domestic Product')
    .attr('transform', 'rotate(-90)')
    .attr('x', -270)
    .attr('y', 60)

  svg
    .append('g')
    .attr('transform', `translate(0, ${h - padding})`)
    .attr('id', 'x-axis')
    .call(xAxis)
    
    svg
    .append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis)


  const rects = svg.append('g')
  data.forEach((item) => {
    const height = h - padding - yScale(item[1])
    const year = +item[0].split('-')[0]
    const offset = Math.floor(parseInt(item[0].split('-')[1]) / 3)
    rects
      .append('rect')
      .attr('class', 'bar')
      .attr('width', w / data.length)
      .attr('height', height)
      .attr('x', xScale(year + offset / 4))
      .attr('y', h - padding - height)
      .attr('data-date', item[0])
      .attr('data-gdp', item[1])
      .attr('fill', 'rgb(51, 173, 255)')
  })
    
}

main()