import { ENVIRONMENT } from '../src/util/secrets';

describe('Secrets', () => {
  it('should return environment', () => {
    expect(ENVIRONMENT).toBeDefined();
  });
});
