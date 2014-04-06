var DryRun = false;

var clean = function clean(AWS,region){
	var rds = new AWS.RDS({region:region});
	var describeDBInstances = rds.describeDBInstances();

	describeDBInstances.on('success',function(resp){
		var response = resp.data;
		var Instances = new Array();

		for(var i in response['DBInstances']){
			if(response['DBInstances'][i]['DBInstanceStatus'] == 'available'){
				var DBInstanceIdentifier = response['DBInstances'][i]['DBInstanceIdentifier'];
				deleteIstances(AWS,region,DBInstanceIdentifier);
			}
		}

		if(Instances.length > 0)
			deleteIstances(AWS,region,Instances);
		
	});

	describeDBInstances.on('error',function(resp){
			console.log('Error occured while describing DB Instances: ');
			console.log(resp);
	});
	describeDBInstances.send();
}
module.exports.clean = clean;

var deleteIstances = function(AWS,region, DBInstanceIdentifier){
	var params = {
			  DBInstanceIdentifier: DBInstanceIdentifier,
			  SkipFinalSnapshot: true
			};
	var rds = new AWS.RDS({region:region});
	var deleteDBInstance = rds.deleteDBInstance(params);

	deleteDBInstance.on('success',function(resp){
		console.log('Successfully deleted',DBInstanceIdentifier,'DB Instance from',region,'region');
	});

	deleteDBInstance.on('error',function(resp){
		console.log('Error occured while terminating Instances: ');
		console.log(resp);
	});

	deleteDBInstance.send();
}