define([
    'backbone',
    'underscore',
    'text!../template/layout.html'
], function(Backbone, _, layoutTemp){
    return Backbone.View.extend({

        template: _.template(layoutTemp),

        initialize: function(){
            this.render();
        },

        render: function(){
            var view = this.template();
            this.$el.html(view);
        }

    })
})