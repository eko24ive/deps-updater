import InputValidationService from '../src/services/inputValidation.service';
import {
  invalidPackageInput,
  invalidPackageSemverInput,
  invalidRepositoryInput,
  validInput,
  validInputWithoutToken,
} from './mocks/inputMocks';

describe('InputValidation service', () => {
  let inputValidationService: InputValidationService;

  beforeAll(async () => {
    inputValidationService = new InputValidationService();
  });

  it('should not throw errors when given valid input', () => {
    expect(() => inputValidationService.validate(validInput)).not.toThrow();
    expect(() =>
      inputValidationService.validate(validInputWithoutToken),
    ).not.toThrow();
  });

  it('should throw error when given invalid package input', () => {
    expect(() => inputValidationService.validate(invalidPackageInput)).toThrow(
      'Invalid package format',
    );
  });
  it('should throw error when given invalid package semver input', () => {
    expect(() =>
      inputValidationService.validate(invalidPackageSemverInput),
    ).toThrow('Invalid version format');
  });
  it('should throw error when given invalid repository input', () => {
    expect(() =>
      inputValidationService.validate(invalidRepositoryInput),
    ).toThrow('Invalid repository resource');
  });
});
