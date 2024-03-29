/*
TODO: Validate package
https://registry.npmjs.org/lodash/4.17.21
 */

export const createNewPackageFile = async (
  packageFileContent: string,
  packageName,
  packageVersion,
): Promise<string> => {
  const packageFile: PackageFile = JSON.parse(packageFileContent);

  // TODO: peer & optional deps
  [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ].forEach((dependancyKey) => {
    if (dependancyKey in packageFile) {
      if (packageName in packageFile[dependancyKey]) {
        packageFile[dependancyKey][packageName] = packageVersion;
      }
    }
  });

  return JSON.stringify(packageFile, null, 2);
};
