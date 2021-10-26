const router = require('express').Router()
const customerValidation = require('../validations/customer')
const customerController = require('../controllers/customer')
const { handleFieldError,authorizeCustomer } = require('../middleware')

router.use('/profile',authorizeCustomer)
router.use('/loan',authorizeCustomer)

router.post(
	'/auth/signup',
	customerValidation.signUpValidator,
	handleFieldError,
	customerController.signUp
)

router.post(
	'/auth/signin',
	customerValidation.signInValidator,
	handleFieldError,
	customerController.signIn
)

router.post(
	'/profile/updateCustomerDetail',
	customerValidation.updateCustomerDetailValidator,
	handleFieldError,
	customerController.updateProfile
)

router.post(
	'/loan/requestLoan',
	customerValidation.requestLoanValidator,
	handleFieldError,
	customerController.requestLoan
)

router.get(
	'/loan/loanDetails',
	customerController.getLoanDetails
)

module.exports = router