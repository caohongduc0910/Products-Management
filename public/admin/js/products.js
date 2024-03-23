//Active/Inactive btn
const buttonChangeStatus = document.querySelectorAll('[button-change-status]')

if(buttonChangeStatus.length > 0){
  
  const formChangeStatus = document.querySelector('#form-change-status')

  buttonChangeStatus.forEach(button => {  
    
    button.onclick = function() {
      const status = button.getAttribute('button-status')
      const id = button.getAttribute('data-id')
      const changeStatus = (status == "active") ? "inactive" : "active"
    
      const action = formChangeStatus.getAttribute('data-path') + `/${changeStatus}/${id}?_method=PATCH`
      
      formChangeStatus.action = action
      // console.log(action)
      formChangeStatus.submit()
    }  
  })
}

//Delete Btn

const buttonDelete = document.querySelectorAll('[button-delete]')
const formDelete = document.querySelector('#form-delete')

if(buttonDelete.length > 0){
  buttonDelete.forEach((button) => {
    button.addEventListener('click', () => {
      const answer = confirm("Bạn có chắc muốn xóa sản phẩm này")

      if(answer) {
         const id = button.getAttribute('data-id')
         const path = formDelete.getAttribute('data-path') + `${id}?_method=DELETE`
         formDelete.action = path
         formDelete.submit()
      }
    })
  })
}