define([
    'backbone',
    'underscore',

    './model/automat',
    './views/Layout'

], function(Backbone, _, AutomatModel, Layout){

    function Automate(options){
        this.init(options);
    }
    _.extend(Automate.prototype, Backbone.Events);
    _.extend(Automate.prototype, {
        init: function(options){
            this.model = new AutomatModel();
            this.layout = new Layout();
        }
    });
    return Automate;
})