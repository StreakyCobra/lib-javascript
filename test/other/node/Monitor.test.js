/* global before, describe, it */

var pryv = require('../../../source/main'),
  should = require('should'),
  nock = require('nock'),
  _ = require('underscore'),
  responses = require('../test-support/responses.js');

// !! Monitor tests are made online

var testMonitor = function (preFetchStructure) {

  var localEnabledStr = preFetchStructure ? ' + LocalStorage' : '';

  describe('Monitor' + localEnabledStr, function () {
    var username = 'hello',
      auth = 'auth-token',
      connection = new pryv.Connection(username, auth, {staging: true});


    if (preFetchStructure) {
      before(function (done) {
        nock('https://' + username + '.pryv.in')
          .get('/access-info')
          .reply(200, responses.accessInfo, responses.headersStandard);


        nock('https://' + username + '.pryv.in')
          .get('/streams?state=all')
          .reply(200, responses.streams, responses.headersStandard);

        connection.fetchStructure(function (error) {
          should.not.exist(error);
          done();
        });
      });
    }

    var filter = new pryv.Filter({limit : 20 });
    var monitor = connection.monitor(filter);



    describe('_onIoStreamsChanged', function () {
      before(function (done) {
        nock('https://' + username + '.pryv.in')
          .get('/access-info')
          .reply(200, responses.accessInfo, responses.headersStandard);


        nock('https://' + username + '.pryv.in')
          .get('/streams?state=all')
          .reply(200, responses.streams, responses.headersStandard);

        connection.fetchStructure(function (error) {
          should.not.exist(error);
          done();
        });
      });
      it('should return new stream structure', function (done) {
        var newStructure = _.clone(responses.streams);
        newStructure.streams[0].children[0].clientData = {'new-value': 'hello'};
        var modifiedStream = newStructure.streams[0].children[0];
        newStructure.streams[1].trashed = true;
        var trashedStream = newStructure.streams[1];
        var newStream = JSON.parse(
          '{"name":"Victoria","parentId":"PVxE_JMMzM","id":"victoria","children":[]}');
        newStructure.streams[0].children.push(newStream);

        nock('https://' + username + '.pryv.in')
          .get('/streams?state=all')
          .reply(200, newStructure, responses.headersStandard);
        console.log('MONITOR', connection.datastore.getStreams()[0].children[0].clientData);
        responses.streams.streams.length.should.equal(connection.datastore.getStreams().length);
        monitor.addEventListener('streamsChanged', function (result) {
          console.log('MONITOR', connection.datastore.getStreams()[0].children[0].clientData);
          newStructure.streams.length.should.equal(connection.datastore.getStreams().length);
          should.exist(result);
          should.exist(result.modified);
          should.exist(result.trashed);
          should.exist(result.created);
          result.modified.length.should.equal(1);
          result.trashed.length.should.equal(1);
          result.created.length.should.equal(1);
          result.modified[0].id.should.equal(modifiedStream.id);
          result.trashed[0].id.should.equal(trashedStream.id);
          result.created[0].id.should.equal(newStream.id);
          done();
        });

        monitor._onIoStreamsChanged();
      });
    });


  });

};

testMonitor(false);

//testMonitor(true);
