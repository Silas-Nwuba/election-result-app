class logout {
  logoutFunction(eventTarget, element, modal, backdrop) {
    eventTarget.addEventListener('click', () => {
      document.querySelector('html').style.overflowY = 'hidden';
      const modalElement = element.querySelector(`.${modal}`);
      modalElement.style.display = 'block';
      modalElement.classList.add(`${backdrop}`);
    });
  }
  closeModalFunction(eventTargetClass, element, modal, backdrop) {
    element
      .querySelector(`.${eventTargetClass}`)
      .addEventListener('click', () => {
        document.querySelector('html').style.overflowY = 'visible';
        element.querySelector(`.${modal}`).style.display = 'none';
        element.classList.remove(`.${backdrop}`);
      });
  }
  confirmFunction(declinebtn, element, modal, backdrop) {
    declinebtn.addEventListener('click', () => {
      document.querySelector('html').style.overflowY = 'visible';
      element.querySelector(`.${modal}`).style.display = 'none';
      element.classList.remove(`.${backdrop}`);
      document.querySelector('.enter-result').classList.add('hidden');
      document.querySelector('.logout').classList.add('hidden');
      //prettier-ignore
      document.querySelector(".welcome-message").classList.add("hidden")
    });
  }
  declineFunction(declinebtn, element, modal, backdrop) {
    declinebtn.addEventListener('click', () => {
      document.querySelector('html').style.overflowY = 'visible';
      element.querySelector(`.${modal}`).style.display = 'none';
      element.classList.remove(`${backdrop}`);
    });
  }
}
export default new logout();
