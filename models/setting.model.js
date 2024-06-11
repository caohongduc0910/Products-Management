const mongoose = require('mongoose')
const generate = require('../helpers/generate')

const settingSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String, 
    email: String,
    address: String,
    copyright: String
  },
  {
    timestamps: true
  })

const Setting = mongoose.model('Setting', settingSchema, 'settings')

module.exports = Setting