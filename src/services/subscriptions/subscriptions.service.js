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
  for (const user of accountsData.users.slice(0, 1)) {
    const grs = await getGrantsRevokes(user.number);
    console.log(grs);
    const u = { owner: null, start: null, end: null, days: 0 }
    grs.forEach((gr) => {
      if (gr.type === 'grant' && u.owner === null) {
        u.owner = gr.provider;
        if (u.start === null)
          u.start = new Date(gr.date);
        const endDate = new Date(gr.date)
        endDate.setMonth(u.start.getMonth() + ((gr.period) ? gr.period : 0));
        u.end = endDate;
        var days = (u.end.getTime() - u.start.getTime()) / (1000 * 3600 * 24);
        u.days = days;
      }
      else if (gr.type === 'grant' && u.owner === gr.provider) {
        const endDate = new Date(u.end)
        endDate.setMonth(endDate.getMonth() + ((gr.period) ? gr.period : 0));
        var days = (endDate.getTime() - u.start.getTime()) / (1000 * 3600 * 24);
        u.end = endDate;
        u.days = days;
      }
      else if (gr.type === 'revocation' && u.owner === gr.provider) {
        u.owner = null
      }
    });
    subscriptions[user.name] = { [u.owner]: u.days }
  }
  return { subscriptions };
};

module.exports = { getSubscriptions };