var ToolComponent = require("substance-ui/tool_component");
var DropdownComponent = require("substance-ui/dropdown_component");

// A simple tool for navigating app states
var NavigateTool = require("./tools/navigate_tool_component");
var Icon = require("substance-ui/font_awesome_icon");

var _ = require("substance/helpers");
var $$ = React.createElement;

var ContentToolbarComponent = React.createClass({

  handleToggleDialog: function(e) {
    e.preventDefault();
    $('.modal').toggleClass('active');
  },

  handleDropdownToggle: function(e) {
    e.preventDefault();
    var $el = $(e.currentTarget).parents('.dropdown');
    if ($el.is('.active')) {
      $el.toggleClass('open');
    }
  },

  render: function() {
    return $$("div", { className: "content-tools-component toolbar small fill-white" },
      $$('div', {className: 'tool-group document clearfix'},
        $$(ToolComponent, { tool: 'undo', title: i18n.t('menu.undo'), classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-undo"})),
        $$(ToolComponent, { tool: 'redo', title: i18n.t('menu.redo'), classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-repeat"})),
        $$(ToolComponent, { tool: 'save', title: i18n.t('menu.save'), classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-save"})),
        $$(ToolComponent, { tool: 'export', title: i18n.t('menu.export'), classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-download"}))
      ),

      $$('div', {className: 'tool-group actions clearfix'}),

      $$('div', {className: 'tool-group formatting clearfix float-right'},
        $$(ToolComponent, { tool: 'timecode', title: i18n.t('menu.timecode'), classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-clock-o"})),
        $$(ToolComponent, { tool: 'emphasis', title: i18n.t('menu.emphasis'), classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-italic"})),
        $$(ToolComponent, { tool: 'strong', title: i18n.t('menu.strong'), classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-bold"}))
      ),
      $$('div', {className: 'tool-group formatting clearfix float-right'},
        $$(ToolComponent, { tool: 'indentation', title: i18n.t('menu.indentation'), classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-dedent"})),
        $$(ToolComponent, { tool: 'whitespace', title: i18n.t('menu.whitespace'), classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-eraser"}))
      ),
      $$('div', {className: 'tool-group formatting clearfix float-right'},
        $$(ToolComponent, { tool: 'comment', title: 'Comment', classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-comment"})),
        $$(ToolComponent, { tool: 'entity_reference', title: 'Tag Entity', classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-bullseye"})),
        $$(ToolComponent, { tool: 'subject_reference', title: 'Tag Subject', classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-tag"}))
      )
    );
  }
});

module.exports = ContentToolbarComponent;

