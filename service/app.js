var express = require('express'),
	user    = require('./routes/user'),
	code    = require('./routes/code'),
	room    = require('./routes/room');
	filter  = require('./libraries/filter');


var app = express();

//
app.set('port',process.env.PORT || 3000);
app.use(express.logger());
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.bodyParser());  
app.use(express.cookieParser('login'));
app.use(express.session());
app.use(function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Access-Control-Allow-Headers','Authorization,Content-type');
	res.status(200);
	next();
})

app.get('/user/list',user.list);
app.get('/user/register',user.register);
app.get('/user/login',user.login);
app.get('/user/logout',filter.authorize,user.logout);
app.get('/user/get_user',filter.authorize,user.get_user);
app.get('/user/fork',filter.authorize,user.fork);
app.get('/user/like',filter.authorize,user.like);
app.get('/user/getone',user.getone)

app.get('/code/list',code.list);
app.post('/code/save',filter.authorize,code.save);
app.post('/code/update',filter.authorize,code.update);
app.get('/code/getone',code.getone);
app.get('/code/gethtml',code.gethtml);
app.get('/code/like',code.like);
app.get('/code/fork',code.fork);
app.post('/code/queryall',code.queryall);

app.get('/room/list',room.list);
app.get('/room/getone',room.getone);
app.get('/room/save',filter.authorize,room.save);

app.listen(3000);


