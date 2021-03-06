var EntitiesPanel = require("./entities/entities_panel");
var ShowEntityReferencePanel = require("./entities/show_entity_reference_panel");
var TagEntityPanel = require("./entities/tag_entity_panel");

var RemarksPanel = require("./remarks/remarks_panel");
var SubjectsPanel = require("./subjects/subjects_panel");
var EditSubjectReferencePanel = require("./subjects/edit_subject_reference_panel");

var MetadataPanel = require("./metadata/metadata_panel");
var SelectLocationPanel = require("./metadata/select_location_panel");

module.exports = {
  "entities": EntitiesPanel,
  "remarks": RemarksPanel,
  "subjects": SubjectsPanel,
  "tagentity": TagEntityPanel,
  "selectWaypoint": SelectLocationPanel,
  "selectPrison": SelectLocationPanel,
  "selectProjectLocation": SelectLocationPanel,
  "showEntityReference": ShowEntityReferencePanel,
  "editSubjectReference": EditSubjectReferencePanel,
  "metadata": MetadataPanel
};
