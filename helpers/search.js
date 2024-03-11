module.exports = (query) => {

  const searchObject = {
    keyword: "",
    regex: ""
  }

  if(query.keyword){
    searchObject.keyword = query.keyword
    const regex = new RegExp(searchObject.keyword,"i") //Search without Case sensitive
    searchObject.regex = regex
  }

  return searchObject

}