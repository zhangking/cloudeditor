var controllerModule =  angular.module('app.controller',['app.service','app']);

controllerModule.controller('IsloginController',['$scope','$http','$location','User',function($scope,$http,$location,User){
	$scope.User = User;
	User.checklogin();

	$scope.$watch('User.islogin',function(newVal,oldVal){
		$scope.islogin = User.islogin;
		$scope.username = User.username;
	});	
	
	$scope.logout = function(){
		delCookie('token');
		user_info = null;
		User.checklogin(function(){
			$location.path('/');	
		});
	}
}]);


//user
controllerModule.controller('RegisterController',['$scope','User','$location',function($scope,User,$location){
	$scope.User = User;
	$scope.doregister = function(user){
		$scope.User.save(user,function(data) {
			if(data.err == 1){

			}else{

				$location.path('/login');
			}
		})

  }

}])

controllerModule.controller('LoginController',['$scope','User','$location','$http',function($scope,User,$location,$http){
	$scope.User = User;
	$scope.dologin = function(user){
		$scope.User.login(user,function(data,status,headers){
			if(data.err){

			}else{
				addCookie('token',data[0].username,12);
				User.checklogin(function(){
					$location.path('/');
				});
			}
		})
  }
}])




 //code
controllerModule.controller('CodelistController',['$scope','Code','$sce','User',function($scope,Code,$sce,User){
	$scope.Code  = Code;
	$scope.User  = User;
		var render = function(){
		Code.query({share:1},function(ret){
			for(var i in ret){
				var i_url = "/#/show/"+ret[i]._id;
				var c_url = "/#/code/"+ret[i]._id;
				ret[i].i_url = $sce.trustAsResourceUrl(i_url);
				ret[i].c_url = $sce.trustAsResourceUrl(c_url);
				if(user_info && user_info.fork && user_info.fork.indexOf(ret[i]._id)!=-1){
					ret[i].isfork = true;
				}else{
					ret[i].isfork = false;
				}
				if(user_info && user_info.like && user_info.like.indexOf(ret[i]._id)!=-1){
					ret[i].islike = true;
				}else{
					ret[i].islike = false;
				}
				if(user_info && user_info.username == ret[i].owner){
					ret[i].isowner = true;
				}else{
					ret[i].isowner =false;
				}
			}

			var total_page = Math.floor(ret.length/6)+1;
			var pages = [];
			for(var i = 0;i<total_page;i++){
				pages[i]={index:i+1}
			}
			$scope.total = total_page;
			$scope.pages = pages;
			$scope.list  = ret; 
			$scope.currpage = 1;	
			$scope.codes = $scope.list.slice(6*($scope.currpage-1),6*($scope.currpage-1)+6);		
	});
	}

	$scope.$watch('User.islogin',render);	

	$scope.like = function(id){
		if(!user_info){
			alert('请先登录');
			return;
		}
		var content = {
			id:user_info._id,
			like : id
		}
		User.like(content,function(ret){
			if(ret.err){
				alert(ret.err);
			}else{
				for(var i in $scope.codes){
					if($scope.codes[i]._id == id){
						$scope.codes[i].islike = true;
					}
				}
			}
		})
		Code.like({id:id},function(ret){
			for(var i in $scope.codes){
				if($scope.codes[i]._id == id){
					$scope.codes[i].like+=1;
				}
			}
		})
	}

	$scope.fork = function(id){
		if(!user_info){
			alert('请先登录');
			return;
		}

		var content = {
			id : user_info._id,
			fork : id
		}
		User.fork(content,function(ret){
			if(ret.err){
				alert(ret.err);
			}else{
				for(var i in $scope.codes){
					if($scope.codes[i]._id == id){
						$scope.codes[i].isfork = true;
					}
				}
			}
		})
		Code.fork({id:id},function(ret){
			for(var i in $scope.codes){
				if($scope.codes[i]._id == id){
					$scope.codes[i].fork+=1;
				}
			}
		})
	}	

	$scope.go = function(index){
		$scope.currpage = index;
	}
	$scope.prev = function(){
		if($scope.currpage!=1){
			$scope.currpage++;
		}
	}
	$scope.next = function(){
		if($scope.currpage!=$scope.total){
			$scope.currpage--;
		}
	}

	$scope.$watch('currpage',function(){
		if($scope.list){
			$scope.codes = $scope.list.slice(6*($scope.currpage-1),6*($scope.currpage-1)+6);
		}
	})
	//
	$('.mask').live('mouseover',function(){
		$(this).find('.intro').show();
		$(this).find('.btn-group').show();
	})

	$('.mask').live('mouseout',function(){
		$(this).find('.intro').hide();
		$(this).find('.btn-group').hide();
	})

}])

