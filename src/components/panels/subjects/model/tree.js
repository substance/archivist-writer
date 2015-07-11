var Substance = require("substance");

// A simple tree implementation
// -------------

var Tree = function(nodes) {
  this.nodes = nodes;
  this.buildIndexes();
};

Tree.Prototype = function() {

  this.buildIndexes = function() {
    // Build a map of parents referencing their kids
    this.parentIndex = {};
    Substance.each(this.nodes, function(node) {
      var parent = node.parent || "root";
      if (!this.parentIndex[parent]) {
        this.parentIndex[parent] = [ node ];
      } else {
        this.parentIndex[parent].push(node);
      }
    }, this);
  };

  // Get a node by id
  this.get = function(id) {
    return this.nodes[id];
  };

  // Get children nodes for a given node using our parentIndex
  this.getChildren = function(nodeId) {
    return this.parentIndex[nodeId] || [];
  };

  // Get parent node for a given nodeId
  this.getParent = function(nodeId) {
    var node = this.nodes[nodeId];
    return this.nodes[node.parent];
  };

  // Walk the tree
  this.walkTree = function(fn, ctx) {
    var self = this;
    if (!ctx) ctx = this;

    function _walkTree(rootNode, fn, ctx) {
      if (rootNode !== "root") {
        fn.call(ctx, rootNode);
      }
      var children = self.getChildren(rootNode.id);
      Substance.each(self.getChildren(rootNode.id || rootNode), function(child) {
        _walkTree(child, fn, ctx);
      });
    }

    return _walkTree("root", fn, ctx);
  };
};

Tree.prototype = new Tree.Prototype();

module.exports = Tree;