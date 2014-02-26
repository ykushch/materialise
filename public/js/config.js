requirejs.config({

    baseUrl: '/js',

    paths: {
        automat: 'automat',
        index: 'index',

        /*libs*/
        text: "libs/text",
        jquery: "libs/jquery",
        underscore: "libs/underscore",
        backbone: "libs/backbone",
        async: "libs/async",
        aes: "libs/aes",
        cslider: "libs/jquery.cslider",
        modernizr: "libs/modernizr.custom"
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
        },
        cslider: {
            deps: ['jquery', 'modernizr']
        },
        modernizr: {
            deps: ['jquery']
        }
    },

    urlArgs: "bust=" + (new Date()).getTime()
});
