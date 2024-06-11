const mongoose = require('mongoose')
const generate = require('../helpers/generate')

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: {
      type: String,
      default: generate.generateRandomNumber(6)
    },
    "expireAt": {
      type: Date,
      expires: 180
    }
  },
  {
    timestamps: true
  })

const forgotPassword = mongoose.model('forgotPassword', forgotPasswordSchema, 'forgot-password')

module.exports = forgotPassword 