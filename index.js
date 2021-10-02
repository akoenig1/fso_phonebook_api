const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
const app = express()

// Middlewares
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if(err.name === 'CastError') {
    return res.status(400).send({ err: 'Malformatted id' })
  }

  next(err)
}

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

// Routes
app.get('/info', (req, res, next) => {
  const date = new Date();
  Person.find({})
    .then(persons => {
      const length = persons.length
      const info = `
        <p>Phonebook has info for ${length} people</p>
        <p>${date}</p>
      `
      res.send(info)
    })
    .catch(err => next(err))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    console.log(persons);
    res.json(persons)
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if((!body.name) || (!body.number)) {
    return res.status(400).json({
      error: 'Name and number required'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(person => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.use(errorHandler)

// Start App
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`)
})