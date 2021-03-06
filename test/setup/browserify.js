var setup = require('./setup');
var config = require('../../package.json').to5BoilerplateOptions;

global.Promise = require('es6-promise').Promise;

global[config.exportVarName] = require('../../tmp/__entry');
global.mocha.setup('bdd');
global.onload = function() {
  global.mocha.checkLeaks();
  global.mocha.globals(config.mochaGlobals);
  global.mocha.run();
  setup();
};
