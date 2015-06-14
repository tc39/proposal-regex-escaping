var Promise = require("bluebird");
var request = Promise.promisify(require("request"));
var cheerio = require("cheerio")
var fs = require("fs");
var api = "https://github.com/search";
var done = "&ref=searchresults&type=Code&utf8=%E2%9C%93";
Promise.coroutine(function*(){
	var items = [];
	for(var i = 0; i < 100; i++){ 
		console.log("Scraping page: " + api + "?l=javascript&q=eval+regexp&p="+ i + done)
		var data = yield request(api + "?l=javascript&q=eval+regex&p="+ i + done).get(1);
		var $ = cheerio.load(data);
		var res = $(".code-list-item").map(function(el){ 
			var el = $(this);
			return {
				title: el.find("p.title a").text(),
				codes: el.find("table.highlight tr").map(function(){
					return $(this).find(".blob-code-inner").text();
				}).get().filter(function(text){
					return (text.indexOf("eval") >= 0);
				}).filter(function(text){
					console.log(text);
					return (text.indexOf("/") >= 0) && (text.lastIndexOf("/") > text.indexOf("/"));
				})
			};
		}).get().filter(function(item){
			return item.codes.length > 0; // has any evals
		});
		items = items.concat(res);
		console.log("Got", items.length, "items. Page: ", i);
		yield Promise.delay(i % 5 * 2000 + (Math.random() * 500)); // play nice and delay
	}
	fs.writeFileSync("res.json", JSON.stringify(items));
})();

