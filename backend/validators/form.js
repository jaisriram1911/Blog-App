const { check } = require('express-validator');

exports.contactCreateValidator = [
    check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
    check('email')
    .isEmail()
    .withMessage('must be a valid email address'),
    check('message')
    .not()
    .isEmpty()
    .isLength({min: 20})
    .withMessage('message must be atleast 20 characters long')
];