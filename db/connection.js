const mongoose = require('mongoose')
const config = require('config')

let { DB } = config

mongoose.Promise = global.Promise

mongoose.connect(`${DB.BASE_URL}/${DB.NAME}`,{
	useUnifiedTopology: true,
	useNewUrlParser:true,
	useCreateIndex : true
})

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));