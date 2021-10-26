const { formatResponse } = require('../helpers')
const { validationResult } = require('express-validator')
const messages = require('../messages')
const config = require('config')
const jwt = require('jsonwebtoken')

const handleFieldError = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0].msg;
        return res.status(400).json(
                    formatResponse(400, null, firstError)
                );
    }
    next()
}

const handleResponse = (res,status,data=null,messageType) => {
    let message = messages[messageType]
    if(message){
        res.status(status).json(
            formatResponse(
                status,
                data,
                message
            )
        )
    }else{
        res.status(500).json(
            formatResponse(
                500,
                null,
                data.errmsg
            )
            
        )
    }
}

const authorizeCustomer = (req,res,next) => {
    let { token } = req.headers
    if(!token)
        return handleResponse(res,401,null,'CUSTOMER_UNAUTHORIZED')
    let user = jwt.verify(token,config.JWT_SECRET)
    if(!user || user.role)
        return handleResponse(res,401,null,'CUSTOMER_UNAUTHORIZED')
    req.user = user
    next()

}

const authorizeCustomerRelationshipManager = (req,res,next) => {

    let { token } = req.headers

    if(!token)
        return handleResponse(res,401,null,'CUSTOMER_UNAUTHORIZED')

    let user = jwt.verify(token,config.JWT_SECRET)

    if(!user|| user.role !== 1)
        return handleResponse(res,401,null,'CUSTOMER_UNAUTHORIZED')

    req.user = user

    next()
}

const authorizeManager = (req,res,next) => {

    let { token } = req.headers

    if(!token)
        return handleResponse(res,401,null,'CUSTOMER_UNAUTHORIZED')

    let user = jwt.verify(token,config.JWT_SECRET)

    if(!user|| user.role !== 2)
        return handleResponse(res,401,null,'CUSTOMER_UNAUTHORIZED')

    req.user = user
    
    next()
}



module.exports = {
	handleFieldError,
    handleResponse,
    authorizeCustomer,
    authorizeCustomerRelationshipManager,
    authorizeManager
}