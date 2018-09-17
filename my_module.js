var toexport = {};

toexport.log = function(message){
    console.log(message);
}

toexport.info = function(message){
    console.info(message);
}

toexport.error = function(message){
    console.error(message);
}

module.exports = toexport;