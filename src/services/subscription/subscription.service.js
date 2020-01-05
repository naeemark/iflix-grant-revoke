const { accounts, amazecom, wondertel } = require('../../repository/inputs')

const subscription = () => {

  // return (await accounts(), await amazecom(), await wondertel())
  const a = accounts()

  return { a }
};

module.exports = { subscription };