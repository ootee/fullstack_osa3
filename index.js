const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const static = require('static')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
morgan.token('type', (req, res) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))

let persons = [
    {
        "name": "Arto Järvinen",
        "number": "050-123454",
        "id": 1
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Martti Ahtisaari",
        "number": "050-5485522",
        "id": 3
    },
    {
        "name": "Marko Ahtisaari",
        "number": "050-8865873",
        "id": 4
    }
]

app.get('/info', (req, res) => {
    res.send('Puhelinluettelossa on ' + persons.map(p => p.name).length + ' henkilön tiedot.<br><br>' + new Date())
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'Name and number are required.' })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    if (persons.find(p => p.name.toLowerCase() === person.name.toLowerCase())) {
        return res.status(400).json({ error: 'Name must be unique.' })
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)

})