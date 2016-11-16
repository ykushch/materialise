var _ = require('underscore'),
    util = require('util'),
    async = require('async'),
    mongoose = require('mongoose'),
    logger = require("../../libs/log")(module);

var Schema = mongoose.Schema;
var identificatorSchema = new Schema({
    identificator: {
        type: String,
        required: true
    }
});

var IdentificatorModel = mongoose.model('identificator', identificatorSchema);
module.exports = IdentificatorModel;
