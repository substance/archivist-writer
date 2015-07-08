var EntityMixin = {
  // Handles click to activate an entity
  handleToggle: function(e) {
    console.log('handle toggle');
    this.props.handleToggle(this.props.id);
    e.preventDefault();
  }
};

module.exports = EntityMixin;