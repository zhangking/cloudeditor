function User(){
}

User.prototype.query = function(param,callback){
	var model = getnewmodel();
	model.query('user',param,callback);
}

User.prototype.save = function(param,callback){
	var model = getnewmodel();
	model.insert('user',param,callback);
}

User.prototype.push = function(id,param,callback){
	var model = getnewmodel();
	model.push('user',id,param,callback);
}


var getnewmodel = function(){
	var model = require('../model');
	return new model();
}



module.exports = User;

