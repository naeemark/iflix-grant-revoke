const fs = require('fs');
const config = require('../config/vars');
const { logger } = require('../utils/logger')

const getAmazecom = async () => {
  const rawData = fs.readFileSync(config.filePathAmazecom);
  const content = JSON.parse(rawData);
  logger.info(JSON.stringify(content))
  return content;
};

module.exports = getAmazecom;