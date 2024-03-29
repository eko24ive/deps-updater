import validateSemver from '../utils/validateSemver.js';

export default class InputValidationService {
  validate(options: CommandOptions): void {
    if (!options.package.includes('@')) {
      throw new Error('Invalid package format');
    }

    if (!options.repository.includes('/')) {
      throw new Error('Invalid repository resource');
    }

    const [, packageVersion] = options.package.split('@');

    if (!validateSemver(packageVersion)) {
      throw new Error('Invalid version format');
    }
  }
}
