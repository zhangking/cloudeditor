var list = function(req,res) {
	var room = getnewroom();
	var callback = function(ret){
		res.send(ret);
	}	
	room.query(req.query,callback);
}
var save = function(req,res){
	var room = getnewroom();
	var callback = function(ret){
		res.send(ret);
	}
	room.save(req.query,callback);
}


var getone = function(req,res) {
	var room = getnewroom();
	var callback = function(ret){
		res.send(ret);
	}	
	room.findone(req.param('id'),callback);
}



var getnewroom = function(){
	var room = require('../db/model/room');
	return  new room();
} 

exports.list = list;
exports.save = save;
exports.getone = getone; 
