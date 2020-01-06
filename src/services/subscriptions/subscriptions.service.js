const { logger } = require('../../utils/logger')
const { getAccounts, getAmazecom, getWondertel } = require('../../repository/inputs')

let accountsData = null;
let amazecomData = null;
let wondertelData = null;

const getInputs = async () => {
  accountsData = await getAccounts();
  amazecomData = await getAmazecom();
  wondertelData = await getWondertel();
};

const findAmazecom = async (accountNumber) => {
  let hours = 0;
  amazecomData.grants.filter((grant) => grant.number === accountNumber)
    .forEach((grant) => { hours += ((grant.period) ? grant.period : 0) })
  return hours;
};

const findWondertel = async (accountNumber) => {
  let hours = 0;
  wondertelData.grants.filter((grant) => grant.number === accountNumber)
    .forEach((grant) => { hours += ((grant.period) ? grant.period : 0) })
  return hours;
};

const getSubscriptions = async () => {
  await getInputs();

  const subscriptions = {};
  for (const user of accountsData.users) {
    const Amazecom = await findAmazecom(user.number);
    const Wondertel = await findWondertel(user.number);
    subscriptions[user.name] = { Amazecom, Wondertel }
  }
  return { subscriptions };
};

module.exports = { getSubscriptions };