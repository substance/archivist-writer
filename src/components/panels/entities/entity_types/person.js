var $$ = React.createElement;
var EntityMixin = require("./entity_mixin");

// Prison view
// ----------------

var Person = React.createClass({
  displayName: "Person",
  mixins: [EntityMixin],
  handleEdit: function(e) {
    e.stopPropagation();
  },
  render: function() {
    var className = ["entity person"];
    if (this.props.active) className.push("active");

    return $$("div", {className: className.join(" "), onClick: this.handleToggle},
      $$("div", {className: "type"}, "Person"),
      $$("div", {className: "name"}, this.props.name),
      $$("div", {className: "description"}, this.props.description),
      $$("a", {className: "edit", target: "_blank", href: './persons/' + this.props.id, onClick: this.handleEdit},
        $$("i", {className: "fa fa-pencil-square-o"})
      )
    );
  }
});

module.exports = Person;