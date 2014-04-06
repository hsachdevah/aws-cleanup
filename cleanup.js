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
    clean()
}
else{
	prompt.start();
	prompt.get(['AWS_Access_Key', 'AWS_Secret_Access_Key'], function (err, result) {
		cred['accessKeyId'] = result.AWS_Access_Key;
		cred['secretAccessKey'] = result.AWS_Secret_Access_Key;
		cred['region'] = "us-east-1";
		
		AWS.config.update(cred);
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