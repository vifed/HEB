var httpClient = require("request");

var toexport = {};

toexport.requestGet = function(url,callback){
    httpClient(url,callback);
}

toexport.reqGetEvent = function(url){
    return httpClient.get(url);
}

module.exports = toexport;