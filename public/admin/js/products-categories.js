
//Delete button

const buttonDelete = document.querySelectorAll('[button-delete]')
const formDelete = document.querySelectorAll('#form-delete')

if(buttonDelete){
  buttonDelete.forEach(btn => {
    btn.onclick = () => {
      const answer = alert("Bạn có chắc muốn xóa danh mục này?")
      
      if(answer) {
        const id = btn.getAttribute('data-id')
        const path = formDelete.getAttribute('data-path') + `${id}?_method=DELETE`
        formDelete.action = path
        formDelete.submit()
     }
    }
  })
}