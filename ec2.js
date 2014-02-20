var AWS = require('aws-sdk');
// AWS.config.region = 'us-east-1';
AWS.config.loadFromPath('./config.json');

var regions = ['us-east-1','us-west-1','us-west-2','eu-west-1','sa-east-1',
                'ap-southeast-2','ap-northeast-1'];

var DryRun = false;

for (var r in regions) {
	var ec2 = new AWS.EC2({region:regions[r]});
	var describeInstances = ec2.describeInstances();
	var describeAddresses = ec2.describeAddresses(); //For Elastic IPs
	

	describeInstances.on('success',function(resp){
		var Instances = new Array();		
		var response = resp.data;
		var region;

		for (var i in response['Reservations']) {
			var reservation = response['Reservations'][i];
			for (var j in reservation['Instances']) {
				if (reservation['Instances'][j]['State']['Name']=='running') {
					Instances.push(reservation['Instances'][j]['InstanceId']);
				};
				region = response['Reservations'][0]['Instances'][0]['Placement']['AvailabilityZone'].slice(0,-1);
				// console.log(reservation['Instances'][j]['InstanceId'],'-',reservation['Instances'][j]['State']['Name'],
				// 	response['Reservations'][0]['Instances'][0]['Placement']['AvailabilityZone'],Instances.length);
			};
		};
		console.log('Terminating',Instances.length,'Instances in',region,'region');

		if (Instances.length > 0 ) {	

			var params = {
			  DryRun: DryRun,
			  InstanceIds: Instances
			};

			console.log(Instances);
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
		};
	});

	describeInstances.on('error',function(resp){
		console.log('Error occured while describing Instances: ');
		console.log(resp);
	})

	describeAddresses.on('success',function(resp){
		if (resp.data.Addresses.length>0) {
			var region = resp.request.httpRequest.region;
			// console.log(resp.data);
			for(var a in resp.data.Addresses){
				if(resp.data.Addresses[a].Domain=='vpc'){
					var AllocationId = resp.data.Addresses[a].AllocationId;
					var params = {
					  AllocationId: AllocationId
					  // PublicIp: '54.206.69.145'
					};

					console.log(region);
					var ec2 = new AWS.EC2({region:region});
					var releaseAddress = ec2.releaseAddress(params);

					releaseAddress.on('error',function(resp){
						console.log('Error occured while releasing Network Addresses: ');
						console.log(releaseAddress);
						console.log(resp);
					});
					releaseAddress.on('success',function(resp){
						console.log('Successfully released EIP');
						// console.log(resp);
					});
					releaseAddress.send();
				};
			}
		};
		
	})

	describeAddresses.on('error',function(resp){
		console.log('Error occured while describing Network Addresses: ');
		console.log(resp);
	})

	describeInstances.send();
	describeAddresses.send();
};
