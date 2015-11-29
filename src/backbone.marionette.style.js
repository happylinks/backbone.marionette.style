import Marionette from 'backbone.marionette';


/**
* Copyright 2013-2015, Facebook, Inc.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree. An additional grant
* of patent rights can be found in the PATENTS file in the same directory.
*
*/

/**
* CSS properties which accept numbers but are not in units of "px".
*/
const isUnitlessNumber = {
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
  strokeWidth: true,
};

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
const prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(isUnitlessNumber).forEach((prop) => {
  prefixes.forEach((prefix) => {
    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});

const msPattern = /^-ms-/;

function dangerousStyleValue(name, value) {
  let styleValue = value;
  const isEmpty = styleValue === null || typeof styleValue === 'boolean' || styleValue === '';
  if (isEmpty) {
    return '';
  }

  const isNonNumeric = isNaN(styleValue);
  if (isNonNumeric || styleValue === 0 ||
      isUnitlessNumber.hasOwnProperty(name) &&
      isUnitlessNumber[name]) {
    return '' + styleValue;
  }

  if (typeof styleValue === 'string') {
    styleValue = styleValue.trim();
  }

  return value + 'px';
}

const _uppercasePattern = /([A-Z])/g;

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
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}

function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, '-ms-');
}

/**
* Memoizes the return value of a function that accepts one string argument.
*
* @param {function} callback
* @return {function}
*/
function memoizeStringOnly(callback) {
  const cache = {};
  return (string) => {
    if (!cache.hasOwnProperty(string)) {
      cache[string] = callback.call(this, string);
    }

    return cache[string];
  };
}

const processStyleName = memoizeStringOnly((styleName) => {
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
const createMarkupForStyles = (styles, component) => {
  let serialized = '';
  for (let styleName in styles) {
    if (styles.hasOwnProperty(styleName)) {
      const styleValue = styles[styleName];
      if (styleValue !== null) {
        serialized += processStyleName(styleName) + ':';
        serialized += dangerousStyleValue(styleName, styleValue, component) + ';';
      }
    }
  }

  return serialized || null;
};

var StyleBehavior = Marionette.StyleBehavior = Marionette.Behavior.extend({
  initialize() {
    if (typeof this.view.style === 'function') {
      this.view.style = this.view.style.call(this.view);
    }

    const css = createMarkupForStyles(this.view.style);
    this.view.attributes = {
      'style': css,
    };
  },
});

export default StyleBehavior;
