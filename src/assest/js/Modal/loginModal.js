import 'core-js/stable';
import 'regenerator-runtime/runtime.js';
import { auth } from './config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const form = document.querySelector('form');
const notification = document.querySelector('.modal');

////////////////////////////////////////////////////////////
export const signUser = (username, password) => {
  signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      if (user) {
        window.location.href = `http://localhost:1234/dashboard.html`;
        form.reset();
      }
    })
    .catch(() => {
      notification.querySelector('.message').innerHTML = 'Network issues occur';
      notification.style.right = 0;
      setTimeout(() => {
        notification.style.right = '-300px';
      }, 3000);
    });
};
