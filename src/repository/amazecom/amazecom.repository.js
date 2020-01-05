
const fs = require('fs');
const config = require('../../config/vars');

const getAmazecom = async () => {
  const rawData = fs.readFileSync(config.filePathAmazecom);
  const content = JSON.parse(rawData);
  return content;
};

module.exports = getAmazecom;