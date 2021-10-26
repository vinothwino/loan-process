const CustomerModel = require('../../models/customer');
const { CUSTOMER_SIGNUP_SUCCESS } = require('./variable')

const CleanCustomerModel = (done) => {
  CustomerModel.deleteOne({email : CUSTOMER_SIGNUP_SUCCESS.email}).then(() => {
  }).then(() => done());
};

module.exports = {
	CleanCustomerModel
}