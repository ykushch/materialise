define([
    'backbone',
    'text!../template/MachineItemsViews.html',
    'text!../template/StarsTemp.html'
], function(Backbone, MachineItemsViews, StarsTemp){

    return Backbone.View.extend({

        template: _.template(MachineItemsViews),
        starsTemp: _.template(StarsTemp),

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
            this.generateStars();
            this.run();
        },

        generateStars: function(){
            var roundResult = this.model.get('roundResult')
                , _this = this;

            this.$el.find('.col').each(function(i, el){
                var $el = $(el)
                    , item = $el.data('item');
                var randomStars = _this.model.getRandomStarts(item*5);
                var winnerStars = _this.model.getStarsByIds(roundResult[i]);
                var allStars = winnerStars.concat(randomStars);
                var allStarsHtml = _this.starsTemp({stars: allStars});

                var winerStarsHtml = _this.starsTemp({stars: winnerStars});
                winerStarsHtml = $('<div class="scroll_new">'+winerStarsHtml+'</div>');
                winerStarsHtml.hide();

                $el.find('.scroll_old').prepend(allStarsHtml);
                $el.append(winerStarsHtml);
            })
        },

        run: function(){

            var speed = this.model.get('speedRotate')
                , _this = this;

            this.$el.find('.col').each(function(i, el){
                var $el = $(el)
                    , $scrollOld = $el.find('.scroll_old')
                    , item = $el.data('item');

                if( item > 1  ){
                    setTimeout(function(){
                        $scrollOld.animate({
                            bottom: -(162 * ((item * 5) +3))
                        }, speed, function(){
                            _this.successRotate($el, item);
                        });
                    }, item * 150);
                }else{
                    $scrollOld.animate({
                        bottom: -(162 * ((item * 5) +3))
                    }, speed, function(){
                        _this.successRotate($el, item);
                    });
                }

            })
        },

        successRotate: function($el, item){
            var $scrollOld = $el.find('.scroll_old')
                , $scrollNew = $el.find('.scroll_new');
            $scrollNew.show();
            $scrollOld.remove();
            $scrollNew.addClass('scroll_old');
            $scrollNew.removeClass('scroll_new');

            if( item == 5 ){
                this.channel.trigger('endRotate');
            }
        }

    })

})