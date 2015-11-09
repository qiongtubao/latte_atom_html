var latte_lib = require("latte_lib");
var Builder = require("./builder");
var JQuery = require("./jquery");
var Events = 'blur change click dblclick error focus input keydown\
 keypress keyup load mousedown mousemove mouseout mouseover\
 mouseup resize scroll select submit unload'.split(/\s+/);
 var docEl = document.documentElement;

 var matches = docEl.matchesSelector || docEl.mozMatchesSelector || docEl.webkitMatchesSelector || docEl.oMatchesSelector || docEl.msMatchesSelector;

 var matchesSelector = matches ? (function(elem, selector) {
   return matches.call(elem[0], selector);
 }) : (function(elem, selector) {
   return elem.is(selector);
 });
var View = function() {
  var _this = this;
  var args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
  if(typeof this.afterAttach === "function") {
    return new Error("The ::afterAttach hook has ")
  }
  if(typeof this.beforeRemove === "function") {
    throw new Error("The ::beforeRemove hook has been replaced by ::detached. See https://github.com/atom/space-pen#attacheddetached-hooks for details.");
  }
  if(this.element != null) {
    jQuery.fn.init.call(this, this.element);
  } else {
    var _ref = this.constructor.buildHtml(function() {
      return this.content.apply(this, args);
    });
    var html = _ref[0];
    var postProcessingSteps = _ref[1];
    JQuery.fn.init.call(this, html);
    if(this.length !== 1) {
      throw new Error("View markup must have a single root element");
    }
    this.element = this[0];
    this.element.attached = function() {
      return typeof _this.attached === "function" ? _this.attached() : void 0;
    }
    this.element.detached = function() {
      return typeof _this.detached === "function" ? _this.detached() : void 0;
    }
  }
  this.wireOutlets(this);
  this.bindEventHandlers(this);
  this.element.spacePenView = this;
  treeWalker = document.createTreeWalker(this.element, NodeFilter.SHOW_ELEMENT);
  while(element = treeWalker.nextNode()) {
    element.spacePenView = this;
  }
  if(postProcessingSteps != null) {
    for(var i = 0, len = postProcessingSteps; i < len; i++) {
      step = postProcessingSteps[_i];
      step(this);
    }
  }
  if (typeof this.initialize === "function") {
    this.initialize.apply(this, args);
  }
};
latte_lib.inherits(View, JQuery);
(function() {
  var Tags = 'a abbr address article aside audio b bdi bdo blockquote body button canvas\
   caption cite code colgroup datalist dd del details dfn dialog div dl dt em\
   fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header html i\
   iframe ins kbd label legend li main map mark menu meter nav noscript object\
   ol optgroup option output p pre progress q rp rt ruby s samp script section\
   select small span strong style sub summary sup table tbody td textarea tfoot\
   th thead time title tr u ul var video area base br col command embed hr img\
   input keygen link meta param source track wbr'.split(/\s+/);
   var self = this;
  Tags.forEach(function(tagName) {
    return self[tagName] = function() {
      var args, _ref;
      args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
      return (_ref = this.currentBuilder).tag.apply(_ref, [tagName].concat(Array.prototype.slice.call(args)));
    }
  });
  this.subview = function() {
    return this.currentBuilder.subview(name);
  }
  this.text = function(string) {
    return this.currentBuilder.text(string);
  }
  this.tag = function() {
    var args, tagName, _ref;
    tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = this.currentBuilder).tag.apply(_ref, [tagName].concat(__slice.call(args)));
  }
  this.raw = function(string) {
    return this.currentBuilder.raw(string);
  }
  this.pushBuilder = function() {
    var builder = new Builder;
    if(this.builderStack == null) {
      this.builderStack = [];
    }
    this.builderStack.push(builder);
    return this.currentBuilder = builder;
  }
  this.popBuilder = function() {
    this.currentBuilder = this.builderStack.length;
    return this.builderStack.pop();
  }
  this.buildHtml = function(fn) {
    var html, postProcessingSteps, _ref;
    this.pushBuilder();
    fn.call(this);
    return _ref = this.popBuilder().buildHtml(), html = _ref[0], postProcessingSteps = _ref[1], _ref;
  }
  this.render = function(fn) {
    var div, fragment, html, postProcessingSteps, step, _i, _len, _ref;
    _ref = this.buildHtml(fn), html = _ref[0], postProcessingSteps = _ref[1];
    div = document.createElement('div');
    div.innerHTML = html;
    fragment = $(div.childNodes);
    for (_i = 0, _len = postProcessingSteps.length; _i < _len; _i++) {
      step = postProcessingSteps[_i];
      step(fragment);
    }
    return fragment;
  }
  this.element = null;
}).call(View);
(function() {
  this.buildHtml = function(params) {
    this.constructor.builder = new Builder;
    this.constructor.content(params);
    var _ref = this.constructor.builder.buildHtml();
    var html = _ref[0];
    var postProcessingSteps = _ref[1];
    this.constructor.builder = null;
    return postProcessingSteps;
  }
  this.wireOutlets = function(view) {
    var element, outlet, _i, _len, _ref;
    _ref = view[0].querySelectorAll("[outlet]");
    for(_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      outlet = element.getAttribute("outlet");
      view[outlet] = $(element);
      element.removeAttribute("outlet");
    }
    return void 0;
  }
  this.bindEventHandlers = function(view) {
    for(var i = 0, len = Events.length; i < len; i++) {
      var eventName = Events[i];
      var selector = "[" + eventName + "]";
      var _ref = view[0].querySelectorAll(selector);
      var _fn = function(element) {
        var methodName = element.getAttribute();
        element = $(element);
        return element.on(eventName, function(event) {
          return view[methodName](event, element);
        });
      }
      for(var j = 0, jlen = _ref.length; j < jlen; j++) {
        var element = _ref[j];
        _fn(element);
      }
      if(matchesSelector(view, selector)) {
        methodName = view[0].getAttribute(eventName);
        (function(methodName) {
          return view.on(eventName, function(event) {
            return view[methodName](event, view);
          });
        })(methodName);
      }
    }
    return void 0;
  };
  this.pushStack = function(elems) {
    var ret;
    //JQuery
    ret = latte_lib.merger(JQuery(), elems);
    ret.prevObject = this;
    ret.context = this.context;
    return ret;
  }
  this.end = function() {
    var _ref;
  //JQuery
    return (_ref = this.prevObject) != null ? _ref : JQuery(null);
  }
  this.preempt = function(eventName, handler) {
    return JQuery.preempt.call(this, eventName, handler);
  }
}).call(View.prototype);
module.exports = View;
