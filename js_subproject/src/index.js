import * as d3 from 'd3'
import {Autocomplete} from './autocomplete'

const containerDiv = d3.select('#full_network')
const margin = {top: 50, right: 50, bottom: 50, left: 50}
const width = containerDiv.node().clientWidth
const height = containerDiv.node().clientHeight
const svg = containerDiv.append('svg')
    .attr('width', width)
    .attr('height', height)

const plot = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id((d) => { return d.number }).distance(25))
    .force('charge', d3.forceManyBody().strength(-6))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(5))
    .force('x', d3.forceX().strength(0.06))
    // .force('x_', d3.forceX().strength(0.05).x(-width / 2))
    .force('y', d3.forceY().strength(0.1))
    // .force('y_', d3.forceY().strength(0.05).y(-height / 2))

d3.json('./data/network.json', (err, networkData) => {
    if (err) {
        console.log(err)
        return
    }

    // SETTING UP SEARCH
    Autocomplete(networkData.nodes)
    console.log(networkData.links)

    const linksG = plot.append('g')
        .attr('class', 'links')
    const nodesG = plot.append('g')
        .attr('class', 'nodes')
    const rectNodesG = plot.append('g')
        .attr('class', 'rect-nodes')

    function visualise (network) {
        function ticked () {
            if (!ticked.count) {
                ticked.count = 0
                link.attr('x1', width / 2)
                    .attr('y1', height / 2)
                    .attr('x2', width / 2)
                    .attr('y2', height / 2)

                node.attr('cx', width / 2)
                    .attr('cy', height / 2)
            }
            ticked.count++

            if (ticked.count === 5) {
                ticked.count = 1
                link // .transition().duration(50)
                    .attr('x1', function (d) { return d.source.x })
                    .attr('y1', function (d) { return d.source.y })
                    .attr('x2', function (d) { return d.target.x })
                    .attr('y2', function (d) { return d.target.y })

                node // .transition().duration(50)
                    .attr('cx', function (d) { return d.x })
                    .attr('cy', function (d) { return d.y })
            }
        }
        function ended () {
            simulation.alpha(0.1)
            simulation.restart()
        }

        simulation
            .nodes(network.nodes)
            .on('tick', ticked)
            .on('end', ended)

        simulation.force('link')
            .links(network.links)
        simulation.alpha(1)
        simulation.restart()

        let link = linksG
            .selectAll('line')
            .data(network.links, d => d.source + '-' + d.target)
        link.exit().remove()
        link = link.enter()
            .append('line')
            .merge(link)
        link.attr('stroke-width', 0.5)
            .attr('opacity', 0.5)
            .attr('stroke', 'rgba(64, 64, 64, 0.5)')
            .attr('stroke-dasharray', d => d.isInvolvement ? '5, 7' : null)

        let node = nodesG
            .selectAll('circle')
            .data(network.nodes)
        node.exit().remove()
        node = node.enter()
            .append('circle')
            .attr('r', 3)
            .attr('fill', d => d.entityType === 'person' ? 'rgb(175, 51, 53)' : 'rgb(64, 64, 64)')
            .merge(node)
            .on('click', (d) => {
                window.location.replace('./single_node.html?id=' + d.number)
            })

        const filters = [
            {div: 'athletics', data: 'athletics'},
            {div: 'student', data: 'student support'},
            {div: 'campus', data: 'campus life'},
            {div: 'entre', data: 'entrepreneurship'},
            {div: 'research', data: 'research'},
            {div: 'emerging', data: 'emerging priorities'},
            {div: 'faculty', data: 'faculty'}
        ]
        
        filters.forEach(theme => {
            d3.select('#' + theme.div).on('click', function () {
                const links = networkData.links.filter(d => d.theme && d.theme.toLowerCase() === theme.data)
                const nodeIds = new Set(links.map(d => [d.source.number, d.target.number]).reduce((p, c) => p.concat(c), []))
                const nodes = networkData.nodes.filter(d => (nodeIds.has(d.number)))
                setTimeout(function () {
                    ticked.count = 0
                    visualise({nodes: nodes, links: links})
                }, 0)
            })
        })
    }
    visualise(networkData)
})
