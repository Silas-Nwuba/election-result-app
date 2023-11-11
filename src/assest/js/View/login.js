import { signUser } from '../Modal/loginModal';
//login
class login {
  #form = document.querySelector('form');
  #login = document.querySelector('.login');
  #loginModal = document.querySelector('.loginModal');
  #loginBtn = document.querySelector('.btn-login');
  #email = document.querySelector('.email');
  #password = document.querySelector('.password');
  #loaderSpinner = document.querySelector('.loader-spinner');
  #close = document.querySelector('.close');
  #backdropSpinner = document.querySelector('.backdrop');

  ////////////////////////////////
  #eyeFillIcon = document.querySelector('.bi-eye-fill');
  #eyeSlashIcon = document.querySelector('.bi-eye-slash-fill');

  showModalFunctionBtn() {
    this.#login.addEventListener('click', this.showModal.bind(this));
  }
  showModal() {
    document.querySelector('html').style.overflowY = 'hidden';
    const modal = this.#loginModal.querySelector('.modal');
    modal.style.display = 'block';
    modal.classList.add('backdrop');
    this.#loginModal.style.display = 'block';
    this.#loginBtn.querySelector('h6').style.display = 'block';
    this.#loaderSpinner.classList.add('loader-hidden');
  }
  closeIcon() {
    this.#close.addEventListener('click', this.hideModal.bind(this));
  }
  hideModal() {
    if (this.closeIcon) {
      document.querySelector('html').style.overflowY = 'visible';
      this.clearForm();
    }
  }

  loginFuntion() {
    this.#form.setAttribute('novalidate', '');
    this.#form.addEventListener('submit', this.validateForm.bind(this));
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

  emailvalidate() {
    let passwordErr = true;
    let emailErr = true;
    const emailRegx = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
    if (this.#email.value.trim() === null || this.#email.value.length === 0) {
      this.showError(this.#email, 'Please enter your email');
      emailErr = false;
    } else if (!emailRegx.test(this.#email.value.trim())) {
      this.showError(this.#email, 'valid email is required');
      emailErr = false;
    } else {
      this.showSuccess(this.#email);
      emailErr = true;
    }

    /////////////////////////////////////////
    ///password validation
    const passRegX = new RegExp('inecad+[0-9]{3,3}');
    const adminRegx = new RegExp('admin123');

    if (
      this.#password.value.trim() === null ||
      this.#password.value.length === 0
    ) {
      this.showError(this.#password, 'Please enter your password');
      passwordErr = false;
    } else if (
      passRegX.test(this.#password.value.trim()) ||
      adminRegx.test(this.#password.value.trim())
    ) {
      this.showSuccess(this.#password);
      passwordErr = true;
    } else if (
      !passRegX.test(this.#password.value.trim()) ||
      !adminRegx.test(this.#password.value.trim())
    ) {
      this.showError(this.#password, 'vaild password is required');
      passwordErr = false;
    } else {
      this.showSuccess(this.#password);
      passwordErr = true;
    }

    if (emailErr && passwordErr === true) {
      return true;
    } else {
      return false;
    }
  }

  loaderSpinner() {
    this.#loginBtn.querySelector('h6').innerHTML = 'Processing..';
  }
  clearForm() {
    this.#form.reset();
    this.#loginModal.querySelector('.modal').style.display = 'none';
    this.#loginModal.classList.remove('modal-backdrop');
    const emailparentElement = this.#form.querySelector('.email-input');
    const passwordparentElement = this.#form.querySelector('.password-input');
    const emailErrorMessage = emailparentElement.querySelector('small');
    const passwordErrorMessage = passwordparentElement.querySelector('small');
    emailErrorMessage.innerText = '';
    passwordErrorMessage.innerText = '';
  }
  showText() {
    this.#eyeFillIcon.addEventListener('click', this.showTextIcon.bind(this));
    this.#eyeSlashIcon.addEventListener(
      'click',
      this.showPasswordIcon.bind(this)
    );
  }
  showTextIcon(e) {
    const parentElement = e.target.parentElement.parentElement.parentElement;
    const inputType = parentElement.querySelector('.password');

    if (inputType.getAttribute('type') === 'password') {
      inputType.setAttribute('type', 'text');
      this.#eyeSlashIcon.classList.remove('hidden');
      this.#eyeFillIcon.classList.add('hidden');
    }
  }
  showPasswordIcon(e) {
    const parentElement = e.target.parentElement.parentElement.parentElement;
    const inputType = parentElement.querySelector('.password');
    if (inputType.getAttribute('type') === 'text') {
      inputType.setAttribute('type', 'password');
      this.#eyeSlashIcon.classList.add('hidden');
      this.#eyeFillIcon.classList.remove('hidden');
    }
  }
  validateForm(e) {
    e.preventDefault();
    if (this.emailvalidate()) {
      this.loaderSpinner();
      this.getInputData(this.#form);
    }
  }

  getInputData(input) {
    const email = input.querySelector('.email').value;
    const password = input.querySelector('.password').value;
    signUser(email, password);
  }
}
export default new login();
