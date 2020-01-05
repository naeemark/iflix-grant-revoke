const { getAccounts, getAmazecom, getWondertel } = require('../../repository/inputs')

const subscription = async () => {
  const accounts = await getAccounts();
  const amazecom = await getAmazecom();
  const wondertel = await getWondertel();
  return { accounts, amazecom, wondertel };
};

module.exports = { subscription };