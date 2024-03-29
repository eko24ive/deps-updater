export const validInput = {
  package: 'package@4.17.21',
  repository: 'user/test-repo',
  token: 'token',
};

export const validInputWithoutToken = {
  package: 'package@4.17.21',
  repository: 'user/test-repo',
  token: 'token',
};

export const invalidPackageInput = {
  package: 'package4.17.21',
  repository: 'user/test-repo',
};

export const invalidPackageSemverInput = {
  package: 'package@4.17',
  repository: 'user/test-repo',
};

export const invalidRepositoryInput = {
  package: 'package@4.17.21',
  repository: 'usertest-repo',
};
