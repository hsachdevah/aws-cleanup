var config = require('./config.json');
var ec2 = require('./ec2/ec2.js');
var eip = require('./ec2/eip.js');


var AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-credentials.json');
config = JSON.parse(JSON.stringify(config));

var regions = config['regions'];


for(var region in regions){

	//Terminate EC2 instances
	if(regions[region]=="true"){
		ec2.clean(AWS,region);
		eip.clean(AWS,region);
	}

}