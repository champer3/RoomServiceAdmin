import { useEffect, useRef } from "react";
import * as d3 from 'd3'

export default function Graph({ data }) {
    const graphRef = useRef(null)
    useEffect(() => {
        if (graphRef.current) {
            const margin = { top: 20, right: 20, bottom: 30, left: 50 }
            const width = graphRef.current.clientWidth - margin.left - margin.right
            const height = graphRef.current.clientHeight - margin.top - margin.bottom

            const svg = d3.select(graphRef.current)
            const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

            const parseTime = d3.timeParse('%Y-%m-%d')
            const x = d3.scaleTime().range([0, width])
            const y = d3.scaleLinear().range([height, 0])

            const line = d3.line()
                .x((d) => x(parseTime(d.date)))
                .y((d) => y(d.value))

            const tickDates = data.map((d) => {
                const lastDayOfMonth = new Date(d.date);
                lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1, 0); // Set to last day of month
                return lastDayOfMonth;
            })
            const desiredTicks = tickDates.slice(1, -1)

            const xAxis = d3.axisBottom(x)
                .tickValues(desiredTicks)
                .tickSizeOuter(0)
                .tickFormat(d3.timeFormat('%b'))

            const yAxis = d3.axisLeft(y)
                .tickSize(-1300)

            x.domain(d3.extent(data, (d) => parseTime(d.date)))
            y.domain([0, d3.max(data, (d) => d.value)])

            g.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(xAxis)



            g.append('g')
                .call(yAxis)

            g.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', '#BC6C25')
                .attr('stroke-width', 2.5)
                .attr('d', line)
                .on('mouseover', (event, d) => {
                    const tooltip = d3.select('body').append('div')
                        .attr('class', 'tooltip')
                        .style('opacity', 0);

                    tooltip.transition()
                        .duration(20)
                        .style('opacity', 0.9)

                    tooltip.html(`Date: ${d.date}<br>Value: ${d.value}`)
                        .style('left', `${event.pageX + 10}px`)
                        .style('top', `${event.pageY - 15}px`);
                })
                .on('mouseout', () => {
                    d3.select('.tooltip').remove(); 
                })

            g.selectAll('text')
                .attr('fill', '#AAAAAA')
                .attr('font-size', '12px')

            g.selectAll('line')
                .attr('stroke', '#CCCCCC')
                .attr('stroke-dasharray', '1')

            g.selectAll('.domain')
                .attr('stroke', '#AAAAAA')
        }
    }, [data]);

    return (
        <div className="">
            <svg ref={graphRef} width="" height="300"></svg>
        </div>
    )
}