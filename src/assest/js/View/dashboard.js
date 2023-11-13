import { getDatabase, ref, onValue } from 'firebase/database';
import logout from './component/logout';
import { app, database } from '../Modal/config/firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import toastr from 'toastr';
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
form.setAttribute('novalidate', '');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const allInputArray = [setHour, setMin, endHour, endMin];
  if (checkAllInput(allInputArray)) {
    const obj = {
      setHour: Number(setHour.value) + 12,
      setMin: Number(setMin.value),
      endHour: Number(endHour.value) + 12,
      endMin: Number(endMin.value),
    };
    const key = 'timer';
    localStorage.setItem(key, JSON.stringify(obj));
    successMessage();
    toastr.success('Time successfully set');
  }
});
const checkAllInput = (input) => {
  let valid = false;
  input.forEach((element) => {
    if (element.value.trim() === '') {
      toastr.error('input field is required');
      valid = false;
    } else {
      valid = true;
    }
  });
  if (valid) {
    return true;
  }
};
const successMessage = () => {
  const modal = countDownModal.querySelector('.modal');
  modal.style.display = 'none';
  const overlay = document.querySelector('.backdrop');
  overlay.style.display = 'none';
  form.reset();
};
toastr.options = {
  preventDuplicates: true,
  preventOpenDuplicate: true,
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

//show profile modal
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

//logout fuction
logout.logoutFunction(logoutEvent, element, modal, backdrop);
logout.closeModalFunction(closeEventClass, element, modal, backdrop);
logout.declineFunction(declineBtn, element, modal, backdrop);

//confirm logout
confirmBtn.addEventListener('click', () => {
  window.location.href = 'http://localhost:1234/';
});
