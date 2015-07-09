var SelectEntityMixin = require("../archivist/select_entity_mixin");
var _ = require("substance/helpers");
var Substance = require("substance");

var SelectPrisonPanelMixin = _.extend({}, SelectEntityMixin, {
  
  // Called with entityId when an entity has been clicked
  handleSelection: function(entityId) {
    var app = this.context.app;
    
    if (app.state.contextId === "selectPrison") {
      var prisonIds = doc.get('document').interviewee_prisons;
      prisonIds.push(entityId);
      var tx = app.doc.startTransaction();
      try {
        tx.set(["document", "interviewee_prisons"], prisonIds);
        tx.save({});
      } finally {
        tx.cleanup();
      }
    } else if (app.state.contextId === "selectWaypoint") {
      var waypointIds = doc.get('document').interviewee_waypoints;

      var tx = app.doc.startTransaction();
      try {
        // Create a new waypoint object
        var newWaypoint = tx.create({
          id: Substance.uuid("waypoint"),
          type: "waypoint",
          density: 1,
          entityId: entityId
        });

        waypointIds.push(newWaypoint.id);

        tx.set(["document", "interviewee_waypoints"], waypointIds);
        tx.save({});
      } finally {
        tx.cleanup();
      }
    } else if (app.state.contextId === "selectProjectLocation") {
      var tx = app.doc.startTransaction();
      try {
        tx.set(["document", "project_location"], entityId);
        tx.save({});
      } finally {
        tx.cleanup();
      }
    }

    app.replaceState({
      contextId: "metadata"
    });
  }
});

var SelectPrisonPanel = React.createClass({
  mixins: [SelectPrisonPanelMixin],
  displayName: "Tag Entity"
});

// Panel configuration
// ----------------

SelectPrisonPanel.contextId = "selectPrison";
SelectPrisonPanel.icon = "fa-bullseye";

// No context switch toggle is shown
SelectPrisonPanel.isDialog = true;

module.exports = SelectPrisonPanel;