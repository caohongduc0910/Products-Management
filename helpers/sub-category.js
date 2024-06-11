const ProductCategory = require('../models/products-categories.model')

module.exports.getSubCategory = async (parentID) => {

  const getCategory = async (parentID) => {
    const subs = await ProductCategory.find({
      deleted: false,
      status: "active",
      parent_id: parentID
    })

    const allSubs = [...subs]

    for (let sub in subs) {
      const arr = getCategory(sub)
      allSubs.concat(arr)
    }
    return allSubs
  }
  
  const allSub = await getCategory(parentID)
  return allSub
}