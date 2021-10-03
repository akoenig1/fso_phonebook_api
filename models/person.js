const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
require('dotenv').config()

const url = process.env.MONGODB_URI

console.log('Connecting to', url);

mongoose.connect(url)
  .then(res => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connetiong to MongoDB: ', err.message);
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: [3, 'Name must be at least 3 characters']
  },
  number: {
    type: String,
    required: true,
    minLength: [8, 'Number must be at least 8 digits']
  }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)