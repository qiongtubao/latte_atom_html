
  var latte_lib = require("latte_lib");
  //var View = require('atom-space-pen-views/node_modules/space-pen').View;
  var View = require("./view");
  var ScrollView = function() {
    View.apply(this, arguments);
  };
  latte_lib.inherits(ScrollView, View);
  (function() {
    this.buildHtml = View.buildHtml;
    this.pushBuilder = View.pushBuilder;
    this.div = View.div;
    this.popBuilder = View.popBuilder;
  }).call(ScrollView);
  (function() {
    this.initialize = function() {
      return atom.commands.add(this.element, {
        'core:move-up': (function(_this) {
          return function() {
            return _this.scrollUp();
          };
        })(this),
        'core:move-down': (function(_this) {
          return function() {
            return _this.scrollDown();
          };
        })(this),
        'core:page-up': (function(_this) {
          return function() {
            return _this.pageUp();
          };
        })(this),
        'core:page-down': (function(_this) {
          return function() {
            return _this.pageDown();
          };
        })(this),
        'core:move-to-top': (function(_this) {
          return function() {
            return _this.scrollToTop();
          };
        })(this),
        'core:move-to-bottom': (function(_this) {
          return function() {
            return _this.scrollToBottom();
          };
        })(this)
      });
    };
  }).call(ScrollView.prototype);
  module.exports = ScrollView;
