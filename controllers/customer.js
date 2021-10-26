const CustomerModel = require('../models/customer')
const CustomerDetailModel = require('../models/customerDetail')
const ManagementModel = require('../models/management')
const LoanModel = require('../models/loan')
const { handleResponse } = require('../middleware')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const config = require('config')
const { Schema } = require('mongoose')

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

            let registeredUser = await CustomerModel.findOne(findQuery)

            if (registeredUser)
                throw Error('CUSTOMER_SIGNUP_USER_ALREADY_REGISTERED')

            let data = await new CustomerModel(req.body).populateCustomerId()

            return handleResponse(
                res,
                200,
                data,
                "CUSTOMER_SIGNUP_SUCCESSFULL"
            )

        } catch (err) {
            return handleResponse(res, 400, err, err.message)
        }
    },
    signIn: async (req, res) => {

        let { customerId, password } = req.body

        try {

            let user = await CustomerModel.findOne({ customerId })

            if (!user)
                throw Error("CUSTOMER_SIGNIN_UNAUTHORIZED")

            if (!bcrypt.compareSync(password, user.password))

                throw Error("CUSTOMER_SIGNIN_UNAUTHORIZED")

            let tokenData = _.pick(user, ['customerId', 'email', 'mobileNumber', 'userName'])

            tokenData['token'] = jwt.sign(tokenData, config.JWT_SECRET)

            return handleResponse(res, 200, tokenData, "CUSTOMER_SIGNIN_SUCCESSFULL")

        } catch (err) {
            return handleResponse(res, 401, err, err.message)
        }
    },
    updateProfile: async (req, res) => {

        try {

            let { customerId } = req.user

            let data = {
                $set: {
                    customerId,
                    customerDetail: req.body
                }
            }

            let query = {
                customerId
            }

            let option = {
                new: true,
                upsert: true,
                useFindAndModify: true
            }

            let customerDetail = await CustomerDetailModel.findOneAndUpdate(query, data, option)

            return handleResponse(res, 200, customerDetail, "CUSTOMER_UPDATE_DETAILS_SUCCESSFULL")

        } catch (err) {
            return handleResponse(res, 401, err, err.message)
        }
    },
    requestLoan: async (req, res) => {

        let { customerId } = req.user

        try{

            let isCustomerInformationFilled = await CustomerDetailModel.findOne({ customerId })

            if(!isCustomerInformationFilled)
                throw new Error("CUSTOMER_INFORMATION_NEED_TO_BE_FILLED")

        	let alreadyLoanApplied = await  LoanModel.findOne({ customerId })

        	if(alreadyLoanApplied)
        		throw Error("CUSTOMER_ALREADY_APPLIED_FOR_LOAN")

	        //GET TOTAL CUSTOMER RELATIONSHIP MANAGERS

	        let customerRelationShipManagers = await ManagementModel.find({ role: 1 })

	        //FILTER WITH _id

	        let customerRelationShipManagersIds = _.map(customerRelationShipManagers, '_id')

	        //GET THE COUNT OF MAPPED CUSTOMERS LOAN WITH RM WISE with the status pending or processing

	        let matchQuery = {
	            $match: {
	                'loan.relationshipManager': {
	                    $in: customerRelationShipManagersIds
	                }
	            }
	        }

            // let matchQuery2 = {
            //     $match: {
            //         'loan.relationshipManagerStatus': {
            //             $lt:2
            //         }
            //     }
            // }

	        let groupQuery = {
	            $group: {
	                _id: '$loan.relationshipManager',
	                count: { $sum: 1 }
	            }
	        }

	        let sortQuery = {
	            $sort: {
	                count: 1       
	            }
	        }

	        let alreadyAssignedRMList = await LoanModel.aggregate([matchQuery, groupQuery, sortQuery])

	        let idleRelationshipManagersList = _.filter(
	            customerRelationShipManagersIds,
	            function(_id) {
	                if (!alreadyAssignedRMList.length)
	                    return true
	                return !alreadyAssignedRMList.some(data => data._id.equals(_id))
	            }
	        )

	        let data = {
	            customerId,
	            loan: _.pick(req.body, ['purpose', 'amount'])
	        }

	        if (idleRelationshipManagersList.length)
	            data.loan['relationshipManager'] = idleRelationshipManagersList[0]
	        else
	            data.loan['relationshipManager'] = alreadyAssignedRMList[0]

	        let newLoan = await new LoanModel(data).save()

	        return handleResponse(res, 200, newLoan, "CUSTOMER_LOAN_REQUEST_SUCCESSFULL")

        }
        catch(err){
        	return handleResponse(res, 400, err, err.message)
        }
    },
    getLoanDetails : async(req,res) => {

        let { customerId } = req.user

        try{

            let LoanData = await LoanModel.findOne({ customerId })

            if(!LoanData)
                throw Error("CUSTOMER_LOAN_DATA_NOT_FOUND")
            
            return handleResponse(res, 200, LoanData, "CUSTOMER_GET_LOAN_DETAIL_SUCCESS")
        } 
        catch(err){
            return handleResponse(res, 400, err, err.message)
        }
    }
}