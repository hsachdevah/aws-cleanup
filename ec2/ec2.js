var DryRun = false;

var clean = function clean(AWS,region){
	var ec2 = new AWS.EC2({region:region});
	var describeInstances = ec2.describeInstances();

	describeInstances.on('success',function(resp){
		var Instances = new Array();		
		var response = resp.data;

		// Get list of instances
		for (var i in response['Reservations']) {
			var reservation = response['Reservations'][i];
			for (var j in reservation['Instances']) {
				if (reservation['Instances'][j]['State']['Name']=='running') {
					Instances.push(reservation['Instances'][j]['InstanceId']);
				};
			};
		};

		if(Instances.length > 0)
			terminate(AWS,region,Instances);

		// for(var instance in Instances)
		// 	terminate(region,Instances[instance]);
	});

	describeInstances.on('error',function(resp){
			console.log('Error occured while describing Instances: ');
			console.log(resp);
	});

	describeInstances.send();
}
module.exports.clean = clean;

var terminate = function(AWS,region, Instances){

	var params = {
			  DryRun: DryRun,
			  InstanceIds: Instances
			};

	var ec2 = new AWS.EC2({region:region});
	var terminateInstances = ec2.terminateInstances(params);

	terminateInstances.on('success',function(resp){
		console.log('Successfully terminated',Instances.length,'Instances from ',region,'region');
	})

	terminateInstances.on('error',function(resp){
		console.log('Error occured while terminating Instances: ');
		console.log(resp);
	})

	terminateInstances.send();

	// console.log(region,instanceId);
}
