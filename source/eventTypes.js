var utility = require('./utility/utility'),
    _ = require('lodash'),
    CC = require('./connection/ConnectionConstants.js');

/**
 * Event types directory data.
 * @link http://api.pryv.com/event-types/
 */
var eventTypes = module.exports = {};

// staging cloudfront: https://d1kp76srklnnah.cloudfront.net/dist/data-types/event-extras.json
// staging direct: https://sw.pryv.li/dist/data-types/event-extras.json
var HOSTNAME = 'd1kp76srklnnah.cloudfront.net',
    PATH = '/dist/data-types/',
    FLATFILE = 'flat.json',
    EXTRASFILE = 'extras.json',
    // TODO: discuss if hierarchical data is really needed (apparently not); remove all that if not
    HIERARCHICALFILE = 'hierarchical.json';

// load default data (fallback)
var types = require('./event-types.default.json'),
    extras = require('./event-extras.default.json'),
    hierarchical = null;
types.isDefault = true;
extras.isDefault = true;

/**
 * @link http://api.pryv.com/event-types/#json-file
 * @param {Function} callback
 */
eventTypes.loadFlat = function (callback) {
  if (typeof(callback) !== 'function') {
    throw new Error(CC.Errors.CALLBACK_IS_NOT_A_FUNCTION);
  }
  _requestFile(FLATFILE, function (err, result) {
    if (err) { return callback(err); }
    if (! isValidTypesFile(result)) {
      return callback(new Error('Missing or corrupt types file: "' +
                                HOSTNAME + PATH + FLATFILE + '"'));
    }
    _.extend(types, result);
    types.isDefault = false;
    callback(null, types);
  });
};

/**
 * Performs a basic check to avoid corrupt data (more smoke test than actual validation).
 * @param {Object} data
 */
function isValidTypesFile(data) {
  return data && data.version && data.types && data.types['activity/plain'];
}

eventTypes.flat = function (eventType) {
  return types.types[eventType];
};

/**
 * @link http://api.pryv.com/event-types/#json-file
 * @param {Function} callback
 */
eventTypes.loadExtras = function (callback) {
  if (typeof(callback) !== 'function') {
    throw new Error(CC.Errors.CALLBACK_IS_NOT_A_FUNCTION);
  }
  _requestFile(EXTRASFILE, function (err, result) {
    if (err) { return callback(err); }
    if (! isValidExtrasFile(result)) {
      return callback(new Error('Missing or corrupt extras file: "' +
                                HOSTNAME + PATH + EXTRASFILE + '"'));
    }
    _.extend(extras, result);
    extras.isDefault = false;
    callback(null, extras);
  });
};

/**
 * Performs a basic check to avoid corrupt data (more smoke test than actual validation).
 * @param {Object} data
 */
function isValidExtrasFile(data) {
  return data && data.version && data.extras && data.extras.count && data.extras.count.formats;
}

eventTypes.extras = function (eventType) {
  var parts = eventType.split('/');
  return extras.extras[parts[0]] && extras.extras[parts[0]].formats[parts[1]] ?
      extras.extras[parts[0]].formats[parts[1]] : null;
};

eventTypes.isNumerical = function (eventOrEventType) {
  if (! eventOrEventType) { return false; }
  var type;
  if (eventOrEventType.type) {
    type = eventOrEventType.type;
  } else {
    type = eventOrEventType;
  }
  var def = eventTypes.flat(type);
  return def ? def.type === 'number' : false;
};

/**
 * @link http://api.pryv.com/event-types/#json-file
 * @param {Function} callback
 */
eventTypes.loadHierarchical = function (callback) {
  if (typeof(callback) !== 'function') {
    throw new Error(CC.Errors.CALLBACK_IS_NOT_A_FUNCTION);
  }
  _requestFile(HIERARCHICALFILE, function (err, result) {
    if (err) { return callback(err); }
    hierarchical = result;
    hierarchical.isDefault = false;
    callback(null, hierarchical);
  });
};

eventTypes.hierarchical = function () {
  if (! hierarchical) {
    throw new Error('Load data via loadHierarchical() first');
  }
  return hierarchical;
};

/**
 * @private
 * @param fileName
 * @param callback
 */
function _requestFile(fileName, callback) {
  if (!_.isFunction(callback)) {
    throw new Error(CC.Errors.CALLBACK_IS_NOT_A_FUNCTION);
  }
  utility.request({
    method : 'GET',
    host : HOSTNAME,
    path : PATH + fileName,
    port : 443,
    ssl : true,
    withoutCredentials: true,
    success : function (result) { callback(null, result); },
    error : function (error) { callback(error, null); }
  });
}
