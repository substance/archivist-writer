var Substance = require('substance');
var Document = Substance.Document; 
var Tool = Substance.Surface.Tool;

/*
  Find and replace tool for text nodes
*/

var findReplaceNodes = function(doc, string, replace, cb) {
  var content = doc.get('content');

  // Get first component and find timecode there
  var comp = content.getFirstComponent();
  findString(doc, comp.path, string, replace);

  // Get other components and find timecode there
  while (comp.hasNext()) {
    comp = comp.getNext();
    findString(doc, comp.path, string, replace);
  }
}

// Find string to replace
var findString = function(doc, path, string, replace) {
  var text = doc.get(path);

  while(detectString(text, string) !== -1) {
    var startOffset = detectString(text, string);
    var endOffset = startOffset + string.length;
    changeTextNode(doc, path, startOffset, endOffset, replace);
    // Update text variable to detect next fragment inside node
    text = doc.get(path);
  }
}

// Detect string to replace
var detectString = function(text, string) {
  return text.indexOf(string);
}

var changeTextNode = function(doc, path, startOffset, endOffset, replace) {

  var sel = doc.createSelection({
    type: 'property',
    path: path,
    startOffset: startOffset,
    endOffset: endOffset
  })

  doc.transaction(function(tx) {
    Document.Transformations.insertText(tx, {selection: sel, text: replace});
  });
}


var WhiteSpaceTool = Tool.extend({

  name: "whitespace",

  init: function() {
    this.state.disabled = false;
  },

  // Needs app context in order to request a state switch
  performAction: function(app) {
    var doc = this.context.doc;

    findReplaceNodes(doc, "  ", " ");
  }
});

module.exports = WhiteSpaceTool;
