var Substance = require('substance');
var $$ = React.createElement;
var Surface = Substance.Surface;
var _ = require("substance/helpers");
var TitleEditor = require("./title_editor");
var UnsupportedNode = require('./nodes/unsupported_node');
var ContainerEditor = Surface.ContainerEditor;

var ENABLED_TOOLS = ["strong", "emphasis", "timecode", "remark", "entity_reference", "subject_reference"];

// Container Node
// ----------------
//
// Represents a flat collection of nodes

var ContentEditor = React.createClass({
  displayName: "ContentEditor",

  contextTypes: {
    app: React.PropTypes.object.isRequired,
    componentRegistry: React.PropTypes.object.isRequired,
    notifications: React.PropTypes.object.isRequired,
    surfaceManager: React.PropTypes.object.isRequired
  },

  childContextTypes: {
    // provided to editor components so that they know in which context they are
    surface: React.PropTypes.object,
  },

  getChildContext: function() {
    return {
      surface: this.surface
    };
  },

  getInitialState: function() {
    var editor = new ContainerEditor(this.props.node.id);
    // HACK: this is also Archivist specific
    // editor.defaultTextType = 'text';

    var options = {
      logger: this.context.notifications
    };

    this.surface = new Surface(this.context.surfaceManager, this.props.doc, editor, options);

    // Debounced version of updateBrackets
    this.updateBracketsDebounced = _.debounce(this.updateBrackets, 600);
    return {};
  },

  handleToggleSubjectReference: function(e) {
    e.preventDefault();
    var subjectReferenceId = e.currentTarget.dataset.id;
    var app = this.context.app;
    var state = app.state;

    if (state.contextId === "editSubjectReference" && state.subjectReferenceId === subjectReferenceId) {
      app.replaceState({
        contextId: "subjects"
      });
    } else {
      app.replaceState({
        contextId: "editSubjectReference",
        subjectReferenceId: subjectReferenceId,
        noScroll: true
      });
    }
  },

  render: function() {
    var containerNode = this.props.node;
    var doc = this.props.doc;
    var app = this.context.app;

    // Prepare subject reference components
    // ---------

    var subjectReferences = doc.getIndex('type').get('subject_reference');
    var subjectRefComponents = [];
    var highlightedNodes = app.getHighlightedNodes();
    
    _.each(subjectReferences, function(sref) {
      subjectRefComponents.push($$('a', {
        className: "subject-reference"+(_.includes(highlightedNodes, sref.id) ? ' selected' : ''),
        href: "#",
        "data-id": sref.id,
        onClick: this.handleToggleSubjectReference
      }));
    }, this);

    // Prepare container components (aka nodes)
    // ---------

    var componentRegistry = this.context.componentRegistry;

    var components = [];
    components = components.concat(containerNode.nodes.map(function(nodeId) {
      var node = doc.get(nodeId);
      var ComponentClass = componentRegistry.get(node.type);

      if (!ComponentClass) {
        console.error('Could not resolve a component for type: ' + node.type);
        ComponentClass = UnsupportedNode;
      }

      return $$(ComponentClass, {
        key: node.id,
        doc: doc,
        node: node
      });
    }));

    // Top level structure
    // ---------

    return $$('div', {className: 'content-editor-component panel-content-inner'},
      $$(TitleEditor, {doc: doc}),
      // The full fledged interview (ContainerEditor)
      $$("div", {ref: "interviewContent", className: "interview-content", contentEditable: true, "data-id": "content"},
        $$("div", {
            className: "container-node " + this.props.node.id,
            spellCheck: false,
            "data-id": this.props.node.id
          },
          $$('div', {className: "nodes"}, components),
          $$('div', {className: "subject-references", contentEditable: false}, subjectRefComponents)
        )
      )
    );
  },

  updateBrackets: function() {
    var doc = this.props.doc;
    var subjectReferences = doc.getIndex('type').get('subject_reference');

    var brackets = {};

    // 3 available slots (0 means not used)
    var bracketSlots = [0,0,0];

    // Collects all events for the sweep algorithm
    var events = [];

    _.each(subjectReferences, function(subjRef) {
      var anchors = $(this.getDOMNode()).find('.nodes .anchor[data-id='+subjRef.id+']');

      var startAnchorEl, endAnchorEl;
      if ($(anchors[0]).hasClass('start-anchor')) {
        startAnchorEl = anchors[0];
        endAnchorEl = anchors[1];
      } else {
        startAnchorEl = anchors[1];
        endAnchorEl = anchors[0];
      }

      if (!startAnchorEl || !endAnchorEl) {
        console.warn("FIXME: Could not find anchors for subject reference ", subjRef.id);
        return;
      }

      var startTop = $(startAnchorEl).position().top;
      var endTop = $(endAnchorEl).position().top + $(endAnchorEl).height();
      var height = endTop - startTop;

      // Add start and end events
      events.push({
        subjRefId: subjRef.id,
        pos: startTop,
        type: "start"
      });

      events.push({
        subjRefId: subjRef.id,
        pos: endTop,
        type: "end"
      });

      brackets[subjRef.id] = {
        top: startTop,
        height: height,
        slot: null        
      };
    }, this);


    function bookSlot(subjRefId) {
      // debugger;
      // Use slot 0 by default
      var minVal = Math.min.apply(this, bracketSlots);
      var slot;

      for (var i = 0; i < bracketSlots.length && slot === undefined; i++) {
        var slotVal = bracketSlots[i];
        // Found first suitable slot
        if (slotVal === minVal) {
          slot = i;
          bracketSlots[i] = slotVal+1;
        }
      }
      // Assign slot to associated bracket
      brackets[subjRefId].slot = slot;
    }

    function releaseSlot(subjRefId) {
      var bracket = brackets[subjRefId];
      bracketSlots[bracket.slot] = bracketSlots[bracket.slot] - 1;
    }
    
    // Sort brackets and events
    events = _.sortBy(events, 'pos');

    // Start the sweep (go through all events)
    _.each(events, function(evt) {
      if (evt.type === "start") {
        bookSlot(evt.subjRefId);
      } else {
        releaseSlot(evt.subjRefId);
      }
    });

    // Render brackets
    // --------------

    _.each(brackets, function(bracket, bracketId) {
      var subjectRefEl = $(this.getDOMNode()).find('.subject-references .subject-reference[data-id='+bracketId+']');
      subjectRefEl.css({
        top: bracket.top,
        height: bracket.height
      });

      subjectRefEl.removeClass('level-0 level-1 level-2');
      subjectRefEl.addClass('level-'+bracket.slot);
    }, this);
  },


  componentDidMount: function() {
    var surface = this.surface;
    var app = this.context.app;
    var doc = this.props.doc;

    doc.connect(this, {
      'document:changed': this.onDocumentChange
    });

    app.registerSurface(surface, {
      enabledTools: ENABLED_TOOLS
    });
    surface.attach(this.refs.interviewContent.getDOMNode());

    doc.connect(this, {
      'container-annotation-update': this.handleContainerAnnotationUpdate
    });

    var self = this;

    // TODO: we need a way so that the brackets get updated properly
    this.forceUpdate(function() {
      // self.updateBrackets();
      _.delay(function() {
        self.updateBrackets();
      }, 100);

      self.surface.rerenderDomSelection();
    });

    $(window).resize(this.updateBracketsDebounced);
  },

  handleContainerAnnotationUpdate: function() {
    var self = this;
    this.forceUpdate(function() {
      self.updateBrackets();
    });
  },

  componentDidUpdate: function() {
    // HACK: when the state is changed this and particularly TextProperties
    // get rerendered (e.g., as the highlights might have changed)
    // Unfortunately we loose the DOM selection then.
    // Thus, we are resetting it here, but(!) delayed as otherwise the surface itself
    // might not have finished setting the selection to the desired and a proper state.
    if (!this.surface.__prerendering__) {
      var self = this;
      setTimeout(function() {
        self.surface.rerenderDomSelection();
      });
    }
    this.updateBrackets();
  },

  componentWillUnmount: function() {
    var app = this.context.app;
    var surface = this.surface;
    var doc = this.props.doc;
    doc.disconnect(this);

    app.unregisterSurface(surface);
    surface.detach();
  },

  onDocumentChange: function(change) {
    var app = this.context.app;

    // console.log('##### ContainerComponent.onDocumentChange', change);

    var deletedSubjectRefs = _.filter(change.deleted, function(node) {
      return node.type === "subject_reference";
    });

    var createdSubjectRefs = _.filter(change.created, function(node) {
      return node.type === "subject_reference";
    });

    // HACK: implicitly switch the state when a subject reference is deleted and currently open
    // This implicitly also updates the brackets accordingly
    var subjectRef = deletedSubjectRefs[0];
    if (subjectRef && app.state.subjectReferenceId === subjectRef.id) {
      app.replaceState({
        contextId: 'subjects'
      });
      return;
    }

    if (change.isAffected([this.props.node.id, 'nodes']) || createdSubjectRefs.length > 0 ) {
      var self = this;
      // console.log('##### calling forceUpdate after document change, to update brackets');
      this.forceUpdate(function() {
        self.updateBracketsDebounced();
      });
    }
    // eagerly update brackets on every change
    else {
      this.updateBracketsDebounced();
    }
  }

});

module.exports = ContentEditor;