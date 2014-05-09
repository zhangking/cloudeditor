function Code () {

}

Code.prototype.findone = function(id,callback){
	var model = getnewmodel();
	model.findone('code',id,callback);
}

Code.prototype.save = function(param,callback){
	var model = getnewmodel();
	model.insert('code',param,callback);
}

Code.prototype.update = function(id,param,callback){
	var model = getnewmodel();
	model.update('code',id,param,callback);
}

Code.prototype.share = function(param,callback){
	var model = getnewmodel();
	param.status = 1;
	model.update('code',param,callback);
}

Code.prototype.query = function(param,callback){
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
	model.query('code',param,callback,limit,sort,skip);
}

Code.prototype.add = function(id,param,callback){
	var model = getnewmodel();	
	model.add('code',id,param,callback);
}

Code.prototype.remove = function(param,callback) {
	var model = getnewmodel();
	model.remove('code',param,callback);
}

Code.prototype.queryall = function(param,callback){
	var model = getnewmodel();
	model.queryall('code',param,callback);
}


var getnewmodel = function(){
	var model = require('../model');
	return new model();
}

module.exports = Code;