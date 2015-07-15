var Substance = require('substance');
var Tool = Substance.Surface.Tool;
var indentationCleaner = require('../transformations/indentation');

var indentationCleanerTool = Tool.extend({
  name: "indentation",

  update: function(surface, sel) {
    this.surface = surface;

    var newState = {
      surface: surface,
      sel: sel,
      disabled: false
    };

    this.setToolState(newState);
  },

  performAction: function(app) {
    var doc = this.context.doc;
    containerId = 'content';
    doc.transaction(function(tx) {
      indentationCleaner(tx, containerId);
    });
  }

});

module.exports = indentationCleanerTool;