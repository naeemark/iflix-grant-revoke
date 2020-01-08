const fs = require('fs');
const config = require('../config/vars');
const { logger } = require('../utils/logger')

const getAccounts = async () => {
  try {
    const rawData = fs.readFileSync(config.filePathAccounts);
    const content = JSON.parse(rawData);
    logger.info(JSON.stringify(content))
    return content;
  } catch (error) {
    logger.error(JSON.stringify(error));
    throw Error(error);
  }
};

module.exports = getAccounts;