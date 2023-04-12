const core = require('@actions/core');
const { Octokit } = require("@octokit/rest");
const cmp = require('semver-compare')

const repository = core.getInput('repository');
const token = core.getInput('token');
var owner = core.getInput('owner');
var repo = core.getInput('repo');
var version = core.getInput('version');

const octokit = (() => {
  if (token) {
    return new Octokit({ auth: token,});
  } else {
    return new Octokit();
  }
})();

async function run() {
    try {
        if (repository){
                [owner, repo] = repository.split("/");
        }
        var releases  = await octokit.repos.getLatestRelease({
            owner: owner,
            repo: repo,
            });
        var latest = releases.Result;
        if (latest) {
            core.setOutput('release', latest.TagName);
            if (version) {
                core.setOutput('compare', cmp(version.replace(/^v/, ''), latest.TagName.replace(/^v/, '')));
            }
        } else {
            core.setFailed("No valid releases");
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run()
