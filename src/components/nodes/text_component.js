'use strict';

var TextProperty = require('substance-ui/text_property');
var $$ = React.createElement;

class TextComponent extends React.Component {
  render() {
    return $$("div", { className: "content-node text", "data-id": this.props.node.id },
      $$(TextProperty, {
        ref: "textProp",
        doc: this.props.doc,
        path: [ this.props.node.id, "content"]
      })
    );
  }
}

TextComponent.displayName = "TextComponent";

module.exports = TextComponent;
