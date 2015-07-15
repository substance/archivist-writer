var SelectEntityMixin = require("../select_entity_mixin");
var _ = require("substance/helpers");

var TagEntityPanelMixin = _.extend({}, SelectEntityMixin, {
  
  // Called with entityId when an entity has been clicked
  handleSelection: function(entityId) {
    var app = this.context.app;
    var doc = app.doc;
    var entityReferenceId = this.props.entityReferenceId;

    if (entityReferenceId) {
      doc.transaction(function(tx) {
        tx.set([entityReferenceId, "target"], entityId);
      });

      app.replaceState({
        contextId: "showEntityReference",
        entityReferenceId: entityReferenceId
      });

    } else {
      var path = this.props.path;
      var startOffset = this.props.startOffset;
      var endOffset = this.props.endOffset;

      var annotation = app.annotate({
        type: "entity_reference",
        target: entityId,
        path: path,
        startOffset: startOffset,
        endOffset: endOffset
      });

      // Switch state to highlight newly created reference
      app.replaceState({
        contextId: "showEntityReference",
        entityReferenceId: annotation.id
      });
    }
  }
});


var TagEntityPanel = React.createClass({
  mixins: [TagEntityPanelMixin],
  displayName: "Tag Entity"
});

// Panel configuration
// ----------------

TagEntityPanel.contextId = "tagentity";
TagEntityPanel.icon = "fa-bullseye";

// No context switch toggle is shown
TagEntityPanel.isDialog = true;

module.exports = TagEntityPanel;