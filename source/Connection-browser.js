var utility = require('./utility/utility-browser');

var Connection = module.exports = require('./Connection.js');

Connection.prototype._request = utility.request;