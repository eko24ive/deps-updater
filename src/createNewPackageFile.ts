/*
TODO: Validate package
https://registry.npmjs.org/lodash/4.17.21
 */

type PackageFile = {
  dependencies: { [key: string]: string; },
  devDependencies: { [key: string]: string; }
}

export const createNewPackageFile = async (packageFileContent: string, packageName, packageVersion): Promise<string> => {
  const packageFile: PackageFile = JSON.parse(packageFileContent);

  ['dependencies', 'devDependencies'].forEach((dependancyKey) => {
    if(packageName in packageFile[dependancyKey]) {
      packageFile[dependancyKey][packageName] = packageVersion
    }
  })

  return JSON.stringify(packageFile, null, 2)
}
