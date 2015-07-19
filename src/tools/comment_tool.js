var Substance = require('substance');
var AnnotationTool = Substance.Surface.AnnotationTool;

var CommentTool = AnnotationTool.extend({
  name: "comment",

  getAnnotationData: function() {
    return {
      container: "content",
      content: "<p>Enter comment</p>",
      created_at: new Date().toJSON(),
      creator: window.currentUser.name
    };
  },
  
  disabledModes: ["remove", "fusion"],
  afterCreate: function(anno) {
    var app = this.context.app;
    app.replaceState({
      contextId: "edit-comment",
      commentId: anno.id,
      noScroll: true
    });
  }
});

module.exports = CommentTool;