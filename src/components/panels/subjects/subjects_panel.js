var $$ = React.createElement;
var Substance = require("substance");
var PanelMixin = require("substance-ui/panel_mixin");
var _ = require("substance/helpers");
var Tree = require("./toc_tree");

// Subjects Panel extension
// ----------------
// 

var SubjectsPanelMixin = _.extend({}, PanelMixin, {
  contextTypes: {
    app: React.PropTypes.object.isRequired,
    backend: React.PropTypes.object.isRequired
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
  	var props = this.props;
    var self = this;
    var app = this.context.app;
    var doc = app.doc;
    var tree = props.doc.subjects.getReferencedSubjectsTree();

    Substance.map(tree.nodes, function(subject) {
      subject.active = subject.id === app.state.subjectId;
      subject.key = subject.id;
      subject.handleToggle = self.handleToggle;
    });

    return $$("div", {className: "panel subjects-panel-component"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'subjects'},
          $$(Tree, {
            ref: "treeWidget",
            tree: tree
          })
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