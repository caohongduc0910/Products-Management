
//Active/Inactive btn
const buttonsChangeStatus = document.querySelectorAll('[button-change-status]')

if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector('#form-change-status')

  buttonsChangeStatus.forEach(buttonChangeStatus => {
    buttonChangeStatus.onclick = () => {
  
      const id = buttonChangeStatus.getAttribute('data-id')
      const changeStatus = (buttonChangeStatus.getAttribute('button-status') == "active")? "inactive" : "active"
      const action = formChangeStatus.getAttribute('data-path') + `/${changeStatus}/${id}?_method=PATCH`

      formChangeStatus.action = action
      formChangeStatus.submit()

    }
  })
}

// //Delete button
// const buttonDelete = document.querySelectorAll('[button-delete]')
// const formDelete = document.querySelectorAll('#form-delete')

// if (buttonDelete) {
//   buttonDelete.forEach(btn => {
//     btn.addEventListener('click', () => {
//       const answer = alert("Bạn có chắc muốn xóa danh mục này?")

//       if (answer) {
//         const id = btn.getAttribute('data-id')
//         const path = formDelete.getAttribute('data-path') + `${id}?_method=DELETE`
//         formDelete.action = path
//         formDelete.submit()
//       }
//     })
//   })
// }