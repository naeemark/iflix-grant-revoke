const fs = require('fs');
const config = require('../config/vars');
const { logger } = require('../utils/logger')

const getWondertel = async () => {
  const rawData = fs.readFileSync(config.filePathWondertel);
  const content = JSON.parse(rawData);
  logger.info(JSON.stringify(content))
  return content;
};

module.exports = getWondertel;