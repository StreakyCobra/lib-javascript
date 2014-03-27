/* global describe, it */
var pryv = require('../../source/main'),
  should = require('should'),
  nock = require('nock'),
  responses = require('../data/responses.js'),
  _ = require('underscore');



describe('Connection', function () {

  var username = 'test-user',
    auth = 'test-token';
  var settings = {
    port: 443,
    ssl: true,
    domain: 'test.io'
  };
  var generatedConnectionId = 'https://test-user.test.io:443/?auth=test-token';


  var generatedShortId = 'test-user:pryv-explorer';

  var connection = new pryv.Connection(username, auth, settings);
  var serialId = 'C' +  (pryv.Connection._serialCounter - 1);


  describe('connection id generation', function () {


    it('should return correct url', function (done) {
      connection.id.should.equal(generatedConnectionId);
      done();
    });

  });

  describe('serialId', function () {

    it('should exists', function (done) {
      connection.serialId.should.equal(serialId);
      done();
    });

  });

  describe('displayId with connection not initialized', function () {

    it('should throw error', function (done) {
      var displayId = null;
      var catchedError = null;
      try {
        displayId = connection.displayId;
      } catch (error) {
        catchedError = error;
      }
      should.exist(catchedError);
      should.not.exist(displayId);
      done();
    });

  });

  describe('reachability test on api-headers', function () {
    this.timeout(15000);

    it('should return API_UNREACHABLE Error', function (done) {
      var endPoint = 'https://' + username + '.' + settings.domain;
      nock(endPoint)
        .get('/whatever')
        .reply(200, responses.accessInfo, ['invalid headers']);

      connection.request('GET', '/whatever', function (error, result) {
        should.exist(error);
        error.id.should.eql('API_UNREACHEABLE');
        should.exist(result);
        done();
      });
    });
  });


  describe('connection.request responseInfo', function () {
    this.timeout(15000);

    var headers = {toto : 'titi'};
    _.extend(headers.toto,  responses.headersAccessInfo.copy);

    it('responseInfo contains headers and code', function (done) {
      var endPoint = 'https://' + username + '.' + settings.domain;
      nock(endPoint)
        .get('/whatever')
        .reply(200, responses.accessInfo, headers);

      connection.request('GET', '/whatever', function (error, result, resultInfo) {
        should.exists(resultInfo.code);
        resultInfo.code.should.equal(200);
        should.exists(resultInfo.headers);
        should.exists(resultInfo.headers.toto);
        resultInfo.headers.toto.should.equal('titi');
        done();
      });
    });

  });


  describe('accessInfo()', function () {
    this.timeout(15000);

    it('should call the proper API method', function (done) {
      nock('https://' + username + '.' + settings.domain)
        .get('/access-info')
        .reply(200, responses.accessInfo, responses.headersAccessInfo);
      var requestTime = (new Date()).getTime();
      connection.accessInfo(function (err, result) {
        var responseTime =  (new Date()).getTime();

        should.not.exist(err);
        should.exist(result);
        result.should.eql(responses.accessInfo);

        connection.serverInfos.deltaTime.should.be.within(1, 15);
        connection.serverInfos.apiVersion.should.equal('nock nock');
        connection.serverInfos.lastSeenLT.should.be.within(requestTime, responseTime);
        done();
      });
    });
  });

  describe('displayId with connection initialized', function () {

    it('should not throw error', function (done) {
      var displayId = null;
      var catchedError = null;
      try {
        displayId = connection.displayId;
      } catch (error) {
        catchedError = error;
      }
      should.not.exist(catchedError);
      displayId.should.equal(generatedShortId);
      done();
    });

  });

  describe('time management', function () {
    it('should retrieve server time from server response');
    it('getLocalTime getServerTime', function (done) {

      var serverTime = 0;
      var localTime = connection.getLocalTime(serverTime);
      connection.getServerTime(localTime).should.equal(serverTime);


      connection.getServerTime().should.be.approximately(
        connection.getServerTime((new Date()).getTime()), 0.001
      );

      done();
    });


  });

});
