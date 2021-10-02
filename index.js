const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
const app = express()

// Local Data
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  const max = 100000
  const id = Math.floor(Math.random() * max)
  return id
}

// Middlewares
morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))


// Routes
app.get('/info', (req, res) => {
  const date = new Date();
  const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `
  res.send(info)
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

  console.log(persons.filter(p => p.name === body.name));

  if(persons.filter(p => p.name === body.name).length > 0) {
    return res.status(400).json({
      error: 'Name already exists in phonebook'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person);

  res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);
  if(person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id);

  res.status(204).end()
})


// Start App
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`)
})