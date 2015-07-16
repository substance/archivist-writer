var $$ = React.createElement;

var _ = require("substance/helpers");

// Tree Node Component
// ---------------

var TreeNode = React.createClass({
  displayName: "TreeNode",

  handleToggle: function(e) {
    var node = this.props.node;
    node.handleToggle(node.id);
    e.preventDefault();
  },

  render: function() {
    var node = this.props.node;
    var treeComp = this.props.treeComp;
    var tree = treeComp.props.tree;
    var childNodes = tree.getChildren(node.id);

    var childrenEls = [];
    
    childrenEls = childNodes.map(function(node) {
      return $$(TreeNode, {
        treeComp: treeComp,
        key: node.id,
        node: node
      });
    }.bind(this));

    _.each(this.props.children, function(childNode) {
      childrenEls($$(TreeNode, {
        node: childNode
      }));
    });

    return $$("div", {className: 'tree-node'+ (node.active ? ' selected' : '')},
      $$('a', {
        href: "#",
        className: 'name',
        "data-id": node.id,
        onClick: this.handleToggle,
      }, node.name),
      $$('div', {className: 'children'}, childrenEls)
    );
  }
});

// Tree Component
// ---------------

var Tree = React.createClass({
  displayName: "Tree",

  componentWillMount: function() {
    this._prepare();
  },

  _prepare: function() {
    var tree = this.props.tree;

    this.state = {
      tree: tree
    };
  },

  getInitialState: function() {
    return {
      tree: null
    };
  },

  render: function() {
    var tree = this.state.tree;
    var childNodes = tree.getChildren("root");

    var childEls = childNodes.map(function(node) {
      return $$(TreeNode, {
        treeComp: this,
        key: node.id,
        node: node
      });
    }.bind(this));
    return $$("div", {className: 'tree-list-component'}, childEls);    
  }
});

module.exports = Tree;