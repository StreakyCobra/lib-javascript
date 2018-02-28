var _ = require('underscore'),
utility = require('./utility/utility.js'),
utilityBrowser = require('./utility/utility-browser.js');

module.exports = {
  Auth: require('./auth/Auth-browser.js'),
  Connection: require('./Connection.js'),
  Event: require('./Event.js'),
  Stream: require('./Stream.js'),
  Filter: require('./Filter.js'),

  eventTypes: require('./eventTypes.js'),
  utility: _.extend(utility, utilityBrowser),
  MESSAGES: {
    MONITOR: require('./Monitor.js').Messages
  }
};
