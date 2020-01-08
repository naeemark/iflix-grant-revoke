const { getAccounts, getAmazecom, getWondertel } = require('./inputs.repository')

describe('Service - inputs', () => {
  beforeEach(() => { });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('pass if getAccounts has users array', async () => {
    return await getAccounts().then((result) => {
      expect(result).toBeObject();
      expect(result).toContainKey('users');
      expect(result.users).toBeArray();
    });
  });

  it('pass if getAmazecom has grants', async () => {
    return await getAmazecom().then((result) => {
      expect(result).toBeObject();
      expect(result).toContainKey('grants');
      expect(result.grants).toBeArray();
    });
  });

  it('pass if getAmazecom has revokes', async () => {
    return await getAmazecom().then((result) => {
      expect(result).toBeObject();
      expect(result).toContainKey('revocations');
      expect(result.revocations).toBeArray();
    });
  });

  it('pass if getWondertel has grants', async () => {
    return await getWondertel().then((result) => {
      expect(result).toBeObject();
      expect(result).toContainKey('grants');
      expect(result.grants).toBeArray();
    });
  });

  it('pass if getWondertel has revokes', async () => {
    return await getWondertel().then((result) => {
      expect(result).toBeObject();
      expect(result).toContainKey('revocations');
      expect(result.revocations).toBeArray();
    });
  });
});