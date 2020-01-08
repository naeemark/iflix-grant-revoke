const fs = require('fs');
const service = require('../src/services/subscriptions/subscriptions.service');

describe('App - TestFixture', () => {
  const expectedOutput = JSON.parse(fs.readFileSync('test/fixture/expected_output.json'));

  beforeEach(() => { });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should pass if output is equal to expectedOutput', async () => {
    var keys = Object.keys(expectedOutput.subscriptions)
    const randomUser = keys[keys.length * Math.random() << 0]
    return await service.getSubscriptions().then((output) => {
      expect(output).toBeObject();
      expect(output).toContainKey('subscriptions');
      expect(output.subscriptions).toEqual(expectedOutput.subscriptions);
      expect(output.subscriptions[randomUser]).toEqual(expectedOutput.subscriptions[randomUser]);
    });
  });
});