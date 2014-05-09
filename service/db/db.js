var mongodb = require('mongodb');
var poolModule = require('generic-pool');


var pool = poolModule.Pool({
    name     : 'mongodb',
    create   : function(callback) {
        var server_options={'auto_reconnect':false,poolSize:1};
        var db_options={w:-1};
        var mongoserver = new mongodb.Server('localhost', 27017,server_options );
        var db=new mongodb.Db('cloud', mongoserver, db_options);
        db.open(function(err,db){
            if(err)return callback(err);
            callback(null,db);
        });
    },
    destroy  : function(db) { db.close(); },
    max      : 10,//根据应用的可能最高并发数设置
    idleTimeoutMillis : 30000,
    log : false 
});

exports.pool = pool;