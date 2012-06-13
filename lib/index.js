/**
 * Cantina Session
 * ---------------
 *
 * Adds connect-based session support to cantina applications.
 *
 * @module cantina
 * @submodule session
 * @main session
 */

// Modules dependencies.
var utils = require('cantina-utils');

// Export sub-modules.
utils.lazy(exports, __dirname, {
  plugin: './plugin'
});
