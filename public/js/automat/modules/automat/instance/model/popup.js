define(['backbone'], function(Backbone){

    return Backbone.Model.extend({
        defaults: {
            text: "",
            timeout: 1500
        }
    })

})