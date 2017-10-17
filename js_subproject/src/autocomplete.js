import * as F from 'fuse.js'
import * as d3 from 'd3'

export function Autocomplete (nodes) {
    const options = {
        keys: ['Display_Name'],
        id: 'number',
        threshhold: 0.0,
        distance: 0
    }
    
    const Fuse = F.default
    const fuse = new Fuse(nodes, options)
    // returns only ids
    document.querySelector('#search_input').onkeyup = function () {
        if (this.value.length >= 3) {
            let results = new Set(fuse.search(' ' + this.value))
            results = nodes.filter(d => results.has(d.number))
            const html = results.reduce((prev, curr) => {
                const li = '<a href="/single_node.html?id=' + curr.number + '"><li class="autocomplete_item">' +
                    curr.Display_Name +
                    '</li></a>'
                return prev + li
            }, '')
            const rect = d3.select('#search_bar').node().getBoundingClientRect()
            d3.select('#search_autocomplete_container')
                .style('width', rect.width + 'px')
                .style('top', (rect.top + rect.height) + 'px')
                .style('right', (window.innerWidth - rect.right) + 'px')

            document.querySelector('#search_autocomplete').innerHTML = html
            showAutocompleteList()
        }
    }
    const closeAutocompleteList = function () {
        d3.select('#search_autocomplete_container').style('display', 'none')
        document.querySelector('#search_input').value = ''
    }
    const showAutocompleteList = function () {
        d3.select('#search_autocomplete_container').style('display', 'initial')
    }
    document.onclick = closeAutocompleteList
    document.ontouchstart = closeAutocompleteList
}
