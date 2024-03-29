import { confirm, input } from '@inquirer/prompts';
import open from 'open';

import BitbucketAPI from './bitbucket.api.js';
import { createNewPackageFile } from './createNewPackageFile.js';

const PACKAGE_FILE = 'package.json'

const run = async (): Promise<void> => {
  const authorizeConsent = await confirm({
    message: 'Would you like to open authorization link to bitbucket?',
    default: false
  });

  if(authorizeConsent) {
    open('https://bitbucket.org/site/oauth2/authorize?client_id=AGNZtJGWvxEjXV8SwV&response_type=token')
  }

  const tokenInput = await input({ message: 'Enter access token', default:'FP1NHcULuhpPFbC44DO6N0TTopvDShhbFb8Q5BiymiJ9LQQR-vexnUV8mih6sRoUbSZiuRa_icJPywwnaFhc6AdrD1girs7syy3xUdgd5q56IVd7sAttfZ-PtmI0O1OW7pe-yvVZrYR6a6H6SRkMFBWGdkOR' });
  BitbucketAPI.token = tokenInput

  const packageAndVersionInput = await input({ message: 'Enter package and version (e.g. react@1.0.0)', default: 'lodash@4.17.21' });
  // https://registry.npmjs.org/lodash/4.17.21

  if(!packageAndVersionInput.includes('@')) {
    throw new Error("Invalid package and version format");
  }

  const [packageName, packageVersion] = packageAndVersionInput.split('@')


  const repositoryName = await input({ message: 'Enter repository (e.g. USER/repository)', default: 'eko24ive/test-repo' });
  if(!repositoryName.includes('/')) {
    throw new Error("Invalid repository resource");
  }
  const repository = await BitbucketAPI.getRepositoryInfo(repositoryName)

  const mainBranch = repository.mainbranch.name;
  const workspaceUUID = repository.workspace.uuid
  const repositoryUUID = repository.uuid

  const packageFileContent = await BitbucketAPI.getFile(repositoryName, mainBranch, PACKAGE_FILE)


  const newPackageFile = await createNewPackageFile(packageFileContent, packageName, packageVersion);

  const changeTitle = `Updating ${packageName} to version ${packageVersion}`
  const commitMessage = `chore: ${changeTitle}`
  const branchName = `updatedeps/${packageName}-${packageVersion}`

  await BitbucketAPI.commitFile(PACKAGE_FILE, newPackageFile, workspaceUUID, repositoryUUID, commitMessage, branchName)

  const createPRConsent = await confirm({
    message: 'Would you like to create a PR to update a dependancy?',
  });

  if(createPRConsent) {
    await BitbucketAPI.createPullrequest(changeTitle, branchName, workspaceUUID, repositoryUUID)
  }
};

run();
