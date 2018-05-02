var  _ = require('underscore');

module.exports = {
  Auth: require('./auth/Auth-browser.js'),
  Connection: require('./Connection.js'),
  Event: require('./Event.js'),
  Stream: require('./Stream.js'),
  Filter: require('./Filter.js'),

  eventTypes: require('./eventTypes.js'),
  utility: _.extend(require('./utility/utility-browser.js'), require('./utility/helpers.js')),
  MESSAGES: {
    MONITOR: require('./Monitor.js').Messages
  }
};
