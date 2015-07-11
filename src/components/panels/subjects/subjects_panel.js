var $$ = React.createElement;
var Substance = require("substance");
var SubjectsModel = require("./model");
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
      // this.setState({
      //   subjects: new SubjectsModel(app.doc, subjects)
      // });

      // Fake method for filtering all subject instead of querying inside backend

      var subjects = new SubjectsModel(app.doc, subjects);
      var referencedSubjects = subjects.getAllReferencedSubjectsWithParents();
      var filteredModel = new SubjectsModel(app.doc, referencedSubjects);

      this.setState({
        subjects: filteredModel
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
        subjectId: subjectId,
        noScroll: true
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

    // Only get referenced subjects
    // var referencedSubjects = state.subjects.getAllReferencedSubjects();
    // var subjectNodes = referencedSubjects.map(function(subject) {
    //   // Dynamically assign active state and a few other things
    //   subject.active = subject.id === props.subjectId;
    //   subject.key = subject.id;
    //   subject.handleToggle = self.handleToggle;
    //   subject.fullPath = state.subjects.getFullPathForSubject(subject.id);
    //   return $$(Subject, subject);
    // });

    // return $$("div", {className: "panel subjects-panel-component"},
    //   $$('div', {className: 'panel-content'},
    //     $$('div', {className: 'subjects'},
    //       subjectNodes
    //     )
    //   )
    // );

    var treeEl;
    var app = this.context.app;
    var doc = app.doc;
    var tree = this.state.subjects.tree;

    Substance.map(tree.nodes, function(subject) {
      subject.active = subject.id === app.state.subjectId;
      subject.key = subject.id;
      subject.handleToggle = self.handleToggle
    });

    if (this.state.subjects) {
      treeEl = $$(Tree, {
        ref: "treeWidget",
        tree: this.state.subjects.tree
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