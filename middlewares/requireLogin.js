const isTestMode = process.env.NODE_ENV === 'test'

module.exports = (req, res, next) => {
  // make sure we can still access routes in tests, create mock user
  if (isTestMode) {
    req.user = require('../test/mocks').user
  }

  if (!req.user) {
    res.status(401).send({ error: 'Not authorized' })
  }

  next()
}
