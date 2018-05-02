var  _ = require('underscore');

module.exports = {
  // TODO: fix singleton (see with me [sgoumaz] if needed)
  Auth: require('./auth/Auth-node.js'),
  Connection: require('./Connection.js'),
  Event: require('./Event.js'),
  Stream: require('./Stream.js'),
  Filter: require('./Filter.js'),

  eventTypes: require('./eventTypes.js'),
  utility: _.extend(require('./utility/utility-node.js'), require('./utility/helpers.js')),
  MESSAGES: {
    MONITOR: require('./Monitor.js').Messages
  }
};