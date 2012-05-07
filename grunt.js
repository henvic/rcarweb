"use strict";

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'app/**/*.js', 'config/**/*.js', 'db/**/*.js', 'public/javascripts/**/*.js', 'routes/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: ['<config:lint.files>', 'public/stylesheets/*.less'],
      tasks: 'default'
    },
    recess: {
      dist: {
        src: ['public/stylesheets/*.less']
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        globalstrict: true,
        es5: true
      },
      globals: {
        exports: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint test recess');

  grunt.loadNpmTasks('grunt-recess');

};