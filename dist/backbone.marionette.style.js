(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("backbone.marionette")) : typeof define === "function" && define.amd ? define(["backbone.marionette"], factory) : global.Backbone.Marionette.StyleBehavior = factory(global.Marionette);
})(this, function (Marionette) {
  "use strict";

  var isUnitlessNumber = {
    animationIterationCount: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridRow: true,
    gridColumn: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,

    // SVG-related properties
    fillOpacity: true,
    stopOpacity: true,
    strokeDashoffset: true,
    strokeOpacity: true,
    strokeWidth: true };

  /**
  * @param {string} prefix vendor-specific prefix, eg: Webkit
  * @param {string} key style name, eg: transitionDuration
  * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
  * WebkitTransitionDuration
  */
  function prefixKey(prefix, key) {
    return prefix + key.charAt(0).toUpperCase() + key.substring(1);
  }

  /**
  * Support style names that may come passed in prefixed by adding permutations
  * of vendor prefixes.
  */
  var prefixes = ["Webkit", "ms", "Moz", "O"];

  // Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
  // infinite loop, because it iterates over the newly added props too.
  Object.keys(isUnitlessNumber).forEach(function (prop) {
    prefixes.forEach(function (prefix) {
      isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
    });
  });

  var msPattern = /^-ms-/;

  function dangerousStyleValue(name, value) {
    var styleValue = value;
    var isEmpty = styleValue === null || typeof styleValue === "boolean" || styleValue === "";
    if (isEmpty) {
      return "";
    }

    var isNonNumeric = isNaN(styleValue);
    if (isNonNumeric || styleValue === 0 || isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]) {
      return "" + styleValue;
    }

    if (typeof styleValue === "string") {
      styleValue = styleValue.trim();
    }

    return value + "px";
  }

  var _uppercasePattern = /([A-Z])/g;

  /**
  * Hyphenates a camelcased string, for example:
  *
  *   > hyphenate('backgroundColor')
  *   < "background-color"
  *
  * For CSS style names, use `hyphenateStyleName` instead which works properly
  * with all vendor prefixes, including `ms`.
  *
  * @param {string} string
  * @return {string}
  */
  function hyphenate(string) {
    return string.replace(_uppercasePattern, "-$1").toLowerCase();
  }

  function hyphenateStyleName(string) {
    return hyphenate(string).replace(msPattern, "-ms-");
  }

  /**
  * Memoizes the return value of a function that accepts one string argument.
  *
  * @param {function} callback
  * @return {function}
  */
  function memoizeStringOnly(callback) {
    var _this = this;
    var cache = {};
    return function (string) {
      if (!cache.hasOwnProperty(string)) {
        cache[string] = callback.call(_this, string);
      }

      return cache[string];
    };
  }

  var processStyleName = memoizeStringOnly(function (styleName) {
    return hyphenateStyleName(styleName);
  });

  /**
  * Serializes a mapping of style properties for use as inline styles:
  *
  *   > createMarkupForStyles({width: '200px', height: 0})
  *   "width:200px;height:0;"
  *
  * Undefined values are ignored so that declarative programming is easier.
  * The result should be HTML-escaped before insertion into the DOM.
  *
  * @param {object} styles
  * @param {ReactDOMComponent} component
  * @return {?string}
  */
  var createMarkupForStyles = function (styles, component) {
    var serialized = "";
    for (var styleName in styles) {
      if (styles.hasOwnProperty(styleName)) {
        var styleValue = styles[styleName];
        if (styleValue !== null) {
          serialized += processStyleName(styleName) + ":";
          serialized += dangerousStyleValue(styleName, styleValue, component) + ";";
        }
      }
    }

    return serialized || null;
  };

  var StyleBehavior = Marionette.StyleBehavior = Marionette.Behavior.extend({
    initialize: function initialize() {
      if (typeof this.view.style === "function") {
        this.view.style = this.view.style.call(this.view);
      }

      var css = createMarkupForStyles(this.view.style);
      this.view.attributes = {
        style: css };
    } });

  var backbone_marionette_style = StyleBehavior;

  return backbone_marionette_style;
});
//# sourceMappingURL=./backbone.marionette.style.js.map