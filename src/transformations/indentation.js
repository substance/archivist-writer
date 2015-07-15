var _ = require('substance/helpers');
var Substance = require('substance');
var Document = Substance.Document;

var detectWhitespace = function(text) {
  return text.indexOf(' ');
}

function cleanIndentationInTextProperty(tx, args) {
  var text = tx.get(args.path);

  while(detectWhitespace(text) == 0) {
    var sel = tx.createSelection({
      type: 'property',
      path: args.path,
      startOffset: 0,
      endOffset: 1
    });
    Document.Transformations.deleteSelection(tx, {selection: sel});
    text = tx.get(args.path);
  }
}

function indentationCleaner(tx, containerId) {
  if (!containerId) {
    throw new Error("Argument 'containerId' is mandatory.");
  }

  console.log('running indentation cleaner...');
  var container = tx.get(containerId);
  var components = container.getComponents();

  _.each(components, function(comp) {
    cleanIndentationInTextProperty(tx, {
      path: comp.path
    });
  });
}

module.exports = indentationCleaner;