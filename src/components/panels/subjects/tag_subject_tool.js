'use strict';

var Substance = require('substance');
var _ = require('substance/helpers');
var $$ = React.createElement;
var AnnotationToolMixin = require("../../writer").AnnotationToolMixin;

var SubjectReferenceToolMixin = _.extend({}, AnnotationToolMixin, {
  
  getAnnotationData: function() {
    return {
      container: "content",
      target: []
    }
  },

  // When there's no existing annotation overlapping, we create a new one.
  canCreate: function(annos, sel) {
    var app = this.context.app;
    var canCreate = app.state.contextId !== "editSubjectReference" && !sel.isCollapsed();
    // console.log('canCreate', canCreate);
    return canCreate; 
  },

  getActiveAnno: function(annos) {
    var app = this.context.app;
    return _.filter(annos, function(a) {
      return a.id === app.state.subjectReferenceId;
    })[0];
  },

  // When there's some overlap with only a single annotation we do an expand
  canExpand: function(annos, sel) {
    var app = this.context.app
    if (annos.length === 0) return false;
    if (app.state.contextId !== "editSubjectReference") return false; 

    var activeAnno = this.getActiveAnno(annos);
    if (!activeAnno) return false;

    var annoSel = activeAnno.getSelection();
    var canExpand = sel.overlaps(annoSel) && !sel.isCollapsed() && !sel.isInsideOf(annoSel);
    return canExpand;
  },

  canFusion: function() {
    return false; // never ever
  },

  canRemove: function(annos, sel) {
    return false; // never through toggling
  },

  canTruncate: function(annos, sel) {
    var app = this.context.app;
    if (annos.length === 0) return false;
    if (app.state.contextId !== "editSubjectReference") return false;

    var activeAnno = this.getActiveAnno(annos);
    if (!activeAnno) return false;
    var annoSel = activeAnno.getSelection();
    var canTruncate = (sel.isLeftAlignedWith(annoSel) || sel.isRightAlignedWith(annoSel)) && !sel.equals(annoSel);
    // console.log('canTruncate', canTruncate);
    return canTruncate;
  },

  // Same implementation as on AnnotationTool, except we get the active
  // subjectReference id
  handleTruncate: function(state) {
    var doc = this.getDocument();
    var sel = state.sel;
    var tx = doc.startTransaction({ selection: sel });
    try {

      var anno = this.getActiveAnno(state.annos);
      if (!anno) return false;

      var annoSel = anno.getSelection(); // state.annoSels[0];
      var newAnnoSel = annoSel.truncate(sel);
      anno.updateRange(tx, newAnnoSel);
      tx.save({ selection: sel });
      this.afterTruncate();
    } finally {
      tx.cleanup();
    }
  },

  // Same implementation as on AnnotationTool, except we get the active
  // subjectReference id
  handleExpand: function(state) {
    var doc = this.getDocument();
    var sel = state.sel;
    var tx = doc.startTransaction({ selection: sel });
    try {
      var anno = this.getActiveAnno(state.annos);
      if (!anno) return false;
      var annoSel = anno.getSelection(); // state.annoSels[0];
      var newAnnoSel = annoSel.expand(sel);
      anno.updateRange(tx, newAnnoSel);
      tx.save({ selection: sel });
      this.afterExpand();
    } finally {
      tx.cleanup();
    }
  },

  disabledModes: ["remove", "fusion"],
  afterCreate: function(anno) {
    var app = this.context.app;
    app.replaceState({
      contextId: "editSubjectReference",
      subjectReferenceId: anno.id
    });
  }
});

var SubjectReferenceTool = React.createClass({
  mixins: [SubjectReferenceToolMixin],
  contextTypes: {
    app: React.PropTypes.object.isRequired
  },
  displayName: "SubjectReferenceTool",
  title: "Tag Subject",
  annotationType: "subject_reference",
  toolIcon: "fa-tag",
});

module.exports = SubjectReferenceTool;
