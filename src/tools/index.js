var _ = require('substance/helpers');
var BuiltInTools = require('substance-ui/writer/tools');
var SubstanceTools = require('substance').Surface.Tools;
var EntityReferenceTool = require('./entity_reference_tool');
var SubjectReferenceTool = require('./subject_reference_tool');
var CommentTool = require('./comment_tool');
var TimecodeTool = require('./timecode_tool');
var IndentationTool = require('./indentation_tool');

module.exports = _.extend({}, BuiltInTools, {
  "export": require("./export_tool"),
  "whitespace": require("./whitespace"),
  "timecode": TimecodeTool,
  "emphasis": SubstanceTools.Emphasis,
  "strong": SubstanceTools.Strong,
  "link": SubstanceTools.Link,
  "entity_reference": EntityReferenceTool,
  "subject_reference": SubjectReferenceTool,
  "comment": CommentTool,
  "indentation": IndentationTool
});
