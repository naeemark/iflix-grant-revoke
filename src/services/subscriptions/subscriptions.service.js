const { logger } = require('../../utils/logger')
const { getAccounts, getAmazecom, getWondertel } = require('../../repository/inputs')

let accountsData = null;
let amazecomData = null;
let wondertelData = null;

const restructure = async (providerName, providerData) => {
  const data = [];
  providerData.grants.forEach((element) => { element['provider'] = providerName; element['type'] = 'grant'; data.push(element); });
  providerData.revocations.forEach((element) => { element['provider'] = providerName; element['type'] = 'revocation'; data.push(element); });
  return data;
}

const getInputs = async () => {
  accountsData = await getAccounts();
  amazecomData = await restructure('Amazecom', await getAmazecom());
  wondertelData = await restructure('Wondertel', await getWondertel());
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
  const gr = []
  amazecomData.forEach((element) => { if (element.number === accountNumber) { gr.push(element); } });
  wondertelData.forEach((element) => { if (element.number === accountNumber) { gr.push(element); } });
  gr.sort((x, y) => new Date(x.date) - new Date(y.date))
  return gr;


  // const Amazecom = await findAmazecom(accountNumber);
  // const Wondertel = await findWondertel(accountNumber);
};

const getSubscriptions = async () => {
  await getInputs();

  const subscriptions = {};
  for (const user of accountsData.users) {
    const grs = await getGrantsRevokes(user.number);
    console.log(grs); console.log(`------------------------`);
    const u = { owner: null, A: { start: null, end: null, days: 0 }, B: { start: null, end: null, days: 0 } }
    grs.forEach((gr) => {
      if (gr.type === 'grant') {
        if (gr.provider === 'Amazecom') {
          if (u.owner === null) u.owner = gr.provider;
          if (u.owner === gr.provider && (gr.period) && gr.period > 0) {
            if (u.A.start === null) {
              u.A.start = new Date(gr.date);
              const endDate = new Date(gr.date);
              endDate.setMonth(endDate.getMonth() + gr.period);
              u.A.end = endDate;
            } else {
              const endDate = new Date(u.A.end);
              endDate.setMonth(endDate.getMonth() + gr.period);
              u.A.end = endDate;
            }
            u.A.days = Math.floor((u.A.end.getTime() - u.A.start.getTime()) / (1000 * 3600 * 24));
          }
        } else if (gr.provider === 'Wondertel') {
          if (u.owner === null) u.owner = gr.provider;
          if (u.owner === gr.provider && (gr.period) && gr.period > 0) {
            if (u.B.start === null) {
              u.B.start = new Date(gr.date);
              const endDate = new Date(gr.date);
              endDate.setMonth(endDate.getMonth() + gr.period);
              u.B.end = endDate;
            } else {
              const endDate = new Date(u.B.end);
              endDate.setMonth(endDate.getMonth() + gr.period);
              u.B.end = endDate;
            }
            u.B.days = Math.floor((u.B.end.getTime() - u.B.start.getTime()) / (1000 * 3600 * 24));
          }
        }
        console.log(u)
      }
      else if (gr.type === 'revocation' && u.owner === gr.provider) {
        u.owner = null;
        if (gr.provider === 'Amazecom') {
          const endDate = new Date(gr.date);
          u.A.end = endDate;
          u.A.days = Math.floor((u.A.end.getTime() - u.A.start.getTime()) / (1000 * 3600 * 24));
        }
        else if (gr.provider === 'Wondertel') {
          const endDate = new Date(gr.date);
          u.B.end = endDate;
          u.B.days = Math.floor((u.B.end.getTime() - u.B.start.getTime()) / (1000 * 3600 * 24));
        }
        console.log(u)
      }
    });
    const subscription = {};
    if (u.A.days) { subscription['Amazecom'] = u.A.days }
    if (u.B.days) { subscription['Wondertel'] = u.B.days }
    if (Object.keys(subscription).length !== 0)
      subscriptions[user.name] = subscription
  }
  return { subscriptions };
};

module.exports = { getSubscriptions };