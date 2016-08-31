/*
  @description defines the names which will be used to title the chords
*/
var nameProvider = [
  'Bob', 'Giovanni', 'Steve', 'Kevin', 'Art', 'Pyotr', 'Rohan', 'Sasha', 'Emily', 'Rachel', 'Poh', 'Viva', 'Lee'
]

var matrix = [
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // Bob
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // Giovanni
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // Steve
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], // Kevin
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], // Art
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], // Pyotr
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // Rohan
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // Rachel
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Sasha
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], // Emily
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], // Lee
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // Viva
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]  // Poh
]

// these are the colours used for the different people
// we have 13 people, so there should be 13 colours
// Bob, Giovanni, Steve, Kevin, Art, Pyotr, Rohan - blue - #91A8D0
// Sasha - aqua - #98DDDE
// Emily, Rachel, Poh, Viva - pink - #F7CAC9
// Lee - purple - #9896A4
var colours = (['#91A8D0', '#91A8D0', '#91A8D0', '#91A8D0', '#91A8D0', '#91A8D0', '#91A8D0', '#98DDDE', '#F7CAC9', '#F7CAC9', '#F7CAC9', '#F7CAC9', '#9896A4'])

var svg = d3.select('svg')
var width = +svg.attr('width')
var height = +svg.attr('height')
var outerRadius = Math.min(width, height) * 0.5 - 40
var innerRadius = outerRadius - 30

// var formatValue = d3.formatPrefix(',.0', 1e3);

var chord = d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending)

var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)

var ribbon = d3.ribbon()
    .radius(innerRadius)

var color = d3.scaleOrdinal()
    .domain(d3.range(nameProvider.length))
    .range(colours)

var g = svg.append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .datum(chord(matrix))

var group = g.append('g')
    .attr('class', 'groups')
  .selectAll('g')
    .data(function (chords) { return chords.groups })
  .enter().append('g')

  // Create a gradient definition for each chord
  // Courtesy of https://twitter.com/NadiehBremer
  // http://www.visualcinnamon.com/2016/06/orientation-gradient-d3-chord-diagram.html
  // //////////////////////////////////////////////////////////
  // ///////////// Create the gradient fills //////////////////
  // //////////////////////////////////////////////////////////

  // Function to create the unique id for each chord gradient
function getGradID (d) { return 'linkGrad-' + d.source.index + '-' + d.target.index }

  // Create the gradients definitions for each chord
var grads = svg.append('defs').selectAll('linearGradient')
  .data(chord(matrix))
     .enter().append('linearGradient')
      // Create the unique ID for this specific source-target pairing
  .attr('id', getGradID)
  .attr('gradientUnits', 'userSpaceOnUse')
  // Find the location where the source chord starts
  .attr('x1', function (d, i) { return innerRadius * Math.cos((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2) })
  .attr('y1', function (d, i) { return innerRadius * Math.sin((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2) })
  // Find the location where the target chord starts
  .attr('x2', function (d, i) { return innerRadius * Math.cos((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2) })
  .attr('y2', function (d, i) { return innerRadius * Math.sin((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2) })

  // Set the starting color (at 0%)
grads.append('stop')
  .attr('offset', '0%')
  .attr('stop-color', function (d) { return color(d.source.index) })

  // Set the ending color (at 100%)
grads.append('stop')
  .attr('offset', '100%')
  .attr('stop-color', function (d) { return color(d.target.index) })

group.append('path')
    .style('fill', function (d) { return color(d.index) })
    .style('stroke', function (d) { return d3.rgb(color(d.index)).darker() })
    .attr('d', arc)

g.append('g')
    .attr('class', 'ribbons')
  .selectAll('path')
    .data(function (chords) { return chords })
  .enter().append('path')
    .attr('d', ribbon)
    // change the fill to reference the unique gradient ID of the source-target combination
    .style('fill', function (d) { return 'url(#' + getGradID(d) + ')' })
    .style('opacity', 0.6)
    .style('stroke', function (d) { return d3.rgb(color(d.target.index)).darker() })

group.append('svg:text')
      .each(function (d) { d.angle = (d.startAngle + d.endAngle) / 2 })
      .attr('dy', '.35em')
      .attr('class', 'titles')
      .attr('text-anchor', function (d) { return d.angle > Math.PI ? 'end' : null })
      .attr('transform', function (d) {
        return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')' + 'translate(' + (innerRadius + 10) + ')' + (d.angle > Math.PI ? 'rotate(180)' : '')
      })
      .attr('opacity', 1)
    .text(function (d, i) { return nameProvider[i] })
