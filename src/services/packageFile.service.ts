const PACKAGE_FILE_KEYS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

export default class PackageFileSerivce {
  packageFile: PackageFile;

  loadFile(file: string): void {
    this.packageFile = JSON.parse(file);
  }

  updateDependency(packageName: string, packageVersion: string): void {
    PACKAGE_FILE_KEYS.forEach((dependancyKey) => {
      if (dependancyKey in this.packageFile) {
        if (packageName in this.packageFile[dependancyKey]) {
          this.packageFile[dependancyKey][packageName] = packageVersion;
        }
      }
    });
  }

  getNewFile(): string {
    return JSON.stringify(this.packageFile, null, 2);
  }
}
