/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://akoenig1:${password}@phonebook.7oems.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
  Person.find({}).then(res => {
    console.log('Phonebook:')
    res.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })
} else if(process.argv.length === 6) {
  const person = new Person({
    name: `${process.argv[3]} ${process.argv[4]}` ,
    number: process.argv[5]
  })

  person.save().then(res => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
    process.exit(1)
  })
} else {
  console.log('Invalid number of arguments. Provide password to retrieve all entries. Provide password, name, and number to add a new entry.')
  process.exit(1)
}



