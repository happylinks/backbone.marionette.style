# Backbone Marionette Style

React-like inline styles for Marionette Views

[![Travis build status](http://img.shields.io/travis/happylinks/backbone.marionette.style.svg?style=flat)](https://travis-ci.org/happylinks/backbone.marionette.style)
[![Code Climate](https://codeclimate.com/github/happylinks/backbone.marionette.style/badges/gpa.svg)](https://codeclimate.com/github/happylinks/backbone.marionette.style)
[![Test Coverage](https://codeclimate.com/github/happylinks/backbone.marionette.style/badges/coverage.svg)](https://codeclimate.com/github/happylinks/backbone.marionette.style)
[![Dependency Status](https://david-dm.org/happylinks/backbone.marionette.style.svg)](https://david-dm.org/happylinks/backbone.marionette.style)
[![devDependency Status](https://david-dm.org/happylinks/backbone.marionette.style/dev-status.svg)](https://david-dm.org/happylinks/backbone.marionette.style#info=devDependencies)

## Usage

To use this Marionette Behavior, be sure to add it to the behaviorLookup.
```js
import StyleBehavior from 'backbone.marionette.style';

Marionette.Behaviors.behaviorsLookup = function() {
  return {
    Style: StyleBehavior
  };
};
```

After you've done this you can add the Style behavior to one of your views, like so:
```js
var StyleView = Marionette.ItemView.extend({
  template: _.template('<div></div>'),
  behaviors: {
    Style: {}
  },
  style: {
    backgroundColor: '#000',
    color: 'white',
    fontSize: 14,
    position: 'absolute'
  }
});
```

## Licenses

This module uses code from [Facebook React](https://github.com/facebook/react) to generate the css from the style object. Their licenses apply.

Also uses the basic setup for the plugin from [Backbone.Storage](https://github.com/thejameskyle/backbone.storage).
