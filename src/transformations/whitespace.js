var _ = require('substance/helpers');
var Substance = require('substance');
var Document = Substance.Document;

function detectWhitespaceInTextProperty(tx, path) {
  var text = tx.get(path);

  var matcher = new RegExp('  ', 'g');
  var matches = [];
  var match;

  while (match = matcher.exec(text)) {
    var sel = tx.createSelection({
      type: 'property',
      path: path,
      startOffset: match.index,
      endOffset: matcher.lastIndex
    });

    matches.unshift(sel);
  }
  return matches;
}

function cleanWhitespacesInTextProperty(tx, path) {
  var matches = detectWhitespaceInTextProperty(tx, path);

  while(matches.length > 0) {
    _.each(matches, function(match) {
      Document.Transformations.insertText(tx, {selection: match, text: ' '});
    });
    matches = detectWhitespaceInTextProperty(tx, path);
  }
  
}

function cleanWhitespaces(tx, containerId) {
  if (!containerId) {
    throw new Error("Argument 'containerId' is mandatory.");
  }

  console.log('running whitespace cleaner...');

  var container = tx.get(containerId);
  var components = container.getComponents();

  _.each(components, function(comp) {
    cleanWhitespacesInTextProperty(tx, comp.path);
  });
}

module.exports = cleanWhitespaces;