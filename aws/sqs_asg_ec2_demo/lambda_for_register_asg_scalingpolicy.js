
var AWS = require('aws-sdk');
var asg = new AWS.AutoScaling({apiVersion: '2011-01-01'});

exports.handler = async (event) => {
    
    var asg_name = 'asg-for-sqs-ec2';
    var policy_name = 'scaling-policy-by-backlog-per-instace';
    var backlog_per_instace_target = '6';
    var metric_namesapce = 'SQS_ASG';
    var metric_name = 'backlog_per_instance';
    
    await register_scaling_policy(asg_name, policy_name, backlog_per_instace_target, metric_namesapce, metric_name);
    
    return {};
};

function register_scaling_policy(asg_name, policy_name, backlog_per_instace_target, metric_namesapce, metric_name) {
  return new Promise((resolve) => {
    var params = {
      AutoScalingGroupName: asg_name, /* required */
      PolicyName: policy_name, /* required */
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingConfiguration: {
        TargetValue: backlog_per_instace_target, /* required */
        CustomizedMetricSpecification: {
          MetricName: metric_name, /* required */
          Namespace: metric_namesapce, /* required */
          Statistic: 'Sum', /* required */
        },
      }
    };
   
    asg.putScalingPolicy(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); 
            resolve();
        }
        console.log('asg_data: ', data); 
        
        resolve();
    });   
  
  });
}

