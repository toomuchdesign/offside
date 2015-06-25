module.exports = function(grunt) {

    'use strict';

    // configure the tasks
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
            },
            all: [
                'Gruntfile.js',
                'src/*.js',
            ]
        }, //end jshint

        replace: {
            options: {
                patterns: [{
                    json: {
                        'version' : '<%= pkg.version %>',
                        'name' : '<%= pkg.name %>',
                        'description' : '<%= pkg.description %>',
                        'date' : '<%= grunt.template.today("dd-mm-yyyy") %>',
                        'repository' : '<%= pkg.repository %>',
                    }
                }],
            },
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src : ['src/**'],
                    dest : 'dist/',
                }]
            }
        }, //end replace

        uglify: {
            dist: {
                files: {
                    'dist/offside.min.js': 'dist/offside.js',
                }
            }
        }, //end uglify

        watch: {
            files: [ 'src/**' ],
            tasks: [ 'build' ]
        }, //end watch

    });

    // load the tasks
    require('load-grunt-tasks')(grunt);

    grunt.registerTask(
        'default', 
        'Watches the project for changes, automatically and exports static files.', 
        [ 'watch' ]
    );

    grunt.registerTask(
        'build',
        'Exports static files.', 
        [ 'jshint', 'newer:replace', 'uglify' ]
    );
};