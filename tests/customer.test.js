const expect = require('expect');
const request = require('supertest');
const { CleanCustomerModel } = require('./common/customer')

const { CUSTOMER_SIGNUP_SUCCESS } = require('./common/variable')

const app = require('../app');

const CustomerModel = require('../models/customer');

describe('POST /customer/signup', () => {

    after(CleanCustomerModel)

    it('should signup a customer', (done) => {

        request(app)
            .post('/customer/signup')
            .send(CUSTOMER_SIGNUP_SUCCESS)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.email).toBe(CUSTOMER_SIGNUP_SUCCESS.email);
                expect(res.body.data.mobileNumber).toBe(CUSTOMER_SIGNUP_SUCCESS.mobileNumber);
            })
            .end((err, res) => {
                if(err)
                    return done(err)
                return done()
            });
    });

    it('should fail if the email or mobileNumber matches', (done) => {

        request(app)
            .post('/customer/signup')
            .send(CUSTOMER_SIGNUP_SUCCESS)
            .expect(400)
            .end((err, res) => {
                if(err)
                    return done(err)
                done()
            });
    });
})