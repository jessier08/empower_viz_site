import * as d3 from 'd3'
import {Autocomplete} from './autocomplete'

var urlParams;
(window.onpopstate = function () {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')) },
        query = window.location.search.substring(1)

    urlParams = {};
    while (match = search.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2])
    }
})()

const containerDiv = d3.select('#single_node_diagram')
const margin = {top: 50, right: 50, bottom: 50, left: 50}
const width = containerDiv.node().clientWidth
const height = containerDiv.node().clientHeight
const svg = containerDiv.append('svg')
    .attr('width', width)
    .attr('height', height)
const biggerCircleRadius = d3.min([height, width]) * 0.4
const smallerCircleRadius = biggerCircleRadius * 2 / 3

const plot = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id((d) => { return d.number }).strength(0.1))
    .force('manyBody', d3.forceManyBody().strength(-40))
    .force('radial', d3.forceRadial(biggerCircleRadius, width / 2, height / 2).strength(1))

d3.json('./data/network.json', (err, data) => {
    if (err) {
        console.log(err)
        return
    }
    console.log(data)
    Autocomplete(data.nodes)
    // Person357
    const network = goTwoLevelsDeep(urlParams.id, data)
    // const network = goTwoLevelsDeep('NonPerson125', data)

    // HIGHLIGHT THEMES
    const centralNode = data.nodes.filter(d => d.number === urlParams.id)
    if (centralNode && centralNode.length) {
        const giveThemes = centralNode[0]['Give_Receive_Link_Theme'].split(';').map(d => d.trim())
        let allThemes = new Set(centralNode[0].themes.concat(giveThemes).filter(d => d !== ''))
        allThemes = Array.from(allThemes)
        console.log(allThemes)
        d3.selectAll('p.legend_theme')
            .style('opacity', 0.1)
        allThemes.forEach(theme => {
            document.querySelectorAll('p.legend_theme[data-name="' + theme + '"]')
            d3.select('p.legend_theme[data-name="' + theme + '"]')
                .style('opacity', 1)

        })
    }

    simulation.nodes(network.nodes)
        .on('tick', ticked)

    simulation.force('link')
        .links(network.links)

    plot.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', smallerCircleRadius)
        .style('fill', 'none')
        .style('stroke', 'rgba(186, 62, 79, 0.1)')
        .style('stroke-width', '3')

    plot.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', biggerCircleRadius)
        .style('fill', 'none')
        .style('stroke', 'rgba(186, 62, 79, 0.1)')
        .style('stroke-width', '3')

    let link = plot.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(network.links)
        .enter().append('line')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.5)
        .attr('stroke', 'grey')
        .attr('stroke-dasharray', d => d.isInvolvement ? '5, 7' : null)

    let node = plot.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(network.nodes)
        .enter().append('circle')
        .attr('r', d => d.level === 0 ? 25 : (d.level === 1 ? 10 : 5))
        .attr('fill', d => d.entityType.toLowerCase().trim() === 'person' ? 'rgb(175, 51, 53)' : 'rgb(64, 64, 64)')
        .attr('cx', function (d) { return d.fx })
        .attr('cy', function (d) { return d.fy })
        .on('mouseover', function (d) {
            console.log(d)
        })

    function ticked () {
        node.attr('cx', d => d.x)
            .attr('cy', d => d.y)
        link.attr('x1', function (d) { return d.source.x })
            .attr('y1', function (d) { return d.source.y })
            .attr('x2', function (d) { return d.target.x })
            .attr('y2', function (d) { return d.target.y })
    }
})

function goTwoLevelsDeep (number, network) {
    const node = network.nodes.filter(d => d.number === number)[0]
    node.fx = width / 2
    node.fy = height / 2

    const level1Links = network.links.filter(d => d.source === node.number || d.target === node.number)
    const level1NodeIds = new Set(level1Links.map(d => {
        if (d.source === node.number) {
            return d.target
        } else if (d.target === node.number) {
            return d.source
        }
        return null
    }))
    let level1Nodes = network.nodes.filter(d => level1NodeIds.has(d.number))
    level1Nodes = level1Nodes.map((d, i) => {
        const x = d.deepExtend()
        x.level = 1
        const coords = circleCoord({x: width / 2, y: height / 2}, smallerCircleRadius, 0, i, level1Nodes.length)
        x.fx = coords.x
        x.fy = coords.y
        return x
    })

    let level2Links = network.links.filter(d => level1NodeIds.has(d.source) || level1NodeIds.has(d.target))
    let level2NodeIds = new Set(level2Links.map(d => {
        if (level1NodeIds.has(d.source)) {
            return d.target
        } else if (level1NodeIds.has(d.target)) {
            return d.source
        }
        return null
    }))
    level2Links = level2Links.filter(d => !(level2NodeIds.has(d.source) && level2NodeIds.has(d.target)))
    level2NodeIds = new Set(level2Links.map(d => {
        let num = null
        if (level1NodeIds.has(d.source)) {
            num = d.target
        } else if (level1NodeIds.has(d.target)) {
            num = d.source
        }
        if (num === number) {
            return null
        }
        return num
    }))
    let level2Nodes = network.nodes.filter(d => level2NodeIds.has(d.number) && !level1NodeIds.has(d.number))
    level2Nodes = level2Nodes.map((d, i) => {
        const x = d.deepExtend()
        x.level = 2
        return x
    })

    var centerNode = node.deepExtend()
    centerNode.level = 0
    centerNode.fx = width / 2
    centerNode.fy = height / 2

    return {links: level1Links.concat(level2Links), nodes: level1Nodes.concat(level2Nodes).concat([centerNode])}
}

// evenly spaces nodes along arc
function circleCoord (center, radius, startAngle, index, numNodes) {
    const angle = (index * (360.0 / numNodes)) + startAngle
    const x = (Math.cos(angle * Math.PI / 180.0) * radius) + center.x
    const y = (Math.sin(angle * Math.PI / 180.0) * radius) + center.y
    return { x: x, y: y }
}

Object.prototype.deepExtend = function() {
    const source = this
    var destination = {}
    for (var property in source) {
      if (source[property] && source[property].constructor && source[property].constructor === Object) {
        destination[property] = destination[property] || {};
        arguments.callee(destination[property], source[property]);
      } else if (source[property] && source[property] && (source[property] instanceof Array)) {
        destination[property] = destination[property] || [];
        source[property].forEach(e => {
            destination[property].push(e.deepExtend())
        })
      } else {
        destination[property] = source[property];
      }
    }
    return destination;
  };

/**
 * Fullname, bio: non-humans
 * Fullname only: parents
 * Fullname degree: alumns
 * First name, degree: current students 
 */ 
