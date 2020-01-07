const { PROVIDER_AMAZECOM, PROVIDER_WONDERTEL, TYPE_GRANT, TYPE_REVOKE } = require('../../utils/constants');
const { getAccounts, getAmazecom, getWondertel } = require('../../repository/inputs');
const { calculateDays } = require('../../utils/utils');
const { logger } = require('../../utils/logger');

let accountsData = null;
let amazecomData = null;
let wondertelData = null;

const restructure = async (providerName, providerData) => {
  const data = [];
  providerData.grants.forEach((element) => { element['provider'] = providerName; element['type'] = TYPE_GRANT; data.push(element); });
  providerData.revocations.forEach((element) => { element['provider'] = providerName; element['type'] = TYPE_REVOKE; data.push(element); });
  return data;
}

const getInputs = async () => {
  accountsData = await getAccounts();
  amazecomData = await restructure(PROVIDER_AMAZECOM, await getAmazecom());
  wondertelData = await restructure(PROVIDER_WONDERTEL, await getWondertel());
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

const getGrantsRevokes = async (accountNumber) => {
  const grantsRevokes = []
  amazecomData.forEach((element) => { if (element.number === accountNumber) { grantsRevokes.push(element); } });
  wondertelData.forEach((element) => { if (element.number === accountNumber) { grantsRevokes.push(element); } });
  grantsRevokes.sort((x, y) => new Date(x.date) - new Date(y.date))
  return grantsRevokes;
};

const getSubscriptions = async () => {
  await getInputs();

  const subscriptions = {};
  for (const user of accountsData.users) {
    const grantsRevokes = await getGrantsRevokes(user.number);
    console.log(grantsRevokes); console.log(`------------------------`);
    const account = { owner: null, amazecom: { start: null, end: null, days: 0 }, wondertel: { start: null, end: null, days: 0 } }
    grantsRevokes.forEach((grantOrRevoke) => {
      if (grantOrRevoke.type === TYPE_GRANT) {
        if (grantOrRevoke.provider === PROVIDER_AMAZECOM) {
          if (account.owner === null) account.owner = grantOrRevoke.provider;
          if (account.owner === grantOrRevoke.provider && (grantOrRevoke.period) && grantOrRevoke.period > 0) {
            if (account.amazecom.start === null) {
              account.amazecom.start = new Date(grantOrRevoke.date);
              const endDate = new Date(grantOrRevoke.date);
              endDate.setMonth(endDate.getMonth() + grantOrRevoke.period);
              account.amazecom.end = endDate;
            } else {
              const endDate = new Date(account.amazecom.end);
              endDate.setMonth(endDate.getMonth() + grantOrRevoke.period);
              account.amazecom.end = endDate;
            }
            account.amazecom.days = Math.floor((account.amazecom.end.getTime() - account.amazecom.start.getTime()) / (1000 * 3600 * 24));
          }
        } else if (grantOrRevoke.provider === PROVIDER_WONDERTEL) {
          if (account.owner === null) account.owner = grantOrRevoke.provider;
          if (account.owner === grantOrRevoke.provider && (grantOrRevoke.period) && grantOrRevoke.period > 0) {
            if (account.wondertel.start === null) {
              account.wondertel.start = new Date(grantOrRevoke.date);
              const endDate = new Date(grantOrRevoke.date);
              endDate.setMonth(endDate.getMonth() + grantOrRevoke.period);
              account.wondertel.end = endDate;
            } else {
              const endDate = new Date(account.wondertel.end);
              endDate.setMonth(endDate.getMonth() + grantOrRevoke.period);
              account.wondertel.end = endDate;
            }
            account.wondertel.days = Math.floor((account.wondertel.end.getTime() - account.wondertel.start.getTime()) / (1000 * 3600 * 24));
          }
        }
        console.log(account)
      }
      else if (grantOrRevoke.type === TYPE_REVOKE && account.owner === grantOrRevoke.provider) {
        account.owner = null;
        if (grantOrRevoke.provider === PROVIDER_AMAZECOM) {
          const endDate = new Date(grantOrRevoke.date);
          account.amazecom.end = endDate;
          account.amazecom.days = Math.floor((account.amazecom.end.getTime() - account.amazecom.start.getTime()) / (1000 * 3600 * 24));
        }
        else if (grantOrRevoke.provider === PROVIDER_WONDERTEL) {
          const endDate = new Date(grantOrRevoke.date);
          account.wondertel.end = endDate;
          account.wondertel.days = Math.floor((account.wondertel.end.getTime() - account.wondertel.start.getTime()) / (1000 * 3600 * 24));
        }
        console.log(account)
      }
    });
    const subscription = {};
    if (account.amazecom.days) { subscription[PROVIDER_AMAZECOM] = account.amazecom.days }
    if (account.wondertel.days) { subscription[PROVIDER_WONDERTEL] = account.wondertel.days }
    if (Object.keys(subscription).length !== 0) {
      logger.info(`User: ${user.name}, Subscription: ${JSON.stringify(subscription)}`);
      subscriptions[user.name] = subscription;
    }
  }
  return { subscriptions };
};

module.exports = { getSubscriptions };