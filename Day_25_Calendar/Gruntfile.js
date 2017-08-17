module.exports = function(grunt) {

    [
        'grunt-contrib-less'
    ].forEach(function(task) {
        grunt.loadNpmTasks(task);
    })

    grunt.initConfig({
        less: {
            styles: {
                files: {
                    'calendar.css': 'less/calendar.less'
                }
            }
        }
    })

    grunt.registerTask('default', ['less']);
}