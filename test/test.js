var assert = require('assert');

var boardCrawler = require('../crawlers/boardCrawler');

// describe('Array', function() {
//   describe('#indexOf()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert.equal(-1, [1,2,3].indexOf(4));
//     });
//   });
// });

describe('BDD Crawlers', function() {
  before(function() {

  });
  describe('#Board', function() {
    it('boardCrawler getAllBoard()', function() {

    });
  });
});

describe('BDD style', function() {
  before(function() {
    // excuted before test suite
  });

  after(function() {
    // excuted after test suite
  });

  beforeEach(function() {
    // excuted before every test
  });

  afterEach(function() {
    // excuted after every test
  });

  describe('#example', function() {
    it('this is a test.', function() {

    });
  });

  describe('calculation', function() {
    it('1+1 should be 2', function() {
      assert.equal(1+1, 2);
    });
  });
});
