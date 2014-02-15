var IdentificatorModel = require('../models/identificator/identificator')
    , crypto = require('crypto')
    , config = require('config')
    , logger = require('libs/log')(module)
    , HttpError = require('error').HttpError
    , Secret = require('libs/utils').Secret
    , _ = require('underscore')
    , PlayerModel = require('../models/player/player');

var controller = {
    score: {
        add: function(req, res, next){
            var data = req.body.data;

            if( !data ){
                return next( new HttpError(400, "Cannot find data") );
            }

            try{
                data = Secret.decode(data);
                data = JSON.parse(data);
            }catch(e){
                return next( new HttpError(400, "Cannot parse data") );
            }

            if( !data.name || !data.identificator || !_.isNumber(data.score) ){
                return next( new HttpError(400, "Cannot find necessary data") );
            }

            if( data.score < 0 ){
                return next( new HttpError(400, "Score should be great that 0") );
            }

            IdentificatorModel.find({
                identificator: data.identificator

            }, function(err, identificators){
                if( err ) return next( new HttpError(400, "identificator: problem with DB") );
                if( !identificators || !identificators.length ) return next( new HttpError(400, "Cannot find identificator") );

                PlayerModel.find({
                    name: data.name,
                    identificator: identificators[0]._id
                }, function(err, players){

                    if( err ) return next( new HttpError(400, "player: problem with DB") );

                    if( players.length ){

                        if( players[0].score == data.score || players[0].score > data.score ){
                            res.send();
                            logger.info("Existing player '" + data.name + "' with identificator: " + identificators[0]._id + " has exist or below value");
                        }else {
                            players[0].update({score: data.score}, function(err){
                                if( err ) return next( new HttpError(400, "Cannot update result") );
                                res.send();
                                logger.info("Existing player '" + data.name + "' with identificator: " + identificators[0]._id + " was updated");
                            })
                        }

                    }else{
                        var player = new PlayerModel({
                            name: data.name,
                            identificator: identificators[0]._id,
                            score: data.score
                        })
                        player.save(function(err){
                            if( err ) return next( new HttpError(400, "Cannot save result") );
                            res.send();
                            logger.info("New player '" + data.name + "' with identificator: " + identificators[0]._id + "was saved");
                        })
                    }
                })
            })

        }
    }
}
module.exports = controller;