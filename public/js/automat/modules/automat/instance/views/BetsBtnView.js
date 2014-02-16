define([
    'backbone',
    'text!../template/BetsBtnView.html'
], function(Backbone, BetsBtnViewTemp){

    return Backbone.View.extend({

        template: _.template(BetsBtnViewTemp),

        className: "lines-picker",

        events: {
            "click .line" : "clickBetHandler"
        },

        initialize: function(){
            this.listenTo(this.model, "change:bet", this.betHandler);
            this.interval;
            this.render();
        },

        render: function(){
            var view = this.template();
            this.$el.html(view);
        },

        betHandler: function(){
            var bet = this.model.get('bet')
                , _this = this;

            this.showBetsLine(bet);
            this.interval = setTimeout(function(){
                _this.hideAllBetsLine();
            }, 500);
            this.setActiveBet(bet);
        },

        setActiveBet: function(number){
            this.$el.find("span").removeClass('active');
            this.$el.find("span").each(function(i, span){
                var $el = $(span);
                if( $el.data('number') <= number ){
                    $el.addClass('active');
                }
            })
        },

        showBetsLine: function(number){
            this.hideAllBetsLine();
            this.$el.find("span").each(function(i, span){
                var $el = $(span);
                if( $el.data('number') <= number ){
                    $el.addClass('showImg');
                }
            })
        },

        hideAllBetsLine: function(){
            this.$el.find("span").removeClass('showImg');
        },

        clickBetHandler: function(e){
            var $el = $(e.target).closest('.line')
                , number = $el.data('number')
                , isButtonDisable = this.model.get('isButtonDisable');

            if( isButtonDisable ) return false;

            if(!number) return false;
            this.model.set('turnbet', number * this.model.get('linecost'));
            this.model.set('bet', number);
        }

    })

})