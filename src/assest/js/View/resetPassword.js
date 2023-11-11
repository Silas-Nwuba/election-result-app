class resetPassword {
  #resetPasswordLink = document.querySelector('.forget-link');
  #resetPasswordModal = document.querySelector('.reset-password');
  #loginModal = document.querySelector('.loginModal');
  #btnReset = document.querySelector('.btn-reset');
  #resetEmail = document.querySelector('.reset-email');
  #close = document.querySelector('.close-reset-modal');
  #backdrop = document.querySelector('.loader-spinner-backdrop');

  resetFunction() {
    this.#resetPasswordLink.addEventListener(
      'click',
      this.showPasswordModal.bind(this)
    );
    this.#btnReset.addEventListener('click', this.validateEmail.bind(this));
  }
  showPasswordModal(e) {
    if (e.target) {
      this.#loginModal.style.display = 'none';
      const modal = this.#resetPasswordModal.querySelector('.modal');
      modal.style.display = 'block';
      modal.classList.add('loader-spinner-backdrop');
      this.#btnReset.querySelector('h6').style.display = 'block';
      this.#btnReset
        .querySelector('.loader-spinner')
        .classList.add('loader-hidden');
    }

    // const modal = this.#loginModal.querySelector('.modal');
    // modal.style.display = 'block';
    // modal.classList.add('');
  }
  closeIcon() {
    this.#close.addEventListener('click', this.hideModal.bind(this));
  }
  hideModal() {
    this.clearForm();
  }
  validateEmail(e) {
    e.preventDefault();
    if (this.emailvalidate(this.#resetEmail)) {
      this.loaderSpinner();
    }
  }
  showError(input, errorMessage) {
    const parentElement = input.parentElement;
    const message = parentElement.querySelector('small');
    message.innerText = errorMessage;
  }
  showSuccess(input) {
    const parentElement = input.parentElement;
    const message = parentElement.querySelector('small');
    message.innerText = '';
  }

  emailvalidate(input) {
    const emailRegx = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
    if (input.value.trim() === null || input.value.length === 0) {
      this.showError(input, 'Please enter your email');
      return false;
    }
    if (!emailRegx.test(input.value.trim())) {
      this.showError(input, 'A valid email is required');
      return false;
    } else {
      this.showSuccess(input);
      return true;
    }
  }
  loaderSpinner() {
    this.#btnReset
      .querySelector('.loader-spinner')
      .classList.remove('loader-hidden');
    this.#btnReset.querySelector('h6').style.display = 'none';
    this.#backdrop.style.display = 'block';
    setTimeout(() => {
      this.#loginModal.style.display = 'none';
      this.#backdrop.style.display = 'none';
      this.clearForm();
    }, 3000);
  }
  clearForm() {
    this.#resetPasswordModal.querySelector('form').reset();
    this.#resetPasswordModal.querySelector('.modal').style.display = 'none';
    this.#resetPasswordModal.classList.remove('modal-backdrop');
    this.#resetPasswordModal.querySelector('small').innerText = '';
  }
}
export default new resetPassword();
