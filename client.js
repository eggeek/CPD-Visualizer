const Tile = require("./public/tile.js");
const d3 = require("d3");

function draw(raw_data) {
  jsons = $.parseJSON(raw_data)
  tiles = new Array();
  for (var i=0; i<jsons.length; i++) {
    tiles.push(new Tile(jsons[i]));
  }

  var lb = Math.min(
    tiles.reduce((min, p) => p.y < min ? p.y : min, tiles[0].y),
    tiles.reduce((min, p) => p.x < min ? p.x : min, tiles[0].x)
  );
  var ub = Math.max(
    tiles.reduce((max, p) => p.y > max ? p.y : max, tiles[0].y),
    tiles.reduce((max, p) => p.x > max ? p.x : max, tiles[0].x)
  );
  var w = 800, h = 800, l=1;


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

  canvas.selectAll(".tile").data(tiles).enter().each(
    function(d, i) {
      var rl = scaling(l) - scaling(0.05),
          ry = scaling(d.y) + 0.5,
          rx = scaling(d.x) + 0.5;

      d3.select(this).append("rect")
      .attr("class", function(d) { return "tile c" + d.cid})
      .attr("id", "id"+d.order)
      .attr("fill", d.order != -1 && d.order == d.rowid? "white": d.coloring())
      .attr("width", rl)
      .attr("height", rl)
      .attr("y", ry)
      .attr("x", rx)
      if (d.order == d.rowid && d.order != -1) {
        var sx = rx + rl / 2, sy = ry + rl / 2;
        d3.select(this).append("path")
        .attr("transform", 'translate('+sx + ',' + sy +')')
        .attr('d', d3.symbol().type(d3.symbolCross).size(rl))
        .attr("class", "tile")
        .attr("id", 'id'+d.order)
        .attr("fill", d.coloring())
      }
  })

  // Define the the tooltip
  var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  d3.selectAll(".tile")
  .on("mouseover", function(d) {
    tooltip.style("opacity", .9);
    tooltip.html(d.getinfo())
       .style("left", (d3.event.pageX+20) + "px")
       .style("top", (d3.event.pageY+5) + "px");
  })
  .on("mouseout", function(d) {
    tooltip.style("opacity", 0);
  });

  d3.selectAll(".tile")
  .on("click", function(d) {
    var cur = $("#id" + d.order)
    if (d.order != d.cid) {
      var centroid = $("#id"+ d.cid)
      toggleHilight(centroid)
    } else {
      var elems = $(".c" + d.cid);
      for (var i=0; i<elems.length; i++) {
        toggleHilight($(elems[i]))
      }
    }
    toggleSelected(cur)
  })

  function reset() {
    canvas.attr("transform", d3.zoomIdentity.scale(1))
  }

  function toggleHilight(elem) {
    if (elem.hasClass("on"))
      elem.removeClass("on")
    else {
      if (elem.hasClass("selected")) return;
      elem.addClass("on")
      elem.attr("stroke-width", 0.05*scaling(l))
    }
  }

  function toggleSelected(elem) {
    if (elem.hasClass("selected"))
      elem.removeClass("selected")
    else {
      elem.addClass("selected")
      elem.attr("stroke-width", 0.05*scaling(l))
    }
  }

  d3.select("#Reset").on("click", function() {
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