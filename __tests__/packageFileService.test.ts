import PackageFileService from '../src/services/packageFile.service';

const fileObject = {
  dependencies: {
    '@inquirer/prompts': '^4.3.0',
  },
};

describe('InputValidation service', () => {
  let packageFileSerivce: PackageFileService;

  beforeAll(async () => {
    packageFileSerivce = new PackageFileService();
  });

  it('should load file', () => {
    packageFileSerivce.loadFile(JSON.stringify(fileObject));

    expect(packageFileSerivce.packageFile).toMatchObject(fileObject);
  });

  it('should update dependancy', () => {
    packageFileSerivce.loadFile(JSON.stringify(fileObject));

    packageFileSerivce.updateDependency('@inquirer/prompts', '1.0.0');

    expect(packageFileSerivce.packageFile.dependencies).toHaveProperty(
      '@inquirer/prompts',
      '1.0.0',
    );
  });

  it('should provide correct new file', () => {
    packageFileSerivce.loadFile(JSON.stringify(fileObject));

    packageFileSerivce.updateDependency('@inquirer/prompts', '1.0.0');
    const newFile = packageFileSerivce.getNewFile();

    expect(newFile).toContain('@inquirer/prompts');
    expect(newFile).toContain('1.0.0');
  });
});
