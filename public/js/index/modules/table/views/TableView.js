define([
    'backbone',
    'underscore',
    'text!../template/TableTemplate.html'
], function(Backbone, _, TableTemplate){
    return Backbone.View.extend({

        template: _.template(TableTemplate),

        tagName: "table",

        initialize: function(){
            var _this = this;
            this.listenTo(this.model, "change:players", this.render);
            this.render();
            _this.model.getActualData();
            setInterval(function(){
                _this.model.getActualData();
            }, _this.model.get('interval'));
        },

        render: function(){
            var view = this.template(this.model.toJSON());
            this.$el.empty().html(view);
        }

    })
})