# aws-cleanup

This project helps to terminate/delete all the resources in a given AWS account.

This is particularly useful if you are learning to work with AWS & don't want to accidentally leave any service in running state only to find out that you have been charged on your credit card at month end.

## Installing

You would require node.js installed on your system to use aws-cleanup. In case its not already installed, you can get it from here: http://nodejs.org/

You also need ```npm``` installed on your system so that required dependencies can be downloaded. Install it from the instructions provided at this site : https://www.npmjs.org/

If these are successfully installed, you should be able to get a valid results from the commands below

```sh
node -v
npm -v
```

You can get the code & required modules (including AWS-SDK for node.js) by executing the following commands

```sh
git clone https://github.com/hsachdevah/aws-cleanup.git
cd aws-cleanup
npm install
```
You can execute the cleanup task by running cleanup.js. You would be asked to provide access-key & secret-access-key, please make sure you have all the required permissions for terminating/deleting resources.

```sh
node cleanup.js
```

<strong>Note</strong>: You can also store credentials locally so you don't have to enter them every time you execute the cleanup task. Create a file with name "aws-credentials.json" in the same directory as cleanup.js with the following content

```json
{ 
	"accessKeyId": "<your AWS access key>", 
	"secretAccessKey": "<your AWS secret key>", 
	"region": "us-east-1" 
}
```

The given access key & secret key should have all the permissions to list/delete AWS resources.

## Supported Services

The following services are supported in latest version:


| Services 				| Notes          												|
| ---------------------	| ---------------------------------------------------------		|
| AutoScalingGroups     | Sets Desired Capacity to 0 									|
| CloudWatch		    | Disabled by default, check config.json. Billing Alarms are not deleted	|
| EBS				    | Only volumes with status 'available' will get deleted			|
| EC2				    | Only instances with status 'running' will get terminated		|
| Elastic IP		    | Only EIPs with scope 'vpc' will get released					|
| ELB				    | 									     						|
| Redshift			    | 									     						|
| RDS				    | Only DB instances with status 'available' will get deleted	|
| SNS				    | Disabled by default, check config.json 						|