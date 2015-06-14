"use strict";
var Promise = require("bluebird");
var request = Promise.promisify(require("request"));
var cheerio = require("cheerio");
var glob = Promise.promisify(require("glob"));
var fs = Promise.promisifyAll(require("fs"));
var exec = Promise.promisify(require("child_process").exec);
var repl = require("repl");
var mostDependent = JSON.parse(fs.readFileSync("most-depended-packages-npm.json"));

global.current = [];

Promise.map(mostDependent, function(name){
	current.push(name);
	fs.appendFileAsync("scanned.txt", name +"\n");
	var folder = null;
	console.log("Checking for ", name);
	return exec("npm info " + name).then(function(data){
		console.log("got data for ", name);
		return {name: name, url: eval("("+data.join("")+")").repository.url };
	}).then(function(repoPair){
		console.log("Cloning ", name);
		var url = repoPair.url.replace("git+https","https");
		if(!url) return null;
		return exec("git clone " + url).return(repoPair);
	}).then(function(pair){
		if(!pair) return [];
		folder = pair.url.split("/").pop().replace(".git","");
		console.log("Cloned repo" + name + " walking " + folder);
		return exec("find ./" + folder +"/ | grep [.]js$");
	}).then(function(fileNames){
		if(fileNames.length === 0) return [];
		return fileNames[0].split("\n").filter(Boolean);
	}).map(function(file){
		return Promise.props({
			data: fs.readFileAsync(file),
			name: file
		});
	}).map(function(info){
		var asString = info.data.toString();
		if(asString.indexOf("eval") >= 0){
			console.log("found eval at file", info.name);
			var fname = info.name.replace(/[.]/,"-").replace(/\//g, ".");
			return fs.writeFileAsync("filesWithEval/repo-"+name+"$"+fname+".js", asString);
		}
	}).then(function(){
		if(!folder) return;
		console.log("Deleting repo " + name);
		return exec("rm -rf ./" + folder +"");
	}).return(undefined).timeout(60000).catch(Promise.TimeoutError, function(e){
		console.log("Timeout error for repo " + name);
		throw e;
	}).catch(function(err){
		fs.appendFileAsync("errors.txt", name + "\n");
		return false; 
	}).finally(function(){
		current = current.filter(function(el){ return el !== name; });
	});
}, {concurrency: 10}).then(function(res){
	console.log(res);
});


repl.start({
  prompt: "node via stdin> ",
  input: process.stdin,
  output: process.stdout,
  useGlobal: true
});
