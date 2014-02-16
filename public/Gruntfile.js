module.exports = function(grunt) {

    grunt.initConfig({

        less: {
                "css/style.css":  'less/style.less'
        },

        watch: {
            less: {
                files: 'less/*.less',
                tasks: ['less']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // By default, lint and run all tests.
    grunt.registerTask('default', ['watch']);

};
