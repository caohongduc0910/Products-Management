
const mongoose = require('mongoose')
slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const productSchema = new mongoose.Schema({ 
    title: String,
    description: String,
    product_category_id: { 
        type: String,
        default: ""
    },
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String, 
    position: Number,
    slug: { 
        type: String, 
        slug: "title",
        unique: true
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
},{
    timestamps: true
})

const Product = mongoose.model('Product', productSchema, 'products')

module.exports = Product 