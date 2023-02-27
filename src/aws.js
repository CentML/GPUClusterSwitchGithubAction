const AWS = require('aws-sdk');
const core = require('@actions/core');
const config = require('./config');

async function startEc2Instance(ec2InstanceIds) {
  const ec2 = new AWS.EC2();

  const params = {
    InstanceIds: ec2InstanceIds,
  };

  try {
    const result = await ec2.startInstances(params).promise();
    const ec2InstanceId = result.StartingInstances.InstanceIds;
    core.info(`AWS EC2 instances ${ec2InstanceId} are started`);
    return ec2InstanceId;
  } catch (error) {
    core.error('AWS EC2 instance starting error');
    throw error;
  }
}

async function terminateEc2Instance() {
  const ec2 = new AWS.EC2();

  const params = {
    InstanceIds: [config.input.ec2InstanceId],
  };

  try {
    await ec2.s(params).promise();
    core.info(`AWS EC2 instance ${config.input.ec2InstanceId} is terminated`);
    return;
  } catch (error) {
    core.error(`AWS EC2 instance ${config.input.ec2InstanceId} termination error`);
    throw error;
  }
}

async function waitForInstanceRunning(ec2InstanceId) {
  const ec2 = new AWS.EC2();

  const params = {
    InstanceIds: ec2InstanceId,
  };

  try {
    await ec2.waitFor('instanceRunning', params).promise();
    core.info(`AWS EC2 instance ${ec2InstanceId} are up and running`);
    return;
  } catch (error) {
    core.error(`AWS EC2 instance ${ec2InstanceId} initialization error`);
    throw error;
  }
}

module.exports = {
  startEc2Instance,
  terminateEc2Instance,
  waitForInstanceRunning,
};
