import 'babel-polyfill'
import * as d3 from 'd3'
import axios from 'axios'

const fetchData = async () => {
  const data = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
  return data
}

const main = async () => {
  const tooltip = document.querySelector('#tooltip')
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
  
  const svg = d3
    .select('#container')
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

  const barWidth = w / data.length
  svg
    .append('g')
    .attr('class', 'rects')
  svg
    .select('.rects')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', barWidth)
    .attr('height', d => h - padding - yScale(d[1]))
    .attr('x', (d, i) => {
      const year = Number(d[0].split('-')[0])
      const quater = Number((i % 4 / 4))
      return xScale(year + quater)
    })
    .attr('y', d => yScale(d[1]))
    .attr('data-date', d => d[0])
    .attr('data-gdp', d => d[1])
    .attr('fill', 'rgb(51, 173, 255)')
    .on('mouseover', (d, i) => {
      const year = Number(d[0].split('-')[0])
      const quater = Number((i % 4 / 4))
      tooltip.style.display = 'flex'
      tooltip.style.transform = `translate(${xScale(year + quater + 5)}px, 320px)`
      tooltip.querySelector('#tooltip-date').innerText = d[0]
      tooltip.querySelector('#tooltip-gdp').innerText = `$${d[1].toLocaleString()} Billion`
    })
    .on('mouseout', () => {
      tooltip.style.display = 'none'
      tooltip.querySelector('#tooltip-date').innerText = ''
      tooltip.querySelector('#tooltip-gdp').innerText = ''
    })
}

main()