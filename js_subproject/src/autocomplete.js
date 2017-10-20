import * as F from 'fuse.js'
import * as d3 from 'd3'

export function Autocomplete (nodes) {
    const options = {
        keys: ['Display_Name'],
        threshhold: 0.0,
        distance: 100
    }
    
    const Fuse = F.default
    const fuse = new Fuse(nodes, options)
    console.log(nodes)
    // returns only ids
    document.querySelector('#search_input').onkeyup = function () {
        if (this.value.length >= 3) {
            let results = fuse.search(this.value)
            const html = results.reduce((prev, curr) => {
                const li = `<a href="/single_node.html?id=${curr.number}">
                                <li class="autocomplete_item">
                                    <span id="display_name">${curr.Display_Name}</span>` +
                                    (curr.College === '' ? '' : `, <span id="college">${curr.College}</span>`) +
                                    (curr.Year === '' ? '' : `, <span id="year">${curr.Year}</span>`) +
                                `</li>
                            </a>`
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
