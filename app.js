require('./db/connection')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('config')



const app = express()

app.use(bodyParser.json());

//routes
require('./routes')(app)

const PORT = config.PORT || 5000

app.listen(PORT, () => {
  console.log('Listening on port', PORT)
})


module.exports = app