var clean = function clean(AWS,region){
	var sns = new AWS.SNS({region:region});
	var listTopics = sns.listTopics();

	listTopics.on('success',function(resp){
		if (resp.data.Topics.length>0) {
			for(var t in resp.data.Topics){
				var topicARN = resp.data.Topics[t].TopicArn;
				deleteTopic(AWS,region,topicARN);
			}
		};
	});

	listTopics.on('error',function(resp){
		if(resp['code']=='UnauthorizedOperation')
			console.log('ERROR: Access denied to list SNS topics in',region);
		else{
			console.log('Error occured while listing SNS topics: ');
			console.log(resp);	
		}
	});

	listTopics.send();
};
module.exports.clean = clean;

var deleteTopic = function(AWS,region,topicARN){
	var params = {
		TopicArn: topicARN
	};

	var sns = new AWS.SNS({region:region});
	var deleteTopic = sns.deleteTopic(params);

	deleteTopic.on('error',function(resp){
		console.log('Error occured while deleting SNS topic: ');
		console.log(resp);
	});
	deleteTopic.on('success',function(resp){
		console.log('Successfully deleted SNS Topic',topicARN);
		// console.log(resp);
	});
	deleteTopic.send();
}
