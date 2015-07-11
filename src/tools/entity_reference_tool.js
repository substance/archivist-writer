var Substance = require('substance');
var Tool = Substance.Surface.Tool;

var TagEntityTool = Tool.extend({
  name: "tag_entity",

  update: function(surface, sel) {
    this.surface = surface; // important!

    // Set disabled when not a property selection
    if (!surface.isEnabled() || sel.isNull() || !sel.isPropertySelection() || sel.isCollapsed()) {
      return this.setDisabled();
    }

    var newState = {
      surface: surface,
      sel: sel,
      disabled: false
    };

    this.setToolState(newState);
  },

  // Needs app context in order to request a state switch
  // TODO: tools should not depend on this.context.app
  performAction: function(app) {
    var app = this.context.app;
    var sel = app.getSelection();

    // TODO: implement sel.getText() so we can get this from the document directly;
    var searchString = window.getSelection().toString();

    app.replaceState({
      contextId: "tagentity",
      path: sel.getPath(),
      startOffset: sel.getStartOffset(),
      endOffset: sel.getEndOffset(),
      searchString: searchString
    });
  },

  createEntityReference: function(target) {

  },

  deleteEntityReference: function(entityReferenceId) {

  },

  updateEntityReference: function(newTarget) {

  }
});

module.exports = TagEntityTool;
