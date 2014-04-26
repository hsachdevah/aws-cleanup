var clean = function clean(AWS,region){
	var ec2 = new AWS.EC2({region:region});
	var describeVolumes = ec2.describeVolumes();

	describeVolumes.on('success',function(resp){
		if(resp['data']['Volumes'].length>0){
			for(var v in resp['data']['Volumes']){
				if(resp['data']['Volumes'][v]['State']=='available'){
					var volId = resp['data']['Volumes'][v]['VolumeId'];
					deleteVol(AWS,region,volId);
				}
				
			}
		}
	});

	describeVolumes.on('error',function(resp){
		if(resp['code']=='UnauthorizedOperation')
			console.log('ERROR: Access denied to describe EBS Volumes in',region);
		else{
			console.log('Error occured while describing EBS Volume: ');
			console.log(resp);	
		}
	});

	describeVolumes.send();
};
module.exports.clean = clean;

var deleteVol = function(AWS,region,volId){
	var params = {
		VolumeId: volId
	};

	var ec2 = new AWS.EC2({region:region});
	var deleteVolume = ec2.deleteVolume(params);

	deleteVolume.on('error',function(resp){
		console.log('Error occured while deleting EBS: ');
		console.log(resp);
	});
	deleteVolume.on('success',function(resp){
		console.log('Successfully deleted EBS volume',volId,'from region',region);
		// console.log(resp);
	});
	deleteVolume.send();
}
