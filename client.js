const Tile = require("./public/tile.js");
const d3 = require("d3");

function coloring(tile) {
  return "pink";
}

function draw(raw_data) {
  data = $.parseJSON(raw_data)
  tiles = new Array();
  for (var i=0; i<data.length; i++) {
    tiles.push(new Tile(data[i]));
  }

  var lb = Math.min(
    data.reduce((min, p) => p.y < min ? p.y : min, data[0].y),
    data.reduce((min, p) => p.x < min ? p.x : min, data[0].x)
  );
  var ub = Math.max(
    data.reduce((max, p) => p.y > max ? p.y : max, data[0].y),
    data.reduce((max, p) => p.x > max ? p.x : max, data[0].x)
  );
  var w = 500, h = 500, l=1;


  var scaling = d3.scaleLinear()
  .domain([lb, ub+1])
  .range([0, w]);

  var canvas = d3.select(".graphContainer")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .call(d3.zoom().on("zoom", function() {
    canvas.attr("transform", d3.event.transform)
  }))
  .append("g")

  canvas.selectAll("rect")
  .data(tiles)
  .enter()
  .append("rect")
  .attr("fill", function(d) { return d.coloring()})
  .attr("width", scaling(l))
  .attr("height", scaling(l))
  .attr("y", function (d) {
      return scaling(d.y);
  })
  .attr("x", function(d) {
      return scaling(d.x);
  });
  // Define the div for the tooltip
  var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  d3.selectAll("rect").attr("class", "tooltip")
  d3.selectAll("rect")
  .on("mouseover", function(d) {
    div.style("opacity", .9);
    div.html(`x:${d.x}, y:${d.y}`)
       .style("left", (d3.event.pageX) + "px")
       .style("top", (d3.event.pageY-scaling(l)) + "px");
  })
  .on("mouseout", function(d) {
    div.style("opacity", 0);
  });

  function reset() {
    canvas.attr("transform", d3.zoomIdentity.scale(1))
  }

  document.getElementById("Reset").addEventListener("click", function() {
    d3.selectAll('g').transition().duration(500)
    .call(reset);
  });
}

$.ajax({
  url: '/data',
  type: 'GET',
  success: draw,
  error: function(error) {
    console.log(`error ${error}`)
  }
});