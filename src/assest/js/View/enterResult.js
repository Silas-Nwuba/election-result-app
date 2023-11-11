import logout from './component/logout.js';
import { createData } from '../Modal/enterResultModal.js';
import Swal from 'sweetalert2';
import data from '../../../data.json';
import toastr from 'toastr';
import { startAfter } from 'firebase/database';

//element
const timerElement = document.querySelectorAll('.time');
const electionTypeBtn = document.querySelector('.election-type');
const showResultForm = document.querySelector('.result-form');
const form = document.querySelector('form');
const state = document.querySelector('.state');
const localGovt = document.querySelector('.local-govt');
const registrationArea = document.querySelector('.registration-area');
const pollUnit = document.querySelector('.polling-unit');
const selects = document.querySelectorAll('.select');
const totalAccredited = document.querySelector('.Total_Accedited_Vote');
const totalValid = document.querySelector('.Total_Valid_Vote');
const partyA = document.querySelector('.partyA');
const partyAScore = document.querySelector('.partyAScore');
const partyB = document.querySelector('.partyB');
const partyBScore = document.querySelector('.partyBScore');
const partyC = document.querySelector('.partyC');
const partyCScore = document.querySelector('.partyCScore');
const remark = document.querySelector('.remark');
const summitBtn = document.querySelector('.upload-btn');
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
const countdownElement = document.querySelector('.countdown');
const countdownLink = document.querySelector('.count-down');
const countDownModal = document.querySelector('.close');
const setHour = document.querySelector('.startHour');
const setMin = document.querySelector('.startMin');
const endHour = document.querySelector('.endHour');
const endMin = document.querySelector('.endMin');

electionTypeBtn.addEventListener('click', () => {
  showResultForm.style.display = 'block';
  electionTypeBtn.style.display = 'none';
});

//countdown timer
function countDown() {
  const currentTime = new Date();
  const startTime = new Date();
  const endTime = new Date();
  startTime.setHours(1, 7, 0, 0);
  endTime.setHours(2, 50, 0, 0);
  if (currentTime >= startTime && currentTime < endTime) {
    let hour = currentTime.getHours();
    const min = currentTime.getMinutes();
    const sec = currentTime.getSeconds();
    const ampm = hour > 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    timerElement.forEach((element) => {
      element.innerHTML = `Timer: ${hour}: ${min
        .toString()
        .padStart(2, 0)} : ${sec.toString().padStart(2, 0)} ${ampm}`;
    });
    // timerElement.style.color = 'green';
    summitBtn.removeAttribute('disabled');
  } else {
    summitBtn.setAttribute('disabled', true);
    timerElement.forEach((element) => {
      element.innerHTML = 'Timer: 00h : 00m : 00s';
    });
  }
}
setInterval(countDown, 1000);
countDown();

