var utility = require('./utility/utility-node');

var Connection = module.exports = require('./Connection.js');

Connection.prototype._request = utility.request;