function d3Tree (initFile) {
  var margin    = {top: 30, right: 20, bottom: 30, left: 20};
  var width     = 960 - margin.left - margin.right;
  var barHeight = 20;
  var barWidth  = width * 0.8;

  var root;
  var tree;

  this.getNodes = function () {
    return this.tree.nodes(this.root);
  };

  this.collapseAll = function () {
    this.tree.nodes(this.root).forEach(function (node) {
      node._children = node.children;
      node.children = null;
    });

    update(root);
  };

  this.loadFile = function (jsonFilename) {
    d3.json(jsonFilename, function(error, data) {
      data.x0 = 0;
      data.y0 = 0;
      update(root = data);
    });
  };

  this.init = function () {
    this.tree = d3.layout.tree().
      nodeSize([0, 20]);
  };

  this.insertInto = function (entryPointSelector) {
    d3.select(entryPointSelector)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  this.init();
}
