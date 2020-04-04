const knex = require('knex')
const configuration = require('../../knexfile')

//development do arquivo knexfile
const connection = knex(configuration.development)  

module.exports = connection