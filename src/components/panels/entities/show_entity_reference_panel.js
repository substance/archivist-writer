var Substance = require("substance");
var $$ = React.createElement;

// Entity types
var Prison = require("./entity_types/prison");
var Toponym = require("./entity_types/toponym");
var Person = require("./entity_types/person");
var Definition = require("./entity_types/definition");
var _ = require("substance/helpers");

var ShowEntityReferencePanel = React.createClass({
  displayName: "Entity",

  contextTypes: {
    app: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired
  },

  // Data loading methods
  // ------------

  loadEntity: function(props) {
    props = props || this.props;
    var app = this.context.app;
    var doc = app.doc;
    var self = this;
    var entityRef = doc.get(props.entityReferenceId);

    var backend = this.context.backend;

    backend.getEntities([entityRef.target], function(err, entities) {
      // Finished simulated loading of entities
      self.setState({
        entity: entities[0]
      });
    }.bind(this));
  },

  // State relevant things
  // ------------

  getInitialState: function() {
    return {
      entity: null
    };
  },

  // Events
  // ------------

  componentDidMount: function() {
    this.loadEntity();
  },

  componentWillReceiveProps: function(nextProps) {
    this.loadEntity(nextProps);
  },

  handleToggle: function(entityId) {
    // do nothing..
  },

  // Rendering
  // -------------------

  getEntityElement: function(entity) {
    entity.handleToggle = this.handleToggle;
    // HACK: we should not pollute entity objects at all
    // fix this in the entities panel and see remarks panel
    // for a better implementation
    
    entity.active = false;
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

  handleCancel: function(e) {
    var app = this.context.app;
    e.preventDefault();
    app.replaceState({
      contextId: "entities"
    });
  },

  handleEdit: function(e) {
    var app = this.context.app;
    e.preventDefault();
    app.replaceState({
      contextId: "tagentity",
      entityReferenceId: this.props.entityReferenceId
    });
  },

  handleDeleteReference: function(e) {
    e.preventDefault();
    var app = this.context.app;
    var doc = app.doc;
    var tx = doc.startTransaction();

    try {
      tx.delete(this.props.entityReferenceId);
      tx.save();
      app.replaceState({
        contextId: "entities"
      });
    } finally {
      tx.cleanup();
    }
  },

  render: function() {
    var state = this.state;
    var props = this.props;

    var entityItem;

    if (this.state.entity) {
      entityItem = this.getEntityElement(this.state.entity);
    } else {
      entityItem = $$('div', null, 'loading...');
    }

    return $$("div", {className: "panel dialog show-entity-reference-panel-component"},
      // Dialog Header
      $$('div', {className: "dialog-header"},
        $$('a', {
          href: "#",
          className: 'back',
          onClick: this.handleCancel,
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-chevron-left"></i>'}
        }),
        $$('div', {className: 'label'}, "Related entity"),
        $$('div', {className: 'actions'},
          $$('a', {
            href: "#",
            className: "edit-reference",
            onClick: this.handleEdit,
            dangerouslySetInnerHTML: {__html: '<i class="fa fa-pencil"></i> Edit'}
          }),
          $$('a', {
            href: "#",
            className: "delete-reference",
            onClick: this.handleDeleteReference,
            dangerouslySetInnerHTML: {__html: '<i class="fa fa-trash"></i> Remove'}
          })
        )
      ),
      // Panel Content
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'entities'},
          entityItem
        )
      )
    );
  }
});

ShowEntityReferencePanel.contextId = "showEntityReference";
ShowEntityReferencePanel.icon = "fa-bullseye";

// No toggle is shown
ShowEntityReferencePanel.isDialog = true;

module.exports = ShowEntityReferencePanel;
