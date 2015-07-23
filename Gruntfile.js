'use strict';

module.exports = function (grunt) {

  // Load all Grunt tasks
  require('load-grunt-tasks')(grunt);

  var opts = {

    pkg: grunt.file.readJSON('package.json'),

    jsMinExt: '.min',

    clean: {
      dist: 'dist',
      trimHtml: ['dist/**/*.html', '!dist/**/index.html', '!dist/google*.html'],
      temp: [ '.tmp' ]
    },

    jekyll: {
      options: {
        config: 'src/_config.yml,src/_config.build.yml',
        src: 'src/jekyll'
      },
      dist: {
        options: {
          dest: '.tmp/jekyll',
        }
      }
    },

    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        keepalive: true
      },
      main: {
        options: {
          open: true,
          // Return HTML content type for extensionless files from local test server
          middleware: function(connect, options, middlwares) {
            return [
              function(req, res, next) {
                req.url.match(/\.(\w+)$/) || res.setHeader( 'Content-Type', 'text/html' );
                next();
              },
              connect.static(options.base)
            ];
          },

          base: 'dist',
        }
      }
    },

    sass: {
      options: {
        bundleExec: true,
        debugInfo: false,
        lineNumbers: false,
        loadPath: 'app/_bower_components'
      },
      // Compile and copy SCSS files
      dist: {
        files: [{
          expand: true,
          cwd: 'src/jekyll/_sass',
          src: '**/*.{scss,sass}',
          dest: 'dist/css',
          ext: '.css'
        }]
      },
      server: {
        options: {
          debugInfo: true,
          lineNumbers: true
        },
        files: [{
          expand: true,
          cwd: 'src/jekyll/_sass',
          src: '**/*.{scss,sass}',
          dest: '.tmp/css',
          ext: '.css'
        }]
      }
    },

    // Uglify our site-specific JS (release only)
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      release: {
        files: {
          'dist/js/eatenbygrues.min.js': ['src/jekyll/_js/eatenbygrues.js']
        }
      }
    },

    prettify: {
      options: {
        config: '.prettifyrc'
      },
      // Prettify a directory of files
      all: {
        expand: true,
        cwd: 'dist/',
        ext: '.html',
        src: ['**/*.html'],
        dest: 'dist/'
      }
    },

    copy: {
      // Copy Jekyll files from /.tmp to /dist
      jekyll: {
        files: [{
          expand: true,
          cwd: '.tmp/jekyll',
          src: '**/*',
          dest: 'dist'
        }]
      },
      // Copy favicons
      favicons: {
        files: [{
          expand: true,
          flatten: true,
          src: [ 'assets/favicon/generated/**' ],
          dest: 'dist'
        }]
      },
      js: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'bower_components/packery/dist/packery.pkgd.min.js',
              'bower_components/bootstrap/dist/js/bootstrap.min.js'
            ],
            dest: 'dist/js'
          },
          {
            expand: true, flatten: true,
            src: [
              'bower_components/bootstrap/dist/css/bootstrap.min.css'
            ],
            dest: 'dist/css'
          },
          {
            expand: true, flatten: true,
            src: [
              'bower_components/bootstrap/dist/fonts/**/*'
            ],
            dest: 'dist/fonts'
          }
        ]
      },
      indjs: {
        files: [{ expand: true, flatten: true,
          src: [ 'src/jekyll/_js/eatenbygrues.js' ],
          dest: 'dist/js'
        }]
      },
      // Strip .html extensions
      trimHtml: {
        files: [{
            expand: true,
            cwd: 'dist',
            src: ['**/*.html', '!**/index.html', '!google*.html'],
            dest: 'dist',
            rename: function(dest, src) {
                return dest + '/' + src.replace(/\.html$/, "");
            }
        }]
      }
    },

    // Replace JavaScript references in HTML files with minified or non- version.
    includereplace: {
      main: {
        options: {
          globals: {
            fileExt: '<%= jsMinExt %>'
          }
        },
        expand: true, cwd: '.tmp/jekyll',
        src: '**/*.html',
        dest: '.tmp/jekyll'
      }
    }


  };

  grunt.initConfig( opts );

  grunt.registerTask('build', 'Build the EatenByGrues.com website.', function( config ) {

    config = config || 'release';
    config === 'debug' && (opts.jsMinExt = '');

    grunt.task.run( grunt.option('simple') ? 'clean:temp' : 'clean' );
    grunt.task.run( ['jekyll','includereplace', 'copy:jekyll', 'prettify'] );
    grunt.task.run( grunt.option('simple') ?
      ['copy:trimHtml'] :
      ['copy:favicons', 'copy:js', 'copy:trimHtml' ] );
    grunt.task.run( ['clean:trimHtml'/*, 'clean:temp'*/ ] );
    grunt.task.run( config === 'release' ? 'uglify' : 'copy:indjs' );


  });

  grunt.registerTask('serve', 'Build and serve the EatenByGrues.com website.', function( config ) {
    config = config || 'release';
    grunt.task.run( ['build:' + config, 'connect:main'] );
  });

  grunt.registerTask('default', [ 'serve:release' ]);

};
