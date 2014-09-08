var DryRun = false;

var clean = function clean(AWS,region){
	var ec2 = new AWS.EC2({region:region});
	var describeInstances = ec2.describeInstances();

	describeInstances.on('success',function(resp){
		
		var response = resp.data;

		// Get list of instances
		for (var i in response['Reservations']) {
			var reservation = response['Reservations'][i];
			for (var j in reservation['Instances']) {
				// console.log(reservation['Instances'][j]);
				if (reservation['Instances'][j]['State']['Name']=='running') {
					var InstanceId = reservation['Instances'][j]['InstanceId'];
					setForTermination(AWS,region,InstanceId);
				};
			};
		};

	});

	describeInstances.on('error',function(resp){
			if(resp['code']=='UnauthorizedOperation')
				console.log('ERROR: Access denied to describe instances in',region);
			else{
				console.log('Error occured while describing Instances: ');
				console.log(resp);	
			}
			
	});

	describeInstances.send();
}
module.exports.clean = clean;


var setForTermination = function(AWS,region,InstanceId){
	var params = {
	  Attribute: 'disableApiTermination', /* required */
	  InstanceId: InstanceId, /* required */
	};

	var Instances = new Array();
	var ec2 = new AWS.EC2({region:region});
	var describeInstanceAttribute = ec2.describeInstanceAttribute(params);

	describeInstanceAttribute.on('success',function(resp){
		if(resp.data.DisableApiTermination.Value == false){
			Instances.push(InstanceId);
			terminate(AWS,region,Instances);
		}
		else{
			console.log('WARNING: EC2 instance',InstanceId,'in',region,'has Termination Protection Enabled');
		}

	});

	describeInstanceAttribute.on('error',function(resp){
		console.log('Error Attribute: ',resp);
	});

	describeInstanceAttribute.send();
}



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
}
