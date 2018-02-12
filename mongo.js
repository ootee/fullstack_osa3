const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const person = new Person({
  name: process.argv[2],
  number: process.argv[3]
})

if (process.argv[2] !== undefined && process.argv[3] !== undefined) {
  console.log('Lisätään henkilö', process.argv[2], 'numero', process.argv[3], 'luetteloon.')
  person
    .save()
    .then(result => {
      console.log('Henkilön tiedot lisätty.')
      mongoose.connection.close()
    })
} else {
  console.log('Puhelinluettelo:')
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}



