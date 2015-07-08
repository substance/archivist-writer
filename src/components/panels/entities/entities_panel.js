var Substance = require("substance");
var $$ = React.createElement;

// Entity types
var Prison = require("./entity_types/prison");
var Toponym = require("./entity_types/toponym");
var Person = require("./entity_types/person");
var Definition = require("./entity_types/definition");
var _ = require("substance/helpers");

var EntitiesPanel = React.createClass({
  displayName: "Entities",

  contextTypes: {
    app: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired
  },

  getReferencedEntityIds: function() {
    var app = this.context.app;
    var doc = app.doc;
    var entityReferences = doc.entityReferencesIndex.get();
    return _.map(entityReferences, function(entityRef, key) {
      return entityRef.target;
    });
  },

  // Data loading methods
  // ------------

  loadEntities: function() {
    var self = this;
    var backend = this.context.backend;
    var entityIds = self.getReferencedEntityIds();

    backend.getEntities(entityIds, function(err, entities) {
      // Finished simulated loading of entities
      self.setState({
        entities: entities
      });
    });
  },


  // State relevant things
  // ------------

  getInitialState: function() {
    return {
      entities: []
    };
  },

  // Events
  // ------------

  componentDidMount: function() {
    this.loadEntities();
  },

  componentWillReceiveProps: function() {
    this.loadEntities();
  },

  handleToggle: function(entityId) {
    var app = this.context.app;

    if (app.state.entityId === entityId) {
      app.replaceState({
        contextId: "entities"
      });
    } else {
      app.replaceState({
        contextId: "entities",
        entityId: entityId
      });
    }
  },

  // Rendering
  // -------------------

  getEntityElement: function(entity) {
    entity.handleToggle = this.handleToggle;

    if (entity.type === "prison") {
      return $$(Prison, entity);
    } else if (entity.type === "toponym") {
      return $$(Toponym, entity);
    } else if (entity.type === "person") {
      return $$(Person, entity);
    } else if (entity.type === "definition") {
      return $$(Definition, entity);
    }
    throw new Error('No view component for '+ entity.type);
  },

  render: function() {
    var state = this.state;
    var props = this.props;

    var getElem = this.getEntityElement;
    var entityNodes = state.entities.map(function(entity, index) {
      // Dynamically assign active state
      entity.active = entity.id === props.entityId;
      entity.key = entity.id;
      return getElem(entity);
    });

    return $$("div", {className: "panel entities-panel-component"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'entities'},
          entityNodes
        )
      )
    );
  }
});

EntitiesPanel.contextId = "entities";
EntitiesPanel.icon = "fa-bullseye";

module.exports = EntitiesPanel;
