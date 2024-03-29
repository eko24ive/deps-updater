import BitbucketClientService from './bitbucketClient.service.js';
import PackageFileSerivce from './packageFile.service.js';

const BRANCH_PREFIX = 'updatedeps';

export default class PullRequestService {
  sourceBranchName: string;

  constructor(
    private packageFileSerivce: PackageFileSerivce,
    private bitbucketService: BitbucketClientService,
    private packageName: string,
    private packageVersion: string,
  ) {}

  async commitFile(
    commitMessage: string,
    packageFileName: string,
    workspaceUUID: UUID,
    repositoryUUID: UUID,
  ): Promise<void> {
    this.sourceBranchName = `${BRANCH_PREFIX}/${this.packageName}-${this.packageVersion}`;

    const newPackageFile = this.packageFileSerivce.getNewFile();

    await this.bitbucketService.commitFile(
      packageFileName,
      newPackageFile,
      workspaceUUID,
      repositoryUUID,
      commitMessage,
      this.sourceBranchName,
    );

    console.log('File succesfully commited');
  }

  async createPullRequest(
    title: string,
    workspaceUUID: UUID,
    repositoryUUID: UUID,
  ): Promise<void> {
    const request = await this.bitbucketService.createPullrequest(
      title,
      this.sourceBranchName,
      workspaceUUID,
      repositoryUUID,
    );

    this.printPRLink(request?.links?.html?.href);
  }

  printPRLink(pullRequestLink: string): void {
    console.log('Pull request created. Visit link below to inspect it');
    console.log(pullRequestLink);
  }
}