controllerModule.controller('ShowController',['$scope','$routeParams','Code',function($scope,$routeParams,Code){
	$scope.Code =Code;
	$scope.codeid = $routeParams.codeId;
	Code.gethtml({'id':$scope.codeid},function(ret){
		document.write(ret);
		$(window.frameElement).attr('class','show');
	}); 
}])

controllerModule.controller('CodedetailController',['$scope','Code','$location','$routeParams','Socket','User',function($scope,Code,$location,$routeParams,Socket,User){
	var editors = new Array(3);
	var array   = ['html','css','js']; 
	$scope.Code =Code;
	$scope.codeid = $routeParams.codeId;
	$scope.isowner = false;
	$scope.isshare = true;
	$scope.isfork  = true;
	$scope.User = User;

	$scope.codemode = [
		'htmlmixed',
		'css',
		'javascript'
	];
	$scope.autorun = true;
	$scope.theme = 'default';
	$scope.keymap = 'sublime';

	$("input[type='radio']").live('change',function(){
		var mode = $(".radio.checked");
		for(var i=0;i<3;i++){
			if(!$(mode[i]).find('input').val())
				return;
		}
		$scope.codemode = [
			$(mode[0]).find('input').val(),
			$(mode[1]).find('input').val(),
			$(mode[2]).find('input').val()
		]
		$scope.theme = $(mode[3]).find('input').val(); 
		$scope.keymap = $(mode[4]).find('input').val(); 
		edit();

	})

	Socket.on('code',function(message){
		var d = getIframeDocument($('iframe')[0]);
		d.open();
		d.write(message.ret);	
		d.close();
	})

	$scope.save = function(){
		var content = getcode(editors,$scope.codemode);
		content.id  = $scope.codeid;
		Code.update(content,function(ret){
			if(ret.err){
				alert(ret.err);
			}
			else{
				alert('ok');
			}
		})
	}

	$scope.share = function(){
		var content = {
			id:$scope.codeid,
			share:'1'
		}
		Code.update(content,function(ret) {
			if(ret.err){
				alret(ret.err);
			}else{
				$scope.isshare = true;
				alert('ok');
			}

		})
	}

	$scope.fork = function(){
		if(!user_info){
			alert('请先登录');
			return;
		}
		var content = {
			id : user_info._id,
			fork : $scope.codeid
		}
		User.fork(content,function(ret){
			if(ret.err){
				alert(ret.err);
			}else{
				$scope.isfork = true;
				alert('ok');
			}
		})
	}

	var change = function(){
		if($scope.autorun){
		var content = getcode(editors,$scope.codemode);
		Socket.emit('code',{code:content});
		}
	}
	$scope.auto = function(){
		$scope.autorun = !$scope.autorun;
	}
	$scope.run = function(){
		var content = getcode(editors,$scope.codemode);
		Socket.emit('code',{code:content});
	}

	var edit = function(newVal,oldVal){
		for(var i=0;i<3;i++){
			if(editors[i]){
				editors[i].setOption('mode',$scope.codemode[i]);
				if($scope.theme)
				editors[i].setOption("theme", $scope.theme);
				if($scope.keymap){
				editors[i].setOption("keyMap", $scope.keymap);
				}
			}else{
			editors[i] = CodeMirror.fromTextArea($('#'+array[i])[0],{
						theme:$scope.theme,
						mode:meta[$scope.codemode[i]],
						lineNumbers:true,
						styleActiveLine:true,
						matchBrackets:true,
						smartIndent:true,
						indentWithTabs:true,
						lineWrapping:true,
						keyMap:$scope.keymap
				});
			editors[i].on('change',change);
			editors[i].setSize('height','800px');
			}
		}
	}

	Code.getone({'id':$scope.codeid},function(ret){
		$scope.codemode = ret[3];
		edit();
		for(var i in $scope.codemode){
			$("input[value='"+$scope.codemode[i]+"'").attr('checked',true).parent().addClass('checked');
		}
		for(var i in editors){
			editors[i].setValue(ret[i]);
		}
		if(user_info && ret.owner == user_info.username){
			$scope.isowner = true;
		}else{
			$scope.isowner = false;
		}
		if(ret.share){
			$scope.isshare = true;
		}else{
			$scope.isshare = false;
		}
		if(user_info && user_info.fork && user_info.fork.indexOf($scope.codeid)!=-1){
			$scope.isfork = true;
		}else{
			$scope.isfork = false;
		}
	}); 
	slideinit();

}]);

