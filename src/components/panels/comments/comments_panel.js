'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");

// Used for HtmlEditor
// 

class CommentsPanel extends Panel {

  // Initialization
  // -----------------

  constructor(props) {
    super(props);
  }

  computeState() {
    var app = this.context.app;
    var doc = app.doc;
    // var comment = doc.get(app.state.commentId);

    // TODO: Sort by occurence in document
    var comments = _.map(doc.commentsIndex.get(), function(comment) {
      return comment;
    });

    return {
      comments: comments
    };
  }

  // Initialization
  componentWillMount() {
    this.state = this.computeState();
  }

  // Updating
  componentWillReceiveProps() {
    this.setState(this.computeState());
  }

  // Event handlers
  // -----------------

  handleClick(e) {
    e.preventDefault();
    var commentId = e.currentTarget.dataset.id;

    this.context.app.replaceState({
      contextId: "show-comment",
      commentId: commentId
    });
  }

  // Rendering
  // -----------------


  render() {
    var commentEls = [];
    var comments = this.state.comments;

    _.each(comments, function(comment) {

      var created = new Date(comment.created_at);
      var created_at = created.toDateString() + ' ' + created.getHours() + ':' + (created.getMinutes()<10?'0':'') + created.getMinutes();

      var sourceText = comment.getText();
      // Shorten sourceText
      if (sourceText.length > 130) {
        sourceText = sourceText.slice(0,130) + " ...";
      }

      commentEls.push($$('div', {
        "data-id": comment.id,
        className: 'comment',
        onClick: this.handleClick.bind(this)
      },
        $$('div', {className: 'meta'},
          $$('span', {className: 'creator'}, comment.creator),
          $$('span', {className: 'created-at'}, created_at)
        ),
        $$('div', null,
          $$('span', {className: 'title'}, sourceText)
        ),
        $$('div', {
          className: 'comment-body',
          dangerouslySetInnerHTML: {__html: comment.content }
        })
      ));
    }.bind(this));

    return $$("div", {className: "panel comments-panel-component"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'comments'}, commentEls)
      )
    );
  }
}

CommentsPanel.displayName = 'Comments';

CommentsPanel.contextTypes = {
  app: React.PropTypes.object.isRequired
};

// Panel Configuration
// -----------------

CommentsPanel.contextId = 'comments';

CommentsPanel.icon = 'fa-comment';

module.exports = CommentsPanel;