const { Schema, model } = require('mongoose')
const { regex,formatToMoney } = require('../helpers')

let relation = [
	'father',
	'mother',
	'wife',
	'child'
]

let martialStatus = [
	'single',
	'engaged',
	'married',
	'divoced'
]

let typeOfEmployment = [
	'government',
	'private',
	'self-employee',
	'retired',
	'unemployee'
]

let rank = [
	"Employee",
	"Supervisor",
	"Asst.Manager",
	"Manager",
	"CEO/Chariman/Director",
	"Owner"
]

let customerDetailSchema = Schema({
	customerId : {
		type : String
	},
	customerDetail : {
		accountInformation : {
			accountNumber : {
				type : String
			}
		},
		personalInformation : { 
			dob: {
				type : String,
			},
			pan : {
				type : String,
			},
			aadhar : {
				type : String,
			},
			permanentHomeAddress : {
				type : String,
				trim : true
			},
			state : {
				type : String,
				trim : true
			},
			city : {
				type : String,
				trim : true
			},
			zipCode : {
				type : Number
			},
			nationality : {
				type : String,
			},
			martialStatus : {
				type : Number,
				enum : [
					0, //Single
					1, //Engaged
					2, //married
					3 //divoced
				],
				get : function(value){
					return martialStatus[value]
				}
			}
		},
		familymembersAndContacts : [{
			name : {
				type : String,
				trim : true
			},
			relation : {
				type : Number,
				enum : [
					0, //father
					1, //mother
					2, //wife
					3 //child
				],
				get : function(value){
					return relation[value]
				}
			},
			dob : {
				type : String
			},
			mobileNumber : {
				type : Number
			}
		}],
		workAndFinanceInformation : {
			typeOfEmployment : {
				type : Number,
				enum : [
					0, //Government
					1, //Private
					2, //Self-employee
					3, //Retired
					4 //UnEmployee
				],
				default : 0
			},
			officeName : {
				type : String
			},
			officeAddress : {
				type : String
			},
			officePhoneNumber : {
				type : Number
			},
			annualIncome : {
				type : Number,
				get : function(val){
					return `₹ ${formatToMoney(val)}`
				}
			},
			rank : {
				type : Number,
				get : function(value){
					return rank[value]
				},
				enum : [
					0, //Employee
					1, //Supervisor
					2, //Asst.Manager
					3, //Manager
					4, //CEO/Chariman/Director
					5 //Owner
				]
			},
			lengthOfService : {
				type : Number,
				get : (value) => `${value} years`
			}
		}
	}
},{
	  toObject : {getters: true,virtuals:true},
      toJSON : {getters: true,virtuals:true}
})

module.exports = new model('CustomerDetail', customerDetailSchema)