var $$ = React.createElement;

// HACK: remember previous selection so we can check if a selection has changed
var prevSelection;

var stateHandlers = {

  handleSelectionChange: function(app, sel, annotations) {
    // From entities panel
    // ---------------
    // if (sel.isNull() || !sel.isPropertySelection() || !sel.isCollapsed()) return;
    // var annotations = app.doc.annotationIndex.get(sel.getPath(), sel.getStartOffset(), sel.getEndOffset(), "entity_reference");
    // var surface = app.getSurface();
    // if (surface.name !== "content") return false;
    // if (annotations.length > 0) {
    //   var ref = annotations[0];
    //   app.replaceState({
    //     contextId: ShowEntityReferencePanel.contextId,
    //     entityReferenceId: ref.id
    //   });
    //   return true;
    // }

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
    // From entities panel
    // ---------------
    // 
    // var doc = app.doc;
    // var state = app.state;

    // // Let the extension handle which nodes should be highlighted
    // if (state.contextId === "entities" && state.entityId) {
    //   // Use reference handler
    //   var references = Object.keys(doc.entityReferencesIndex.get(state.entityId));
    //   return references;
    // } else if (state.entityReferenceId) {
    //   return [state.entityReferenceId];
    // }
  }


};

module.exports = stateHandlers;