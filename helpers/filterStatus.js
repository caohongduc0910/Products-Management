module.exports = (query) => {
  let filterStatus = [{
    name: 'Tất cả',
    status: "",
    class: ""
  },
  {
    name: "Hoạt động",
    status: "active",
    class: ""
  },
  {
    name: "Dừng hoạt động",
    status: "inactive",
    class: ""
  }]
  
  if (query.status) {
    const idx = filterStatus.findIndex(function (item) {
      return item.status == query.status
    })
    filterStatus[idx].class = "active"
  }
  else {
    const idx = filterStatus.findIndex(function (item) {
      return item.status == ""
    })
    filterStatus[idx].class = "active"
  }
  return filterStatus
}