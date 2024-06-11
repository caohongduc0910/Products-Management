
const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    permission: {
        type: Array,
        default: []
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now()
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    // deletedDate: Date
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ],
}, {
    timestamps: true
})

const Role = mongoose.model('Role', productSchema, 'roles')

module.exports = Role 