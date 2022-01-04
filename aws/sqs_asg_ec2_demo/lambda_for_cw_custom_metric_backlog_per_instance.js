
var AWS = require('aws-sdk');
var cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
var asg = new AWS.AutoScaling({apiVersion: '2011-01-01'});

exports.handler = async (event) => {
  
    var sqs_queue_url = 'https://sqs.us-east-1.amazonaws.com/344458213649/sqs-asg-ec2-001';
    var num_of_msg_in_queue = await get_num_of_msg_in_queue(sqs_queue_url);
    console.log('num_of_msg_in_queue: ', num_of_msg_in_queue);
    
    var asg_name = 'asg-for-sqs-ec2';
    var num_of_ec2_in_asg = await get_num_of_ec2_in_asg(asg_name);
    console.log('num_of_ec2_in_asg: ', num_of_ec2_in_asg);
    
    var backlog_per_instance = num_of_msg_in_queue; // if num_of_ec2_in_asg == 0, then use this 
    if (num_of_ec2_in_asg > 0) {
      backlog_per_instance = num_of_msg_in_queue / num_of_ec2_in_asg;
    }
    
    console.log('backlog_per_instance: ', backlog_per_instance);
    
    await put_custom_metric(backlog_per_instance);
    
    return {};
};

function get_num_of_ec2_in_asg(asg_name) {
  return new Promise((resolve) => {
    var params = {
      AutoScalingGroupNames: [
         asg_name
      ]
    };
   
  asg.describeAutoScalingGroups(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); 
      resolve();
    }
    
    var instances = data.AutoScalingGroups[0].Instances;

    var instance_inservice_count = 0;
    for (var i = 0; i < instances.length ;i++) {
      var instance = instances[i];
      if (instance.LifecycleState === 'InService') {
        instance_inservice_count++;
      }
    }
    
    resolve(instance_inservice_count);
  })
  
  });
}

function get_num_of_msg_in_queue(sqs_queue_url) {
  return new Promise((resolve) => {
    var params = {
      QueueUrl: sqs_queue_url,
      AttributeNames : ['ApproximateNumberOfMessages'],
     };

    sqs.getQueueAttributes(params, function(err, data){
      if (err) {
          console.log("Error", err);
          resolve();
      } 
      
      var result = result = data.Attributes.ApproximateNumberOfMessages;
      resolve(result);
    });         
  });    
}

function put_custom_metric(backlog_per_instance) {
  return new Promise((resolve) => {
    // Create parameters JSON for putMetricData
    var params = {
      Namespace: 'SQS_ASG',
      MetricData: [
        {
          MetricName: 'backlog_per_instance',
          Value: backlog_per_instance
        },
      ]
    };
    
    cw.putMetricData(params, function(err, data) {
      if (err) {
        console.log("putMetricData Error", err);
        resolve();
      }
      
      resolve(data);
    });  
    
  });    
}





