var Substance = require('substance');
var AnnotationTool = Substance.Surface.AnnotationTool;

var TimecodeTool = AnnotationTool.extend({
	name: "timecode"
});

module.exports = TimecodeTool;