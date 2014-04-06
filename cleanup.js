var AWS = require('aws-sdk');
var config = require('./config.json');
var ec2 = require('./ec2/ec2.js');
var eip = require('./ec2/eip.js');
var elb = require('./ec2/elb.js');
var rds = require('./rds/rds.js');
var prompt = require('prompt');
var fs = require('fs');

config = JSON.parse(JSON.stringify(config));
var cred = {};

if (fs.existsSync('./aws-credentials.json')) {
    AWS.config.loadFromPath('./aws-credentials.json');
    confirm();
}
else{
	prompt.start();
	prompt.get(['AWS_Access_Key', 'AWS_Secret_Access_Key'], function (err, result) {
		cred['accessKeyId'] = result.AWS_Access_Key;
		cred['secretAccessKey'] = result.AWS_Secret_Access_Key;
		cred['region'] = "us-east-1";
		
		AWS.config.update(cred);
		confirm();
	});
	
}

function confirm(){
	console.log('WARNING: You are about to delete your AWS resources permanently. Are you sure you want to proceed?')
	var property = {
		name: 'yesno',
		message: 'yes/no?',
		validator: /y[es]*|n[o]?/,
		warning: 'Must respond yes or no',
		default: 'no'
	};
	prompt.get(property, function (err, result) {
		if(result.yesno == 'yes' || result.yesno == 'y')
			clean();
	});
}

function clean(){
	var regions = config['regions'];
	console.log("Starting cleanup process ...");
	for(var region in regions){
		if(regions[region]=="true"){
			ec2.clean(AWS,region);
			eip.clean(AWS,region);
			elb.clean(AWS,region);
			rds.clean(AWS,region);
		}
	}	
}