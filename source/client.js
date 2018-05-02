module.exports = {
  Auth: require('./auth/Auth-browser.js'),
  Connection: require('./Connection-browser.js'),
  Event: require('./Event.js'),
  Stream: require('./Stream.js'),
  Filter: require('./Filter.js'),

  eventTypes: require('./eventTypes-browser.js'),
  utility: require('./utility/utility-browser.js'),
  MESSAGES: {
    MONITOR: require('./Monitor.js').Messages
  }
};
