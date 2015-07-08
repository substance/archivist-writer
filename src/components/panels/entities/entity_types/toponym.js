var $$ = React.createElement;
var EntityMixin = require("./entity_mixin");

// Toponym view
// ----------------

var Toponym = React.createClass({
  displayName: "Toponym",
  mixins: [EntityMixin],
  handleEdit: function(e) {
    e.stopPropagation();
  },
  render: function() {
    var className = ["entity toponym"];
    if (this.props.active) className.push("active");

    return $$("div", {className: className.join(" "), onClick: this.handleToggle},
      $$("div", {className: "type"}, "Toponym"),
      $$("div", {className: "name"}, this.props.name),
      $$("div", {className: "synonyms"}, "Known as: "+ this.props.synonyms.join(', ')),
      $$("div", {className: "country"}, "Country: "+this.props.country),
      $$("div", {className: "description"}, this.props.description),
      $$("a", {className: "edit", target: "_blank", href: './toponyms/' + this.props.id, onClick: this.handleEdit},
        $$("i", {className: "fa fa-pencil-square-o"})
      )
    );
  }
});

module.exports = Toponym;