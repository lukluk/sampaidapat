module.exports = function (grunt) {
    grunt.initConfig({

        notify_hooks: {
            options: {
                enabled: true,
                max_jshint_notifications: 5, // maximum number of notifications from jshint output
                title: "kopi.js", // defaults to the name in package.json, or will use project directory's name
                success: false, // whether successful grunt executions should be notified automatically
                duration: 3 // the duration of notification in seconds, for `notify-send only
            }
        },
        includeSource: {            
            files: {
                // Target-specific file lists and/or options go here.         
                files: {
                    'index.html': 'index.dev.html'
                }

            }
        },
        notify: {
            app: {
                options: {
                    message: 'Controller Updated'
                }
            },
            assets: {
                options: {
                    message: 'Assets Updated!'
                }
            },
            bower: {
                options: {
                    message: 'Bower updated'
                }
            },
            server: {
                options: {
                    message: 'Server is ready!'
                }
            }
        },
        injector: {
            options: {

            },
            bower_dependencies: {
                files: {
                    'index.html': ['bower.json'],
                }
            }
        },
        // define source files and their destinations
        uglify: {
            app: {
                src: 'controller/*.js', // source files mask
                dest: 'deploy/', // destination folder
                expand: true, // allow dynamic building
                flatten: true, // remove all unnecessary nesting
                ext: '.control' // replace .js to .min.js
            },
            kopi: {
                src: 'kopi/*.js', // source files mask
                dest: 'deploy/', // destination folder
                expand: true, // allow dynamic building
                flatten: true, // remove all unnecessary nesting
                ext: '.kopi' // replace .js to .min.js
            },
            lang: {
                src: 'lang/*.js', // source files mask
                dest: 'deploy/', // destination folder
                expand: true, // allow dynamic building
                flatten: true, // remove all unnecessary nesting
                ext: '.preload' // replace .js to .min.js
            },
            preload: {
                src: 'config/*.js', // source files mask
                dest: 'deploy/', // destination folder
                expand: true, // allow dynamic building
                flatten: true, // remove all unnecessary nesting
                ext: '.preload' // replace .js to .min.js
            },
            assets: {
                src: 'assets/js/*.js', // source files mask
                dest: 'deploy/', // destination folder
                expand: true, // allow dynamic building
                flatten: true, // remove all unnecessary nesting
                ext: '.assets' // replace .js to .min.js
            },
            options: {
                mangle: false,
                compress: false,
                beautify: true
            }
        },
        watch: {
            all:{
                files: ['kopi/*.js','kopi_addon/*.js','assets/js/*.js','assets/css/*.css','bower.json','package.json','controller/*.js'],
                tasks:['includeSource','injector','notify:app']
            },
            kopi: {
                files: ['kopi/*.js'],
                tasks: ['uglify:kopi', 'concat:kopi', 'clean:temp', 'notify:server']
            },
            preload: {
                files: ['lang/*.js', 'config/*.js'],
                tasks: ['uglify:lang', 'uglify:preload', 'concat:preload', 'clean:temp', 'notify:assets']
            },
            bower: {
                files: ['bower_components/*'],
                tasks: ['injector', 'copy:bower', 'notify:bower']
            },
            js: {
                files: ['assets/css/*.css', 'assets/js/*.js'],
                tasks: ['copy:main', 'uglify:assets', 'concat:assetsjs', 'concat:assetscss', 'clean:temp', 'notify:assets']
            },
            controler: {
                files: ['controller/*.js'],
                tasks: ['uglify:app', 'concat:app', 'clean:temp', 'notify:app']
            },
            views: {
                files: [
                    'view/*.html'
                ],
                tasks: ['copy:views', 'notify:assets']
            }
        },
        copy: {
            views: {
                files: [{
                    expand: true,
                    src: ['view/*'],
                    dest: 'deploy'
                    }]
            },
            bower: {
                files: [{
                    expand: true,
                    src: ['bower_components/**'],
                    dest: 'deploy'
                }, {
                    src: ['index.prod.html'],
                    dest: 'deploy/index.html'
                }]
            },
            main: {
                files: [{
                    expand: true,
                    src: ['assets/*'],
                    dest: 'deploy'
                }, {
                    expand: true,
                    src: ['xcache'],
                    dest: 'deploy'
                }]
            },

        },
        compress: {
            main: {
                options: {
                    mode: 'gzip'
                },
                expand: true,
                cwd: 'deploy/',
                src: ['*.*'],
                dest: 'deploy/'
            }
        },
        concat: {
            css: {
                src: 'kopi/*.css',
                dest: 'deploy/kopi.css'
            },
            assetscss: {
                src: 'assets/css/*.css',
                dest: 'deploy/assets.css'
            },
            app: {
                src: ['deploy/*.control'],
                dest: 'deploy/index.js',
            },
            assetsjs: {
                src: ['deploy/*.assets'],
                dest: 'deploy/assets.js',
            },
            kopi: {
                src: ['deploy/kopi.kopi', 'deploy/route.kopi', 'deploy/alert.kopi', 'deploy/event.kopi', 'deploy/module.kopi', 'deploy/render.kopi', 'deploy/api.kopi', 'deploy/model.kopi', 'deploy/navigate.kopi', 'deploy/form.kopi', 'deploy/array.kopi', 'deploy/polymer.kopi'],
                dest: 'deploy/kopi.js',
            },
            preload: {
                src: 'deploy/*.preload',
                dest: 'deploy/preload.js',
            }
        },
        clean: {
            files: {
                src: [
     "deploy/*",
    ]
            },
            temp: {
                src: [
     "deploy/*.preload",
     "deploy/*.control",
     "deploy/*.kopi"

    ]
            }
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-include-source')
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-obfuscator');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // register at least this one task
    grunt.registerTask('live', ['clean:files', 'injector', 'copy', 'uglify', 'concat', 'clean:temp', 'notify:server']);
    grunt.registerTask('default', ['includeSource','injector']);


};