const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const static = require('static')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
morgan.token('type', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send('Puhelinluettelossa on ' + persons.map(p => p.name).length + ' henkilön tiedot.<br><br>' + new Date())
    })
})
app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
})
app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(formatPerson(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })

})
app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})
app.post('/api/persons', (req, res) => {
  const body = req.body
  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: 'Name and number are required.' })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  Person
    .find({ name: req.body.name })
    .then(result => {
      if (result.length > 0) {
        res.status(400).send({ error: 'person already in database' })
      } else {
        person
          .save()
          .then(savedPerson => {
            res.json(formatPerson(savedPerson))
          })
      }

    })
})
app.put('/api/persons/:id', (req, res) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(formatPerson(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})
const generateId = () => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}
const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)

})