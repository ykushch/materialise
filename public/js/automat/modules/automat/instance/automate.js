define([
    'backbone',
    'underscore',

    './model/automat',
    './views/Layout',
    './views/BetsBtnView',
    './views/MachineItemsViews',
    './views/MachineControlView'

], function(Backbone, _, AutomatModel, Layout, BetsBtnView, MachineItemsViews, MachineControlView){

    function Automate(options){
        this.init(options);
    }
    _.extend(Automate.prototype, Backbone.Events);
    _.extend(Automate.prototype, {
        init: function(options){
            this.channel = _.extend({}, Backbone.Events);
            this.model = new AutomatModel();
            this.layout = new Layout({channel: this.channel});
            this.betsBtnView = new BetsBtnView({model: this.model, channel: this.channel});
            this.machineItemsViews = new MachineItemsViews({model: this.model, channel: this.channel});
            this.machineControlView = new MachineControlView({model: this.model, channel: this.channel});
            this.layout.$el.find('.slot-machine').append( this.betsBtnView.$el );
            this.layout.$el.find('.slot-machine').append( this.machineItemsViews.$el );
            this.layout.$el.append( this.machineControlView.$el );

            this.bind();

            $('body .automate').append( this.layout.$el );
        },

        bind: function(){
            var _this = this;

            //$(document).on('keydown', {this_: _this},  this.keydown);
            this.channel.on("controlBtnClick", function(data){_this.controlBtnHandler(data)});
        },

        controlBtnHandler: function(data){
            var type = data.type;
            if(!type) return false;

            switch(type){
                case "getwin":
                    break;
                case "maxbet":
                    this.maxBetChange();
                    break;
                case "play":
                    this.play();
                    break;
                case "betlines":
                    this.betLinesChange();
                    break;
                case "leaderboard":
                    break;
            }
        },

        betLinesChange: function(){
            var bet = this.model.get('bet');
            if( bet ==  this.model.get('maxBet') ){
                bet = 1;
            }else{
                bet++;
            }

            this.model.set('turnbet', bet * this.model.get('linecost'));
            this.model.set('bet', bet);
        },

        maxBetChange: function(){
            var maxBet = this.model.get('maxBet');
            this.model.set('turnbet', maxBet * this.model.get('linecost'));
            this.model.set('bet', maxBet);
        },

        play: function(){
            var totalWin = this.model.get("totalWin")
                , turnbet = this.model.get("turnbet");

            if( totalWin <= 0 ){
                alert("You don't have money");
                return false;
            }

            if( totalWin < turnbet ){
                alert("You don't have money (turnbet)");
                return false;
            }

            this.model.set('isButtonDisable', true);
            this.model.generateResult();
            this.channel.trigger('rotateItems');

/*            var winnerBet = this.model.isWinner();
            if( winnerBet.length ){
                //игрок что то выиграл
            }else{
                //игрок ничего не выиграл
            }*//**/


        }
    });
    return Automate;
})