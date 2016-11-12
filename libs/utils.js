var CryptoJS = require("crypto-js")
    , config = require('config');

var Secret = {};
Secret.decode = function(data){
    var decrypted = CryptoJS.AES.decrypt(data, 'keepSimple');
    return decrypted.toString(CryptoJS.enc.Utf8);
};

exports.Secret = Secret;