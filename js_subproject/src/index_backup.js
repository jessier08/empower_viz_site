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
    .force('link', d3.forceLink().id((d) => { return d.number }).distance(25))
    .force('charge', d3.forceManyBody().strength(-6))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(5))
    .force('x', d3.forceX().strength(0.06))
    // .force('x_', d3.forceX().strength(0.05).x(-width / 2))
    .force('y', d3.forceY().strength(0.1))
    // .force('y_', d3.forceY().strength(0.05).y(-height / 2))

// d3.csv('./data/split_spouses.csv', parse, (err, data) => {
//     if (err) {
//         console.log(err)
//         return
//     }
//     console.log(data[0])
//     const networkData = createNetwork(data)
//     console.log(networkData)
d3.json('./data/network.json', (err, networkData) => {
    if (err) {
        console.log(err)
        return
    }
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

                rectNode.transition()
                    .attr('x', width / 2)
                    .attr('y', height / 2)
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

                rectNode // .transition().duration(50)
                    .attr('cx', function (d) { return d.x })
                    .attr('cy', function (d) { return d.y })
                    // .attr('x', function (d) { return d.x })
                    // .attr('y', function (d) { return d.y })
            }
        }
        function ended () {
            simulation.alpha(0.1)
            simulation.restart()
        }
        ticked.step = 5
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
            .data(network.nodes.filter(d => d.entityType === 'person'), d => d.number)
        node.exit().remove()
        node = node.enter()
            .append('circle')
            .attr('r', 3)
            .attr('fill', 'rgb(175, 51, 53)')
            .merge(node)
            .on('mouseover', (d) => {
                console.log(d);
            })

        let rectNode = rectNodesG
            .selectAll('circle')
            .data(network.nodes.filter(d => d.entityType !== 'person'), d => d.number)
        rectNode.exit().transition().style('opacity', 0).remove()
        rectNode = rectNode.enter()
            .append('circle')
            .attr('r', 3)
            .attr('fill', 'rgb(64, 64, 64)')
            // .attr('width', 5)
            // .attr('height', 5)
            .merge(rectNode)
            .on('mouseover', (d) => {
                console.log(d);
            })

        const filters = [
            {div: 'athletics', data: 'athletics'},
            {div: 'student', data: 'student support'},
            {div: 'campus', data: 'campus life'},
            {div: 'entre', data: 'entrepreneurship'},
            {div: 'research', data: 'research'},
            {div: 'emerging', data: ''},
            {div: 'faculty', data: 'faculty'}
        ]
        
        filters.forEach(theme => {
            d3.select('#' + theme.div).on('click', function () {
                console.log(theme)
                const nodes = networkData.nodes.filter(d => d.themes.indexOf(theme.data) !== -1)
                const nodeIds = new Set(nodes.map(d => d.number))
                const links = networkData.links.filter(d => (nodeIds.has(d.source) && nodeIds.has(d.target)))
                setTimeout(function () {
                    ticked.count = 0
                    visualise({nodes: nodes, links: links})
                }, 0)
            })
        })
    }
    visualise(networkData)
})

function parse (row) { // -> modified row
    row.giveTo = !row.Give_To || row.Give_To === '' ? [] : row.Give_To.split(';').map(d => d.trim())
    row.receiveFrom = !row.Receive_From || row.Receive_From === '' ? [] : row.Receive_From.split(';').map(d => d.trim())
    row.involvementWith = !row.Involvement_With || row.Involvement_With === '' ? [] : row.Involvement_With.split(';').map(d => d.trim())
    row.entityType = row['Entity _Type'].toLowerCase().trim()
    row.number = row['Number'].trim()
    row.themes = row['Involvement_Link_Theme'].toLowerCase().split(';').map(d => d.trim())
    return row
}

function createNetwork (data) {
    let receivers = new Set(), givers = new Set(), involvers = {}
    const links = [], nodes = {}
    // const allNodeIds = new Set(data.map(d => d.number))

    data.forEach(node => {
        nodes[node.number] = node
    })

    data.forEach(d => {
        d.giveTo.forEach(e => receivers.add(e))
        d.receiveFrom.forEach(e => givers.add(e))

        // ADD INVOLVEMENT LINKS
        d.involvementWith.forEach((e, i) => {
            let x = data.filter(f => f.number === e)
            if (x && x[0]) {
                // TODO: filter to have only one connection between 
                links.push({source: d.number, target: e, value: 5, isInvolvement: true, theme: d.themes.length > i ? d.themes[i] : ''})
            }
        })
    })

    receivers = Array.from(receivers)
    givers = Array.from(givers)

    const giversData = {}
    const receiversData = {}

    // IMPACT LINKS
    for (let i = 0; i < data.length; i++) {
        const row = data[i]
        for (let j = 0; j < row.giveTo.length; j++) {
            // giver
            const giver = row.giveTo[j]
            if (!giversData[giver]) {
                giversData[giver] = []
            }
            giversData[giver].push(row)
        }
        for (let j = 0; j < row.receiveFrom.length; j++) {
            // receiver
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
                    links.push({ source: giver.number, target: receiver.number, value: 5 })
                    nodes[giver.number] = giver
                    nodes[receiver.number] = receiver
                }
            }
        }
    }

    var x = { links: links, nodes: Object.values(nodes) }
    console.log(JSON.stringify(x)) // THIS IS THE NETWORK SAVED IN network.json
    return x
}
