const express = require('express')
const cors = require('cors')
const routes = require('./routes')

const app = express()

app.use(cors())
//depois trocar urlencoded por json
app.use(express.json()) 
app.use(routes)


app.listen(3333) //app trabalha na porta 3333