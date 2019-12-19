const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  }
}, { timestamps: true })

const model = mongoose.model('user', schema)

module.exports = model
