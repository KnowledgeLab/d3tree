const treeFile = "tree1.json";
const entryPointSelector = "body";

var margin    = {top: 30, right: 20, bottom: 30, left: 20};
var width     = 960 - margin.left - margin.right;
var barHeight = 20;
var barWidth  = width * 0.8;

var i         = 0;

var displayTree = new d3Tree(treeFile);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

displayTree.insertInto(entryPointSelector);
