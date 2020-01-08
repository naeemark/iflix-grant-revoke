const { calculateDays } = require('./data-utils')

describe('utils - data-utils', () => {
  beforeEach(() => { });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('pass if calculate days works fine', async () => {
    const addDays = 2
    const start = new Date('08-01-2020');
    const end = new Date('08-01-2020');
    end.setDate(end.getDate() + addDays);

    const provider = { start, end }
    const days = calculateDays(provider);

    expect(days).toEqual(addDays);
  });
});
