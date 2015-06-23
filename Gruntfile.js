module.exports = function(grunt) {

  // configure the tasks
  grunt.initConfig({

    pkg : grunt.file.readJSON('package.json'),

    replace : {
      options : {
        patterns: [
          {
            json: {
              'version' : '<%= pkg.version %>',
              'name' : '<%= pkg.name %>',
              'description' : '<%= pkg.description %>',
              'date' : '<%= grunt.template.today("dd-mm-yyyy") %>',
              'repository' : '<%= pkg.repository %>',
            }
          }
        ],
      },
      dist :{
        files : [
          { 
            expand: true,
            flatten: true,
            filter: 'isFile',
            src : ['src/**'],
            dest : 'dist/'
          },
        ]
      }
    }, //end Replace

    uglify: {
      javascript: {
        files: {
          'dist/jquery.offside.min.js': ['dist/jquery.offside.js'],
        }
      }
    }, //end Uglify

    watch: {
      files: [ 'src/**' ],
      tasks: [ 'build' ]
    }, //end Watch

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
    [ 'newer:replace', 'uglify' ]
  );
};