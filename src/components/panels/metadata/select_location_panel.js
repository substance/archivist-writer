var SelectEntityMixin = require("../select_entity_mixin");
var _ = require("substance/helpers");
var Substance = require("substance");

var SelectPrisonPanelMixin = _.extend({}, SelectEntityMixin, {
  
  // Called with entityId when an entity has been clicked
  handleSelection: function(entityId) {
    var app = this.context.app;
    var doc = app.doc;
    
    if (app.state.contextId === "selectPrison") {
      var prisonIds = doc.get('document').interviewee_prisons;
      prisonIds.push(entityId);
      
      doc.transaction(function(tx) {
        tx.set(["document", "interviewee_prisons"], prisonIds);
      });
    } else if (app.state.contextId === "selectWaypoint") {
      var waypointIds = doc.get('document').interviewee_waypoints;

      var newWaypoint = tx.create({
        id: Substance.uuid("waypoint"),
        type: "waypoint",
        density: 1,
        entityId: entityId
      });

      waypointIds.push(newWaypoint.id);

      doc.transaction(function(tx) {
        tx.set(["document", "interviewee_waypoints"], waypointIds);
      });
    } else if (app.state.contextId === "selectProjectLocation") {
      doc.transaction(function(tx) {
        tx.set(["document", "project_location"], entityId);
      });
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