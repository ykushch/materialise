define([
    'backbone',
    'underscore',
    'text!../template/GalleryTemplate.html'
], function(Backbone, _, GalleryTemplate){
    return Backbone.View.extend({

        template: _.template(GalleryTemplate),

        tagName: "ul",

        className: "thumbs noscript",

        initialize: function(){
            var _this = this;



            this.render();
        },

        render: function(){
            var view = this.template();
            this.$el.empty().html(view);
        }

    })
})