/*
 * grunt-parallel
 * https://github.com/iammerrick/grunt-parallel
 *
 * Copyright (c) 2013 Merrick Christensen
 * Licensed under the MIT license.
 */
/*jshint es5:true*/
module.exports = function(grunt) {
  var Q = require('q');

  function spawn(task) {
    var deferred = Q.defer();

    var child = grunt.util.spawn(task, function(error, result, code) {
      if (code !== 0) {
        !child && grunt.log.error(error);
        deferred.reject();
      }

      else {
        deferred.resolve();
      }
    });

    if (child) {
      child.stdout.on('data', function(d) { grunt.log.write(String(d)); });
      child.stderr.on('data', function(d) { grunt.log.error(String(d)); });
    }

    return deferred.promise;
  }

  grunt.registerMultiTask('parallel', 'Run sub-tasks in parallel.', function() {
    Q.all(this.data.map(spawn)).then(this.async());
  });
};
