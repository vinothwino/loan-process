const { Schema, model } = require('mongoose')
const { regex } = require('../helpers')
const bcrypt = require('bcryptjs')

let customerSchema = Schema({
	customerId : {
		type : String
	},
	firstName : {
		type : String,
		required : true,
		trim : true
	},
	lastName : {
		type : String,
		required : true,
		trim : true
	},
	email : {
		type : String,
		trim : true,
		unique : true,
		validate : {
			validator: function(value){
				return (regex.email).test(value)
			},
			message : 'Invalid email ID'
		}
	},
	mobileNumber : {
		type : Number
	},
	password : {
		type : String,
		requried : true,
		validate : {
			validator: function(value){
				return (regex.password).test(value)
			},
			message : 'Invalid password'
		}
	}
},{
	toJSON : {
		virtuals :true
	},
	timestamp : true
})

customerSchema
	.virtual('userName')
	.get(function(){
		return `${this.firstName} ${this.lastName}`
	})


customerSchema.methods.populateCustomerId = async function(){

	let User = this
	let count = await User.model('Customer').find({}).estimatedDocumentCount() + 1
	let customerId = 'SBI'+count.toString().padStart(6,0)
	User.customerId=customerId
	let data = await User.save()
	return data
}

customerSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})


module.exports = new model('Customer',customerSchema)


