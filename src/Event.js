
var _ = require('underscore');
/**
 *
 * @type {Function}
 * @constructor
 */
var Event = module.exports = function (connection, data) {
  this.connection = connection;
  _.extend(this, data);
};


Object.defineProperty(Event.prototype, 'stream', {
  get: function () {
    return this.connection.datastore.getStreamById(this.streamId);
  },
  set: function () { throw new Error('Event.stream property is read only'); }
});
