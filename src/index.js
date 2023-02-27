const aws = require('./aws');
const config = require('./config');
const core = require('@actions/core');

function setOutput(ec2InstanceIds) {
  core.setOutput('ec2Instances', ec2InstanceIds);
}

async function start() {
  let ec2InstanceIds = [];
  if (config.input.t4) {
    const t4Ids = config.getT4Ids();
    ec2InstanceIds = ec2InstanceIds.concat(t4Ids);
    console.log(t4Ids);
    console.log(ec2InstanceIds);
  }
  const startedEC2InstanceIds = await aws.startEc2Instance(ec2InstanceIds);
  setOutput(startedEC2InstanceIds);
  await aws.waitForInstanceRunning(startedEC2InstanceIds);
}

async function stop() {
  let ec2InstanceIds = [];

  if (config.input.t4) {
    const t4Ids = config.getT4Ids();
    ec2InstanceIds = ec2InstanceIds.concat(t4Ids);
  }

  await aws.stopEc2Instance(ec2InstanceIds);
}

(async function () {
  try {
    config.input.mode === 'start' ? await start() : await stop();
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
})();
