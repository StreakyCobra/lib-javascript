var _ = require('underscore'),
utility = require('./utility/utility.js'),
utilityNode = require('./utility/utility-node.js');

module.exports = {
  // TODO: fix singleton (see with me [sgoumaz] if needed)
  Auth: require('./auth/Auth-node.js'),
  Connection: require('./Connection.js'),
  Event: require('./Event.js'),
  Stream: require('./Stream.js'),
  Filter: require('./Filter.js'),

  eventTypes: require('./eventTypes.js'),
  utility: _.extend(utility, utilityNode),
  MESSAGES: {
    MONITOR: require('./Monitor.js').Messages
  }
};