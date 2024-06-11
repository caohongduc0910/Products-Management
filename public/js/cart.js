
const inputsQuantity = document.querySelectorAll("input[name='quantity']")
if (inputsQuantity) {
  inputsQuantity.forEach(input => {
    input.onchange = (e) => {
      const productID = input.getAttribute('item-id')
      const quantity = e.target.value
      if (parseInt(quantity) >= 1)
        window.location.href = `/cart/update/${productID}/${quantity}`
    }
  })
}