controllerModule.controller('CodeController',['$scope','Code','$location','Socket',function($scope,Code,$location,Socket){
	var editors = new Array(3);
	var array   = ['html','css','js'];
	$scope.theme = 'default';
	$scope.Code =Code;
	$scope.codemode = [
		'htmlmixed',
		'css',
		'javascript'
	];
	$scope.autorun = true;
	$scope.keymap = 'sublime';

	$("input[type='radio']").live('change',function(){
		var mode = $(".radio.checked");
		$scope.codemode = [
			$(mode[0]).find('input').val(),
			$(mode[1]).find('input').val(),
			$(mode[2]).find('input').val()
		]
		$scope.theme = $(mode[3]).find('input').val();
		$scope.keymap = $(mode[4]).find('input').val();
		edit();
	})
	$scope.auto=function(){
		$scope.autorun = !$scope.autorun; 
	}


	Socket.on('code',function(message){
		console.log(message);
		var d = getIframeDocument($('iframe')[0]);
		d.open();
		d.write(message.ret);	
		d.close();
	})
	var change = function(){
		if($scope.autorun){
		var content = getcode(editors,$scope.codemode);
		Socket.emit('code',{code:content});
		}
	}

	$scope.run = function(){
		var content = getcode(editors,$scope.codemode);
		Socket.emit('code',{code:content});
	}

	//按钮
	$scope.save = function(){
		var content = getcode(editors,$scope.codemode);
		content.owner = getCookie('token');
		Code.save(content,function(ret){
			if(ret.err){
				alert(ret.err);
			}
			else{
				$location.path('/code/'+ret[0]._id);
			}
		})
	}


	var edit = function(newVal,oldVal){
		for(var i = 0;i<3;i++){
			if(editors[i]){
				editors[i].setOption('mode',$scope.codemode[i]);
				if($scope.theme)
				editors[i].setOption("theme", $scope.theme);
				if($scope.keymap)
				editors[i].setOption("keyMap", $scope.keymap);
			}else{
				editors[i] = CodeMirror.fromTextArea($('#'+array[i])[0],{
						theme:$scope.theme,
						mode:meta[$scope.codemode[i]],
						lineNumbers:true,
						styleActiveLine:true,
						matchBrackets:true,
						smartIndent:true,
						indentWithTabs:true,
						keyMap:$scope.keymap
				})
				editors[i].on('change',change);
				editors[i].setSize('height','800px');
			}
		}
	}
	edit();
	//slide
	slideinit();

}])


