var EntitiesPanel = require("./entities_panel");
var TagEntityPanel = require("./tag_entity_panel");
var TagEntityTool = require("./tag_entity_tool");
var ShowEntityReferencePanel = require("./show_entity_reference_panel");
var stateHandlers = require("./state_handlers");

module.exports = {
  name: "entities",
  panels: [
    EntitiesPanel,
    TagEntityPanel,
    ShowEntityReferencePanel
  ],
  stateHandlers: stateHandlers,
  tools: [
    TagEntityTool
  ]
};
