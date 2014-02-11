var AWS = require('aws-sdk');
// AWS.config.region = 'us-east-1';
AWS.config.loadFromPath('./config.json');

var DryRun = false;
var ec2 = new AWS.EC2();
var request = new AWS.EC2().describeInstances();
var response;

request.on('success',function(resp){
	response = resp.data;
	var Instances = [];
	for (var i in response['Reservations']) {
		var reservation = response['Reservations'][i];
		for (var j in reservation['Instances']) {
			Instances.push(reservation['Instances'][j]['InstanceId']);
		};
	};
	var params = {
	  DryRun: DryRun, 
	  InstanceIds: Instances
	};
	ec2.terminateInstances(params,function(err,data){
		if (err) { console.log(err); }
	});
});

request.on('error',function(resp){
	console.log(resp);
})

console.log('sending request');
request.send();

