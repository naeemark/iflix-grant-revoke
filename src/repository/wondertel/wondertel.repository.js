const fs = require('fs');
const config = require('../../config/vars');

const getWondertel = async () => {
  const rawData = fs.readFileSync(config.filePathWondertel);
  const content = JSON.parse(rawData);
  return content;
};

module.exports = getWondertel;