controllerModule.controller('MyController',['$scope','Code','$sce','User','$routeParams','$location',function($scope,Code,$sce,User,$routeParams,$location){
	$scope.Code  = Code;
	$scope.User  = User;
	
	$scope.username = $routeParams.username;
	User.getone({username:$scope.username},function(ret){

		Code.query({owner:ret[0].username},rendermy);	

		var fork = ret[0].fork;
		if(fork.length > 0){
			Code.queryall({key:'_id',value:fork},renderfork);	
		
		}
	})

		var rendermy = function(ret){
			for(var i in ret){
				var i_url = "/#/show/"+ret[i]._id;
				var c_url = "/#/code/"+ret[i]._id;
				ret[i].i_url = $sce.trustAsResourceUrl(i_url);
				ret[i].c_url = $sce.trustAsResourceUrl(c_url);
				if(user_info && user_info.fork && user_info.fork.indexOf(ret[i]._id)!=-1){
					ret[i].isfork = true;
				}else{
					ret[i].isfork = false;
				}
				if(user_info && user_info.like && user_info.like.indexOf(ret[i]._id)!=-1){
					ret[i].islike = true;
				}else{
					ret[i].islike = false;
				}
				if(user_info && user_info.username == ret[i].owner){
					ret[i].isowner = true;
				}else{
					ret[i].isowner =false;
				}
			}
			$scope.mycodes = ret;

	}
			var renderfork = function(ret){
			for(var i in ret){
				var i_url = "/#/show/"+ret[i]._id;
				var c_url = "/#/code/"+ret[i]._id;
				ret[i].i_url = $sce.trustAsResourceUrl(i_url);
				ret[i].c_url = $sce.trustAsResourceUrl(c_url);
				if(user_info && user_info.fork && user_info.fork.indexOf(ret[i]._id)!=-1){
					ret[i].isfork = true;
				}else{
					ret[i].isfork = false;
				}
				if(user_info && user_info.like && user_info.like.indexOf(ret[i]._id)!=-1){
					ret[i].islike = true;
				}else{
					ret[i].islike = false;
				}
				if(user_info && user_info.username == ret[i].owner){
					ret[i].isowner = true;
				}else{
					ret[i].isowner =false;
				}
			}
			$scope.forkcodes = ret;

	}

	$scope.like = function(id,tar){
		if(!user_info){
			alert('请先登录');
			return;
		}
		var content = {
			id:user_info._id,
			like : id
		}
		User.like(content,function(ret){
			if(ret.err){
				alert(ret.err);
			}else{
				if(tar == 'my'){
				for(var i in $scope.mycodes){
					if($scope.mycodes[i]._id == id){
						$scope.mycodes[i].islike = true;
					}
				}
				}else{
					for(var i in $scope.forkcodes){
					if($scope.forkcodes[i]._id == id){
						$scope.forkcodes[i].islike = true;
					}
				}

				}
			}
		})
		Code.like({id:id},function(ret){
			if(tar == 'my'){
				for(var i in $scope.mycodes){
					if($scope.mycodes[i]._id == id){
						$scope.mycodes[i].like += 1;
					}
				}
				}else{
					for(var i in $scope.forkcodes){
					if($scope.forkcodes[i]._id == id){
						$scope.forkcodes[i].like += 1;
					}
				}

				}
		})
	}

	$scope.fork = function(id,tar){
		if(!user_info){
			alert('请先登录');
			return;
		}

		var content = {
			id : user_info._id,
			fork : id
		}
		User.fork(content,function(ret){
			if(ret.err){
				alert(ret.err);
			}else{
				if(tar == 'my'){
				for(var i in $scope.mycodes){
					if($scope.mycodes[i]._id == id){
						$scope.mycodes[i].isfork = true;
					}
				}
				}else{
					for(var i in $scope.forkcodes){
					if($scope.forkcodes[i]._id == id){
						$scope.forkcodes[i].isfork = true;
					}
				}

				}
			}
		})
		Code.fork({id:id},function(ret){
			if(tar == 'my'){
				for(var i in $scope.mycodes){
					if($scope.mycodes[i]._id == id){
						$scope.mycodes[i].fork += 1;
					}
				}
				}else{
					for(var i in $scope.forkcodes){
					if($scope.forkcodes[i]._id == id){
						$scope.forkcodes[i].fork += 1;
					}
				}

				}
		})
	}	

	//
	$('.mask').live('mouseover',function(){
		$(this).find('.intro').show();
		$(this).find('.btn-group').show();
	})

	$('.mask').live('mouseout',function(){
		$(this).find('.intro').hide();
		$(this).find('.btn-group').hide();
	})

}])
controllerModule.controller('RoomController',['Room','$scope','$location',function(Room,$scope,$location){
	$scope.iscreate = false;

	Room.list({},function(ret){
		$scope.rooms = ret;
	})

	$scope.tocreate = function(){
		if(user_info){
		$scope.iscreate = !$scope.iscreate; 
		}else{
			alert('请先登录');
		}
	}
	$scope.create = function(room){
		if(!user_info){
			return;
		}
		room.owner = user_info.username;
		Room.save(room,function(ret){
			$location.path('/room/'+ret[0]._id);
		})
	}

}])

