const { check } = require('express-validator')
const { regex, checkIsValidDate } = require('../helpers')

module.exports = {
    signUpValidator: [
        check('firstName', 'first name is required').not().isEmpty(),
        check('lastName', 'last name is required').not().isEmpty(),
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
        check('customerId', 'customerId is required').not().isEmpty()
        .contains('SBI')
        .withMessage('Enter the valid customer ID'),
        check('password', 'password is required').not().isEmpty()
    ],
    updateCustomerDetailValidator: [
        //account information
        check('accountInformation', 'accountInformation is required').not().isEmpty(),

        check('accountInformation.accountNumber', 'accountNumber is required field in accountInformation').not().isEmpty()
            .matches(regex.accountNumber)
            .withMessage('Enter the valid account number'),
        //personal information
        check('personalInformation', 'personalInformation is required').not().isEmpty(),
        check('personalInformation.dob', 'dob is required field in personalInformation').not().isEmpty()
        .custom(checkIsValidDate)
        .withMessage('Enter the valid dob'),
        check('personalInformation.pan', 'pan is required field in personalInformation').not().isEmpty()
        .matches(regex.pan)
        .withMessage('Enter the valid pan number'),
        check('personalInformation.aadhar', 'aadhar is required field in personalInformation').not().isEmpty()
        .matches(regex.aadhar)
        .withMessage('Enter the valid aadhar number'),
        check('personalInformation.permanentHomeAddress', 'permanentHomeAddress is required field in personalInformation').not().isEmpty(),
        check('personalInformation.zipCode', 'zipCode is required field in personalInformation').not().isEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Enter the valid zip code'),
        check('personalInformation.nationality', 'nationality is required field in personalInformation').not().isEmpty(),
        check('personalInformation.martialStatus', 'martialStatus is required field in personalInformation').not().isEmpty()
        .custom(function(value) { return [0, 1, 2, 3, 4].includes(value) })
        .withMessage('Enter the valid martialStatus'),
        check('personalInformation.city', 'city is required field in personalInformation').not().isEmpty(),
        check('personalInformation.state', 'state is required field in personalInformation').not().isEmpty(),
        //family memeber details
        check('familymembersAndContacts', 'familymembersAndContacts is required').exists()
        .isArray()
        .withMessage('familymembersAndContacts should be an array')
        .custom(value => value.length >= 2)
        .withMessage("Atleast two family member is required"),
        check('familymembersAndContacts.*.name', 'name is required field in familymembersAndContacts').not().isEmpty(),
        check('familymembersAndContacts.*.relation', 'relation is required field in familymembersAndContacts').not().isEmpty(),
        check('familymembersAndContacts.*.dob', 'dob is required field in familymembersAndContacts').not().isEmpty(),
        check('familymembersAndContacts.*.mobileNumber', 'mobileNumber is required field in familymembersAndContacts').not().isEmpty()
        .isLength({ min: 10, max: 10 })
        .withMessage('Enter valid mobileNumber in familymembersAndContacts'),
        //work and finance information
        check('workAndFinanceInformation', 'workAndFinanceInformation is required').not().isEmpty(),
        check('workAndFinanceInformation.typeOfEmployment', 'typeOfEmployment is required field in workAndFinanceInformation').not().isEmpty()
        .custom(function(value) { return [0, 1, 2, 3, 4].includes(value) })
        .withMessage('Enter the valid typeOfEmployment'),
        check('workAndFinanceInformation.officeName', 'officeName is required field in workAndFinanceInformation').not().isEmpty(),
        check('workAndFinanceInformation.officeAddress', 'officeAddress is required field in workAndFinanceInformation').not().isEmpty(),
        check('workAndFinanceInformation.officePhoneNumber', 'officePhoneNumber is required field in workAndFinanceInformation').not().isEmpty()
        .isLength({ min: 10, max: 10 })
        .withMessage('Enter the valid office phone number'),
        check('workAndFinanceInformation.annualIncome', 'annualIncome is required field in workAndFinanceInformation').not().isEmpty(),
        check('workAndFinanceInformation.rank', 'rank is required field in workAndFinanceInformation').not().isEmpty()
        .custom(function(value) { return [0, 1, 2, 3, 4, 5].includes(value) })
        .withMessage('Enter the valid rank'),
        check('workAndFinanceInformation.lengthOfService', 'lengthOfService is required field in workAndFinanceInformation').not().isEmpty()
        .custom(value => typeof value === 'number' && value > 0)
        .withMessage('Enter the valid length of service')
    ],
    requestLoanValidator : [
        check('amount', 'amount is required').not().isEmpty(),
        check('purpose', 'purpose is required').not().isEmpty()
    ]
}