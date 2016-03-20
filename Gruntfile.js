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
            js: {
                files: [{
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src : ['src/*.js'],
                    dest : 'dist/',
                }]
            },
            css: {
                files: [{
                    expand: true,
                    flatten: true,
                    filter: 'isFile',
                    src : ['src/*.css'],
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
            js: {
                files: [ 'src/*.js' ],
                tasks: [ 'buildJs' ]
            },
            css: {
                files: [ 'src/.*css' ],
                tasks: [ 'buildCss' ]
            }
        }, //end watch

    });

    // load the tasks
    require('load-grunt-tasks')(grunt);

    grunt.registerTask(
        'default', 
        'Watches the project for changes, automatically and exports static files.', 
        [ 'build', 'watch' ]
    );

    grunt.registerTask(
        'buildCss',
        'Exports CSS files.', 
        [ 'replace:css' ]
    );

    grunt.registerTask(
        'buildJs',
        'Exports JS files.', 
        [ 'jshint', 'replace:js', 'uglify' ]
    );

    grunt.registerTask(
        'build',
        'Exports static files.', 
        [ 'buildJs', 'buildCss' ]
    );
};