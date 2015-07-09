var _ = require('substance/helpers');
var BuiltInTools = require('substance-ui/writer/tools');
var SubstanceTools = require('substance').Surface.Tools;

delete BuiltInTools.save;

module.exports = _.extend({}, BuiltInTools, {
  "export": require("./export_tool"),
  "emphasis": SubstanceTools.Emphasis,
  "strong": SubstanceTools.Strong,
  "link": SubstanceTools.Link,
});
