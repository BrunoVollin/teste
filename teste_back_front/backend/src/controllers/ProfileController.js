const connection = require("../database/connection")

module.exports = {
    async index(request, response) {
        const ong_id = request.headers.authorization //array de 1 posição , id da ong logada

        const incidents = await connection('incidents') // um incidente
            .where('ong_id', ong_id) // que o id seja igual o meu id
            .select('*') // disso selecione a coluna ong_id
        
        return response.json(incidents)    
    } 
}