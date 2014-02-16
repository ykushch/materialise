requirejs.config({

    baseUrl: 'js/libs',

    paths: {
        automat: '../automat',

        /*libs*/
        underscore: "underscore",
        backbone: "backbone",
        async: "async",
        aes: "aes"
    },

    shim:{
        jquery: {
            exports: "jQuery"
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        aes: {
            exports: 'CryptoJS'
        }
    },

    urlArgs: "bust=" + (new Date()).getTime()
});
