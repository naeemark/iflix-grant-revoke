const { subscription } = require('./services/subscription')
const { logger } = require('./utils/logger')

subscription().then((subs) => {
  logger.info(typeof (subs));
});