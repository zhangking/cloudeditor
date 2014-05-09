var pool = require('./db').pool;
var ObjectId = require('mongodb').ObjectID;
//增删改查
function model(){
	this.pool = pool;
}

model.prototype.findone = function(coll,id,callback){
	pool.acquire(function(err,db){
		if(!err){
			db.collection(coll,function(err,collection){
				collection.findOne({'_id':new ObjectId(id)},function(err,ret){
					pool.release(db);
					if(!err){
						callback(ret);
					}else{

					}
				});
			})
		}
		else{
			pool.release(db);
			console.log('db error');
		}

	});
}

model.prototype.query = function(coll,param,callback,limit,sort,skip) {
	limit = limit?limit:null;
	sort  = sort?sort:{};
	skip  = skip?skip:0;
	pool.acquire(function(err,db){
	if(!err){
		db.collection(coll,function(err,collection){
		collection.find(param,{
			limit:limit,
			sort:sort,
			skip:skip
		}).toArray(function(err,ret){
			pool.release(db);
			if(!err){
				callback(ret);
			}else{
				//
			}
		});
	})
	}else{
		pool.release(db);
		console.log('db error');
	}
	})
}
model.prototype.queryall = function(coll,param,callback) {
	for(var i in param.value){
		param.value[i] = new ObjectId(param.value[i]);	
	}
	var a = {};
	a[param.key] = {"$in":param.value}; 
	pool.acquire(function(err,db){
	if(!err){
		db.collection(coll,function(err,collection){
		collection.find(a).toArray(function(err,ret){
			pool.release(db);
			if(!err){
				callback(ret);
			}else{
				//
			}
		});
	})
	}else{
		pool.release(db);
		console.log('db error');
	}
	})
}
model.prototype.insert = function(coll,param,callback) {
	pool.acquire(function(err,db){
		if(!err){
			db.collection(coll,function(err,collection){
				collection.insert(param,function(err,ret){
					pool.release(db);
					if(!err){
						callback(ret);
					}else{

					}
				});
			})
		}
		else{
			pool.release(db);
			console.log('db error');
		}

	});

}

model.prototype.remove = function(coll,id,callback) {
	pool.acquire(function(err,db){
		if(!err){
			db.collection(coll,function(err,collection){
				collection.remove({'_id':new ObjectId(id)},function(err,ret){
					pool.release(db);
					if(!err){
						callback(ret);
					}else{

					}
				});
			})
		}
		else{

			pool.release(db);
			console.log('db error');
		}

	});


}

model.prototype.update = function(coll,id,param,callback) {
	pool.acquire(function(err,db){
		if(!err){
			db.collection(coll,function(err,collection){
				collection.update({'_id':new ObjectId(id)},{$set:param},function(err,ret){
					pool.release(db);
					if(!err){
						callback(ret);
					}else{

					}
				});
			})
		}
		else{
			pool.release(db);
			console.log('db error');
		}

	});	
}

model.prototype.push = function(coll,id,param,callback){
		pool.acquire(function(err,db){
		if(!err){
			db.collection(coll,function(err,collection){
				collection.update({'_id':new ObjectId(id)},{$push:param},function(err,ret){
					pool.release(db);
					if(!err){
						callback(ret);
					}else{

					}
				});
			})
		}
		else{
			pool.release(db);
			console.log('db error');
		}

	});	
}

model.prototype.add = function(coll,id,param,callback){
		pool.acquire(function(err,db){
		if(!err){
			db.collection(coll,function(err,collection){
				collection.update({'_id':new ObjectId(id)},{$inc:param},function(err,ret){
					pool.release(db);
					if(!err){
						callback(ret);
					}else{

					}
				});
			})
		}
		else{
			pool.release(db);
			console.log('db error');
		}

	});	
}

module.exports  = model;


