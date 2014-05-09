var list = function(req,res) {
	var code = getnewcode();
	var callback = function(ret){
		res.send(ret);
	}	
	code.query(req.query,callback);
}
var save = function(req,res){
	var code = getnewcode();
	var callback = function(ret){
		res.send(ret);
	}
	code.save(req.body,callback);
}
var update =function(req,res) {
	var code = getnewcode();
	var callback = function(ret){
		res.send(ret);
	}
	var id = req.param('id'); 
	delete req.body.id;
	code.update(id,req.body,callback);
}

var getone = function(req,res) {
	var code = getnewcode();
	var callback = function(ret){
		res.send(ret);
	}	
	code.findone(req.param('id'),callback);
}
var gethtml = function(req,res){
	var code = getnewcode();
	var callback = function(ret){
		var html = "<!DOCTYPE html><html><head><meta http-equiv=Content-Type content='text/html;charset=utf-8'><style>"+ret[1]+"</style><script src='//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'></script><script>"+ret[2]+"</script></head><body>"+ret[0]+"</body></html>";
		console.log(html);
		res.send(html);
	}
	code.findone(req.param('id'),callback);
}
var like = function(req,res){
	var code = getnewcode();
	var callback = function(ret){
		res.send(ret);
	}	
	code.add(req.param('id'),{like:1},callback);
}
var fork = function(req,res){
	var code = getnewcode();
	var callback = function(ret){
		res.send(ret);
	}	
	code.add(req.param('id'),{fork:1},callback);
}

var queryall = function(req,res){
	var code = getnewcode();
	var callback = function(ret){
		res.send(ret);
	}
	code.queryall(req.body,callback);
}

var getnewcode = function(){
	var code = require('../db/model/code');
	return  new code();
} 

exports.list = list;
exports.save = save;
exports.getone = getone; 
exports.gethtml = gethtml;
exports.update = update;
exports.like = like;
exports.fork = fork;
exports.queryall = queryall;
