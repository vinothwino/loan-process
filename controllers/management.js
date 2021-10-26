const ManagementModel = require('../models/management')
const { handleResponse } = require('../middleware')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const config = require('config')
const LoanModel = require('../models/loan')
const CustomerDetailModel = require('../models/customerDetail')
const { Types } = require('mongoose')

module.exports = {
    signUp: async (req, res) => {

        try {

            let findQuery = {
                $or: [{
                        email: req.body.email
                    },
                    {
                        mobileNumber: req.body.mobileNumber
                    }
                ]
            }

            let registeredUser = await ManagementModel.findOne(findQuery)

            if (registeredUser)
                throw Error('MANAGEMENT_SIGNUP_USER_ALREADY_REGISTERED')

            let data = await new ManagementModel(req.body).save()

            return handleResponse(
                res,
                200,
                data,
                "MANAGEMENT_SIGNUP_SUCCESSFULL"
            )
        } catch (err) {
            return handleResponse(res, 400, err, err.message)
        }
    },
    signIn: async (req, res) => {

        let { email, password } = req.body

        try {

            let user = await ManagementModel.findOne({ email })

            if (!user)
                throw Error("MANAGEMENT_SIGNIN_UNAUTHORIZED")

            if (!bcrypt.compareSync(password, user.password))

                throw Error("MANAGEMENT_SIGNIN_UNAUTHORIZED")

            let tokenData = _.pick(user, ['email', 'mobileNumber', 'userName', 'role', '_id'])

            tokenData['token'] = jwt.sign(tokenData, config.JWT_SECRET)

            return handleResponse(res, 200, tokenData, "MANAGEMENT_SIGNIN_SUCCESSFULL")
        } catch (err) {
            return handleResponse(res, 401, err, err.message)
        }
    },
    getLoanListForRelationshipManager: async (req, res) => {

        let { _id } = req.user

        try {

            let matchQuery = {
                $match: {
                    'loan.relationshipManager': Types.ObjectId(_id)
                }
            }

            let populateQuery = {
                $lookup: {
                    from: 'customerdetails',
                    localField: 'customerId',
                    foreignField: 'customerId',
                    as: 'customerDetails'
                }
            }

            let unwind = { "$unwind": "$customerDetails" }

            let list = await LoanModel.aggregate([matchQuery, populateQuery, unwind])

            return handleResponse(res, 200, list, "MANAGEMENT_RM_GETLOANLIST_SUCCESSFULL")

        } catch (err) {
            return handleResponse(res, 401, err, err.message)
        }
    },
    updateRelationshipManagerLoanStatus: async (req, res) => {

    	try {

	        let { customerId } = req.params

	        let { status } = req.body

            let updateStatue = await LoanModel.findOneAndUpdate({ customerId },{
                'loan.relationshipManagerStatus' : status
            })

            let matchQuery = {
                $match: {
                    'customerId': customerId
                }
            }

            let updateQuery = {
            	$set : {
            		'loan.relationshipManagerStatus' : status
            	}
            }

            let populateQuery = {
                $lookup: {
                    from: 'customerdetails',
                    localField: 'customerId',
                    foreignField: 'customerId',
                    as: 'customerDetails'
                }
            }

            let unwind = { "$unwind": "$customerDetails" }

            let list = await LoanModel.aggregate([matchQuery, populateQuery, unwind])

            return handleResponse(res, 200, list, "MANAGEMENT_RM_GETLOANLIST_SUCCESSFULL")

    	} catch (err) {
            return handleResponse(res, 400, err, err.message)
        }
    },
    updateManagerLoanStatus: async (req, res) => {
    	try {
    		
	        let { customerId } = req.params

	        let { status } = req.body

            let updateStatue = await LoanModel.findOneAndUpdate({ customerId },{
                'loan.managerStatus' : status
            })

            let matchQuery = {
                $match: {
                    'customerId': customerId
                }
            }

            let populateQuery = {
                $lookup: {
                    from: 'customerdetails',
                    localField: 'customerId',
                    foreignField: 'customerId',
                    as: 'customerDetails'
                }
            }

            let unwind = { "$unwind": "$customerDetails" }

            let list = await LoanModel.aggregate([matchQuery, populateQuery, unwind])

            return handleResponse(res, 200, list, "MANAGEMENT_RM_GETLOANLIST_SUCCESSFULL")

    	} catch (err) {
            return handleResponse(res, 400, err, err.message)
        }
    },
    getLoanList: async (req, res) => {
    	try {


            let populateQuery = {
                $lookup: {
                    from: 'customerdetails',
                    localField: 'customerId',
                    foreignField: 'customerId',
                    as: 'customerDetails'
                }
            }

            let populateQuery1 = {
                $lookup: {
                    from: 'managements',
                    localField: 'loan.relationshipManager',
                    foreignField: '_id',
                    as: 'relationshipManagerProfile'
                }
            }

            let project = {
                $project : {
                    _id :1,
                    loan : 1,
                    customerId : 1,
                    'relationshipManagerProfile._id' : 1,
                    'relationshipManagerProfile.userName' : 1,
                    'relationshipManagerProfile.mobileNumber' : 1
                }
            }

            let unwind = { "$unwind": "$customerDetails" }

            let list = await LoanModel.aggregate([populateQuery1,populateQuery, unwind,project])

            return handleResponse(res, 200, list, "MANAGEMENT_RM_GETLOANLIST_SUCCESSFULL")

    	} catch (err) {
            return handleResponse(res, 400, err, err.message)
        }
    }
}