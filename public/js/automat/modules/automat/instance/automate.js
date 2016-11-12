define([
    'backbone',
    'underscore',

    './model/automat',
    './views/Layout',
    './views/BetsBtnView',
    './views/MachineItemsViews',
    './views/MachineControlView',
    './views/PopUpView',
    './model/popup',
    'aes'

], function(Backbone, _, AutomatModel, Layout,
            BetsBtnView, MachineItemsViews, MachineControlView,
            PopUpView, PopUpModel){


    /**
     * After player makes bet and press 'Play' btn, Automate execute play method.
     * Model generate result, after that view starts rotate.
     * After rotating the view trigger 'endRotate' event and ask modek to calculate whether player win or lose money
     * */
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
            this.channel.on("endRotate", function(data){_this.endRotate(data)});
        },

        controlBtnHandler: function(data){
            var type = data.type;
            if(!type) return false;

            switch(type){
                case "getwin":
                    this.getwin();
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
                this.showPopUp({text: "You don't have money"});

                return false;
            }

            if( totalWin < turnbet ){
                this.showPopUp({text: "You don't have enough money"});
                return false;
            }

            this.model.set('isButtonDisable', true);
            this.model.generateResult();
            this.channel.trigger('rotateItems');

        },

        endRotate: function(){
            var winnerBet = this.model.getUserWinnerBet();

            if( winnerBet.length ){
                //игрок что то выиграл
                this.model.calculateSuccess();
            }else{
                //игрок ничего не выиграл
                this.model.calculateLost();
            }

            this.model.set('isButtonDisable', false);
        },

        getName: function(){
            return $.trim(this.layout.$el.find('.input-name').val());
        },

        getId: function(){
            return $.trim(this.layout.$el.find('.input-id').val());
        },

        // write scores on the server
        getwin: function(){

            if( !this.getName() || !this.getId() ){
                this.showPopUp({
                    text:"Если вы хотите чтобы в следующий раз ваш результат был учтен в таблице результатов," +
                        " введите свой ID и Name",
                    timeout: 5000});
            }else{
                this.sendDataToServer()
            }

            this.model.clear().set(this.model.defaults);

        },

        showPopUp: function(data){
            var popUp = new PopUpView({
                model: new PopUpModel(data)
            });
            popUp.show();
        },

        sendDataToServer: function(){

            var data = {
                    name: this.getName(),
                    score: this.model.get("totalWin"),
                    identificator: this.getId()
                }
                , _this = this;

            data = JSON.stringify(data);
            var encrypted = '' + CryptoJS.AES.encrypt(data, this.model.get("key"));

            $.ajax({
                type: 'post',
                url: '/api/score/add',
                data: {data: encrypted},
                success: function(){
                    _this.showPopUp({
                        text: "Result was saved."
                    })
                },
                error: function(xhr, type, message){
                    var responseText = xhr.responseText
                        , text = "Server error";

                    if( responseText ){
                        try{
                            responseText = JSON.parse(responseText)
                            if( responseText && responseText.error ){
                                text = responseText.error;
                            }
                        }catch(e){}

                    }

                    _this.showPopUp({
                        text: text
                    })
                }
            })
        }
    });
    return Automate;
})