var serviceModule =  angular.module('app.service',[]);

serviceModule.factory('User',['$http',function($http){
	var User = {};
	User.save = function(user,callback){
		$http.get(main.api_url+'/user/register',{params:user}).success(callback);		
	}
	User.login = function(user,callback){
		$http.get(main.api_url+'/user/login?',{params:user}).success(callback);	
	}
	User.checklogin =function(callback){
		$http.defaults.headers.common['Authorization']=getCookie('token');
		$http.get(main.api_url+'/user/get_user').success(function(data){
			if(data.err){
      			User.islogin = false;
    		}else{
    			user_info = data[0];
      			User.islogin = true;
      			User.username = data[0].username;
    		}
    		if(callback){
    			callback();
    		}
		});
	}
	User.getone = function(param,callback){
		$http.get(main.api_url+'/user/getone',{params:param}).success(callback);	
	}

	User.fork = function(param,callback){
		$http.get(main.api_url+'/user/fork',{params:param}).success(callback);
	}
	User.like = function(param,callback){
		$http.get(main.api_url+'/user/like',{params:param}).success(callback);
	}

	User.islogin = false;
	User.username = '';
	return User;
}]);


serviceModule.factory('Code',['$http',function($http){
	var Code = {};
	Code.save = function(code,callback){
		$http.post(main.api_url+'/code/save',code).success(callback);
	}
	Code.update = function(code,callback){
		$http.post(main.api_url+'/code/update',code).success(callback);	
	}

	Code.getone  = function(param,callback) {
		$http.get(main.api_url+'/code/getone',{params:param}).success(callback);
	}
	Code.gethtml = function(param,callback) {
		$http.get(main.api_url+'/code/gethtml',{params:param}).success(callback);
	}
	Code.query  = function(param,callback){
		$http.get(main.api_url+'/code/list',{params:param}).success(callback);
	}

	Code.like = function(param,callback){
		$http.get(main.api_url+'/code/like',{params:param}).success(callback);
	}
	Code.fork = function(param,callback){
		$http.get(main.api_url+'/code/fork',{params:param}).success(callback);
	} 

	Code.queryall = function(param,callback){
		$http.post(main.api_url+'/code/queryall',param).success(callback);	
	}

	return Code;
}])

serviceModule.factory('Room',['$http',function($http){
	var Room={};
	Room.save = function(room,callback){
		$http.get(main.api_url+'/room/save',{params:room}).success(callback);
	}

	Room.list = function(param,callback){
		$http.get(main.api_url+'/room/list',{params:param}).success(callback);
	}

	Room.getone = function(param,callback){
		$http.get(main.api_url+'/room/getone',{params:param}).success(callback);
	}
	return Room;
}])


serviceModule.factory('Socket',['$rootScope',function($rootScope){
	var socket = io.connect('http://localhost:8000');
	return {
		on:function(eventname,callback,path){
			path = path?path:'/';
			socket.of(path).on(eventname,function(){
				var args = arguments;
				$rootScope.$apply(function(){
					callback.apply(socket,args);
				})
			})
		},
		emit:function(eventname,data,path){
			path = path?path:'/';
			socket.of(path).emit(eventname,data,function(){
				var args = arguments;
				$rootScope.$apply(function(){
					// if(callback){
					// 	callback.apply(socket,args);
					// }

				})
			})
		}
	}

}])
