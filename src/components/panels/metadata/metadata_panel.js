var Substance = require("substance");
var $$ = React.createElement;
var Surface = Substance.Surface;
var _ = require("substance/helpers");
var TextProperty = require("substance-ui/text_property");

// Helpers
// ------------------

function label(name) {
  return $$('div', {className: 'label', contentEditable: false}, name);
}

// Metadata Panel
// ------------------

var MetadataPanel = React.createClass({
  displayName: "Info",

  // State relevant things
  // ------------

  contextTypes: {
    backend: React.PropTypes.object.isRequired,
    app: React.PropTypes.object.isRequired,
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

    this.surface = new Surface(this.context.surfaceManager, doc, new Surface.FormEditor());
    return null;
  },

  componentDidMount: function() {
    var app = this.context.app;
    app.registerSurface(this.surface, {
      enabledTools: ["strong", "emphasis"]
    });

    this.surface.attach(this.getDOMNode());

    var doc = app.doc;
    doc.connect(this, {
      'document:changed': this.handleDocumentChange
    });
    this.loadMetadata();
  },

  handleDocumentChange: function(change, info) {
    var refId = this.props.subjectReferenceId;

    if (change.isAffected(["document", "interviewee_prisons"]) ||
        change.isAffected(["document", "interviewee_waypoints"]) ||
        change.isAffected(["document", "project_location"]) ||
        change.isAffected(["document", "record_type"]) ||
        change.isAffected(["document", "transcripted"]) ||
        change.isAffected(["document", "verified"]) ||
        change.isAffected(["document", "finished"])) {
      this.loadMetadata();
    }
  },

  handleWaypointDensityChange: function(e) {
    var app = this.context.app;
    var doc = app.doc;
    var waypointId = e.currentTarget.dataset.waypointId;
    var newDensityValue = e.currentTarget.value;

    doc.transaction(function(tx) {
      tx.set([waypointId, "density"], newDensityValue);
    });
  },

  componentWillUnmount: function() {
    var app = this.context.app;
    app.doc.disconnect(this);
    app.unregisterSurface(this.surface);
    this.surface.detach();
  },

  loadPrisons: function(cb) {
    var app = this.context.app;
    var backend = this.context.backend;
    var doc = app.doc;
    var prisonIds = doc.get('document').interviewee_prisons;
    backend.getEntities(prisonIds, cb);
  },

  loadProjectLocation: function(cb) {
    var backend = this.context.backend;
    var app = this.context.app;
    var doc = app.doc;

    var projectLocationId = doc.get('document').project_location;
    if (projectLocationId) {
      backend.getEntities([projectLocationId], function(err, locations) {
        if (err) return cb(err);
        cb(null, locations[0]);
      });
    } else {
      cb(null, null);
    }
  },

  loadWaypointLocations: function(cb) {
    var backend = this.context.backend;
    var app = this.context.app;
    var doc = app.doc;
    var waypoints = doc.get('document').getWaypoints();
    var waypointLocationIds = _.pluck(waypoints, 'entityId');

    backend.getEntities(waypointLocationIds, function(err, waypointLocations) {
      if (err) return cb(err);
      var res = {};
      _.each(waypointLocations, function(location) {
        res[location.id] =  location;
      });
      cb(null, res);
    });
  },

  loadMetadata: function() {
    var self = this;
    // console.log('loading/reloading external metadata and rerender');

    this.loadPrisons(function(err, prisons) {
      self.loadWaypointLocations(function(err, waypointLocations) {
        self.loadProjectLocation(function(err, projectLocation) {
          self.setState({
            prisons: prisons,
            waypointLocations: waypointLocations,
            projectLocation: projectLocation
          });
        });
      });
    });
  },

  renderTextProperty: function(property) {
    var app = this.context.app;
    return $$(TextProperty, {
      doc: app.doc,
      path: [ "document", property]
    });
  },

  renderChecboxProperty: function(property) {
    var app = this.context.app;
    var checked = app.doc.get('document')[property];

    return $$('input', {
      contentEditable: false,
      name: property,
      onChange: this.handleCheckboxChange,
      checked: checked,
      type: 'checkbox'
    });
  },

  renderInterviewType: function() {
    var app = this.context.app;
    var selected = app.doc.get('document').record_type;

    return $$('select', {contentEditable: false, onChange: this.handleInterviewTypeState, defaultValue: selected},
      $$('option', 'video', "Video"),
      $$('option', 'audio', "Audio")
    );
  },

  handleCheckboxChange: function(e) {
    var app = this.context.app;
    var doc = app.doc;
    var property = e.currentTarget.name;
    var checked = e.currentTarget.checked;

    doc.transaction(function(tx) {
      tx.set(["document", property], checked);
    });
  },

  handleInterviewTypeState: function(e) {
    var app = this.context.app;
    var doc = app.doc;
    var value = e.currentTarget.value;

    doc.transaction(function(tx) {
      tx.set(["document", "record_type"], value);
    });
  },

  handleAddPrison: function(e) {
    var app = this.context.app;
    e.preventDefault();
    app.replaceState({
      contextId: "selectPrison"
    });
  },

  handleAddWaypoint: function(e) {
    var app = this.context.app;
    e.preventDefault();
    app.replaceState({
      contextId: "selectWaypoint"
    });
  },

  handleSetProjectLocation: function(e) {
    var app = this.context.app;
    e.preventDefault();
    app.replaceState({
      contextId: "selectProjectLocation"
    });
  },

  handleRemoveProjectLocation: function(e) {
    e.preventDefault();
    var app = this.context.app;
    var doc = app.doc;

    doc.transaction(function(tx) {
      tx.set(["document", "project_location"], null);
    });
  },

  handleRemoveWaypoint: function(e) {
    var app = this.context.app;
    var doc = app.doc;
    var waypointId = e.currentTarget.dataset.id;
    e.preventDefault();

    var waypointIds = doc.get('document').interviewee_waypoints;
    waypointIds = _.without(waypointIds, waypointId);

    doc.transaction(function(tx) {
      tx.delete(waypointId);
      tx.set(["document", "interviewee_waypoints"], waypointIds);
    });
  },

  handleRemovePrison: function(e) {
    var app = this.context.app;
    var doc = app.doc;
    var prisonId = e.currentTarget.dataset.id;
    var prisonIds = doc.get('document').interviewee_prisons;
    prisonIds = _.without(prisonIds, prisonId);
    e.preventDefault();

    doc.transaction(function(tx) {
      tx.set(["document", "interviewee_prisons"], prisonIds);
    });
  },

  renderProjectLocation: function() {
    var elems = [label("Project Location")];
    
    if (this.state.projectLocation) {
      var projectLocation = $$('span', {className: 'entity-tag', contentEditable: false},
        $$('span', {className: 'project-location name'}, this.state.projectLocation.name),
        $$('a', {
          href: "#",
          "data-id": this.state.projectLocation.id,
          className: 'remove-tag remove-project-location',
          onClick: this.handleRemoveProjectLocation,
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-remove"></i>'},
        })
      );
      elems.push(projectLocation);
    } else {
      elems.push($$('a', {
        href: '#',
        className: 'add-entity set-project-location',
        onClick: this.handleSetProjectLocation,
      }, "Set project Location"));
    }

    return $$('div', {contentEditable: false, className: 'project-location-wrapper'}, elems);
  },

  renderPrisons: function() {
    var prisonEls = this.state.prisons.map(function(prison) {
      return $$('span', {className: 'entity-tag prison'},
        $$('span', {className: 'name'}, prison.name),
        $$('a', {
          href: "#",
          "data-id": prison.id,
          className: 'remove-tag remove-prison',
          onClick: this.handleRemovePrison,
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-remove"></i>'},
        })
      );
    }.bind(this));

    return $$('div', {className: 'prisons-wrapper', contentEditable: false},
      label("Prisons"),
      $$('div', {className: 'entity-tags prisons'}, prisonEls),
      $$('a', {href: '#', className: 'add-entity add-prison', onClick: this.handleAddPrison}, "Add prison")
    );
  },

  renderWaypoints: function() {
    var app = this.context.app;
    var doc = app.doc;
    var waypoints = doc.get("document").getWaypoints();

    var waypointEls = waypoints.map(function(waypoint) {
      waypointLocation = this.state.waypointLocations[waypoint.entityId];

      return $$('span', {className: 'entity-tag waypoint'},
        $$('span', {className: 'name'}, waypointLocation.name),
        $$('input', {"data-waypoint-id": waypoint.id, className: 'density', min: 1, max: 5, type: 'number', defaultValue: waypoint.density, onChange: this.handleWaypointDensityChange}),
        $$('a', {
          href: "#",
          "data-id": waypoint.id,
          className: 'remove-tag remove-waypoint',
          onClick: this.handleRemoveWaypoint,
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-remove"></i>'},
        })
      );
    }.bind(this));

    return $$('div', {className: 'waypoints-wrapper', contentEditable: false},
      label("Waypoints"),
      $$('div', {className: 'entity-tags waypoints'}, waypointEls),
      $$('a', {href: '#', className: 'add-entity add-waypoint', onClick: this.handleAddWaypoint}, "Add waypoint")
    );
  },

  render: function() {
    var props = this.props;

    if (!this.state) {
      return $$('div', {contentEditable: true, "data-id": "metadata"}, 'Loading');
    }

    return $$("div", {className: "panel metadata-panel-component", contentEditable: true, "data-id": "metadata"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'abstracts section'},
          $$('h3', {contentEditable: false}, "Summary"),
          // Russian abstract
          label("Russian"),
          this.renderTextProperty('abstract'),

          // English abstract
          label("English"),
          this.renderTextProperty('abstract_en')
        ),

        $$('div', {className: 'biography section'},
          $$('h3', {contentEditable: false}, "Biography"),
          label("Name"),
          this.renderTextProperty("title"),

          label("Biography"),
          this.renderTextProperty("interviewee_bio"),

          label("Category"),
          this.renderTextProperty("interviewee_category"),

          label("Forced labor"),
          this.renderTextProperty("interviewee_forced_labor_type"),

          this.renderPrisons(),
          this.renderWaypoints()
        ),

        $$('div', {className: 'project section'},
          $$('h3', {contentEditable: false}, "Project Details"),
          // Project name
          label("Project Name"),
          this.renderTextProperty('project_name'),

          // Project location
          this.renderProjectLocation(),

          // Where the interview took place
          label("Place"),
          this.renderTextProperty('interview_location'),

          // Where the interview took place
          label("Persons present"),
          this.renderTextProperty('persons_present'),

          // Video or audio
          label("Interview Type"),
          this.renderInterviewType(),

          // Source of media
          label("Media identifier"),
          this.renderTextProperty('media_id'),

          // Where the interview took place
          label("Duration (in minutes)"),
          this.renderTextProperty('interview_duration'),

          // Where the interview took place
          label("Interview date"),
          this.renderTextProperty('interview_date'),

          // The interviewer
          label("Interviewer"),
          this.renderTextProperty('conductor'),

          // Interview operator
          label("Operator"),
          this.renderTextProperty('operator'),

          // Sound
          label("Sound Operator"),
          this.renderTextProperty('sound_operator'),

          label("Date of publication"),
          this.renderTextProperty('published_on')

          // $$('div', {className: "This interview was created on XX and published on YY. Last update was made"})
        ),
        $$('div', {className: 'status section', contentEditable: false},
          $$('h3', {contentEditable: false}, "Workflow"),

          this.renderChecboxProperty('transcripted'),
          label("Transcription ready"),

          this.renderChecboxProperty('verified'),
          label("Interview verified"),

          this.renderChecboxProperty('finished'),
          label("Ready for publish")
        )
      )
    );
  }
});

MetadataPanel.contextId = "metadata";
MetadataPanel.icon = "fa-info";

module.exports = MetadataPanel;
