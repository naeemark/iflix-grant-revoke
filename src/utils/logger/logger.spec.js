const util = require('./logger');

describe('Utility - logger', () => {
  let infoSpy;
  let errorSpy;
  let debugSpy;
  let warnSpy;

  beforeEach(() => {
    infoSpy = jest.spyOn(util.logger, 'info');
    errorSpy = jest.spyOn(util.logger, 'error');
    debugSpy = jest.spyOn(util.logger, 'debug');
    warnSpy = jest.spyOn(util.logger, 'warn');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should capture error response', () => {
    const methodName = 'method';
    const errorMessage = 'error';
    const response = 'stupid';

    const error = {
      message: errorMessage,
      response: {
        data: response
      }
    };
    util.captureError('title', error, methodName);

    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('should capture error response with stack', () => {
    const methodName = 'method';
    const errorMessage = 'error';
    const response = 'stupid';
    const stack = 'stack';

    const error = {
      message: errorMessage,
      response: {
        data: response
      },
      stack
    };
    util.captureError('title', error, methodName);

    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});
