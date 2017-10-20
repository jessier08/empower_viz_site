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

d3.csv('./data/final_data.csv', parse, (err, data) => {
    if (err) {
        console.log(err)
        return
    }
    console.log(data[0])

    // GIVE THEME EXCEL SHEET WAY
    const x = {}
    data.forEach(d => {
        for (let i = 0; i < d.giveTo.length; ++i) {
            if (i < d.giveTheme.length) {
                x[d.giveTo[i]] = d.giveTheme[i]
            }
        }
    })
    // let y = ''
    // for (let key in x) {
    //     y += '"'+key + '","' + x[key] + '"\n'
    // }
    // console.log(y)

    const networkData = createNetwork(data, x)
    // console.log(networkData)
})

function parse (row) { // -> modified row
    row.giveTo = !row.Give_To || row.Give_To === '' ? [] : row.Give_To.split(';').map(d => d.trim())
    row.receiveFrom = !row.Receive_From || row.Receive_From === '' ? [] : row.Receive_From.split(';').map(d => d.trim())
    row.involvementWith = !row.Involvement_With || row.Involvement_With === '' ? [] : row.Involvement_With.split(';').map(d => d.trim())
    row.entityType = row['Entity _Type'].toLowerCase().trim()
    row.number = row['Number'].trim()
    row.themes = row['Involvement_Link_Theme'].toLowerCase().split(';').map(d => d.trim())
    row.giveTheme = !row['Give_Receive_Link_Theme'] || row['Give_Receive_Link_Theme'] === '' ? [] : row['Give_Receive_Link_Theme'].split(';').map(d => d.trim())
    return row
}

function createNetwork (data, giverThemes) {
    let receivers = new Set(), givers = new Set(), involvers = {}
    const links = [], nodes = {}
    // const allNodeIds = new Set(data.map(d => d.number))

    data.forEach(node => {
        nodes[node.number] = node
    })

    const involvementLinkSet = new Set()
    data.forEach(d => {
        d.giveTo.forEach(e => receivers.add(e))
        d.receiveFrom.forEach(e => givers.add(e))

        // ADD INVOLVEMENT LINKS
        
        for (let i = 0; i < d.involvementWith.length; ++i) {    
            const e = d.involvementWith[i]
            let x = data.filter(f => f.number === e)
            if (x && x[0]) {
                if (!(involvementLinkSet.has(d.number + '-' + e) && involvementLinkSet.has(e + '-' + d.number))) {
                    involvementLinkSet.add(d.number + '-' + e)
                    links.push({source: d.number, target: e, isInvolvement: true, theme: d.themes.length > i ? d.themes[i] : ''})
                }
            }
        }
    })
    // console.log(involvementLinkSet)
    // debugger

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
                    let theme = Array.from(new Set(giver.giveTo).intersection(new Set(receiver.receiveFrom)))
                    if (theme.length > 0) {
                        theme = theme[0]
                    } else {
                        theme = ''
                    }
                    links.push({ source: giver.number, target: receiver.number, theme: giverThemes[theme] })
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

Set.prototype.intersection = function (setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}