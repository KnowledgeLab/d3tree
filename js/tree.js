d3Tree.transitionDuration  = 400;
d3Tree.barHeight = 20;
d3Tree.barWidth  = Canvas.width * 0.8;

d3Tree.diagonal = d3.svg.diagonal()
  .projection(function (d) { return [d.y, d.x]; });

function d3Tree(initFile) {
  "use strict";

  var root;
  var tree;

  var svgMain;                  // FIXME: terrible name
  var svg;

  var linkSelector = "path.link";

  this.getNodes = function () {
    return this.tree.nodes(this.root);
  };

  this.collapseAll = function () {
    this.getNodes().forEach(function (node) {
      node._children = node.children;
      node.children = null;
    });
  };

  this.loadFile = function (jsonFilename) {
    var _this = this;

    d3.json(jsonFilename, function (error, data) {
      data.x0 = 0;
      data.y0 = 0;

      _this.root = data;

      _this.collapseAll();

      update(_this.root);
    });
  };

  this.getAllLinks = function () {
    return this.svg.selectAll(this.linkSelector);
  }

  this.init = function (jsonFilename) {
    this.tree = d3.layout.tree().
      nodeSize([0, 20]);

    this.loadFile(jsonFilename);

    this.svgMain = d3.select(entryPointSelector)
    .append("svg");
  };

  this.insertInto = function (entryPointSelector) {
    this.svg = this.svgMain
      .attr("width", Canvas.width + Canvas.margin.left + Canvas.margin.right)
      .append("g")
      .attr("transform", "translate(" + Canvas.margin.left + "," + Canvas.margin.top + ")");
  };

  this.positionNodes = function () {
    this.getNodes().forEach(function (n,i) {
      n.x = i * d3Tree.barHeight;
    });
  }

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
