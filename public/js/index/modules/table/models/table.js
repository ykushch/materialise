define(['backbone'], function(Backbone){

    return Backbone.Model.extend({
        defaults: {
            players: [],
            interval: 1000
        },

        getActualData: function(){
            var _this = this;
            this.fetch({
                type: "GET",
                url: "/api/score/get",
                success: function(model, data, xhr){
                    _this.unset('players', {silent: true});
                    _this.set('players', data.players);
                },
                error: function(){}
            });
        }
    })

})