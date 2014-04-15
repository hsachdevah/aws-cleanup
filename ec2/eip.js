var clean = function clean(AWS,region){
	var ec2 = new AWS.EC2({region:region});
	var describeAddresses = ec2.describeAddresses();

	describeAddresses.on('success',function(resp){
		if (resp.data.Addresses.length>0) {
			for(var a in resp.data.Addresses){
				if(resp.data.Addresses[a].Domain=='vpc'){
					var AllocationId = resp.data.Addresses[a].AllocationId;
					release(AWS,region,AllocationId);
				};
			}
		};
	});

	describeAddresses.on('error',function(resp){
		if(resp['code']=='UnauthorizedOperation')
			console.log('ERROR: Access denied to describe network addresses in',region);
		else{
			console.log('Error occured while describing Network Addresses: ');
			console.log(resp);	
		}
	});

	describeAddresses.send();
};
module.exports.clean = clean;

var release = function(AWS,region,AllocationId){
	var params = {
		AllocationId: AllocationId
		// PublicIp: '54.206.69.145'
	};

	var ec2 = new AWS.EC2({region:region});
	var releaseAddress = ec2.releaseAddress(params);

	releaseAddress.on('error',function(resp){
		console.log('Error occured while releasing Network Addresses: ');
		console.log(releaseAddress);
		console.log(resp);
	});
	releaseAddress.on('success',function(resp){
		console.log('Successfully released EIP from region',region);
		// console.log(resp);
	});
	releaseAddress.send();
}
