var $$ = React.createElement;
var Substance = require("substance");
var PanelMixin = require("substance-ui/panel_mixin");
var _ = require("substance/helpers");

// Sub component
var Subject = require("./subject");
var Tree = require("./toc_tree");

// Subjects Panel extension
// ----------------
// 

var SubjectsPanelMixin = _.extend({}, PanelMixin, {
  contextTypes: {
    app: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired
  },

  // Data loading methods
  // ------------

  loadSubjects: function() {
    var app = this.context.app;
    var props = this.props;
    var backend = this.context.backend;
    var self = this;

    backend.getSubjects(function(err, subjects) {
      this.setState({
        subjects: subjects
      });
    }.bind(this));
  },

  // State relevant things
  // ------------

  getInitialState: function() {
    return {
      subjects: null
    };
  },

  // Events
  // ------------

  componentDidMount: function() {
    if (!this.state.subjects) {
      this.loadSubjects();
    }
  },

  handleToggle: function(subjectId) {
    var app = this.context.app;

    if (app.state.subjectId === subjectId) {
      app.replaceState({
        contextId: "subjects"
      });
    } else {
      app.replaceState({
        contextId: "subjects",
        subjectId: subjectId
      });
    }
  },

  // Rendering
  // -------------------

  render: function() {
  	var state = this.state;
  	var props = this.props;
    var self = this;

    if (!state.subjects) {
      return $$("div", null, "Loading subjects ...");
    }

    var treeEl;
    var app = this.context.app;
    var doc = app.doc;
    console.log(this.state.subjects);
    var tree = this.state.subjects.tree;

    Substance.map(tree.nodes, function(subject) {
      subject.active = subject.id === app.state.subjectId;
      subject.key = subject.id;
      subject.handleToggle = self.handleToggle
    });

    if (this.state.subjects) {
      treeEl = $$(Tree, {
        ref: "treeWidget",
        tree: this.state.subjects.getReferencedSubjectsTree()
      });
    } else {
      treeEl = $$('div', {className: "subjects-tree", ref: 'subjectsTree'}, "Loading subjects");
    }

    return $$("div", {className: "panel subjects-panel-component"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'subjects'},
          treeEl
        )
      )
    );
  }
});

// Panel Configuration
// -----------------

var SubjectsPanel = React.createClass({
  mixins: [SubjectsPanelMixin],
  displayName: "Subjects",
});

SubjectsPanel.contextId = "subjects";
SubjectsPanel.icon = "fa-tag";

module.exports = SubjectsPanel;