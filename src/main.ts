import { confirm } from '@inquirer/prompts';
import { Command } from 'commander';
import dotenv from 'dotenv';

import BitbucketClientService from './services/bitbucketClient.service.js';
import InputValidationService from './services/inputValidation.service.js';
import PackageFileSerivce from './services/packageFile.service.js';
import PullRequestService from './services/pullRequest.service.js';

dotenv.config();
const PACKAGE_FILE_NAME = 'package.json';

const program = new Command();

program
  .description('Split a string into substrings and display as an array')
  .requiredOption(
    '--package <string>',
    'Package name and version (e.g. react@1.0.0',
  )
  .requiredOption(
    '--repository <string>',
    'Repository name (e.g. user/repository)',
  )
  .option('--token <string>', 'Bitbucket access token');

program.parse(process.argv);

// Introduce serivces to manage business logic
// Npm package version validation
// unit tests
// add TS coverage (dtos..., etc)

const run = async (): Promise<void> => {
  const options: CommandOptions = program.opts();

  const bitbucketServiceToken =
    options.token ?? process.env.BITBUCKET_API_TOKEN;
  const bitbucketService = new BitbucketClientService(bitbucketServiceToken);
  const inputValidationService = new InputValidationService();
  const packageFileSerivce = new PackageFileSerivce();

  inputValidationService.validate(options);

  const [packageName, packageVersion] = options.package.split('@');

  const repository = await bitbucketService.getRepositoryInfo(
    options.repository,
  );

  const rawSourcePackageFile = await bitbucketService.getFile(
    options.repository,
    repository.mainbranch.name,
    PACKAGE_FILE_NAME,
  );

  packageFileSerivce.loadFile(rawSourcePackageFile);
  packageFileSerivce.updateDependency(packageName, packageVersion);

  const createPRConsent = await confirm({
    message: 'Would you like to create a PR to update a dependancy?',
  });

  if (!createPRConsent) {
    return;
  }

  const pullRequestService = new PullRequestService(
    packageFileSerivce,
    bitbucketService,
    packageName,
    packageVersion,
  );

  const changeDescription = `Updating ${packageName} to version ${packageVersion}`;

  await pullRequestService.commitFile(
    `chore: ${changeDescription}`,
    PACKAGE_FILE_NAME,
    repository.workspace.uuid,
    repository.uuid,
  );

  await pullRequestService.createPullRequest(
    changeDescription,
    repository.workspace.uuid,
    repository.uuid
  );
};

run();
