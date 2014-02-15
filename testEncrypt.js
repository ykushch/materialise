var CryptoJS = require("crypto-js");

var data = "U2FsdGVkX18iSA+uG11RNfqW5ArXnl0Jg+RIimWECw1xQvpuKZ941Lzif+FhFbENYSgV5gaBg5X63mB6yjKtS5SBtE3uAXrbQH4Ct69Yl3Q=";
var decrypted = CryptoJS.AES.decrypt(data, "keepSimple");
console.log(decrypted.toString(CryptoJS.enc.Utf8));