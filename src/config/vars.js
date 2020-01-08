const path = require('path');

// import .env variables
require('dotenv-safe').config({
  path: path.join(process.cwd(), '.env'),
  sample: path.join(process.cwd(), '.env.example')
});

module.exports = {
  serviceName: 'iflix-grant-revoke',
  filePathAccounts: process.env.ACCOUNTS_FILE_PATH,
  filePathAmazecom: process.env.AMAZECOM_FILE_PATH,
  filePathWondertel: process.env.WONDERTEL_FILE_PATH
};
