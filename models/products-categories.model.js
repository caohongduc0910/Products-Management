
const mongoose = require('mongoose')
slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const productCategorySchema = new mongoose.Schema({ 
    title: String,
    parent_id: { 
      type: String,
      default: ""
  },
    description: String,
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
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ],
},{
    timestamps: true
})

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, 'products-categories')

module.exports = ProductCategory