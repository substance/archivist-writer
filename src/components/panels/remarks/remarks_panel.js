var $$ = React.createElement;
var Substance = require("substance");
var Surface = Substance.Surface;
var _ = require("substance/helpers");
var PanelMixin = require("substance-ui/panel_mixin");

// Sub component
var Remark = require("./remark");

// Subjects Panel extension
// ----------------

var RemarksPanelMixin = _.extend({}, PanelMixin, {

  // State relevant things
  // ------------

  contextTypes: {
    app: React.PropTypes.object.isRequired,
    componentRegistry: React.PropTypes.object.isRequired,
    surfaceManager: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    surface: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      surface: this.surface
    };
  },

  getInitialState: function() {
    var app = this.context.app;
    var doc = app.doc;

    var remarks = _.map(doc.remarksIndex.get(), function(remark) {
      return remark;
    });

    var activeRemark;
    if (app.state.remarkId) {
      activeRemark = doc.get(app.state.remarkId);
    }

    return {
      remarks: remarks,
      activeRemark: activeRemark
    };
  },

  componentWillMount: function() {
    var app = this.context.app;
    var doc = app.doc;

    var surface = new Surface(this.context.surfaceManager, doc, new Surface.FormEditor());

    surface.connect(this, {
      'selection:changed': function(sel) {
        var currentRemarkId;
        if (this.props.activeRemark) {
          currentRemarkId = this.props.activeRemark.id;
        }
        
        if (!sel.getPath) return; // probably a null selection
        var remarkId = sel.getPath()[0];
        if (remarkId !== currentRemarkId) {
          app.replaceState({
            contextId: "remarks",
            remarkId: remarkId,
            noScroll: true
          });
          surface.rerenderDomSelection();          
        }
      }
    });

    this.surface = surface;
  },

  componentDidMount: function() {
    var app = this.context.app;
    app.registerSurface(this.surface, {
      enabledTools: ["strong", "emphasis"]
    });
    this.surface.attach(this.getDOMNode());
    this.updateScroll();
  },

  componentDidUpdate: function() {
    this.updateScroll();
  },

  updateScroll: function() {
    var app = this.context.app;
    if (this.props.activeRemark && !app.state.noScroll) {
      this.scrollToNode(this.props.activeRemark.id);
    }
  },

  componentWillUnmount: function() {
    var app = this.context.app;
    app.unregisterSurface(this.surface);
    this.surface.detach();
  },

  // Rendering
  // -------------------

  render: function() {
    var state = this.state;
    var props = this.props;
    var self = this;

    var remarkNodes = state.remarks.map(function(remark) {
      return $$(Remark, {
        remark: remark,
        key: remark.id,
        active: remark === state.activeRemark,
      });
    });

    return $$("div", {className: "panel remarks-panel-component", contentEditable: true, 'data-id': "remarks"},
      $$('div', {className: 'panel-content', ref: "panelContent"},
        $$('div', {className: 'panel-content-inner remarks'},
          remarkNodes
        )
      )
    );
  }
});


var RemarksPanel = React.createClass({
  mixins: [RemarksPanelMixin],
  displayName: "Remarks",
});

// Panel Configuration
// -----------------

RemarksPanel.contextId = "remarks";
RemarksPanel.icon = "fa-comment";

module.exports = RemarksPanel;