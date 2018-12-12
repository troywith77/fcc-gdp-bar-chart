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

  // 设置svg的宽，高，padding
  const w = 900, h = 460, padding = 40

  // 取出日期组成新的数组
  const yearsDate = data.map(d => new Date(d[0]))
  // 获取最大的日期
  const xMax = new Date(d3.max(yearsDate))

  // 取出gdp组成新的数组，获取最大值和最小值
  const GDP = data.map(d => d[1])
  const maxGdp = d3.max(GDP)
  const minGdp = d3.min(GDP)

  // scale gdp， domain（数据范围）取0到gdp最大值，range（scale后的范围）取0到高度减去上下的2个padding高度
  const gdpScale = d3
    .scaleLinear()
    .domain([0, maxGdp])
    .range([0, h - padding * 2])

  // scale gdp 到svg上y轴应该对应的值
  const scaleGdp = GDP.map(i => gdpScale(i))
  
  // scale x轴
  const xScale = d3
    .scaleTime()
    .domain([d3.min(yearsDate), xMax])
    .range([padding, w - padding])

  // scale y轴，range里左边是大的值，右边是小的值，可以reverse y轴顺序，否则的话默认0在最上面
  const yScale = d3
    .scaleLinear()
    .domain([0, maxGdp])
    .range([h - padding, padding])

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
  
  // 添加一个svg元素，设置宽高
  const svg = d3
    .select('#container')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

  // 添加说明，旋转90度
  svg
    .append('text')
    .text('Gross Domestic Product')
    .attr('transform', 'rotate(-90)')
    .attr('x', -270)
    .attr('y', 60)

  // 添加x轴，平移到距离底部padding高的地方
  svg
    .append('g')
    .attr('transform', `translate(0, ${h - padding})`)
    .attr('id', 'x-axis')
    .call(xAxis)
    
  // 添加y轴，向右平移padding个px
  svg
    .append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis)

  // 设置一个柱形的宽度为可视x轴区域除以元素个数
  const barWidth = (w - padding * 2) / data.length
  
  // 添加一个group存放所有的rect元素
  svg
    .append('g')
    .attr('class', 'rects')
    
  svg
    .select('.rects')
    .selectAll('rect')
    // 填充数据
    .data(scaleGdp)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', barWidth)
    // 高度为scale过的gdp值
    .attr('height', d => d)
    .attr('x', (d, i) => xScale(yearsDate[i]))
    // whiteGap = h - padding - padding - d
    // y = whiteGap + padding
    .attr('y', d => h - d - padding)
    .attr('data-date', (d, i) => data[i][0])
    .attr('data-gdp', (d, i) => GDP[i])
    .attr('fill', 'rgb(51, 173, 255)')
    .on('mouseover', (d, i) => {
      tooltip.style.display = 'flex'
      tooltip.style.transform = `translate(${xScale(yearsDate[i]) + 10}px, 320px)`
      tooltip.querySelector('#tooltip-date').innerText = data[i][0]
      tooltip.querySelector('#tooltip-gdp').innerText = `$${GDP[i].toLocaleString()} Billion`
    })
    .on('mouseout', () => {
      tooltip.style.display = 'none'
      tooltip.querySelector('#tooltip-date').innerText = ''
      tooltip.querySelector('#tooltip-gdp').innerText = ''
    })
}

main()