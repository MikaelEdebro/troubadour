const { check } = require('express-validator/check')

module.exports = [
  check('artist')
    .not()
    .isEmpty()
    .withMessage('Artist is missing')
    .trim(),
  check('title')
    .not()
    .isEmpty()
    .withMessage('Title is missing')
    .trim(),
  check('body')
    .not()
    .isEmpty()
    .withMessage('Body is missing')
    .trim(),
]
