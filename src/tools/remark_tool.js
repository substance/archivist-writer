var Substance = require('substance');
var AnnotationTool = Substance.Surface.AnnotationTool;

var RemarkTool = AnnotationTool.extend({
  name: "remark",

  getAnnotationData: function() {
    return {
      container: "content",
      content: ""
    }
  },
  
  disabledModes: ["remove", "fusion"],
  afterCreate: function(anno) {
    var app = this.context.app;
    app.replaceState({
      contextId: "remarks",
      subjectReferenceId: anno.id,
      noScroll: true
    });
  }
});

module.exports = RemarkTool;