import PullRequestService from '../src/services/pullRequest.service';
import BitbucketService from '../src/services/bitbucketClient.service';
import PackageFileService from '../src/services/packageFile.service';

jest.mock('../src/services/bitbucketClient.service.ts');
jest.mock('../src/services/packageFile.service.ts');

const BRANCH_PREFIX = 'updatedeps';
const packageName = 'package';
const packageVersion = '1.0.0';

const workspaceUUID = 'workspace-UUID';
const repositoryUUID = 'repository-UUID';

describe('InputValidation service', () => {
  let pullRequestSerivce: PullRequestService;
  let bitbucketService: BitbucketService;
  let packageFileService: PackageFileService;

  beforeAll(async () => {
    bitbucketService = new BitbucketService('');
    packageFileService = new PackageFileService();

    pullRequestSerivce = new PullRequestService(
      packageFileService,
      bitbucketService,
      packageName,
      packageVersion,
    );
  });

  describe('Commit', () => {
    it('branch name should match naming', () => {
      pullRequestSerivce.commitFile(
        'commit message',
        'package.json',
        workspaceUUID,
        repositoryUUID,
      );

      expect(pullRequestSerivce.sourceBranchName).toMatch(
        `${BRANCH_PREFIX}/${packageName}-${packageVersion}`,
      );
    });

    it('should retrieve file before commit', () => {
      pullRequestSerivce.commitFile(
        'commit message',
        'package.json',
        workspaceUUID,
        repositoryUUID,
      );

      expect(packageFileService.getNewFile).toHaveBeenCalled();
    });

    it('should trigger commit post request', () => {
      pullRequestSerivce.commitFile(
        'commit message',
        'package.json',
        workspaceUUID,
        repositoryUUID,
      );

      expect(bitbucketService.commitFile).toHaveBeenCalled();
    });
  });

  describe('Pull request', () => {
    it('should trigger commit upload', () => {
      const pullRequestTitle = 'pull Request Title';

      pullRequestSerivce.createPullRequest(
        pullRequestTitle,
        workspaceUUID,
        repositoryUUID,
      );

      expect(bitbucketService.createPullrequest).toHaveBeenCalledWith(
        pullRequestTitle,
        `updatedeps/${packageName}-${packageVersion}`,
        workspaceUUID,
        repositoryUUID,
      );
    });
  });
});