window.onload = function () {
  localGovt.disabled = true;
  registrationArea.disabled = true;
  pollUnit.disabled = true;

  selects.forEach((select) => {
    if (select.disabled === true) {
      select.style.cursor = 'auto';
    }
  });
  state.options[state.options.length] = new Option(data.state, data.state);

  //state change
  state.addEventListener('change', (e) => {
    if (e.target.value === 'BAYELSA') {
      localGovt.disabled = false;
      registrationArea.disabled = true;
      pollUnit.disabled = true;

      localGovt.length = 1;
      registrationArea.length = 1;
      pollUnit.length = 1;

      data.lgas.forEach((item, id) => {
        const { lga } = item;
        //prettier-ignore
        localGovt.options[localGovt.options.length] = new Option(`0${id + 1} - ${lga}`,lga);
      });
    } else {
      localGovt.disabled = true;
      registrationArea.disabled = true;
      pollUnit.disabled = true;

      localGovt.length = 1;
      registrationArea.length = 1;
      pollUnit.length = 1;
    }
  });
  //local government change
  localGovt.addEventListener('change', (e) => {
    if (e.target.value != '') {
      registrationArea.disabled = false;
      pollUnit.disabled = true;
      registrationArea.length = 1;
      pollUnit.length = 1;
      data.lgas.forEach((item) => {
        if (item.lga === e.target.value) {
          item.wards.forEach((ward, id) => {
            //prettier-ignore
            registrationArea.options[registrationArea.options.length] = new Option(`0${id + 1} - ${ward}`,ward);
          });
        }
      });
    } else {
      registrationArea.disabled = true;
      registrationArea.length = 1;
    }
  });
  //registration area change
  registrationArea.addEventListener('change', (e) => {
    if (e.target.value != '') {
      pollUnit.disabled = false;
      pollUnit.length = 1;
      data.lgas.forEach((item) => {
        item.poll.forEach((poll) => {
          const { wardname, pollingUnit } = poll;
          if (e.target.value === wardname) {
            pollingUnit.forEach((pollingUnit, id) => {
              //prettier-ignore
              pollUnit.options[pollUnit.options.length] = new Option(`0${id + 1} - ${pollingUnit}`,pollingUnit);
            });
          }
        });
      });
    } else {
      pollUnit.disabled = true;
      pollUnit.length = 1;
    }
  });
};
//form validation
const validateForm = () => {
  form.setAttribute('novalidate', '');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allInputArray = [
      state,
      localGovt,
      registrationArea,
      pollUnit,
      totalAccredited,
      totalValid,
      partyA,
      partyAScore,
      partyB,
      partyBScore,
      partyC,
      partyCScore,
      remark,
    ];
    const inputValueValidate = [
      totalAccredited,
      totalValid,
      partyAScore,
      partyBScore,
      partyCScore,
    ];

    if (
      checkAllInput(allInputArray) &&
      checkInputValue(inputValueValidate) &&
      checkValidVote(totalAccredited, totalValid) &&
      checkPartyVote(totalValid, partyAScore, partyBScore, partyCScore)
    ) {
      getFormData();
    }
  });
};
const success = (input) => {
  const formGroup = input.parentElement;
  const small = formGroup.querySelector('small');
  small.innerHTML = '';
};
const errorMessge = (input, message) => {
  const formGroup = input.parentElement;
  const small = formGroup.querySelector('small');
  small.textContent = `${getInputName(formGroup)} ${message}`;
};
const getInputName = (input) => {
  const text = input.querySelector('label');
  return text.textContent;
};
const checkAllInput = (input) => {
  let valid = false;
  input.forEach((element) => {
    if (element.value.trim() === '' || element.value.length === 0) {
      errorMessge(element, 'is required');
      valid = false;
    } else {
      success(element);
      valid = true;
    }
  });
  if (valid) {
    return true;
  }
};
const checkInputValue = (input) => {
  let valid = false;
  const regrex = /^[0-9]+$/;
  input.forEach((element) => {
    if (element.value.trim() == '') {
      errorMessge(element, 'is required');
      valid = false;
    } else if (!regrex.test(element.value.trim())) {
      errorMessge(element, 'is invalid');
      valid = false;
    } else {
      success(element);
      valid = true;
    }
  });
  if (valid) {
    return true;
  }
};
const checkValidVote = (totalaccredited, totalvalid) => {
  let valid = false;
  if (Number(totalvalid.value) > Number(totalaccredited.value)) {
    Swal.fire({
      icon: 'error',
      title: '<h4 style="color:rgb(179, 6, 6)"> Error</h4>',
      text: 'Result are in Accurate',
      confirmButtonColor: 'rgb(3, 133, 3)',
    });
    valid = false;
  } else if (Number(totalaccredited.value) < Number(totalvalid.value)) {
    Swal.fire({
      icon: 'error',
      title: '<h4 style="color:rgb(179, 6, 6)"> Error</h4>',
      text: 'Result are in Accurate',
      confirmButtonColor: 'rgb(3, 133, 3)',
    });
    valid = false;
  } else {
    valid = true;
  }

  if (valid) {
    return true;
  }
};
const checkPartyVote = (totalvalid, scoreA, scoreB, scoreC) => {
  let valid = false;
  //prettier-ignore
  const totalPartyScore = Number(scoreA.value) + Number(scoreB.value) + Number(scoreC.value);
  if (totalPartyScore > Number(totalvalid.value)) {
    Swal.fire({
      icon: 'error',
      title: '<h4 style="color:rgb(179, 6, 6)"> Error</h4>',
      text: 'Result are not accurate',
      confirmButtonColor: 'rgb(3, 133, 3)',
    });
    valid = false;
  } else if (totalPartyScore < Number(totalvalid.value)) {
    Swal.fire({
      icon: 'error',
      title: '<h4 style="color:rgb(179, 6, 6)"> Error</h4>',
      text: 'Result are not accurate',
      confirmButtonColor: 'rgb(3, 133, 3)',
    });
    valid = false;
  } else {
    valid = true;
  }
  if (valid) {
    return true;
  }
};

