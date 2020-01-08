const fs = require('fs');
const config = require('../config/vars');
const { logger } = require('../utils/logger')

const getWondertel = async () => {
  try {
    const rawData = fs.readFileSync(config.filePathWondertel);
    const content = JSON.parse(rawData);
    logger.info(JSON.stringify(content))
    return content;
  } catch (error) {
    logger.error(JSON.stringify(error));
    throw Error(error);
  }
};

module.exports = getWondertel;