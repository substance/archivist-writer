'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");
var HtmlEditor = require("substance-ui/html-editor");
var Icon = require("substance-ui/font_awesome_icon");
var ToolComponent = HtmlEditor.ToolComponent;

// Used for HtmlEditor
// 

class Toolbar extends React.Component {
  render() {
    return $$("div", { className: "toolbar"},
      $$(ToolComponent, { tool: 'emphasis', classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-italic"})),
      $$(ToolComponent, { tool: 'strong', classNames: ['button', 'tool']}, $$(Icon, {icon: "fa-bold"}))
    );
  }
}

class EditCommentPanel extends Panel {

  // Initialization
  // -----------------

  constructor(props) {
    super(props);
  }

  computeState() {
    var app = this.context.app;
    var doc = app.doc;
    var comment = doc.get(app.state.commentId);

    return {
      comment: comment
    };
  }

  componentWillMount() {
    this.state = this.computeState();
  }

  componentWillReceiveProps() {
    this.setState(this.computeState());
  }

  // Event handlers
  // -----------------

  handleCancel(e) {
    e.preventDefault();
    // Go to regular entities panel
    this.context.app.replaceState({
      contextId: "show-comment",
      commentId: this.state.comment.id
    });
  }

  handleDelete(e) {
    e.preventDefault();
    var doc = this.getDocument();
    doc.transaction(function(tx) {
      tx.delete(this.state.comment.id);
    }.bind(this));

    this.context.app.replaceState({
      contextId: "comments"
    });
  }

  handleSave(e) {
    e.preventDefault();

    var htmlEditor = this.refs.htmlEditor;
    var doc = this.getDocument();
    doc.transaction(function(tx) {
      tx.set([this.state.comment.id, "content"], htmlEditor.getContent());
    }.bind(this));

    // Go back to show dialog
    this.handleCancel(e);
  }

  render() {
    var comment = this.state.comment;

    var created = new Date(comment.created_at);
    var created_at = created.toDateString() + ' ' + created.getHours() + ':' + (created.getMinutes()<10?'0':'') + created.getMinutes();

    return $$("div", {className: "panel dialog edit-comment-panel-component"},
      $$('div', {className: "dialog-header"},
        $$('a', {
          href: "#",
          className: 'back',
          onClick: this.handleCancel.bind(this),
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-chevron-left"></i>'}
        }),
        $$('div', {className: 'label'}, "Edit Comment"),
        $$('div', {className: 'actions'},
          $$('a', {
            href: "#",
            className: "delete-comment",
            onClick: this.handleDelete.bind(this),
            dangerouslySetInnerHTML: {__html: '<i class="fa fa-trash"></i> Remove'}
          })
        )
      ),

      $$('div', {className: "panel-content"},
        $$('div', {className: 'comment'},
          $$('div', {className: "comment-editor"},
            $$(HtmlEditor, {
              ref: 'htmlEditor',
              content: comment.content,
              toolbar: Toolbar,
              enabledTools: ["strong", "emphasis"],
              // onContentChanged: function(doc, change) {
              //   // console.log('document changed', change);
              //   // console.log('new content', doc.toHtml());
              // }
            }),
            $$('button', {
              className: 'button action save-comment',
              onClick: this.handleSave.bind(this)
            }, 'Save Comment'),
            $$('button', {
              className: 'button action cancel save-comment',
              onClick: this.handleCancel.bind(this)
            }, 'Cancel')
          ),
          $$('div', {className: 'meta'},
            $$('span', {className: 'creator'}, comment.creator),
            $$('span', {className: 'created-at'}, created_at)
          )
        ),
        // TODO: Display replies
        $$('div', {className: 'replies'})
      )
    );
  }
}


EditCommentPanel.displayName = 'EditCommentPanel';
EditCommentPanel.contextTypes = {
  app: React.PropTypes.object.isRequired
};

// Panel Configuration
// -----------------

EditCommentPanel.icon = 'fa-comment';
EditCommentPanel.isDialog = true;

module.exports = EditCommentPanel;