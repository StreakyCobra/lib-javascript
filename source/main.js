var  _ = require('underscore');

module.exports = {
  // TODO: fix singleton (see with me [sgoumaz] if needed)
  Auth: require('./auth/Auth-node.js'),
  Connection: require('./Connection-node.js'),
  Event: require('./Event.js'),
  Stream: require('./Stream.js'),
  Filter: require('./Filter.js'),

  eventTypes: require('./eventTypes-node.js'),
  utility: require('./utility/utility-node.js'),
  MESSAGES: {
    MONITOR: require('./Monitor.js').Messages
  }
};