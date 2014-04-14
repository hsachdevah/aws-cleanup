var clean = function clean(AWS,region){
	var elb = new AWS.ELB({region:region});
	var describeLoadBalancers = elb.describeLoadBalancers();


	describeLoadBalancers.on('success',function(resp){
		if (resp.data.LoadBalancerDescriptions.length>0) {
			for(var lb in resp.data.LoadBalancerDescriptions){
				var name  = resp.data.LoadBalancerDescriptions[lb].LoadBalancerName;
				deleteELB(AWS,region,name);
			}
		}

	});

	describeLoadBalancers.on('error',function(resp){
		if(resp['code']=='AccessDenied')
			console.log('ERROR: Access denied to describe load balancers in',region);
		else{
			console.log('Error occured while describing Balancers: ');
			console.log(resp);	
		}
	});

	describeLoadBalancers.send()
}
module.exports.clean = clean;


var deleteELB = function(AWS,region,name){
	var params = {
	  LoadBalancerName: name // required
	};

	var elb = new AWS.ELB({region:region});
	var deleteLoadBalancer = elb.deleteLoadBalancer(params);

	
	deleteLoadBalancer.on('error',function(resp){
		console.log('Error occured while deleting ELB: ');
		console.log(resp);
	});
	deleteLoadBalancer.on('success',function(resp){
		console.log('Successfully deleted ELB',name,'from region',region);
		// console.log(resp);
	});
	deleteLoadBalancer.send();
}

