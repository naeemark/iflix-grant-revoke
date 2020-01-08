const winston = require('winston');
const sanitizer = require('node-sanitizer');
const { serviceName } = require('../../config/vars');

const {
  combine,
  colorize,
  simple
} = winston.format;

const options = {
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
    prettyPrint: true,
    format: combine(
      colorize(),
      simple()
    )
  }
};

const transports = [new winston.transports.Console(options.console)];

// instantiate a new Winston Logger with the settings defined above
const logger = winston.loggers.add(process.env.NODE_ENV, {
  transports
});

/**
 * Debug Log
 * @param {String} methodName Method's name
 * @param {String} message    Debug message
 * @param {Object} data       Debug data
 */
const debug = (methodName, message, data) => {
  const logData = {
    serviceName,
    methodName,
    data,
    message
  };
  logger.debug(message, logData);
};

/**
 * Warn Log
 * @param {String} methodName   Method's name
 * @param {String} message      Warn message
 * @param {Object} data         Warn data
 * @param {Object} error        Error
 */
const warn = (methodName, message, data, error) => {
  const logData = {
    serviceName,
    methodName,
    data,
    message,
    error
  };
  logger.warn(message, logData);
};

/**
 * Capture Error
 * @param {String} title        Error's title
 * @param {Object} error        Error's data
 * @param {String} methodName   Method's name
 */
const captureError = (title, error, methodName) => {
  // Uncomment the following line if you use elastic APM
  // apm.captureError(error);

  const logData = {
    serviceName,
    methodName,
    error: error.message
  };

  if (error.stack) {
    logData.stack = error.stack;
  }

  if (error.response && error.response.data) {
    logData.response = error.response.data;
  }
  logger.error(title, logData);
};


module.exports = {
  logger,
  debug,
  warn,
  captureError
};
