const fs = require('fs');
const config = require('../../config/vars');

const getAccounts = async () => {
  const rawData = fs.readFileSync(config.filePathAccounts);
  const content = JSON.parse(rawData);
  return content;
};

module.exports = getAccounts;