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
    .force('link', d3.forceLink().id((d) => { return d.number }).distance(5).strength(0.5))
    .force('charge', d3.forceManyBody().strength(-3))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX())
    .force("y", d3.forceY())

d3.csv('./data/split_spouses.csv', parse, (err, data) => {
    if (err) {
        console.log(err)
        return
    }
    console.log(data[0])
    const network = createNetwork(data)

    console.log(network)

    simulation
        .nodes(network.nodes)
        .on('tick', ticked)

    simulation.force('link')
        .links(network.links)

    let link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(network.links)
        .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', 'grey')
        .attr('stroke-dasharray', d => d.involvement ? '5, 5' : null)

    let node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(network.nodes.filter(d => d.entityType.toLowerCase().trim() === 'person'))
        .enter().append('circle')
        .attr('r', 2.5)
        .attr('fill', 'rgb(175, 51, 53)')

    let rectNode = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('rect')
        .data(network.nodes.filter(d => d.entityType.toLowerCase().trim() !== 'person'))
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
    let receivers = new Set(), givers = new Set()
    const giveToData = {}, receiveFromData = {}
    const links = [], nodes = {}

    data.forEach(d => {
        d.giveTo.forEach(e => receivers.add(e) )
        d.receiveFrom.forEach(e => givers.add(e) )
    })

    receivers = Array.from(receivers)
    givers = Array.from(givers)

    const giversData = {}
    const receiversData = {}

    for (let i = 0; i < data.length; i++) {
        const row = data[i]
        for (let j = 0; j < row.giveTo.length; j++) {
            const giver = row.giveTo[j]
            if (!giversData[giver]) {
                giversData[giver] = []
            }
            giversData[giver].push(row)
        }
        for (let j = 0; j < row.receiveFrom.length; j++) {
            const receiver = row.receiveFrom[j]
            if (!receiversData[receiver]) {
                receiversData[receiver] = []
            }
            receiversData[receiver].push(row)
        }
    }

    const connectors = Array.from(new Set(Object.keys(giversData).concat(Object.keys(receiversData))))

    for (let i = 0; i < connectors.length; i++) {
        const giverNodes = giversData[connectors[i]]
        const receiverNodes = receiversData[connectors[i]]
        if (!(giverNodes && giverNodes.length && receiverNodes && receiverNodes.length)) {
            continue
        }
        for (let j = 0; j < giverNodes.length; j++) {
            const giver = giverNodes[j]
            for (let k = 0; k < receiverNodes.length; k++) {
                const receiver = receiverNodes[k]
                if (links.filter(d => (d.source === receiver.number && d.target === giver.number) || (d.source === giver.number && d.target === receiver.number) ).length === 0) {
                    links.push({ source: giver.number, target: receiver.number, value: 1 })
                    nodes[giver.number] = giver
                    nodes[receiver.number] = receiver
                }
            }
        }
    }

    return { links: links, nodes: Object.values(nodes)}
}
