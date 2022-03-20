const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    insecureAuth: true
})

connection.connect()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/pokemon', (req, res) => {
    connection.query('CALL get_pokemon();', (err, results, fields) => {
        let pokemon = results[0]
        pokemon = pokemon.map((e) => {
            e.types = e.types.split(',')
            return e
        })
        res.send(pokemon)
    })
})

app.get('/pokemon/:no', (req, res) => {
    let no = req.params.no
    connection.execute('CALL get_pokemon_no(?);', [no], (err, results, fields) => {
        let pokemon = results[0]
        pokemon = pokemon.map((e) => {
            e.types = e.types.split(',')
            return e
        })
        res.send(pokemon)
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})