const core = require('@actions/core');
const github = require('@actions/github');
const ec2Config = require('./ec2.json');

class Config {
  constructor() {
    this.input = {
      mode: core.getInput('mode'),
      githubToken: core.getInput('github-token'),
      t4: core.getInput('t4'),
      a10g: core.getInput('a10g'),
      v100: core.getInput('v100'),
    };

    // the values of github.context.repo.owner and github.context.repo.repo are taken from
    // the environment variable GITHUB_REPOSITORY specified in "owner/repo" format and
    // provided by the GitHub Action on the runtime
    this.githubContext = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
    };

    //
    // validate input
    //

    if (!this.input.mode) {
      throw new Error(`The 'mode' input is not specified`);
    }

    if (!this.input.githubToken) {
      throw new Error(`The 'github-token' input is not specified`);
    }

    if (!this.input.t4) {
      throw new Error(`The 't4' input is not specified`);
    }

    if (!this.input.a10g) {
      throw new Error(`The 'a10g' input is not specified`);
    }

    if (!this.input.v100) {
      throw new Error(`The 'v100' input is not specified`);
    }
  }

  getInput() {
    return this.input;
  }

  getT4Ids() {
    return ec2Config.t4;
  }

  getA10GIds() {
    return ec2Config.a10g;
  }

  getV100Ids() {
    return ec2Config.v100;
  }

  generateUniqueLabel() {
    return Math.random().toString(36).substr(2, 5);
  }
}

try {
  module.exports = new Config();
} catch (error) {
  core.error(error);
  core.setFailed(error.message);
}
