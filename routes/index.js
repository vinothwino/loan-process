const customerRoutes = require('./customer')
const managementRoutes = require('./management')

module.exports = (app) => {
	app.use('/customer',customerRoutes)
	app.use('/management',managementRoutes)
}