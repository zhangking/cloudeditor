function Room () {

}

Room.prototype.findone = function(id,callback){
	var model = getnewmodel();
	model.findone('room',id,callback);
}

Room.prototype.save = function(param,callback){
	var model = getnewmodel();
	model.insert('room',param,callback);
}

Room.prototype.query = function(param,callback){
	var model = getnewmodel();
	var limit,sort,skip;
	if(param.limit){
		limit = param.limit;
		delete param.limit;
	}
	if(param.sort){
		sort = param.sort;
	    delete param.sort;
	}
	if(param.skip){
		skip = param.skip;
		delete param.skip;
	}
	model.query('room',param,callback,limit,sort,skip);
}


Room.prototype.remove = function(param,callback) {
	var model = getnewmodel();
	model.remove('room',param,callback);
}

var getnewmodel = function(){
	var model = require('../model');
	return new model();
}

module.exports = Room;