var _ = require('substance/helpers');
var BuiltInTools = require('substance-ui/writer/tools');
var SubstanceTools = require('substance').Surface.Tools;
var EntityReferenceTool = require('./entity_reference_tool');
var SubjectReferenceTool = require('./subject_reference_tool');
var RemarkTool = require('./remark_tool');

delete BuiltInTools.save;

module.exports = _.extend({}, BuiltInTools, {
  "export": require("./export_tool"),
  "whitespace": require("./whitespace"),
  "emphasis": SubstanceTools.Emphasis,
  "strong": SubstanceTools.Strong,
  "link": SubstanceTools.Link,
  "entity_reference": EntityReferenceTool,
  "subject_reference": SubjectReferenceTool,
  "remark": RemarkTool
});
