
const closeModal = (id) => {
    const signupModal = document.querySelector(`#${id}`)
    const modal = bootstrap.Modal.getInstance(signupModal)
    modal.hide()
} 
export default closeModal