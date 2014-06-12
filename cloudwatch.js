var clean = function clean(AWS,region){
	var cw = new AWS.CloudWatch({region:region});
	var describeAlarms = cw.describeAlarms();

	describeAlarms.on('success',function(resp){

		if(resp.data.MetricAlarms.length>0){
			for(var a in resp.data.MetricAlarms){
				var Namespace = resp.data.MetricAlarms[a].Namespace;
				var Alarms = new Array(); //AlarmName
				if(Namespace != 'AWS/Billing'){
					Alarms.push(resp.data.MetricAlarms[a].AlarmName);
				}
			}	
			if(Alarms.length>0)
				deleteAlarms(AWS,region,Alarms);
		};
	});

	describeAlarms.on('error',function(resp){

		// if(resp['code']=='AccessDenied')
		// 	console.log('ERROR: Access denied to describe AutoScaling Groups in',region);
		// else{
			console.log('Error occured while describing CloudWatch Alarms: ');
			console.log(resp);	
		// }
		
	});

	describeAlarms.send();
};
module.exports.clean = clean;

var deleteAlarms = function(AWS,region,AlarmNames){
	var params = {
	  AlarmNames: AlarmNames,
	};

	var cw = new AWS.CloudWatch({region:region});
	var deleteAlarms = cw.deleteAlarms(params);

	deleteAlarms.on('error',function(resp){
		console.log('Error occured while deleting CloudWatch alarm in region',region);
		console.log(resp);
	});

	deleteAlarms.on('success',function(resp){
		console.log('Successfully deleted CloudWatch alarms from region',region);
		// console.log(resp);
	});
	deleteAlarms.send();
}