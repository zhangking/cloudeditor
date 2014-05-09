var list = function(req,res) {
	var user = getnewuser();
	var callback = function(ret){
		res.send(ret);
	}
	user.query(null,callback);
}

var register = function(req,res){
	var crypto   = require('crypto');
	var user = getnewuser();

	var username = req.param('username'),
		password = req.param('password');

	//检验重复
	user.query({username:username},function(ret){
		if(ret.length>0){
			res.send({'err':'已存在'});
		}else{
			var md5 = crypto.createHash('md5');
				password = md5.update(password).digest('hex');
				user.save({username:username,password:password},function(ret){
					if(ret.length){
						res.send({'err':'0'});
					}else{
						res.send({'err':'1'});
					}
				}); 	

		}
	})

}

var login = function(req,res){
	var crypto   = require('crypto');
	var user = getnewuser();

	var username = req.param('username'),
		password = req.param('password');
	var md5 = crypto.createHash('md5');
		password = md5.update(password).digest('hex');
		user.query({username:username},function(ret){
			if(ret.length){
				if(ret[0].password == password){
					//登录处理
					res.send(ret);
				}else{
					res.send({err:'密码不正确'});
				}
			}else{
				res.send({err:'账户不存在'});
			}
		})
}

var logout = function(req,res){
	res.send(1);
}

var get_user = function(req,res){
	var user = getnewuser();
	var callback = function(ret){
		res.send(ret);
	}
	user.query({username:req.header('Authorization')},callback);
}
var getone = function(req,res){
	var user = getnewuser();
	var callback = function(ret){
		res.send(ret);
	}
	user.query(req.query,callback);
}

var fork = function(req,res){
	var user = getnewuser();
	var callback = function(ret){
		res.send(ret);
	}
	var id = req.param('id');
	delete req.query.id; 
	user.push(id,req.query,callback);
}

var like = function(req,res){
	var user = getnewuser();
	var callback = function(ret){
		res.send(ret);
	}
	var id = req.param('id');
	delete req.query.id; 
	user.push(id,req.query,callback);
}

var getnewuser = function(){
	var user = require('../db/model/user');
	return  new user();
}

exports.list = list;
exports.register = register;
exports.login = login;
exports.get_user = get_user;
exports.logout = logout;
exports.fork  = fork;
exports.like = like;
exports.getone = getone;


