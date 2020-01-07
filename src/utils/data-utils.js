const { TYPE_GRANT, TYPE_REVOKE } = require('./constants');

const calculateDays = (provider) => {
  return Math.floor((provider.end.getTime() - provider.start.getTime()) / (1000 * 3600 * 24));
};

const restructure = async (providerName, providerData) => {
  const data = [];
  providerData.grants.forEach((element) => {
    element['provider'] = providerName; element['type'] = TYPE_GRANT; data.push(element);
  });
  providerData.revocations.forEach((element) => {
    element['provider'] = providerName; element['type'] = TYPE_REVOKE; data.push(element);
  });
  return data;
}

const getGrantsRevokes = async (accountNumber, amazecomData, wondertelData) => {
  const grantsRevokes = []
  amazecomData.forEach((element) => { if (element.number === accountNumber) { grantsRevokes.push(element); } });
  wondertelData.forEach((element) => { if (element.number === accountNumber) { grantsRevokes.push(element); } });
  grantsRevokes.sort((x, y) => new Date(x.date) - new Date(y.date))
  return grantsRevokes;
};

module.exports = {
  calculateDays,
  restructure,
  getGrantsRevokes
}