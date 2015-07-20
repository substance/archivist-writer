'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");

class ShowCommentPanel extends Panel {

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
      contextId: "comments"
    });
  }

  handleEdit(e) {
    e.preventDefault();

    // Go to regular entities panel
    this.context.app.replaceState({
      contextId: "edit-comment",
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

  render() {
    var comment = this.state.comment;

    var created = new Date(comment.created_at);
    var created_at = created.toDateString() + ' ' + created.getHours() + ':' + (created.getMinutes()<10?'0':'') + created.getMinutes();

    return $$("div", {className: "panel dialog show-comment-panel-component"},
      $$('div', {className: "dialog-header"},
        $$('a', {
          href: "#",
          className: 'back',
          onClick: this.handleCancel.bind(this),
          dangerouslySetInnerHTML: {__html: '<i class="fa fa-chevron-left"></i>'}
        }),
        $$('div', {className: 'label'}, "Comment"),
        $$('div', {className: 'actions'},
          $$('a', {
            href: "#",
            className: "edit-comment",
            onClick: this.handleEdit.bind(this),
            dangerouslySetInnerHTML: {__html: '<i class="fa fa-pencil"></i> Edit'}
          }),
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
          $$('div', {className: 'meta'},
            $$('span', {className: 'creator'}, comment.creator),
            $$('span', {className: 'created-at'}, created_at)
          ),
          $$('div', {
            className: "comment-content",
            dangerouslySetInnerHTML: {__html: comment.content}
          })
        ),
        // TODO: Display replies
        $$('div', {className: 'replies'})
      )
    );
  }
}

ShowCommentPanel.displayName = 'ShowCommentPanel';

ShowCommentPanel.contextTypes = {
  app: React.PropTypes.object.isRequired
};

// Panel Configuration
// -----------------

ShowCommentPanel.icon = 'fa-comment';
ShowCommentPanel.isDialog = true;

module.exports = ShowCommentPanel;