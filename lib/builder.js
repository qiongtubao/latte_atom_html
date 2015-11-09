var SelfClosingTags = {};

'area base br col command embed hr img input keygen link meta param\
source track wbr'.split(/\s+/).forEach(function(tag) {
  return SelfClosingTags[tag] = true;
});
var registerElement = function(tagName) {
  var customTagName, _base;
  customTagName = "space-pen-" + tagName;
  if ((_base = window.__spacePenCustomElements)[customTagName] == null) {
    _base[customTagName] = typeof document.registerElement === "function" ? document.registerElement(customTagName, {
      prototype: Object.create(CustomElementPrototype),
      "extends": tagName
    }) : void 0;
  }
  return customTagName;
};
function Builder() {
  this.document = [];
  this.postProcessingSteps = [];
}
(function() {
  this.buildHtml = function() {
    return [this.document.join(""), this.postProcessingSteps];
  }
  this.tag = function() {
    var args, name, options;
    var name = arguments[0];
    var args = 2 <= arguments.length ? Array.prototype.slice.call(arguments, 1): [];
    var options = this.extractOptions(args);
    this.openTag(name, options.attributes);
    if(SelfClosingTags.hasOwnProperty(name)) {
      if((options.text != null) || (options.content != null)) {
        throw new Error("Self-closing tag " + name + " cannot have text or content");
      }
    }else{
      if(typeof options.content === "function") {
        options.content();
      }
      if(options.text) {
        this.text(options.text);
      }
      return this.closeTag(name);
    }
  };

  this.openTag = function(name, attributes) {
    var attributeName, attributePairs, attributesString, value;
    if(this.document.length === 0) {
      if(attributes == null) {
        attributes = {};
      }
      if(attributes.is == null) {
        attributes.is = registerElement(name);
      }
    }
    attributePairs = (function() {
      var _results;
      _results = [];
      for(attributeName in attributes) {
        value = attributes[attributeName];
        _results.push("" + attributeName + "=\"" + value + "\"");
      }
      return _results;
    })();
    attributesString = attributePairs.length ? " " + attributePairs.join(" ") : "";
    return this.document.push("<" + name + attributesString + ">");
  }
  this.closeTag = function(name) {
    return this.document.push("</" + name + ">");
  }
  this.text = function(string) {
    var escapedString;
    escapedString = string.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return this.document.push(escapedString);
  }
  this.raw = function(string) {
    return this.document.push(string);
  }
  this.subview = function(outletName, subview) {
    var subviewId;
    subviewId = "subview-" + (++idCounter);
    this.tag("div", {
      id: subviewId
    });
    return this.postProcessingSteps.push(function(){
      view[outletName] = subview;
      subview.parentView = view;
      return view.find("div#" + subviewId).replaceWith(subview);
    });
  }
  this.extractOptions = function(args) {
    var arg, options, _i, _len;
    options = {};
    for(var _i = 0, len = args.length; _i < len; _i++) {
      arg = args[_i];
      switch(typeof arg) {
        case "function":
          options.content = arg;
        break;
        case "string":
        case "number":
          options.text = arg.toString();
        break;
        default:
          options.attributes = arg;
      }
    }
    return options;
  }
}).call(Builder.prototype);
module.exports = Builder;
