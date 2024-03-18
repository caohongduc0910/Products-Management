
const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    permission: {
        type: Array,
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedDate: Date
}, {
    timestamps: true
})

const Role = mongoose.model('Role', productSchema, 'roles')

module.exports = Role 