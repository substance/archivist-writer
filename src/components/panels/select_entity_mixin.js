var $$ = React.createElement;

var TYPE_LABELS = {
  "prison": "Prison",
  "toponym": "Toponym",
  "person": "Person",
  "definition": "Definition"
};

// Example of a sub view
// ----------------

var EntityView = React.createClass({
  displayName: "Entity",

  handleClick: function(e) {
    e.preventDefault();
    this.props.handleSelection(this.props.id);
  },

  render: function() {
    var className = ["entity", this.props.type];
    if (this.props.active) className.push("active");

    if (this.props.type == 'prison' && this.props.prison_type instanceof Array) {
      this.props.name = this.props.name.toLowerCase().indexOf("неизвестно") >= 0 ? this.props.nearest_locality + ' (' + this.props.prison_type.join(', ') + ')' : this.props.name;
    }

    var props = [
      $$("div", {className: "type"}, TYPE_LABELS[this.props.type]),
      $$("div", {className: "name"}, this.props.name || this.props.title)
    ];

    if (this.props.synonyms && this.props.synonyms instanceof Array) {
      props.push($$("div", {className: "synonyms"}, "Also known as: "+this.props.synonyms.join(', ')));
    }

    if (this.props.country) {
      props.push($$("div", {className: "country"}, "Country: "+this.props.country));
    }

    if (this.props.type == 'person') {
      var description = this.props.description || '';
      // Trim person description if it's too long
      if (description.length > 100) description = description.substring(0, 100) + '...';
      props.push($$("div", {className: "description"}, description));
    }

    return $$("div", {
      className: className.join(" "),
      onClick: this.handleClick
    }, props);
  }
});

// Entities Panel extension
// ----------------

var SelectEntityMixin = {

  contextTypes: {
    app: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired
  },

  handleCancel: function(e) {
    var app = this.context.app;
    e.preventDefault();
    console.log('props', this.props);
    if (this.props.entityReferenceId) {
      // Go back to show entities panel
      app.replaceState({
        contextId: "showEntityReference",
        entityReferenceId: this.props.entityReferenceId
      });
    } else {
      // Go to regular entities panel
      app.replaceState({
        contextId: "entities"
      });
    }
  },

  // Data loading methods
  // ------------

  loadEntities: function(searchString, type) {
    var self = this;
    var type = type || false;
    var backend = this.context.backend;

    backend.searchEntities(searchString, type, function(err, entities) {
      self.setState({
        state: entities.state,
        entities: entities.results
      });
    });
  },

  // State relevant things
  // ------------

  getInitialState: function() {
    return {
      searchString: this.props.searchString,
      entities: []
    };
  },

  // Events
  // ------------

  componentDidMount: function() {
    this.loadEntities(this.state.searchString);
  },

  handleSearchStringChange: function(e) {
    var searchString = e.target.value;
    var searchType = this.state.type || false;
    this.setState({searchString: searchString});
    this.loadEntities(searchString, searchType);
  },

  handleEntityFilterChange: function(e) {
    var searchType = e.currentTarget.value;
    this.setState({type: searchType});
    this.loadEntities(this.state.searchString, searchType);
  },

  handleRefreshClick: function() {
    var type = this.state.type || false;
    var searchString = this.state.searchString || '';
    this.loadEntities(searchString, type);
  },

  // Rendering
  // -------------------

  render: function() {
    var self = this;
    var entities = this.state.entities;
    var entityNodes;
    var stateMessage = this.state.state;

    if (entities.length > 0) {
      entityNodes = entities.map(function(entity) {
        entity.handleSelection = self.handleSelection;
        return $$(EntityView, entity);
      });
    } else {
      entityNodes = [$$('div', {className: "no-results", text: "Loading suggestions"})];
    }

    return $$("div", {className: "panel dialog tag-entity-panel-component"},
      $$('div', {className: "dialog-header"},
        $$('a', {
          href: "#",
          className: 'back',
          onClick: this.handleCancel,
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-chevron-left"></i>'}
        }),
        $$('div', {className: 'label'}, "Select entity")
      ),

      $$('div', {className: "panel-content"},
        $$('div', {className: "search", html: ""},
          $$('input', {
            className: "search-str",
            type: "text",
            placeholder: "Type to search for entities",//,
            value: this.state.searchString,
            onChange: this.handleSearchStringChange
          }),
          $$('select', {
              className: "entity-type",
              onChange: this.handleEntityFilterChange
            },
            $$('option', {value: ""}, "All"),
            //$$('option', {value: "prison"}, "Prison"),
            //$$('option', {value: "toponym"}, "Toponym"),
            $$('option', {value: "location"}, "Location"),
            $$('option', {value: "person"}, "Person"),
            $$('option', {value: "definition"}, "Definition")
          ),
          $$('span', { 
              className: "refresh",
              onClick: this.handleRefreshClick
            },
            $$('i', { className: "fa fa-refresh" }, "")
          )
        ),
        $$('div', {className: "search-result-state"},
          $$('span', { className: "state" }, stateMessage),
          $$('span', { className: "add-entity" },
            $$('span', { className: "label" }, "Add new: "),
            $$('a', { href: "/prisons/add", target: "_blank" },
              $$('i', { className: "fa fa-th" }, "")
            ),
            $$('a', { href: "/toponyms/add", target: "_blank" },
              $$('i', { className: "fa fa-globe" }, "")
            ),
            $$('a', { href: "/definitions/add", target: "_blank" },
              $$('i', { className: "fa fa-bookmark" }, "")
            ),
            $$('a', { href: "/persons/add", target: "_blank" },
              $$('i', { className: "fa fa-users" }, "")
            )
          )
        ),
        $$('div', {className: "entities"},
          entityNodes
        )
      )
    );
  }
};

module.exports = SelectEntityMixin;