import { getDatabase, ref, onValue } from 'firebase/database';
import logout from './component/logout';
import { app, database } from '../Modal/config/firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';

const logoutEvent = document.querySelector('.logout');
const element = document.querySelector('.logout-modal');
const modal = document.querySelector('.modal').className;
const backdrop = document.querySelector('.backdrop').className;
const closeEventClass = document.querySelector('.close').className;
const declineBtn = document.querySelector('.decline');
const confirmBtn = document.querySelector('.confirm');
let totalOfficer = document.querySelector('.total-officer');
const totalScore = document.querySelector('.total-score');
const totalParty = document.querySelector('.total-party');
const totalPolliingUnit = document.querySelector('.total-polling');
const totalWard = document.querySelector('.wards');
const totalLga = document.querySelector('.lgas');
const countDown = document.querySelector('.count-down');
const countDownModal = document.querySelector('.countdown');
const form = document.querySelector('form');
const menuIcon = document.querySelector('.bi-list');
const menu = document.querySelector('.menu');
const overlay = document.querySelector('.backdrop');
const profileIcon = document.querySelector('.user-profile-icon');
const dropdown = document.querySelector('.dropdown-content');

const setHour = document.querySelector('.startHour');
const setMin = document.querySelector('.startMin');
const endHour = document.querySelector('.endHour');
const endMin = document.querySelector('.endMin');

//logout fuction
logout.logoutFunction(logoutEvent, element, modal, backdrop);
logout.closeModalFunction(closeEventClass, element, modal, backdrop);
logout.declineFunction(declineBtn, element, modal, backdrop);

const loader = document.querySelector('.loader-spinner');
const dashboard = document.querySelector('.dashboard-content');

const getData = () => {
  try {
    const db = getDatabase(app);
    const starCountRef = ref(db, 'electionResult');
    let apc = 0;
    let pdp = 0;
    let labour = 0;
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        loader.style.display = 'block';
        setTimeout(() => {
          snapshot.forEach((childsnapshot) => {
            const data = childsnapshot.val();
            const apcScore = +data.partyAScore;
            const pdpScore = +data.partyCScore;
            const labourScore = +data.partyBScore;
            apc += apcScore;
            pdp += pdpScore;
            labour += labourScore;
            const getItem = collection(database, 'users');
            getDocs(getItem).then((res) => {
              res.docs.map((item) => {
                dashboard.style.display = 'block';
                loader.style.display = 'none';
                if (item.id !== 'admin') {
                  totalOfficer.innerHTML = res.size - 1;
                }
                totalScore.innerHTML = childsnapshot.child.length
                  .toLocaleString('en-US')
                  .padStart(2, 0);
                totalLga.innerHTML = '08';
                totalPolliingUnit.innerHTML = '2,244';
                totalWard.innerHTML = '105';
                totalParty.innerHTML = '03';
              });
            });
            loader.style.display = 'none';
          });
        }, 2000);
      } else {
        loader.style.display = 'none';
        dashboard.style.display = 'block';
        const getItem = collection(database, 'users');
        getDocs(getItem).then((res) => {
          res.docs.map((item) => {
            dashboard.style.display = 'block';
            loader.style.display = 'none';
            if (item.id !== 'admin') {
              totalOfficer.innerHTML = res.size - 1;
            }
          });
        });
        totalLga.innerHTML = '08';
        totalPolliingUnit.innerHTML = '2,244';
        totalWard.innerHTML = '105';
        totalParty.innerHTML = '03';
        totalScore.innerHTML = '0';
      }
    });
  } catch (error) {
    alert(error.message);
  }
};
getData();

confirmBtn.addEventListener('click', () => {
  window.location.href = 'http://localhost:1234/';
});
//show election time
countDown.addEventListener('click', () => {
  const modal = countDownModal.querySelector('.modal');
  modal.style.display = 'block';
  const overlay = document.querySelector('.backdrop');
  overlay.style.display = 'block';
});
//close election timer
countDownModal.querySelector('.close').addEventListener('click', () => {
  const modal = countDownModal.querySelector('.modal');
  modal.style.display = 'none';
  const overlay = document.querySelector('.backdrop');
  overlay.style.display = 'none';
  form.reset();
  form.querySelectorAll('small').forEach((element) => {
    element.innerHTML = '';
  });
});
//set timer
const validateTimer = () => {
  form.setAttribute('novalidate', '');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allInputArray = [setHour, setMin, endHour, endMin];
    //  const hourArray = [setHour,endHour]
    if (checkAllInput(allInputArray)) {
      countDownTimer();
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
  small.textContent = `${message}`;
};
const checkAllInput = (input) => {
  let valid = false;
  const regrex = /^[0-9]{2}$/;
  input.forEach((element) => {
    if (element.value.trim() === '') {
      errorMessge(element, 'Field is required');
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

function countDownTimer() {
  const startHourEle = document.querySelector('.start-hour');
  const startMinEle = document.querySelector('.start-min');
  const startSecEle = document.querySelector('.start-sec');
  const currentTime = new Date();
  const startTime = new Date();
  const setHour24 = Number(setHour.value) * 12;
  const endHour24 = Number(endHour.value) * 12;
  console.log(setHour24, endHour24);
  const endTime = new Date();
  startTime.setHours(`${setHour24}`, `${setMin.value}`, 0, 0);
  endTime.setHours(`${endHour24}`, `${endMin.value}`, 0, 0);
  if (currentTime >= startTime && currentTime < endTime) {
    let hour = currentTime.getHours();
    const min = currentTime.getMinutes();
    const sec = currentTime.getSeconds();
    hour = hour % 12;
    hour = hour ? hour : 12;
    startHourEle.innerHTML = `${hour}`;
    startMinEle.innerHTML = `${min}`;
    startSecEle.innerHTML = `${sec}`;
  }
}
// setInterval(countDownTimer, 1000);
// validateTimer();

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
