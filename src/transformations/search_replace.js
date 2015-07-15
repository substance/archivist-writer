var _ = require('substance/helpers');
var Substance = require('substance');
var Document = Substance.Document;

// Find all matches for a given search string in a text property
// Method returns an array of matches, each match is represented as
// a PropertySelection

function searchInTextProperty(tx, args) {
  var text = tx.get(args.path);

  // Case-insensitive search for multiple matches
  var matcher = new RegExp(args.searchStr, 'ig');
  var matches = [];
  var match;

  while ((match=matcher.exec(text))) {
    var sel = tx.createSelection({
      type: 'property',
      path: args.path,
      startOffset: match.index,
      endOffset: matcher.lastIndex
    });
    // Store matches in reverse order, so the replace operations later are side effect free.
    matches.unshift(sel);
  }
  return matches;
}

function searchAndReplaceInTextProperty(tx, args) {
  var matches = searchInTextProperty(tx, {
    path: args.path,
    searchStr: args.searchStr
  });

  _.each(matches, function(match) {
    // Select match and replace it with replaceStr
    Document.Transformations.insertText(tx, {selection: match, text: args.replaceStr});
  });
  
}

function searchAndReplace(tx, args) {
  if (!args.containerId) {
    throw new Error("Argument 'containerId' is mandatory.");
  }
  if (!_.isString(args.searchStr)) {
    throw new Error("Argument 'searchStr' is mandatory and must be a string.");
  }
  if (!_.isString(args.replaceStr)) {
    throw new Error("Argument 'replaceStr' is mandatory and must be a string.");
  }

  console.log('search', args.searchStr, 'and replace with', args.replaceStr);

  var container = tx.get(args.containerId);
  var components = container.getComponents();

  _.each(components, function(comp) {
    // TODO: only consider text property components
    // How to determine that?
    searchAndReplaceInTextProperty(tx, {
      path: comp.path,
      searchStr: args.searchStr,
      replaceStr: args.replaceStr
    });
  });
}

module.exports = searchAndReplace;