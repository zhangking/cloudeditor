var less = require('less');

var renderless = function(code,callback){
	less.render(code, function (e, css) {
  	callback(css);
	});	
}


exports.renderless = renderless;