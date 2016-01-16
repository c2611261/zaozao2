/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    meta: {
      version: '0.1.0'
    },
    banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* http://PROJECT_WEBSITE/\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
      'YOUR_NAME; Licensed MIT */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      modules:{
        files: [
          {
            expand: true,
            cwd: 'public/views',
            src: '**/*',
            dest: 'dist/public/views'
          }
        ]
      }
      // dist: {
      //   src: ['public/js/*'],
      //   dest: 'dist/'
      // }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      all:{
        files: [
          {
            expand: true,
            cwd: 'public/js',
            src: '*.js',
            dest: 'dist/public/js',
            ext: '.min.js'
          }
        ]
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
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    bower: {
    install: {
      options: {
        targetDir: './dist/bower_components',
        layout: 'byComponent',
        install: true,
        verbose: false,
        cleanTargetDir: false,
        cleanBowerDir: false,
        bowerOptions: {}
        }
      }
    },
    //qunit: {
    //  files: ['test/**/*.html']
    //},
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      }
    }
    //  lib_test: {
    //    files: '<%= jshint.lib_test.src %>',
    //    tasks: ['jshint:lib_test', 'qunit']
    //  }
    //}

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-environment');


  // Default task.
  grunt.registerTask('default', ['jshint', 'bower', 'concat', 'uglify']);

};
