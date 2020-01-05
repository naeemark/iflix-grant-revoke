const { subscription } = require('./services/subscription')

subscription().then((a) => console.log(a.accounts, a.amazecom, a.wondertel));