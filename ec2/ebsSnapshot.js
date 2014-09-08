var clean = function clean(AWS,region,accoutId,days){
	var params = {
		Filters: [
			{
				Name: 'owner-id',
				Values: [accoutId]
			}
		]
	};
	var ec2 = new AWS.EC2({region:region});
	var describeSnapshots = ec2.describeSnapshots(params);

	describeSnapshots.on('success',function(resp){
		if(resp.data.Snapshots.length>0){
			for(var v in resp.data.Snapshots){
				var SnapId = resp.data.Snapshots[v].SnapshotId;
				var StartTime = resp.data.Snapshots[v].StartTime;
				var noOfDays = (Date.now() - Date.parse(StartTime))/86400000
				if(noOfDays > days){
					deleteSnapshot(AWS,region,SnapId);
					// console.log(SnapId,':',noOfDays);
				}
			}
		}
	});

	describeSnapshots.on('error',function(resp){
		if(resp['code']=='UnauthorizedOperation')
			console.log('ERROR: Access denied to describe EBS Volumes in',region);
		else{
			console.log('Error occured while describing EBS Volume: ');
			console.log(resp);	
		}
	});

	describeSnapshots.send();
};
module.exports.clean = clean;

var deleteSnapshot = function(AWS,region,SnapshotId){
	var params = {
		SnapshotId: SnapshotId
	};

	var ec2 = new AWS.EC2({region:region});
	var deleteSnapshot = ec2.deleteSnapshot(params);

	deleteSnapshot.on('error',function(resp){
		if(resp.code!='InvalidSnapshot.InUse'){
			console.log('Error occured while deleting EBS-Snapshot:',SnapshotId,'in',region);
			console.log(resp);	
		}		
	});
	deleteSnapshot.on('success',function(resp){
		console.log('Successfully deleted EBS snapshot',SnapshotId,'from region',region);
		// console.log(resp);
	});
	deleteSnapshot.send();
}
