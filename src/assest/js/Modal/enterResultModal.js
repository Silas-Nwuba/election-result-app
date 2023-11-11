import { getDatabase, set, ref } from 'firebase/database';
import { app } from './config/firebaseConfig';
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
  const db = getDatabase(app);
  const userId = `inecr${generateId(100, 1000)}`;
  set(ref(db, 'electionResult/' + userId), data)
    .then(() => {
      hideLoader();
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '<h4 style="color:rgb(3, 133, 3)">Success</h4>',
          text: 'Successfully uploaded',
          confirmButtonColor: 'rgb(3, 133, 3)',
        });
      }, 1000);
    })
    .catch(() => {
      hideLoader();
      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: '<h4 style="color:rgb(179, 6, 6)">Error</h4>',
          text: 'Result not uploaded',
          confirmButtonColor: 'rgb(3, 133, 3)',
        });
      }, 1000);
    });
};
