const router = require('express').Router()
const managementValidation = require('../validations/management')
const managementController = require('../controllers/management')
const { handleFieldError,authorizeCustomerRelationshipManager,authorizeManager } = require('../middleware')

router.use('/customerRelationshipManager',authorizeCustomerRelationshipManager)
// router.use('/manager',authorizeManager)

router.post(
	'/auth/signup',
	managementValidation.signUpValidator,
	handleFieldError,
	managementController.signUp
)

router.post(
	'/auth/signin',
	managementValidation.signInValidator,
	handleFieldError,
	managementController.signIn
)

router.get(
	'/customerRelationshipManager/loans',
	managementController.getLoanListForRelationshipManager
)

router.put(
	'/customerRelationshipManager/loan/:customerId',
	managementValidation.updateLoanStatusValidator,
	handleFieldError,
	managementController.updateRelationshipManagerLoanStatus
)

router.put(
	'/manager/loan/:customerId',
	managementValidation.updateLoanStatusValidator,
	handleFieldError,
	managementController.updateManagerLoanStatus
)

router.get(
	'/manager/loans',
	managementController.getLoanList
)

module.exports = router