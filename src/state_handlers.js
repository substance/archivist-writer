var $$ = React.createElement;

// HACK: remember previous selection so we can check if a selection has changed
var prevSelection;

var stateHandlers = {

  handleSelectionChange: function(app, sel) {

  },

  // Determine highlighted nodes
  // -----------------
  //
  // => inspects state
  //
  // TODO: this is potentially called too often
  //
  // Based on app state, determine which nodes should be highlighted in the content panel
  // @returns a list of nodes to be highlighted

  getHighlightedNodes: function(app) {
    
  }

};

module.exports = stateHandlers;