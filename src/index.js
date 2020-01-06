const { getSubscriptions } = require('./services/subscriptions')
const { logger } = require('./utils/logger')

getSubscriptions().then((subscription) => {
  logger.info(JSON.stringify(subscription));
});