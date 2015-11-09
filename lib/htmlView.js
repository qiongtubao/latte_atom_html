var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) {
    for (var key in parent) {
      if (hasProp.call(parent, key))
      child[key] = parent[key];
    }
    function ctor() {
      this.constructor = child;
   }
   ctor.prototype = parent.prototype;
   child.prototype = new ctor();
   child.__super__ = parent.prototype;
   return child;
 },
  hasProp = {}.hasOwnProperty;
var fs = require("fs");
var Atom = require("atom");
var CompositeDisposable = Atom.CompositeDisposable;
var Disposable = Atom.Disposable;
var penView = require("atom-space-pen-views");
var $ = penView.$;
var $$$ = penView.$$$;
var ScrollView = require("./scrollView");
//var ScrollView = penView.ScrollView;
var path = require("path");
var os = require("os");
var latte_lib = require("latte_lib");
var HtmlView  = function(arg) {
  ScrollView.call(this, arguments);
  this.filePath = arg.filePath;
};
latte_lib.inherits(HtmlView, ScrollView);
(function(){
  this.initialize = function() {
    this.text("super long content that will scroll");
  }
  this.getTitle = function(){
    if(this.editor != null ) {
      return this.editor.getTitle() + " latteHtml";
    }else{
      return "latteHtml";
    }
  }
  this.renderHTML = function() {
    var data = fs.readFileSync(this.filePath);
    var iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.src = this.filePath;
    this.html($(iframe));
  }
}).call(HtmlView.prototype);
(function() {
  this.content = function() {
    return this.div({
      "class": "html",
      tabindex: -1
    });
  }
  this.buildHtml = ScrollView.buildHtml;
  this.pushBuilder = ScrollView.pushBuilder;
  this.div = ScrollView.div;
  this.popBuilder = ScrollView.popBuilder;
}).call(HtmlView);
module.exports = HtmlView;
