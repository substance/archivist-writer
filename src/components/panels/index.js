var EntitiesPanel = require("./entities/entities_panel");
var ShowEntityReferencePanel = require("./entities/show_entity_reference_panel");
var TagEntityPanel = require("./entities/tag_entity_panel");

var SubjectsPanel = require("./subjects/subjects_panel");
var EditSubjectReferencePanel = require("./subjects/edit_subject_reference_panel");

var MetadataPanel = require("./metadata/metadata_panel");
var SelectLocationPanel = require("./metadata/select_location_panel");

// Comments
var CommentsPanel = require("./comments/comments_panel");
var ShowCommentPanel = require("./comments/show_comment_panel");
var EditCommentPanel = require("./comments/edit_comment_panel");


module.exports = {
  "entities": EntitiesPanel,
  "subjects": SubjectsPanel,
  "tagentity": TagEntityPanel,
  "selectWaypoint": SelectLocationPanel,
  "selectPrison": SelectLocationPanel,
  "selectProjectLocation": SelectLocationPanel,
  "showEntityReference": ShowEntityReferencePanel,
  "editSubjectReference": EditSubjectReferencePanel,
  "show-comment": ShowCommentPanel,
  "edit-comment": EditCommentPanel,
  "comments": CommentsPanel,
  "metadata": MetadataPanel
};
