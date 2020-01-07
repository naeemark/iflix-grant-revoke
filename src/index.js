var fs = require('fs');
const { getSubscriptions } = require('./services/subscriptions')
const { logger } = require('./utils/logger')

getSubscriptions().then((subscriptions) => {
  const jsonString = JSON.stringify(subscriptions, null, 2);
  logger.info(jsonString);
  const filePath = 'output/result.json'
  fs.writeFile(filePath, jsonString, (err) => {
    if (err) throw err;
    logger.info(`Output Exported to: '${filePath}'`)
  });
});