const { PROVIDER_AMAZECOM, PROVIDER_WONDERTEL, TYPE_GRANT, TYPE_REVOKE } = require('../../utils/constants');
const { getAccounts, getAmazecom, getWondertel } = require('../../repository/inputs');
const { calculateDays, restructure, getGrantsRevokes } = require('../../utils/data-utils');
const { logger } = require('../../utils/logger');

let accountsData = null;
let amazecomData = null;
let wondertelData = null;

const syncInputs = async () => {
  accountsData = await getAccounts();
  amazecomData = await restructure(PROVIDER_AMAZECOM, await getAmazecom());
  wondertelData = await restructure(PROVIDER_WONDERTEL, await getWondertel());
};

const getSubscription = async (account) => {
  const subscription = {};
  if (account.amazecom.days) { subscription[PROVIDER_AMAZECOM] = account.amazecom.days }
  if (account.wondertel.days) { subscription[PROVIDER_WONDERTEL] = account.wondertel.days }
  return subscription;
}

const getSubscriptions = async () => {

  await syncInputs();
  const subscriptions = {};

  for (const user of accountsData.users) {
    const grantsRevokes = await getGrantsRevokes(user.number, amazecomData, wondertelData);
    // console.log(grantsRevokes); console.log(`------------------------`);
    const account = { owner: null, amazecom: { start: null, end: null, days: 0 }, wondertel: { start: null, end: null, days: 0 } }

    grantsRevokes.forEach((grantOrRevoke) => {
      if (grantOrRevoke.type === TYPE_GRANT) {

        if (account.owner === null) account.owner = grantOrRevoke.provider;

        const providerKey = grantOrRevoke.provider.toLowerCase();
        if (account.owner === grantOrRevoke.provider && (grantOrRevoke.period) && grantOrRevoke.period > 0) {
          if (account[providerKey].start === null) {
            account[providerKey].start = new Date(grantOrRevoke.date);
            const endDate = new Date(grantOrRevoke.date);
            endDate.setMonth(endDate.getMonth() + grantOrRevoke.period);
            account[providerKey].end = endDate;
          } else {
            const endDate = new Date(account[providerKey].end);
            endDate.setMonth(endDate.getMonth() + grantOrRevoke.period);
            account[providerKey].end = endDate;
          }
          account[providerKey].days = calculateDays(account[providerKey]);
        }
      }
      else if (grantOrRevoke.type === TYPE_REVOKE && account.owner === grantOrRevoke.provider) {
        account.owner = null;
        const providerKey = grantOrRevoke.provider.toLowerCase();
        account[providerKey].end = new Date(grantOrRevoke.date);
        account[providerKey].days = calculateDays(account[providerKey]);
      }
    });

    const subscription = await getSubscription(account);
    if (Object.keys(subscription).length !== 0) {
      subscriptions[user.name] = subscription;
    }
  }
  return { subscriptions };
};

module.exports = { getSubscriptions };