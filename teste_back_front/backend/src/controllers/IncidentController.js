const connection = require('../database/connection')

module.exports = {
    async index(request, response) { 
        //valor padrao da pagina eh 1
        const { page = 1 } = request.query //query params ex: aluno?nota=10(aluno que a nota é 10)

        const [count] = await connection('incidents').count()

        const incident = await connection('incidents') // join juntando infos de 2 tabelas
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id') //na tabela ongs que o id da ong é igralo id do incident
            .limit(5) //limitar 5 incidentes por vez para caber na pagina
            .offset((page - 1) * 5) //vai comesar na pagina 1 do 0, na 2 do 5, e na 3 de 10 //
            .select(
            'incidents.*', //selecione todos os incidentes
            'ongs.name',  //selecione da ong o nome
            'ongs.email',
            'ongs.whatsapp',
            'ongs.city',
            'ongs.uf',
            )

        response.header('X-Total-Count', count['count(*)'])    

        return response.json(incident)
    },

    async create(request, response) {
        const { title, description, value } = request.body
        const ong_id = request.headers.authorization //array de 1 posição

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        })

        return response.json({ id })
    },

    async delete(request, response) {
        const {id} = request.params
        const ong_id = request.headers.authorization //array de 1 posição , id da ong logada

        const incident = await connection('incidents') // um incidente
            .where('id', id) // que o id seja igual o meu id
            .select('ong_id') // disso selecione a coluna ong_id
            .first() // como é apenas um resultado

        if (incident.ong_id != ong_id) { // se uma ong tentar excluir o incidente da outra
            return response.status(401).json({ error: "Operation not permitted."}) //erro 401
        }                

        await connection('incidents').where('id', id).delete()

        return response.status(204).send() //204 secesso
    }

}