const getFormData = () => {
  const resultData = {
    state: state.value,
    localGovt: localGovt.value,
    ward: registrationArea.value,
    pollingUnit: pollUnit.value,
    totalAccredited: totalAccredited.value,
    totalValidVote: totalValid.value,
    partyA: partyA.value,
    partyB: partyB.value,
    partyBScore: partyBScore.value,
    partyAScore: partyAScore.value,
    partyC: partyC.value,
    partyCScore: partyCScore.value,
    remark: remark,
  };
  createData(resultData);
};
validateForm();

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

//show election time
countdownLink.addEventListener('click', () => {
  //prettier-ignore
  const modal = countDownModal.parentElement.parentElement.parentElement.parentElement
  modal.style.display = 'block';
  const overlay = document.querySelector('.backdrop');
  overlay.style.display = 'block';
});
//close election timer
countDownModal.addEventListener('click', () => {
  //prettier-ignore
  const modal = countDownModal.parentElement.parentElement.parentElement.parentElement
  modal.style.display = 'none';
  const overlay = document.querySelector('.backdrop');
  overlay.style.display = 'none';
  form.reset();
  form.querySelectorAll('small').forEach((element) => {
    element.innerHTML = '';
  });
});
//set timer
countdownElement.querySelector('form').setAttribute('novalidate', '');
countdownElement.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const allInputArray = [setHour, setMin, endHour, endMin];
  //  const hourArray = [setHour,endHour]
  if (checkAllInputCountdown(allInputArray)) {
    getCountdownData(setHour, setMin, endHour, endMin);
  }
});
const checkAllInputCountdown = (input) => {
  let valid = false;
  input.forEach((element) => {
    if (element.value.trim() === '') {
      toastr.error('input field is required');
      valid = false;
    } else {
      valid = true;
      // countdownElement.querySelector('form').reset();
    }
  });
  if (valid) {
    return true;
  }
};
const getCountdownData = (startHour, startMin, endHour, endMin) => {
  countDownTimer(startHour, startMin, endHour, endMin);
};
function countDownTimer(startHour, startMin, endHour, endMin) {
  const setHour = document.querySelector('.start-hour');
  const setMin = document.querySelector('.start-min');
  const setSec = document.querySelector('.start-sec');
  const currentTime = new Date();
  const startTime = new Date();
  const endTime = new Date();
  const timeStartHour = Number(startHour.value) + 12;
  const timeEndHour = Number(endHour.value) + 12;
  //prettier-ignore
  startTime.setHours(timeStartHour,`${Number(startMin.value)}`, 0, 0);
  endTime.setHours(timeEndHour, `${Number(endMin.value)}`, 0, 0);
  if (currentTime >= startTime && currentTime < endTime) {
    let hour = currentTime.getHours();
    const min = currentTime.getMinutes();
    const sec = currentTime.getSeconds();
    console.log(hour, min, sec);
    hour = hour % 12;
    hour = hour ? hour : 12;
    setHour.innerHTML = `${hour}`;
    setMin.innerHTML = `${min}`;
    setSec.innerHTML = `${sec}`;
  }
}
setInterval(countDownTimer, 1000);
// validateTimer();

toastr.options = {
  preventDuplicates: true,
  preventOpenDuplicate: true,
};

//logout function
logout.logoutFunction(logoutEvent, element, modal, backdrop);
logout.closeModalFunction(closeEventClass, element, modal, backdrop);
logout.closeModalFunction(closeEventClass, element, modal, backdrop);
logout.declineFunction(declineBtn, element, modal, backdrop);

//confirm logout
confirmBtn.addEventListener('click', () => {
  window.location.href = 'http://localhost:1234/';
});
