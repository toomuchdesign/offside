module.exports = function(grunt) {

  // configure the tasks
  grunt.initConfig({

    pkg : grunt.file.readJSON('package.json'),
    meta : {
      banner : "/*<%= pkg.name %>*/",
      output : "client/dist/responsive-nav.js",
      outputMin : "client/dist/responsive-nav.min.js"
    },

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
          'dist/offside.min.js': ['dist/offside.js'],
        }
      }
    }, //end Uglify

    watch: {
      files: [ 'src/**' ],
      tasks: [ 'build' ]
    }, //end Watch

  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask(
    'default', 
    'Watches the project for changes, automatically and exports static files.', 
    [ 'watch' ]
  );

  grunt.registerTask(
    'build', 
    'Exports static files.', 
    [ 'replace', 'uglify' ]
  );
};