// TODO: add "collapse all" button

"use strict";
var treeFile, entryPointSelector, i, displayTree;

var treeFile           = "tree1.json";
var entryPointSelector = "body";
var i                  = 0;

var displayTree        = new d3Tree(treeFile);

displayTree.insertInto(entryPointSelector);

function canvasHeightAdjust (newHeight) {
  displayTree.svgMain.transition()
    .duration(d3Tree.duration)
  .attr("height", newHeight);

  d3.select(window.frameElement).transition()
    .duration(d3Tree.duration)
    .style("height", newHeight + "px");
}

function update(source) {
  // Compute the flattened node list. TODO use d3.layout.hierarchy.
  var nodes     = displayTree.getNodes();

  var newHeight = nodes.length * d3Tree.barHeight + Canvas.margin.top + Canvas.margin.bottom;
  canvasHeightAdjust(newHeight);

  displayTree.positionNodes();
  
  // Update the nodes…
  var node = displayTree.svg.selectAll("g.node")
    .data(nodes, function (d) { return d.id || (d.id = ++i); });

  var nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    .style("opacity", 1e-6);

  // Enter any new nodes at the parent's previous position.
  nodeEnter.append("rect")
    .attr("y", -d3Tree.barHeight / 2)
    .attr("height", d3Tree.barHeight)
    .attr("width", d3Tree.barWidth)
    .style("fill", d3Tree.getNodeColor)
    .on("click", d3Tree.toggleChildren);

  nodeEnter.append("text")
    .attr("dy", 3.5)
    .attr("dx", 5.5)
    .text(function (d) { return d.name; });

  // Transition nodes to their new position.
  nodeEnter.transition()
    .duration(d3Tree.duration)
    .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })
    .style("opacity", 1);

  node.transition()
    .duration(d3Tree.duration)
    .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })
    .style("opacity", 1)
    .select("rect")
    .style("fill", d3Tree.getNodeColor);

  // Transition exiting nodes to the parent's new position.
  node.exit().transition()
    .duration(d3Tree.duration)
    .attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .style("opacity", 1e-6)
    .remove();

  // Update the links…
  var link = displayTree.getAllLinks()
    .data(displayTree.tree.links(displayTree.getNodes()), function (d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
      var o = {x: source.x0, y: source.y0};
      return d3Tree.diagonal({source: o, target: o});
    })
    .transition()
    .duration(d3Tree.duration)
    .attr("d", d3Tree.diagonal);

  // Transition links to their new position.
  link.transition()
    .duration(d3Tree.duration)
    .attr("d", d3Tree.diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(d3Tree.duration)
    .attr("d", function (d) {
      var o = {x: source.x, y: source.y};
      return d3Tree.diagonal({source: o, target: o});
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
};
