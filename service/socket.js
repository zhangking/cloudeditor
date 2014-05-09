var express = require('express'),
	http    = require('http'),
	render  = require('./libraries/render.js');
	Room    = require('./db/model/room.js');

var app = express();
app.use(function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin','http://localhost:9000');
	res.setHeader('Access-Control-Allow-Credentials',false);
	next();
})

var server = http.createServer(app);
server.listen(8000);

var	io	= require('socket.io').listen(server,{origins:'*:*'});

io.of('/').on('connection',function(socket){
	socket.on('code',function(message) {
		var code = message.code;
		join(code,function(ret) {
			socket.emit('code',{
				ret:ret,
				ori:code
			});
		});
	})
})

io.of('/room').on('connection',function(socket){

	socket.on('add',function(message){
		socket.room = message;
		socket.join(message);
		socket.broadcast.to(message).emit('add','code');
	})

	socket.on('code',function(message){
		var room = message.room;
		var code = message.code;
		join(code,function(ret){
			socket.broadcast.to(room).emit('code',{
				ret:ret,
				ori:code
			});
			socket.emit('code',{
				ret:ret,
				ori:code
			});
		})
	})

	socket.on('click',function(message){
		var room = message.room;
		socket.broadcast.to(room).emit('click',message);
	})

	socket.on('comment',function(message){
		var room = message.room;
		socket.broadcast.to(room).emit('comment',message);
	})

	socket.on('disconnect', function () {
		var room = io.sockets.manager.rooms['/room/'+socket.room];
		socket.leave(socket.room);
		
		if(room.length == 0){
			var model = new Room();
			model.remove(socket.room,function(){});
		}
	})

})

var join  = function(data,callb){
	var mode;
	var callback = function(){
		var ret = "<!DOCTYPE html><html><head><meta http-equiv=Content-Type content='text/html;charset=utf-8'><style>"+data[1]+"</style></head><body>"+data[0]+"<script src='styles/library/flat/js/jquery-1.8.3.min.js'></script><script>"+data[2]+"</script></body></html>";	
		callb(ret);
	}
	var done = function(n,ca){
		var count = 0;
		return function(){
			ca();
			count++;
			if(count == n){
				ca();
			}
		}();
	}
	if(mode = data[3]){
		//html
			done(3,callback);
		//css
			switch(mode[1]){
				case 'less':
				render.renderless(data[1],function(ret){
					data[1] = ret;
					done(3,callback);
				});
				break;
				default:
				done(3,callback);
				break;
			} 
		//js
			done(3,callback);
	}else{
		callback();
	}

}


