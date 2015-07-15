var Substance = require('substance');
var Tool = Substance.Surface.Tool;
var whitespaceCleaner = require('../transformations/whitespace');

var whitespaceCleanerTool = Tool.extend({
  name: "whitespace",

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
      whitespaceCleaner(tx, containerId);
    });
  }

});

module.exports = whitespaceCleanerTool;