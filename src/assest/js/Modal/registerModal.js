import 'core-js/stable';
import 'regenerator-runtime/runtime.js';
import { database } from './config/firebaseConfig.js';
import { setDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';
const form = document.querySelector('form');
const loader = document.querySelector('.loader-spinner');
const displayLoader = () => {
  document.querySelector('html').style.overflowY = 'hidden';
  loader.style.display = 'block';
};
const hideLoader = () => {
  document.querySelector('html').style.overflowY = 'visible';
  loader.style.display = 'none';
  resetForm();
};
const resetForm = () => {
  form.reset();
};
const generateId = (start, range) => {
  let id = Math.floor(Math.random() * range + start);
  while (id > range) {
    id = Math.floor(Math.random() * range + start);
  }
  return id;
};
export const createData = (data) => {
  displayLoader();
  setDoc(doc(database, 'users', `PO${generateId(100, 1000)}`), data)
    .then(() => {
      hideLoader();
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '<h4 style="color:rgb(3, 133, 3)"> Success</h4>',
          text: 'Successfully Registered',
          confirmButtonColor: 'rgb(3, 133, 3)',
        });
      }, 1000);
    })
    .catch(() => {
      hideLoader();
      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: '<h4 style="color:rgb(179, 6, 6)"> Error</h4>',
          text: 'Netwok Error',
          confirmButtonColor: 'rgb(3, 133, 3)',
        });
      }, 1000);
    });
};

// //admin registeration
// setDoc(doc(database, 'users', 'admin'), {
//   firstname: 'silas',
//   lastname: 'nwuba',
//   middlename: 'ebuka',
//   gender: 'male',
//   age: 24,
//   email: 'nwubasilas@yahoo.com',
//   stateOfOrigin: 'Anambra',
//   password: 'admin123',
//   confirmPassword: 'admin123',
// })
//   .then((response) => {
//     alert(response);
//   })
//   .catch((error) => {
//     alert(error.message);
//   });
