var Tree = require("./tree");
var Substance = require("substance");

var SubjectsModel = function(doc, subjects) {
  this.doc = doc;

  // Convert subjects to hash
  this.subjects = {};

  Substance.each(subjects, function(subject) {
    this.subjects[subject.id] = subject;
  }, this);

  this.tree = new Tree(this.subjects);
};

// Get tree representation suitable for jsTree widget
// ----------------

SubjectsModel.prototype.getTree = function() {
  var tree = this.tree;

  function getChildren(parentId) {
    var res = [];
    var nodes = tree.getChildren(parentId);
    if (nodes.length === 0) return res; // exit condition

    Substance.each(nodes, function(node) {
      var entry = {
        id: node.id,
        text: node.name,
        children: getChildren(node.id) // get children for subj
      };
      res.push(entry);
    });
    return res;
  }

  return getChildren("root");
};


SubjectsModel.prototype.getAllReferencedSubjects = function() {
  var doc = this.doc;
  var subjectRefs = doc.subjectReferencesIndex.get();
  var subjects = [];

  Substance.each(subjectRefs, function(subjectRef) {
    Substance.each(subjectRef.target, function(subjectId) {
      var subject = this.tree.get(subjectId);
      if (!Substance.includes(subjects, subject)) {
        if(subject === undefined) {
          console.log('You have outdated subjects in this interview')
        } else {
          subjects.push(subject);
        }  
      }
    }, this);
  }, this);

  return subjects;
};

SubjectsModel.prototype.getFullPathForSubject = function(subjectId) {
  var tree = this.tree;
  var res = [];

  function getParent(nodeId) {
    var node = tree.get(nodeId);
    var parent = tree.getParent(nodeId);
    if (parent) getParent(parent.id);

    res.push(node.name);
    return res;
  }
  return getParent(subjectId);
};

module.exports = SubjectsModel;