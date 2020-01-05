const path = require('path');

// import .env variables
require('dotenv-safe').config();

module.exports = {
  filePathAccounts: process.env.ACCOUNTS_FILE_PATH,
  filePathAmazecom: process.env.AMAZECOM_FILE_PATH,
  filePathWondertel: process.env.WONDERTEL_FILE_PATH
};
