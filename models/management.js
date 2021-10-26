const { Schema, model } = require('mongoose')
const { regex } = require('../helpers')
const bcrypt = require('bcryptjs')

let managementSchema = Schema({
	userName : {
		type : String,
		required : true,
		trim : true
	},
	email : {
		type : String,
		trim : true,
		unique : true
	},
	password : {
		type : String,
		requried : true
	},
	mobileNumber : {
		type : Number,
	},
	role : {
		type : Number,
		enum : [
			1, //customer relationship manager
			2 //manager
		],
		default : 1
	}
},{timestamp:true})

managementSchema.pre('save', function (next) {
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


module.exports = new model('Management',managementSchema)


