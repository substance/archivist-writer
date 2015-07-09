var $$ = React.createElement;

var SubjectsModel = require("./subjects_model");
var _ = require("substance/helpers");

// Tree Node Component
// ---------------

var TreeNode = React.createClass({
  displayName: "TreeNode",

  render: function() {
    var node = this.props.node;
    var treeComp = this.props.treeComp;
    var tree = treeComp.props.tree;
    var childNodes = tree.getChildren(node.id);

    var childrenEls = [];
    if (this.props.node._expanded) {
      childrenEls = childNodes.map(function(node) {
        return $$(TreeNode, {
          treeComp: treeComp,
          key: node.id,
          node: node,
          handleSelection: this.props.handleSelection,
          handleExpansion: this.props.handleExpansion
        });
      }.bind(this));

      _.each(this.props.children, function(childNode) {
        childrenEls($$(TreeNode, {
          node: childNode
        }));
      });
    }

    var expandedIcon = node._expanded ? "fa-caret-down" : "fa-caret-right";
    var selectedIcon = node._selected ? "fa-check-square-o" : "fa-square-o";
    var hideExpand = childNodes.length === 0;

    return $$("div", {className: 'tree-node'+ (node._selected ? ' selected' : '') + (node._expanded ? ' expanded' : '')},
      $$('a', {
        "data-id": node.id,
        className: 'expand-toggle'+ (hideExpand ? ' hidden' : ''),
        onClick: this.props.handleExpansion,
        href: "#",
        dangerouslySetInnerHTML: {__html: '<i class="fa '+expandedIcon+'"></i>'}
      }),
      $$('a', {
        href: "#",
        "data-id": node.id,
        className: 'select-toggle',
        onClick: this.props.handleSelection,
        dangerouslySetInnerHTML: {__html: '<i class="fa '+selectedIcon+'"></i>'}
      }),
      $$('a', {
        href: "#",
        className: 'name',
        "data-id": node.id,
        onClick: this.props.handleSelection,
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
    this._prepare(this.props.selectedNodes);
  },

  componentWillReceiveProps: function(nextProps) {
    this._prepare(nextProps.selectedNodes);
  },

  // Preprocess tree to flag nodes accordingly
  // This prepares the state element, before a render happens
  _prepare: function(newSelectedNodes) {
    var tree = this.props.tree;

    // Reset everything
    tree.walkTree(function(node) {
      delete node._selected;
      delete node._expanded;
    });

    // Preprocess tree to flag nodes accordingly
    var selectedNodes = {};

    _.each(newSelectedNodes, function(nodeId) {
      selectedNodes[nodeId] = true;
    });

    function __expand(node) {
      if (!node) return;
      node._expanded = true;
      __expand(tree.get(node.parent));
    }

    tree.walkTree(function(node) {
      node._selected = selectedNodes[node.id];
      if (node._selected) {
        __expand(tree.get(node.parent));
      }
    });

    this.state = {
      tree: tree,
      selectedNodes: selectedNodes
    };
  },

  getInitialState: function() {
    return {
      selectedNodes: null,
      tree: null
    };
  },

  handleExpansion: function(e) {
    e.preventDefault();
    var nodeId = e.currentTarget.dataset.id;
    var tree = this.state.tree;
    var node = tree.get(nodeId);
    var selectedNodes = this.state.selectedNodes;

    if (node._expanded) {
      // Collapse
      node._expanded = false;
    } else {
      // Expand
      node._expanded = true;
    }

    this.setState({
      selectedNodes: selectedNodes,
      tree: tree
    });
  },

  handleSelection: function(e) {
    e.preventDefault();
    var nodeId = e.currentTarget.dataset.id;
    var tree = this.state.tree;
    var node = tree.get(nodeId);
    var selectedNodes = this.state.selectedNodes;

    if (selectedNodes[nodeId]) {
      // Deselect
      node._selected = false;
      delete selectedNodes[nodeId];
    } else {
      // Select
      node._selected = true;
      selectedNodes[nodeId] = true;
    }

    this.setState({
      selectedNodes: selectedNodes,
      tree: tree
    });
    
    this.props.onSelectionChanged(selectedNodes);
  },

  render: function() {
    var tree = this.state.tree;
    var childNodes = tree.getChildren("root");

    var childEls = childNodes.map(function(node) {
      return $$(TreeNode, {
        treeComp: this,
        key: node.id,
        node: node,
        handleSelection: this.handleSelection,
        handleExpansion: this.handleExpansion
      });
    }.bind(this));
    return $$("div", {className: 'tree-component'}, childEls);    
  }
});

module.exports = Tree;