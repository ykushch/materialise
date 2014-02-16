define([
    'backbone',
    './instance/automate'
], function(Backbone, Automate){

    new Automate();

    var Controller = {
        getAutomate: function(){
            return new Automate();
        }
    }

    return {
        getAutomate: function(){
            Controller.getAutomate();
        }
    }

})