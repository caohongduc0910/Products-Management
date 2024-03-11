module.exports = (query, count) => {
  objectPagination = {
    limitItems: 4,
    currentPage: 1,
    startItem: 0
  }

  if (!isNaN(query.index)) {
    objectPagination.currentPage = query.index
    objectPagination.startItem = (parseInt(objectPagination.currentPage) - 1) * objectPagination.limitItems
  }

  
  objectPagination.totalPages = Math.ceil(count / objectPagination.limitItems)
  
  return objectPagination
}