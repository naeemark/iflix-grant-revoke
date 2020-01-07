/* eslint-disable arrow-body-style */
const service = require('./subscriptions.service');

describe('Service - getSubscriptions', () => {
  beforeEach(() => { });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should unit test getSubscription', async () => {
    return await service.getSubscriptions().then((result) => {
      expect(result).toBeObject();
      expect(result).toContainKey('subscriptions');
    });
  });
});
