import 'unpoly'
import 'unpoly/unpoly.css'
import Toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import '../css/app.css'

up.on('up:link:follow', console.log)
up.on('up:fragment:loaded', function (event) {
  if (event?.response?.status === 403) {
    Toastr.error('You do not have the permission to do this')
    event?.preventDefault()
  }
})
up.compiler('.toastKeeper', function (/** @type {HTMLElement} */ element) {
  if (element.classList.contains('error')) Toastr.error(element.innerHTML)
  else if (element.classList.contains('success')) Toastr.success(element.innerHTML)
  else Toastr.info(element.innerHTML)
})

up.compiler('.supplierInput select', function (/** @type {HTMLSelectElement} */ element) {
  handleSupplierValue(element)
  element.addEventListener('input', () => handleSupplierValue(element))
  element.addEventListener('change', () => handleSupplierValue(element))
})

/**
 *
 * @param {HTMLSelectElement} select
 */
function handleSupplierValue(select) {
  /** @type {NodeListOf<HTMLElement>} */
  const domainInputs = document.querySelectorAll('.domainInput')

  domainInputs.forEach((input) => {
    const isCurrent = select.value === input.dataset.supplier
    input.style.display = isCurrent ? '' : 'none'
    const domainSelect = input.querySelector('select')

    if (domainSelect) domainSelect.name = isCurrent ? 'domain' : ''
  })
}
