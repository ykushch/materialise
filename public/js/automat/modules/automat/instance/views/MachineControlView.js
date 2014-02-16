define([
    'backbone',
    'text!../template/MachineControlView.html'
], function(Backbone, MachineControlView){

    return Backbone.View.extend({

        template: _.template(MachineControlView),

        className: "slot-machine-control",

        events: {
            "click .button": "buttonHandler"
        },

        initialize: function(options){
            this.channel = options.channel;

            this.listenTo(this.model, "change:bet", this.betHandler);

            this.render();
        },

        render: function(){
            var view = this.template(this.model.toJSON());
            this.$el.html(view);
        },

        buttonHandler: function(e){
            var $el = $(e.target)
                , type = $el.data('type')
                , isButtonDisable = this.model.get('isButtonDisable');

            if( !type || isButtonDisable ) return false;

            this.channel.trigger("controlBtnClick", {
                type: type
            });
        },

        betHandler: function(){
            this.$el.find(".bet-description .bet-line").html( this.model.get('bet') );
            this.$el.find(".bet-description .bet-line").html( this.model.get('bet') );
            this.$el.find(".bet-description .turn-bet").html( this.model.get('turnbet') );
        }

    })

})