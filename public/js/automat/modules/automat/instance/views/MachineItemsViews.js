define([
    'backbone',
    'text!../template/MachineItemsViews.html'
], function(Backbone, MachineItemsViews){

    return Backbone.View.extend({

        template: _.template(MachineItemsViews),

        className: "slot-machine-items",

        initialize: function(options){

            //this.listenTo(this.model);
            this.channel = options.channel;
            this.listenTo(this.channel, "rotateItems", this.rotateItems)
            this.render();
        },

        render: function(){
            var view = this.template();
            this.$el.html(view);
        },

        rotateItems: function(){
            var roundResult = this.model.get('roundResult');



        }

    })

})