'use strict';
//全局变量
var main =
    { api_url:'http://localhost:3000'

    };
var mode_file ={
    'css':'css/css.js',
    'less':'css/less_test.js',
    'js':'javascript/javascript.js',
    'htmlmixed':'htmlmixed/htmlmixed.js'
  }
var meta    = {
    'htmlmixed':'htmlmixed',
    'less':'css',
    'css':'css',
    'javascript':'javascript'
}  
var user_info;

angular
  .module('app', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'app.controller',
    'app.service',
    'app.directives'
  ])
  .config(function ($routeProvider,$httpProvider) { 
    $httpProvider.defaults.headers.common['Authorization']=getCookie('token');
    $routeProvider
      .when('/',{
        templateUrl:'views/list.html',
        controller:'CodelistController'
      })
      .when('/login',{
        templateUrl:'views/login.html',
        controller:'LoginController'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterController'
      })
      .when('/code',{
        templateUrl:'views/code.html',
        controller: 'CodeController'
      })
      .when('/code/:codeId',{
        templateUrl:'views/code_detail.html',
        controller:'CodedetailController'
      })
      .when('/show/:codeId',{
        templateUrl:'views/code_show.html',
        controller:'ShowController'
      })
      .when('/my/:username',{
        templateUrl:'views/my.html',
        controller:'MyController'
      })
      .when('/room',{
        templateUrl:'views/room.html',
        controller:'RoomController'
      })
      .when('/room/:roomid',{
        templateUrl:'views/oneroom.html',
        controller:'OneRoomController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

//cookie
function delCookie(name)//删除cookie
{
   document.cookie = name+"=;expires="+(new Date(0)).toGMTString();
}

function addCookie(objName,objValue,objHours){      //添加cookie
    var str = objName + "=" + escape(objValue);
    if(objHours > 0){                               //为时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours*3600*1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
   }
   document.cookie = str;
}

function getCookie(name)//取cookies函数        
{
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]); return null;
}








