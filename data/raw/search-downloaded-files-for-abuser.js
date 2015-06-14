var Promise = require("bluebird");
var request = Promise.promisify(require("request"));
var cheerio = require("cheerio");
var fs = Promise.promisifyAll(require("fs"));

var glob = Promise.promisify(require("glob"));
var i = 1;
glob("./filesWithEval/*").map(function(file){
	return fs.readFileAsync(file).then(function(data){
		var content = data.toString();
		if(content.length < 10) return;
		if(/eval\(("|').*?\+.+?\)/.test(content)){
			//if(/eval\(("|')\()/.test(content)) return // json hax
			console.log(content.length);
			var j = i;
			i++;
			return fs.writeFileAsync("./anony/"+j+".js", data);
		} else {
			console.log("Sane!");
		}
	});
});
