const aws = require('./aws');
const config = require('./config');
const core = require('@actions/core');

function setOutput(ec2InstanceIds) {
  core.setOutput('ec2Instances', ec2InstanceIds);
}

async function start() {
  let ec2InstanceIds = [];
  console.log(config.getInput());
  if (config.getInput().t4 === 'true') {
    const t4 = config.getT4Ids();
    ec2InstanceIds = ec2InstanceIds.concat(t4);
  }
  if (config.getInput().a10g === 'true') {
    const a10 = config.getA10GIds();
    ec2InstanceIds = ec2InstanceIds.concat(a10);
  }
  if (config.getInput().v100 === 'true') {
    const v100 = config.getV100Ids();
    ec2InstanceIds = ec2InstanceIds.concat(v100);
  }

  const startedEC2InstanceIds = await aws.startEc2Instance(ec2InstanceIds);
  setOutput(startedEC2InstanceIds);
  await aws.waitForInstanceRunning(startedEC2InstanceIds);
}

async function stop() {
  let ec2InstanceIds = [];
  if (config.getInput().t4 === 'true') {
    const t4 = config.getT4Ids();
    ec2InstanceIds = ec2InstanceIds.concat(t4);
  }
  if (config.getInput().a10g === 'true') {
    const a10 = config.getA10GIds();
    ec2InstanceIds = ec2InstanceIds.concat(a10);
  }
  if (config.getInput().v100 === 'true') {
    const v100 = config.getV100Ids();
    ec2InstanceIds = ec2InstanceIds.concat(v100);
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
