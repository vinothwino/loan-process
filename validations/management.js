const { check,param } = require('express-validator')
const { regex, checkIsValidDate } = require('../helpers')

module.exports = {
    signUpValidator: [
        check('userName', 'userName is required').not().isEmpty(),
        check('mobileNumber', 'mobile number is required').not().isEmpty()
        .isLength({ min: 10, max: 10 })
        .withMessage('Enter valid mobileNumber'),
        check('email', 'Email is required').not().isEmpty()
        .isEmail()
        .withMessage('Enter the valid email'),
        check('password', 'Password is required').not().isEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(regex.password)
        .withMessage('Password must contain one character & one special character!!')
    ],
    signInValidator: [
        check('email', 'email is required').not().isEmpty()
        .isEmail()
        .withMessage('Enter the valid email ID'),
        check('password', 'password is required').not().isEmpty()
    ],
    updateLoanStatusValidator : [
        param('customerId', 'customerId is required in params').exists()
    ]
}