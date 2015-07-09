var $$ = React.createElement;
var Substance = require("substance");
var SubjectsModel = require("./subjects_model");
var PanelMixin = require("substance-ui/panel_mixin");
var _ = require("substance/helpers");

// Sub component
var Subject = require("./subject");

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
    var backend = this.context.backend;
    
    backend.getSubjects(function(err, subjects) {
      this.setState({
        subjects: new SubjectsModel(app.doc, subjects)
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
    var referencedSubjects = state.subjects.getAllReferencedSubjects();
    var subjectNodes = referencedSubjects.map(function(subject) {
      // Dynamically assign active state and a few other things
      subject.active = subject.id === props.subjectId;
      subject.key = subject.id;
      subject.handleToggle = self.handleToggle;
      subject.fullPath = state.subjects.getFullPathForSubject(subject.id);
      return $$(Subject, subject);
    });

    return $$("div", {className: "panel subjects-panel-component"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'subjects'},
          subjectNodes
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