controllerModule.controller('OneRoomController',['Room','$scope','$routeParams','Socket','Code',function(Room,$scope,$routeParams,Socket,Code){
	$scope.roomid = $routeParams.roomid;
	$scope.isowner =  false;
	var editors = new Array(3);
	var array   = ['html','css','js'];
	
	$scope.Code =Code;
	$scope.codemode = [
		'htmlmixed',
		'css',
		'javascript'
	];
	$scope.autorun = true;
	$scope.theme = 'default';
	$scope.keymap = 'sublime';

	$("input[type='radio']").live('change',function(){
		var mode = $(".radio.checked");
		$scope.codemode = [
			$(mode[0]).find('input').val(),
			$(mode[1]).find('input').val(),
			$(mode[2]).find('input').val()
		]
		$scope.theme = $(mode[3]).find('input').val(); 
		$scope.keymap = $(mode[4]).find('input').val();
		edit();
	})

	$('#show_com').click(function(){
		$(this).hide();
		$('#comment_div').show();
		$('.c_mask').show();
	})
	$('#hide_com').click(function(){
		$('#comment_div').hide();
		$('.c_mask').hide();
		$('#show_com').show();	
	})

	$('.opt_change').find('div').bind('click',function(){
	if($scope.isowner){	
		var klass = $(this).attr('class').split(' ')[0];
		Socket.emit('click',{room:$scope.roomid,param:klass},'/room');
	}
	})

	Socket.on('click',function(ret){
		if(!$scope.isowner){
			$('.'+ret.param).click();			
		}
	},'/room');

	Socket.on('add',function(ret){
		if($scope.isowner){
			var content = getcode(editors,$scope.codemode);
			Socket.emit('code',{room:$scope.roomid,code:content},'/room');
		}
	},'/room');

	Socket.on('code',function(message){
		var d = getIframeDocument($('iframe')[0]);
		d.open();
		d.write(message.ret);	
		d.close();
		if(!$scope.isowner){
			for(var i =0;i<3;i++){
				editors[i].getDoc().setValue(message.ori[i]);
			}
		}

	},'/room');

	var change = function(){
		if($scope.isowner && $scope.autorun){
			var content = getcode(editors,$scope.codemode);
			Socket.emit('code',{room:$scope.roomid,code:content},'/room');
		}
	}
	
	$scope.auto = function(){
		$scope.autorun = !$scope.autorun;
	}

	$scope.run = function(){
		var content = getcode(editors,$scope.codemode);
		Socket.emit('code',{room:$scope.roomid,code:content},'/room');
	}

	Room.getone({id:$scope.roomid},function(ret){
		$scope.owner = ret.owner;
		if(user_info && $scope.owner == user_info.username){
			$scope.isowner = true;
		}
		slideinit();
	})

	Socket.emit('add',$scope.roomid,'/room');

	$scope.comment = function(text){
		$('.comment').find('input').val('');
		$scope.comment_text = '';
		fly(text);
		Socket.emit('comment',{room:$scope.roomid,text:text},'/room');
	}
	$('html').keydown(function(event){
		if(event.keyCode == 13){
			$scope.comment($scope.comment_text);
		}

	})
	Socket.on('comment',function(ret){
		fly(ret.text);
	},'/room');

	var edit = function(newVal,oldVal){
		for(var i = 0;i<3;i++){
			if(editors[i]){
				editors[i].setOption('mode',$scope.codemode[i]);
				if($scope.theme){
					editors[i].setOption('theme',$scope.theme);
				}
				if($scope.keymap)
					editors[i].setOption('keyMap',$scope.keymap);
			}else{
				editors[i] = CodeMirror.fromTextArea($('#'+array[i])[0],{
						mode:meta[$scope.codemode[i]],
						lineNumbers:true,
						styleActiveLine:true,
						matchBrackets:true,
						smartIndent:true,
						indentWithTabs:true,
						keyMap:$scope.keymap
						//readOnly:!$scope.isowner
				})
				editors[i].on('change',change);
				editors[i].setSize('height','800px');
			}
		}
	}
	edit();


}])

//code 公共函数
	var getcode= function(editors,mode){
		var content = {};
		for(var i =0;i<3;i++){
			content[i] = editors[i].getValue();
		}
		content[3] = mode;
		return content;
	}

	var fly = function(text){
		var div = $('<div>'+text+'</div>');
		$('.c_mask').find('.container').append(div);
		var x = Math.random()*250;
		var y = Math.random()*1200;
		var s = Math.random()*30;
		if(div.width()+y>1200){
			y-=div.width();
		}
		div.css({'top':x+'px','left':y+'px','font-size':0});
		div.animate({'font-size':s})
		setTimeout(function(){
			div.remove();
		},5000);
	}

	var slideinit = function(){
		$('.opt_bar .arrow').toggle(function(){
				$('.opt_bar').animate({'left':'0px'});
				$(this).removeClass('fui-arrow-right').addClass('fui-arrow-left');
			},
			function(){
				$('.opt_bar').animate({'left':'-270px'});
				$(this).removeClass('fui-arrow-left').addClass('fui-arrow-right');
			})
		$(':radio').radio();
		$('.opt_change').find('div').bind('click',function(){
		$('.opt_change').find('div').removeClass('select');
		$('.box').addClass('hide');
		$('.'+$(this).attr('class')).removeClass('hide');
		$(this).addClass('select');
	})
		$('#auto').bind('click',function(){
			if($(this).hasClass('btn-primary')){
				$(this).removeClass('btn-primary').addClass('btn-default');
			}else{
				$(this).addClass('btn-primary').removeClass('btn-default')
			}
		})
	}

	var getIframeDocument = function(element) {
    	return  element.contentDocument || element.contentWindow.document;
	};
