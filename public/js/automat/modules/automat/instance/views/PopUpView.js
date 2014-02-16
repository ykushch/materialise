define([
    'backbone',
    'underscore',
    'text!../template/PopUp.html'
], function(Backbone, _, layoutTemp){
    return Backbone.View.extend({

        template: _.template(layoutTemp),

        className: "message",

        initialize: function(){
            this.render();
        },

        render: function(){
            var view = this.template(this.model.toJSON());
            this.$el.html(view);
        },

        show: function(){
            var _this = this;
            this.deleteAllPopUp();
            $('body').prepend(this.$el);
            setTimeout(function(){
                _this.$el.addClass('in');
            }, 0)
            setTimeout(function(){
                _this.$el.remove();
            }, this.model.get('timeout'));
        },

        deleteAllPopUp: function(){
            $('body > .message').remove();
        }

    })
})