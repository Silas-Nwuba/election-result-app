import AOS from 'aos/src/js/aos.js';
import login from './login.js';
import resetPassword from './resetPassword.js';
import siderbar from './component/sidebar.js';

const initFuntion = function () {
  //login function call
  ////////////////////////////////////////////
  login.showModalFunctionBtn();
  login.closeIcon();
  login.loginFuntion();
  login.showText();
  ///////////////////////////////////
  //reset password call
  resetPassword.resetFunction();
  resetPassword.closeIcon();

  const loginSidebar = document.querySelector('.login-sidebar');
  const closeIcon = document.querySelector('.closeIcon');

  //sidebar
  loginSidebar.addEventListener('click', () => {
    sidebar.style.left = '-400px';
    backdropSideBar.style.display = 'none';
    const loginModal = document.querySelector('.loginModal');
    const modal = loginModal.querySelector('.modal');
    modal.style.display = 'block';
    modal.classList.add('backdrop');
    loginModal.style.display = 'block';
  });

  const listIcon = document.querySelector('.bi-list');
  const sidebar = document.querySelector('.sidebar');
  const backdropSideBar = document.querySelector('.backdrop');
  listIcon.addEventListener('click', () => {
    sidebar.style.left = 0;
    backdropSideBar.style.display = 'block';
  });
  closeIcon.addEventListener('click', () => {
    sidebar.style.left = '-400px';
    backdropSideBar.style.display = 'none';
  });
};

initFuntion();
AOS.init();
