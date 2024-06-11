
//Permission
const tablePermission = document.querySelector('[table-permissions]')
const btnSubmit = document.querySelector('[button-submit]')

if (tablePermission) {
  btnSubmit.onclick = () => {
    let roles = []

    const rows = tablePermission.querySelectorAll('[data-name]')

    rows.forEach(row => {
      const name = row.getAttribute('data-name')
      const inputs = row.querySelectorAll('input')
      if (name == "id") {
        inputs.forEach(input => {
          const id = input.value
          roles.push({
            id: id,
            permission: []
          })
        })
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked
          if (checked) {
            roles[index].permission.push(name)
          }
        })
      }
    })
    console.log(roles)

    if (roles.length > 0) {
      const formPermissions = document.querySelector('[form-change-permissions]')
      const inputPermissions = document.querySelector('input[name="permissions"]')
      inputPermissions.value = JSON.stringify(roles)
      formPermissions.submit()
    }
  }
}

//Permission Data Default

const dataRoles = document.querySelector('[data-roles]')
if (dataRoles) {
  const data = dataRoles.getAttribute('data-roles')
  const records = JSON.parse(data)
  const tablePermission = document.querySelector('[table-permissions]')

  records.forEach((record, index) => {
    const permissions = record.permission

    permissions.forEach(permission => {
      const row = tablePermission.querySelector(`[data-name=${permission}]`)
      const input = row.querySelectorAll('input')[index]
      input.checked = true 
    })
  })
}