module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appName: 'SampleApp',
        appDir: 'app',
        cssDir: '<%= appDir %>/css',
        sassDir: '<%= appDir %>/scss',
        appScss: '<%= sassDir %>/styles.scss',
        appCss: '<%= cssDir %>/styles.css',

        sass: {
            dev: {
                options: {
                    sourcemap: true
                },
                files: {
                    '<%= appCss %>': '<%= appScss %>'
                }
            },
            dist: {
                files: {
                    '<%= appCss %>': '<%= appScss %>'
                }
            }
        },

        jshint: {
            files: [
                '<%= appDir %>/**/*.js',
                '!<%= appDir %>/bower_components/**',
                'specs/**/*.js',
                'tests/**/*.js',
                'e2e-tests/**/*.js',
                '!.*/**'
            ],
            options: {
                reporter: require('jshint-stylish'),
                laxbreak: true,
                strict: true,
                globals: {
                    jQuery: true
                }
            }
        },

        watch: {
            sass: {
                files: ['<%= appDir %>/**/*.scss', '!<%= appDir %>/bower_components/**'],
                tasks: ['sass:dev'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            jshint: {
                files: ['<%= appDir %>/**/*.js', '!<%= appDir %>/bower_components/**'],
                tasks: ['jshint']
            },
            other: {
                files: ['<%= appDir %>/**/*.html', '<%= appDir %>/**/*.js'],
                options: {
                    livereload: true
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['jshint', 'sass:dist']);
};