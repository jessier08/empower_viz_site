import * as d3 from 'd3'

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
    .force('link', d3.forceLink().id((d) => { return d.displayName }))
    .force('charge', d3.forceManyBody().strength(-0.3))
    .force('center', d3.forceCenter(width / 2, height / 2))

d3.csv('./data/split_spouses.csv', parse, (err, data) => {
    if (err) {
        console.log(err)
        return
    }
    console.log(data[0])
    const links = createNetwork(data)

    console.log(links)

    simulation
        .nodes(data)
        .on('tick', ticked)

    simulation.force('link')
        .links(links)

    let link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', 'grey')
        .attr('stroke-dasharray', d => d.involvement ? '5, 5' : null)

    let node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(data.filter(d => d.entityType.toLowerCase().trim() === 'person'))
        .enter().append('circle')
        .attr('r', 2.5)
        // .attr('fill', function (d) { return color(d.group) })

    let rectNode = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('rect')
        .data(data.filter(d => d.entityType.toLowerCase().trim() !== 'person'))
        .enter().append('rect')
        .attr('width', 5)
        .attr('height', 5)

    function ticked () {
        link.attr('x1', function (d) { return d.source.x })
            .attr('y1', function (d) { return d.source.y })
            .attr('x2', function (d) { return d.target.x })
            .attr('y2', function (d) { return d.target.y })

        node
            .attr('cx', function (d) { return d.x })
            .attr('cy', function (d) { return d.y })

        rectNode
            .attr('x', function (d) { return d.x })
            .attr('y', function (d) { return d.y })
    }
})

function parse (row) { // -> modified row
    row.giveTo = row.giveTo === '' ? [] : row.giveTo.split(';').map(d => d.trim())
    row.receiveFrom = row.receiveFrom === '' ? [] : row.receiveFrom.split(';').map(d => d.trim())
    row.involvementWith = row.involvementWith === '' ? [] : row.involvementWith.split(';').map(d => d.trim())
    return row
}

function createNetwork (data) {
    const namesSet = new Set(data.map(d => d.displayName))
    const set = new Set()
    const links = []

    const checkOccurance = function (d, row, involvement = false) {
        if (!(set.has(`${d}---${row.displayName}`) || set.has(`${row.displayName}---${d}`))) {
            // if the name and giveTo name don't (!) exist in the set
            if (!namesSet.has(row.displayName) || !namesSet.has(d)) {
                return
            }

            set.add(`${d}---${row.displayName}`)
            links.push({source: row.displayName, target: d, involvement: involvement})
        }
    }

    for (let i = 0; i < data.length; i++) {
        const row = data[i]
        row.giveTo.forEach(d => { checkOccurance(d, row) })
        row.receiveFrom.forEach(d => { checkOccurance(d, row) })
        row.involvementWith.forEach(d => { checkOccurance(d, row, true) })
    }

    return links
}
