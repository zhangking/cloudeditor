exports.authorize = function(req,res,next){
	if(req.header('Authorization')=='null'){
		res.send({err:'请先登录'});
	}else{
		next();
	}
}