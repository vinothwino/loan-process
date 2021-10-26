const { Schema, model } = require('mongoose')
const { regex } = require('../helpers')
const bcrypt = require('bcryptjs')
const _ = require('lodash')

let loanSchema = Schema({
	customerId : {
		type : String
	},
	loan : {
		amount : Number,
		purpose : {
			type : Number,
			enum : [
				0, //Balance transfer
				1, //Travel
				2, //Personal consumption
				3, //Hospitalization
				4, //Furniture
				5, //Health and wellness
				6, //Home improvement
				7, //Electronics
				8, //Education
				9 //car repair
			],
			required:true
		},
		relationshipManager : {
			type : Schema.Types.ObjectId,
			ref : 'management'
		},
		relationshipManagerStatus : {
			type : Number,
			enum : [
				0, //Pending
				1, //processing
				2, //Approved
				3 //Declined
			],
			default : 0
		},
		message : String,
		managerStatus : {
			type : Number,
			enum : [
				0, //Pending
				1, //processing
				2, //Approved
				3 //Declined
			],
			default : 0
		},
		createdAt : {
			type : Date,
			default : Date.now
		}
	}
},{
	toJSON : {
		virtuals : true
	}
})


loanSchema.virtual('loanStatus')
	.get(function(){
		let { managerStatus,relationshipManagerStatus } = this.loan
		if(managerStatus === 2 && relationshipManagerStatus === 2)
			return 'Approved'
		if(managerStatus === 3 || relationshipManagerStatus ===3)
			return 'Declined'

		if(managerStatus !== 0 || relationshipManagerStatus !== 0)
			return 'Processing'
		if(managerStatus === 0 || relationshipManagerStatus === 0)
			return 'Pending'
	})


module.exports = new model('Loan',loanSchema)


