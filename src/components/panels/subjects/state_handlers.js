var SubjectsPanel = require("./subjects_panel");
var EditSubjectReferencePanel = require("./edit_subject_reference_panel");
var $$ = React.createElement;
var _ = require("substance/helpers");

var stateHandlers = {

  // Handle Context Panel creation
  // -----------------
  //
  // => inspects state
  //
  // Returns a new panel element if a particular state is matched

  handleContextPanelCreation: function(app) {
    var s = app.state;

    if (s.contextId === SubjectsPanel.contextId) {
      return $$(SubjectsPanel, {
        subjectId: s.subjectId
      });
    } else if (s.contextId === EditSubjectReferencePanel.contextId && s.subjectReferenceId) {
      return $$(EditSubjectReferencePanel, {
        subjectReferenceId: s.subjectReferenceId
      });
    }
  },

  handleSelectionChange: function(app, sel, annotations) {
    var state = app.state;

    // Just prevent other modules from handling this
    if (state.contextId === EditSubjectReferencePanel.contextId) {
      return true;
    }
  },

  // Determine highlighted nodes
  // -----------------
  //
  // => inspects state
  //
  // Based on app state, determine which nodes should be highlighted in the content panel
  // @returns a list of nodes to be highlighted

  getHighlightedNodes: function(app) {
    var doc = app.doc;
    var state = app.state;

    // When a subject has been clicked in the subjects panel
    if (state.contextId === "subjects" && state.subjectId) {
      var references = Object.keys(doc.subjectReferencesIndex.get(state.subjectId));
      return references;
    }

    // When a subject reference has been clicked and an edit dialog came up
    if (state.contextId === EditSubjectReferencePanel.contextId && state.subjectReferenceId) {
      return [state.subjectReferenceId];
    }
  },

  // Determine active subject reference nodes
  // -----------------
  //
  // => inspects state
  //
  // Based on writer state, determine which container nodes should be highlighted in the content panel
  // @returns a list of nodes to be highlighted

  getActiveContainerAnnotations: function(app) {
    var state = app.state;

    // When a subject has been clicked in the subjects panel
    if (state.contextId === EditSubjectReferencePanel.contextId && state.subjectReferenceId) {
      return [ state.subjectReferenceId ];
    }
    if (state.contextId === "subjects" && state.subjectId) {
      var doc = app.doc;
      var references = Object.keys(doc.subjectReferencesIndex.get(state.subjectId));
      return references;
    }
  }
};

module.exports = stateHandlers;