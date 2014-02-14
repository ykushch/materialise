var _ = require('underscore'),
    util = require('util'),
    async = require('async'),
    mongoose = require('mongoose'),
    logger = require("libs/log")(module);

var Schema = mongoose.Schema;
var playerSchema = new Schema({
    identificator: {
        type: String,
        required: true
    }
});

var PlayerModel = mongoose.model('player', playerSchema);

module.exports = PlayerModel;
