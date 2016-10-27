'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',

        // Task configuration.
        clean: {
            options: {
                force: true
            },
            files: ['../deploy/css/*','css']
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'sass',
                    cssDir: '../deploy/css',
                    outputStyle: 'compact',
                    noLineComments: true ,
                    bundleExec:true
                }
            },
            localDev: {
                options: {
                    sassDir: 'sass',
                    cssDir: '../deploy/css',
                    outputStyle: 'expanded',
                    noLineComments: false
                }
            }
        },
        concat:{
            siteStatic:{
                src:[
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/chart.js/dist/chart.js',
                    'node_modules/requirejs/require.js'
                    
                   
                    
                ],
                dest:'../deploy/js/vendoMatic.js',
                nonull: true
            },
            testSuite:{
                src:[
                    '../deply/js/vendoMatic.js',
                    'node_modules/mocha/mocha.js',
                    'node_modules/chai/chai.js',
                    "test/vendingMachine.js"
                ],
                dest: "../deploy/test/vendoMaticTestSuite.js",
                nonull:true
            }
            
        },
        cssmin: {
            options: {
                banner: '/* DO NOT COMMIT */',
                report: false /* change to 'gzip' to see gzipped sizes on local */
            },
            minify: {
                expand: true,
                cwd: '../deploy/css',
                src: ['*.css'],
                dest: '../deploy/css',
                ext: '.min.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                report: false /* change to 'gzip' to see gzipped sizes on local */
            },
            minify:{
                expand: true,
                cwd: 'put file path here',
                src: ['**/*.js','!*.min.js'],
                dest: 'put file path here',
                ext: '.min.js'
            }
        },
        watch: {
            sassy: {
                files: ['sass/**/*.scss'],
                tasks: ['compass:localDev'],
                options: {
                    spawn: false
                }
            },
            scripts:{
                files:['js/**/*.js','!js/bundled/*.js'],
                tasks:['concat'],
                options:{
                    spawn:false
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('local', ['compass:localDev','watch']);
    grunt.registerTask('localMavenBuild', ['compass:localDev','concat']);
    grunt.registerTask('localFirstTime', ['compass:localDev','concat']);
    grunt.registerTask('default', ['clean','compass:dist','cssmin','concat','uglify']);
};