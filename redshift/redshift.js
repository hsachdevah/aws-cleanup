var clean = function clean(AWS,region){
	var rs = new AWS.Redshift({region:region});
	var describeClusters = rs.describeClusters();

	describeClusters.on('success',function(resp){
		//Check if service is available in region
		if(resp['data']['Clusters'].length>0){
			for(var c in resp['data']['Clusters']){
				var clusterIdentifier = resp['data']['Clusters'][c]['ClusterIdentifier'];
				deleteCluster(AWS,region,clusterIdentifier);
			}
		}
	});

	describeClusters.on('error',function(resp){
		if(resp['code']=='UnauthorizedOperation')
			console.log('ERROR: Access denied to describe Redshift Clusters in',region);
		else if(resp['errno']=='ENOTFOUND'){
			console.log('Redshift service is not available in:',region);
		}
		else {
			console.log('Error occured while describing Redshift Cluster: ');
			console.log(resp);	
		}
	});

	describeClusters.send();
};
module.exports.clean = clean;

var deleteCluster = function(AWS,region,clusterIdentifier){
	var params = {
		ClusterIdentifier: clusterIdentifier,
		SkipFinalClusterSnapshot: true
	};

	var rs = new AWS.Redshift({region:region});
	var deleteCluster = rs.deleteCluster(params);

	deleteCluster.on('error',function(resp){
		console.log('Error occured while deleting resdhift cluster: ');
		console.log(resp);
	});
	deleteCluster.on('success',function(resp){
		console.log('Successfully Redshift Cluster',clusterIdentifier,'from region',region);
		// console.log(resp);
	});
	deleteCluster.send();
}
