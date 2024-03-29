type UUID = string;

interface CommandOptions {
  package: string;
  repository: string;
  token?: string;
}

interface PackageFile {
  dependencies: { [key: string]: string };
  devDependencies: { [key: string]: string };
  peerDependencies: { [key: string]: string };
  optionalDependencies: { [key: string]: string };
}

interface Repository {
  uuid: UUID;
  workspace: {
    uuid: UUID;
  };
  mainbranch: {
    name: string;
  };
}

interface Commit {
  message: string;
  branchName: string;
}
