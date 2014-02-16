var crypto = require('crypto');


function generate(length){
    var date = (new Date()).getTime() + "";
    var random  = Math.random();
    var random1  = Math.random();
    var random2  = Math.random();

    var md5sum = crypto.createHash('md5');
    md5sum.update( (date * random * random1 * random2) + "" );
    return   md5sum.digest('hex').slice(0, length );
}

function getRandomId(count){
    var result = [];
    for( var i = 0; i < count; i++ ){
        result.push( generate(5) );
    }
    return result;
}

var randomId= getRandomId(300);
console.log(randomId);