import { sharedLibsConfigApiGateway } from './shared-libs-config-api-gateway';

describe('sharedLibsConfigApiGateway', () => {
  it('should work', () => {
    expect(sharedLibsConfigApiGateway()).toEqual(
      'shared-libs-config-api-gateway'
    );
  });
});
