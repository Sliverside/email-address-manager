import 'unpoly'
import 'unpoly/unpoly.css'
import Toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import '../css/app.css'

up.compiler('.toastKeeper', function (/** @type {HTMLElement} */ element) {
  if (element.classList.contains('error')) Toastr.error(element.innerHTML)
  else if (element.classList.contains('success')) Toastr.success(element.innerHTML)
  else Toastr.info(element.innerHTML)
})
