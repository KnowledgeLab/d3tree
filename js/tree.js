function d3Tree(initFile) {
  "use strict";
  var margin    = {top: 30, right: 20, bottom: 30, left: 20};
  var width     = 960 - margin.left - margin.right;
  var root;
  var tree;

  var svg;

  this.getNodes = function () {
    return this.tree.nodes(this.root);
  };

  this.setRoot = function (val) {
    this.root = val;
  };

  this.collapseAll = function () {
    this.tree.nodes(this.root).forEach(function (node) {
      node._children = node.children;
      node.children = null;
    });
  };

  this.loadFile = function (jsonFilename) {
    var _this = this;
    d3.json(jsonFilename, function (error, data) {
      data.x0 = 0;
      data.y0 = 0;

      _this.setRoot(data);

      _this.collapseAll();

      update(_this.root);
    });
  };

  this.init = function (jsonFilename) {
    this.tree = d3.layout.tree().
      nodeSize([0, 20]);

    this.loadFile(jsonFilename);
  };

  this.insertInto = function (entryPointSelector) {
    this.svg = d3.select(entryPointSelector)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  };

  this.init(initFile);
}

d3Tree.getNodeColor = function (d) {
  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
};

d3Tree.toggleChildren = function (d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }

  update(d);
};

d3Tree.duration  = 400;
d3Tree.margin    = {top: 30, right: 20, bottom: 30, left: 20};
d3Tree.width     = 960 - d3Tree.margin.left - d3Tree.margin.right;
d3Tree.barHeight = 20;
d3Tree.barWidth  = d3Tree.width * 0.8;

d3Tree.diagonal = d3.svg.diagonal()
  .projection(function (d) { return [d.y, d.x]; });
