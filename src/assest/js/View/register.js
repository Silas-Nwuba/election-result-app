import logout from './component/logout.js';
import { createData } from '../Modal/registerModal.js';

function init() {
  const logoutEvent = document.querySelector('.logout');
  const element = document.querySelector('.logout-modal');
  const modal = document.querySelector('.modal').className;
  const backdrop = document.querySelector('.backdrop').className;
  const closeEventClass = document.querySelector('.close').className;
  const declineBtn = document.querySelector('.decline');
  const confirmBtn = document.querySelector('.confirm');
  const menuIcon = document.querySelector('.bi-list');
  const menu = document.querySelector('.menu');
  const overlay = document.querySelector('.backdrop');
  const profileIcon = document.querySelector('.user-profile-icon');
  const dropdown = document.querySelector('.dropdown-content');

  // //////////////////////////////////////////////
  //form validation
  const validateForm = () => {
    const fname = document.querySelector('.first-name');
    const lname = document.querySelector('.last-name');
    const middleName = document.querySelector('.middle-name');
    const genderParent = document.querySelector('.gender-content');
    const gender = genderParent.querySelectorAll('.gender');
    const age = document.querySelector('.age');
    const email = document.querySelector('.email');
    const stateOfOrigin = document.querySelector('.stateOfOrigin');
    const password = document.querySelector('.password');
    const confirmPassword = document.querySelector('.confirmPassword');

    //prettier-ignore
    let nameErr = gendersErr = ageErr = emailErr = countryErr = passwordErr = confirmPasswordErr = true;

    if (fname.value.trim() === '') {
      errorMessage(fname, 'is required');
      nameErr = false;
    } else {
      const regrex = /^[a-zA-Z]+$/;
      if (!regrex.test(fname.value.trim())) {
        errorMessage(fname, 'is not valid');
        nameErr = false;
      } else {
        successMessage(fname);
        nameErr = true;
      }
    }
    if (lname.value.trim() === '') {
      errorMessage(lname, 'is required');
      nameErr = false;
    } else {
      const regrex = /^[a-zA-Z]+$/;
      if (!regrex.test(lname.value.trim())) {
        errorMessage(lname, 'is not valid');
        nameErr = false;
      } else {
        successMessage(lname);
        nameErr = true;
      }
    }
    if (middleName.value.trim() === '') {
      errorMessage(middleName, 'is required');
      nameErr = false;
    } else {
      const regrex = /^[a-zA-Z]+$/;
      if (!regrex.test(middleName.value.trim())) {
        errorMessage(middleName, 'is not valid');
        nameErr = false;
      } else {
        successMessage(middleName);
        nameErr = true;
      }
    }
    if (gender[0].checked === false && gender[1].checked === false) {
      errorMessage(genderParent, 'is required');
      gendersErr = false;
    } else {
      successMessage(genderParent);
      genderErr = false;
    }
    if (age.value === '') {
      errorMessage(age, 'is required');
      ageErr = false;
    } else {
      const regrex = /^[0-9]+$/;
      if (!regrex.test(age.value.trim())) {
        errorMessage(age, 'is not valid');
        ageErr = false;
      } else if (Number(age.value) < 18) {
        errorMessage(age, 'should not be less than 18');
        ageErr = false;
      } else if (Number(age.value) > 40) {
        errorMessage(age, 'should not be greater than 40');
        ageErr = false;
      } else {
        successMessage(age);
        ageErr = true;
      }
    }

    if (email.value.trim() === '') {
      errorMessage(email, 'is required');
      emailErr = false;
    } else {
      const regrex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
      if (!regrex.test(email.value.trim())) {
        errorMessage(email, 'is not valid');
        emailErr = false;
      } else {
        successMessage(email);
        emailErr = true;
      }
    }

    if (stateOfOrigin.value === 'Choose...') {
      errorMessage(stateOfOrigin, 'is required');
      countryErr = false;
    } else {
      successMessage(stateOfOrigin);
      countryErr = true;
    }

    if (password.value.trim() === '') {
      errorMessage(password, 'is required');
      passwordErr = false;
    } else {
      const regex = new RegExp('inecad+[0-9]{3,3}');
      if (!regex.test(password.value.trim())) {
        errorMessage(password, 'is not valid');
        passwordErr = false;
      } else {
        successMessage(password);
        passwordErr = true;
      }
    }

    if (confirmPassword.value.trim() === '') {
      errorMessage(confirmPassword, 'is required');
      confirmPasswordErr = false;
    } else if (confirmPassword.value.trim() != password.value.trim()) {
      errorMessage(confirmPassword, 'do not match');
      confirmPasswordErr = false;
    } else {
      successMessage(confirmPassword);
      confirmPasswordErr = true;
    }
    //prettier-ignore
    if((nameErr  && gendersErr && ageErr && emailErr && countryErr && passwordErr && confirmPasswordErr) === true ){
      return true;
    }
    else{
      return false;
    }
  };

  const errorMessage = (input, message) => {
    const inputParent = input.parentElement;
    const small = inputParent.querySelector('small');
    small.classList.add('error-message');
    small.textContent = `${getInputName(inputParent)} ${message}`;
  };
  const successMessage = (input) => {
    const inputParent = input.parentElement;
    const small = inputParent.querySelector('small');
    small.classList.remove('error-message');
    small.textContent = '';
  };
  const getInputName = (input) => {
    const text = input.querySelector('label');
    return text.textContent;
  };
  const showTextPassword = () => {
    const eyeIcon = document.querySelector('.eye-icon');
    const eyeFillIcon = document.querySelector('.bi-eye-fill');
    const eyeSlashIcon = document.querySelector('.bi-eye-slash-fill');
    //////////////////////////////////////////////////////
    //changing password type to text type
    eyeIcon.addEventListener('click', () => {
      const inputType = document.querySelector('.password');
      if (inputType.getAttribute('type') === 'password') {
        inputType.setAttribute('type', 'text');
        eyeSlashIcon.classList.remove('hidden');
        eyeFillIcon.classList.add('hidden');
      } else if (inputType.getAttribute('type') === 'text') {
        inputType.setAttribute('type', 'password');
        eyeSlashIcon.classList.add('hidden');
        eyeFillIcon.classList.remove('hidden');
      }
    });
  };
  const showTextConfirmPassword = () => {
    const eyeIcon = document.querySelector('.confirmPassword-eye-icon');

    //////////////////////////////////////////////////////
    //changing password type to text type
    eyeIcon.addEventListener('click', (e) => {
      const parentElement = e.target.parentElement.parentElement;
      const eyeSlashIcon = parentElement.querySelector('.bi-eye-slash-fill');
      const eyeFillIcon = parentElement.querySelector('.bi-eye-fill');
      const inputType = document.querySelector('.confirmPassword');
      if (inputType.getAttribute('type') === 'password') {
        inputType.setAttribute('type', 'text');
        eyeSlashIcon.classList.remove('hidden');
        eyeFillIcon.classList.add('hidden');
      } else if (inputType.getAttribute('type') === 'text') {
        inputType.setAttribute('type', 'password');
        eyeSlashIcon.classList.add('hidden');
        eyeFillIcon.classList.remove('hidden');
      }
    });
  };
  showTextPassword();
  showTextConfirmPassword();
  const form = document.querySelector('form');
  form.setAttribute('novalidate', '');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (validateForm()) {
      sendDataToFirebase(form);
    }
  });

  const sendDataToFirebase = (formElement) => {
    const firstName = formElement.querySelector('.first-name').value;
    const lastName = formElement.querySelector('.last-name').value;
    const middleName = formElement.querySelector('.middle-name').value;
    const gender = formElement.querySelector('.gender:checked').value;
    const age = formElement.querySelector('.age').value;
    const email = formElement.querySelector('.email').value;
    const stateOfOrigin = formElement.querySelector('.stateOfOrigin').value;
    const password = formElement.querySelector('.password').value;
    const confirmPassword = formElement.querySelector('.confirmPassword').value;
    //prettier-ignore
    const data = {
     firstName : firstName,
     lastName : lastName,
     middleName : middleName,
     gender : gender,
     age:age,
     email : email,
     stateOfOrigin:stateOfOrigin,
     password : password,
     confirmPassword:confirmPassword
    }
    createData(data);
  };

  //sidebar menu
  menuIcon.addEventListener('click', () => {
    menu.style.left = 0;
    overlay.style.display = 'block';
    dropdown.style.display = 'none';
  });
  //close sidebar menu
  overlay.addEventListener('click', () => {
    menu.style.left = '-400px';
    overlay.style.display = 'none';
  });

  // //show profile modal
  profileIcon.addEventListener('click', () => {
    dropdown.classList.toggle('show');
  });
  window.addEventListener('click', function (event) {
    const target = event.target;
    if (!target.closest('.user-profile-icon')) {
      if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
      }
    }
  });
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  logout.logoutFunction(logoutEvent, element, modal, backdrop);
  logout.closeModalFunction(closeEventClass, element, modal, backdrop);
  logout.declineFunction(declineBtn, element, modal, backdrop);
  //confirm logout
  confirmBtn.addEventListener('click', () => {
    window.location.href = 'http://localhost:1234/';
  });
}

init();
