var _ = require('underscore');

var Filter = module.exports = function (settings) {
  // protect against calls without `new`
  if (! (this instanceof Filter)) {
    return new Filter(settings);
  }

  this.settings = _.extend({
    //TODO: set default values
    streams: null,
    tags: null,
    from: null,
    to: null,
    limit: null,
    skip: null,
    modifiedSince: null,
    state: null
  }, settings);
};

//TODO: remove or rewrite (name & functionality unclear)
Filter.prototype.focusedOnSingleStream = function () {
  if (_.isArray(this.settings.streams) && this.settings.streams.length === 1) {
    return this.settings.streams[0];
  }
  return null;
};