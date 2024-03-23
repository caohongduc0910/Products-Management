
//Button status
const btns = document.querySelectorAll('[button-status]')

if (btns.length > 0) {

  let url = new URL(window.location.href)

  btns.forEach(btn => {
    btn.onclick = () => {
      const status = btn.getAttribute('button-status')
      if (status) {
        url.searchParams.set('status', status)
      } else {
        url.searchParams.delete('status')
      }
      // console.log(url)
      window.location.href = url.href
    }
  })
}


//Form Search
const searchBtn = document.querySelector('#forms-search')
if (searchBtn) {
  let url = new URL(window.location.href)

  searchBtn.addEventListener('submit', (e) => {
    e.preventDefault()
    const keyword = e.target.elements.keyword.value

    if (keyword) {
      url.searchParams.set('keyword', keyword)
    } else {
      url.searchParams.delete('keyword')
    }

    window.location.href = url.href
  })
}


//Page button
const pageBtns = document.querySelectorAll('[page-index]')

if (pageBtns.length > 0) {

  let url = new URL(window.location.href)

  pageBtns.forEach(pageBtn => {

    pageBtn.onclick = () => {

      const index = pageBtn.getAttribute('page-index')

      if (index) {
        url.searchParams.set('index', index)
      } else {
        url.searchParams.delete('index')
      }
      window.location.href = url.href

    }

  })
}


//Checkbox
const boxMulti = document.querySelector('[checkbox-multi]')

if (boxMulti) {

  const checkBoxMulti = document.querySelector('input[name="checkall"]')
  const checkBoxOnes = document.querySelectorAll('input[name="id"]')

  checkBoxMulti.onclick = function () {
    if (checkBoxMulti.checked) {
      checkBoxOnes.forEach((checkBoxOne) => {
        checkBoxOne.checked = true
      })
    } else {
      checkBoxOnes.forEach((checkBoxOne) => {
        checkBoxOne.checked = false
      })
    }
  }

  checkBoxOnes.forEach((checkBoxOne => {
    checkBoxOne.onclick = () => {
      const cnt = document.querySelectorAll('input[name="id"]:checked').length
      // console.log(cnt)
      if (cnt == checkBoxOnes.length) {
        checkBoxMulti.checked = true
      }
      else {
        checkBoxMulti.checked = false
      }
    }
  }))

}

//Submit btn (Áp dụng)
const formChangeMulti = document.querySelector("[form-change-multi]")

if (formChangeMulti) {
  formChangeMulti.addEventListener('submit', (e) => {
    e.preventDefault()

    const typeChange = e.target.elements.type.value
    if (typeChange == "delete-all") {
      const answer = confirm("Bạn có chắc muốn xóa những sản phẩm này ?")
      if (!answer) {
        return
      }
    }

    const boxChecked = document.querySelectorAll('input[name="id"]:checked')
    const formArea = document.querySelector('input[name="ids"]')
    if (boxChecked.length > 0) {
      let ids = []
      boxChecked.forEach((box) => {

        const id = box.value

        if (typeChange == "change-position") {
          const position = box.closest("tr").querySelector('input[name="position"]').value
          ids.push(`${id} - ${position}`)

        } else {
          ids.push(id)
        }

      })

      ids = ids.join(", ")
      formArea.value = ids

      formChangeMulti.submit()

    } else {
      alert("Chọn ít nhất 1 sản phẩm để tiếp tục")
    }

  })
}

//Alert
const showAlert = document.querySelector('[show-alert]')
if (showAlert) {
  const closeBtn = document.querySelector('[close-alert]')
  const time = parseInt(showAlert.getAttribute('data-time'))
  console.log(time)

  setTimeout(() => {
    showAlert.classList.add('alert-hidden')
  }, time)

  closeBtn.onclick = () => {
    showAlert.classList.add('alert-hidden')
  }
}


//Img preview

const updateImage = document.querySelector('[upload-image]')
const updateImageInput = document.querySelector('[upload-image-input]')
const updateImagePreview = document.querySelector('[upload-image-preview]')
const closePreviewBtn = document.querySelector('[close-preview]')

if (updateImage) {
  updateImageInput.addEventListener('change', (e) => {

    console.log(e.target.files)
    const fileName = e.target.files[0]
    if (fileName) {
      updateImagePreview.src = URL.createObjectURL(fileName)
    }
  })

  closePreviewBtn.onclick = () => {
    updateImageInput.value = ""
    updateImagePreview.src = ""
  }
}

//Sort
const sortSelect = document.querySelector('[sort-select]')
const sortClear = document.querySelector('[sort-clear]')

if (sortSelect) {

  let url = new URL(window.location.href)

  sortSelect.onchange = (e) => {
    const query = e.target.value
    const arr = query.split("-")
    const [sortKey, sortValue] = arr

    url.searchParams.set('sortKey', sortKey)
    url.searchParams.set('sortValue', sortValue)

    window.location.href = url.href
  }

  const sortKey = url.searchParams.get('sortKey')
  const sortValue = url.searchParams.get('sortValue')
  const string = `${sortKey}-${sortValue}`

  if (string) {
    const sortOption = sortSelect.querySelector(`option[value=${string}]`)
    sortOption.selected = true
  }
}
