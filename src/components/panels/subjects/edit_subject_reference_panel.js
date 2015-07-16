var $$ = React.createElement;

var _ = require("substance/helpers");
var Tree = require("./tree_component");

// Edit Subject Reference Panel
// ----------------

var EditSubjectReferencePanel = React.createClass({
  displayName: "Tag subjects",

  contextTypes: {
    backend: React.PropTypes.object.isRequired,
    app: React.PropTypes.object.isRequired
  },

  handleCancel: function(e) {
    e.preventDefault();
    // Go to regular entities panel
    this.context.app.replaceState({
      contextId: "subjects"
    });
  },

  // Events
  // ------------

  componentDidMount: function() {
    var app = this.context.app;
    var doc = app.doc;
    doc.connect(this, {
      'document:changed': this.handleDocumentChange
    });
  },

  handleDocumentChange: function(change, info) {
    var refId = this.props.subjectReferenceId;
    if (info.updateSubjectReference) return;
    if (change.isAffected([refId, "target"])) {
      this.forceUpdate();
    }
  },

  handleDeleteReference: function(e) {
    var app = this.context.app;
    var subjectReferenceId = this.props.subjectReferenceId;
    var doc = app.doc;

    doc.transaction(function(tx) {
      tx.delete(subjectReferenceId);
    });

    app.replaceState({
      contextId: "subjects"
    });
  },

  componentWillUnmount: function() {
    var doc = this.context.app.doc;
    doc.disconnect(this);
  },

  // Write changes in selection to document model
  // ------------

  updateSubjectReference: function(selectedNodes) {
    var app = this.context.app;
    var doc = app.doc;
    var subjectReferenceId = this.props.subjectReferenceId;
    var subjectIds = Object.keys(selectedNodes);

    doc.transaction({}, {updateSubjectReference: true}, function(tx) {
      tx.set([subjectReferenceId, "target"], subjectIds);
    });
  },

  // Rendering
  // -------------------

  render: function() {
    var treeEl;
    var app = this.context.app;
    var doc = app.doc;

    treeEl = $$(Tree, {
      ref: "treeWidget",
      selectedNodes: doc.get(app.state.subjectReferenceId).target,
      tree: doc.subjects.getTree(),
      onSelectionChanged: this.updateSubjectReference
    });

    return $$("div", {className: "panel dialog edit-subject-reference-panel-component"},
      $$('div', {className: "dialog-header"},
        $$('a', {
          href: "#",
          className: 'back',
          onClick: this.handleCancel,
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-chevron-left"></i>'}
        }),
        $$('div', {className: 'label'}, "Related subjects"),
        $$('div', {className: 'actions'},
          $$('a', {
            href: "#",
            className: "delete-reference",
            onClick: this.handleDeleteReference,
            dangerouslySetInnerHTML: {__html: '<i class="fa fa-trash"></i> Remove'}
          })
        )
      ),
      $$('div', {className: "panel-content"},
        treeEl
      )
    );
  }
});

// Panel configuration
// ----------------

EditSubjectReferencePanel.contextId = "editSubjectReference";
EditSubjectReferencePanel.icon = "fa-tag";

// No toggle is shown
EditSubjectReferencePanel.isDialog = true;

module.exports = EditSubjectReferencePanel;