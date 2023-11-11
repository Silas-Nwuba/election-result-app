import 'core-js/stable';
import 'regenerator-runtime/runtime.js';
import DataTable from 'datatables.net-bs5';
//prettier-ignore
import { doc, updateDoc,deleteDoc, collection,onSnapshot} from 'firebase/firestore';
import { app, database } from '../Modal/config/firebaseConfig.js';
import logout from './component/logout.js';
import sidebar from './component/sidebar.js';
import { setTimeout } from 'core-js';
import Swal from 'sweetalert2';
import toastr from 'toastr';

// all element
const logoutEvent = document.querySelector('.logout');
const element = document.querySelector('.logout-modal');
const modal = document.querySelector('.modal').className;
const backdrop = document.querySelector('.backdrop').className;
const closeEventClass = document.querySelector('.close').className;
const declineBtn = document.querySelector('.decline');
const confirmBtn = document.querySelector('.confirm');
const tableElement = document.querySelector('#myTable');
const updateModal = document.querySelector('.edit-modal');
const requestLoaders = document.querySelector('.loader-spinner');
const refreshBtn = document.querySelector('.refresh-btn');
const sideMenuIcon = document.querySelector('.bi-list');
const sidebarElement = document.querySelector('.menu');
const sidebarBackdrop = document.querySelector('.backdrop');
const menuIcon = document.querySelector('.bi-list');
const menu = document.querySelector('.menu');
const overlay = document.querySelector('.backdrop');
const profileIcon = document.querySelector('.user-profile-icon');
const dropdown = document.querySelector('.dropdown-content');
let temp = [];
//renderItem in the table
const btnEditIcon = `<a href="#" class="edit"
><svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  fill="currentColor"
  class="bi bi-pencil-square"
  viewBox="0 0 16 16"
>
  <path
    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
  />
  <path
    fill-rule="evenodd"
    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
  />
</svg>
</a
>`;
const btnDeleteIcon = `<a href="#" class="delete"
><svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  fill="currentColor"
  class="bi bi-trash"
  viewBox="0 0 16 16"
>
  <path
    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"
  />
  <path
    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
  />
</svg>
</a
>`;

const actionBtn = `<span class="action-btn">${
  btnEditIcon + ' ' + btnDeleteIcon
}</span>`;
let table = new DataTable(tableElement, {
  pageLength: 5,
  columns: [
    { data: 'id' },
    { data: 'fullname' },
    { data: 'gender' },
    { data: 'age' },
    { data: 'state' },
    { data: 'email' },
    { data: `${actionBtn}` },
  ],
  lengthMenu: [
    [5, 20, 30, -1],
    [5, 10, 20, 30, 40, 50],
  ],
  columnDefs: [
    {
      target: [0],
      visible: true,
    },
    {
      target: -1,
      defaultContent: `${actionBtn}`,
    },
  ],
});
requestLoaders.style.display = 'block';
const renderItemTable = () => {
  let dataArr = [];
  let uniqueKey = [];
  const getItem = collection(database, 'users');
  onSnapshot(getItem, (snapshot) => {
    snapshot.docChanges().forEach((item) => {
      const { firstName, lastName, gender, age, email, stateOfOrigin } =
        item.doc.data();
      //prettier-ignore
      const firstname = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const lastname = lastName.charAt(0).toUpperCase() + lastName.slice(1);
      dataArr.push({
        id: item.doc.id.charAt(0).toUpperCase() + item.doc.id.slice(1),
        fullname: firstname + ' ' + lastname,
        gender: gender.charAt(0).toUpperCase() + gender.slice(1),
        age: age,
        state: stateOfOrigin.charAt(0).toUpperCase() + stateOfOrigin.slice(1),
        email: email.charAt(0).toUpperCase() + email.slice(1),
      });

      const dataItem = dataArr.filter((item) => {
        return item.id !== 'admin';
      });

      if (!uniqueKey.includes(item.doc.id)) {
        table.clear();
        table.rows.add(dataItem);
        table.draw();
        uniqueKey.push(item.doc.id);
      }
      requestLoaders.style.display = 'none';
    });
  });
  // .then((Response) => {
  //   Response.docs.map((item, id) => {
  //     const { firstName, lastName, gender, age, email, stateOfOrigin } =
  //       item.data();
  //     //prettier-ignore
  //     const firstname = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  //     const lastname = lastName.charAt(0).toUpperCase() + lastName.slice(1);
  //     dataArr.push({
  //       id: item.id.charAt(0).toUpperCase() + item.id.slice(1),
  //       fullname: firstname + ' ' + lastname,
  //       gender: gender.charAt(0).toUpperCase() + gender.slice(1),
  //       age: age,
  //       state: stateOfOrigin.charAt(0).toUpperCase() + stateOfOrigin.slice(1),
  //       email: email.charAt(0).toUpperCase() + email.slice(1),
  //     });

  //     const dataItem = dataArr.filter((item) => {
  //       return item.id !== 'admin';
  //     });

  //     if (!uniqueKey.includes(id)) {
  //       table.clear();
  //       table.rows.add(dataItem);
  //       table.draw();
  //       uniqueKey.push(id);
  //     }
  //   });
  // })
  // .catch(() => {});
};
const updateHandler = () => {
  tableElement.querySelector('tbody').addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.closest('.edit')) {
      const row =
        e.target.closest('.edit').parentElement.parentElement.parentElement;
      const id = row.children[0].innerText;
      const name = row.children[1].innerText;
      const gender = row.children[2].innerText;
      const age = row.children[3].innerText;
      const state = row.children[4].innerText;
      const email = row.children[5].innerText;
      requestLoaders.style.display = 'none';
      renderItemModal(id, name, gender, age, state, email);
    }
  });
};
const renderItemModal = (id, name, gender, age, state, email) => {
  const details = {
    id: id,
    name: name,
    gender: gender,
    age: age,
    state: state,
    email: email,
  };
  if (temp.length > 0) {
    temp = [];
  }
  temp.push(details);
  temp.forEach((data) => {
    console.log(data.name);
    const firstName = data.name.split(' ')[0];
    const lastName = data.name.split(' ')[1];

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">Edit Profile</h5>
                <span aria-hidden="true" class="close"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg></span>
            </div>
            <div class="modal-body">
      <form action="" autocomplete="off">
  <div class="row" data-id="${data.id}">
   <div class="col">
     <label for="firstName">First Name  <svg
     xmlns="http://www.w3.org/2000/svg"
     width="5"
     height="5"
     fill="currentColor"
     class="bi bi-asterisk"
     viewBox="0 0 16 16"
   >
     <path
       d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z"
     />
   </svg></label>
     <input type="text" class="firstName" value="${firstName}">
     <small></small>
   </div>
   <div class="col">
     <label for="lastName">Last Name  <svg
     xmlns="http://www.w3.org/2000/svg"
     width="5"
     height="5"
     fill="currentColor"
     class="bi bi-asterisk"
     viewBox="0 0 16 16"
   >
     <path
       d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z"
     />
   </svg></label>
     <input type="text" class="lastName" value="${lastName}">
     <small></small>
   </div>
  </div>
  <div class="row">
   <div class="col">
     <label for="gender">Gender  <svg
     xmlns="http://www.w3.org/2000/svg"
     width="5"
     height="5"
     fill="currentColor"
     class="bi bi-asterisk"
     viewBox="0 0 16 16"
   >
     <path
       d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z"
     />
   </svg></label>
    <select name="" class="gender">
    <option selected value="${data.gender}">${data.gender}</option>
     <option value="male">Male</option>
     <option value="Female">Female</option>
    </select>
    <small></small>
   </div>
   <div class="col">
     <label for="age">Age<svg
     xmlns="http://www.w3.org/2000/svg"
     width="5"
     height="5"
     fill="currentColor"
     class="bi bi-asterisk"
     viewBox="0 0 16 16"
   >
     <path
       d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z"
     />
   </svg></label>
     <input type="text" class="age" value="${data.age}">
     <small></small>
   </div>
  </div>
  <div class="row">
   <div class="col">
   <label for="stateOfOrigin"> State of origin<svg
   xmlns="http://www.w3.org/2000/svg"
   width="5"
   height="5"
   fill="currentColor"
   class="bi bi-asterisk"
   viewBox="0 0 16 16"
 >
   <path
     d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z"
   />
 </svg></label>
   <select name="" class="stateOfOrigin">
  <option selected value="${data.state}">${data.state}</option>
   <option value="Abia">Abia</option>
   <option value="Adamawa">Adamawa</option>
   <option value="Akwa ibom">Akwa ibom</option>
   <option value="Anambra">Anambra</option>
   <option value="Bauchi">Bauchi</option>
   <option value="Bayelsa">Bayelsa</option>
   <option value="Benue">Benue</option>
   <option value="Borno">Borno</option>
   <option value="Cross river">cross river</option>
   <option value="Delta">Delta</option>
   <option value="Ebonyi">Ebonyi</option>
   <option value="Edo">Edo</option>
   <option value="Ekiti">Ekiti</option>
   <option value="Enugu">Enugu</option>
   <option value="Gombe">Gombe</option>
   <option value="Imo">Imo</option>
   <option value="Jigawa">Jigawa</option>
   <option value="Kaduna">Kaduna</option>
   <option value="Kano">Kano</option>
   <option value="Katstina">Katstina</option>
   <option value="Kebbi">Kebbi</option>
   <option value="Kogi">Kogi</option>
   <option value="Kwara">Kwara</option>
   <option value="Lagos">Lagos</option>
   <option value="Nasarawa">Nasarawa</option>
   <option value="Niger">Niger</option>
   <option value="Ogun">Ogun</option>
   <option value="Ondo">Ondo</option>
   <option value="Osun">Osun</option>
   <option value="Oyo">Oyo</option>
   <option value="Plateau">Plateau</option>
   <option value="River">River</option>
   <option value="Sokoto">Sokoto</option>
   <option value="Taraba">Taraba</option>
   <option value="Yobe">Yobe</option>
   <option value="Zamfara">Zamfara</option>
   <option value="Fct">Fct</option>
 </select>
 <small></small>
   </div>
   <div class="col">
     <label for="email">Email address<svg
     xmlns="http://www.w3.org/2000/svg"
     width="5"
     height="5"
     fill="currentColor"
     class="bi bi-asterisk"
     viewBox="0 0 16 16"
   >
     <path
       d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z"
     />
   </svg></label>
     <input type="email" class="email" value="${data.email}">
     <small></small>
   </div>
  </div>
  <button type="submit">Update</button>
 </form>
 </div>
 </div>
 </div>`;
    updateModal.append(modal);
  });
  updateModal.querySelector('.modal').style.display = 'block';
  overlay.style.display = 'block';
  const closeEditModal = document.querySelector('.close');
  closeEditModal.addEventListener('click', closeUpdateModal);
  const formUpdate = document.querySelector('form');
  requestLoaders.style.display = 'none';
  formUpdate.addEventListener('submit', validateUpdateForm);
};
const closeUpdateModal = () => {
  const modal = updateModal.querySelector('.modal');
  overlay.style.display = 'none';
  modal.remove();
  temp = [];
};
//Update-loader
const displayLoader = () => {
  document.querySelector('html').style.overflowY = 'hidden';
  updateModal.querySelector('.modal').style.display = 'none';
  overlay.style.display = 'none';
};
const hideLoader = () => {
  document.querySelector('html').style.overflowY = 'visible';
  updateModal.querySelector('.modal').style.display = 'none';
  overlay.style.display = 'none';
};

//validate update form
const validateUpdateForm = (e) => {
  e.preventDefault();
  //get data value
  const form = e.target;
  const id = form.querySelector('.row').dataset.id;
  const firstName = form.querySelector('.firstName');
  const lastName = form.querySelector('.lastName');
  const age = form.querySelector('.age');
  const email = form.querySelector('.email');
  const gender = form.querySelector('.gender');
  const state = form.querySelector('.stateOfOrigin');
  const dataArr = [firstName, lastName, age, email];
  if (
    checkAllInput(dataArr) &&
    checkFirstName(firstName) &&
    checkLastName(lastName) &&
    checkAge(age) &&
    checkEmail(email)
  ) {
    const updateData = doc(database, 'users', id);
    displayLoader();
    updateDoc(updateData, {
      firstName: firstName.value,
      lastName: lastName.value,
      gender: gender.value,
      age: age.value,
      email: email.value,
      state: state.value,
    })
      .then(() => {
        hideLoader();
        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: '<h4 style="color:rgb(3, 133, 3)"> Success</h4>',
            text: 'Successfully updated',
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
            text: 'Failed to update',
            confirmButtonColor: 'rgb(3, 133, 3)',
          });
        }, 1000);
      });
  }
};
const successFunction = (input) => {
  const formGroup = input.parentElement;
  const small = formGroup.querySelector('small');
  small.innerHTML = '';
};
const errorFunction = (input, message) => {
  const formGroup = input.parentElement;
  const small = formGroup.querySelector('small');
  small.innerHTML = `${getInputName(input)} ${message}`;
};
const getInputName = (input) => {
  const parent = input.parentElement;
  const label = parent.querySelector('label');
  return label.textContent;
};
const checkAllInput = (input) => {
  let valid = true;
  input.forEach((inp) => {
    if (inp.value.trim() === '') {
      errorFunction(inp, 'is required');
      valid = false;
    } else {
      successFunction(inp);
      valid = true;
    }
  });
  if (valid === true) {
    return true;
  }
};
const checkFirstName = (firstName) => {
  const regrex = /^[a-zA-Z]+$/;
  if (firstName.value.trim() === '') {
    errorFunction(inp, 'is required');
    return false;
  } else if (!regrex.test(firstName.value.trim())) {
    errorFunction(firstName, 'is not valid');
    return false;
  } else {
    successFunction(firstName);
    return true;
  }
};
const checkLastName = (lastName) => {
  const regrex = /^[a-zA-Z]+$/;
  if (lastName.value.trim() === '') {
    errorFunction(inp, 'is required');
    return false;
  } else if (!regrex.test(lastName.value.trim())) {
    errorFunction(lastName, 'is not valid');
    return false;
  } else {
    successFunction(lastName);
    return true;
  }
};
const checkAge = (inputAge) => {
  const regrex = /^[0-9]+$/;
  if (inputAge.value.trim() === '') {
    errorFunction(inputAge, 'is required');
    return false;
  } else if (!regrex.test(inputAge.value.trim())) {
    errorFunction(inputAge, 'is not valid');
    return false;
  } else if (Number(inputAge.value) < 18) {
    errorFunction(inputAge, 'should not be less than 18');
    return false;
  } else if (Number(inputAge.value) > 40) {
    errorFunction(inputAge, 'should not be greater than 40');
    return false;
  } else {
    successFunction(inputAge);
    return true;
  }
};
const checkEmail = (inputEmail) => {
  const regrex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
  if (!regrex.test(inputEmail.value.trim())) {
    errorMessage(inputEmail, 'is not valid');
    return false;
  } else {
    successFunction(inputEmail);
    return true;
  }
};

//delete row
const deleteHandler = () => {
  tableElement.querySelector('tbody').addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.closest('.delete')) {
      const row =
        e.target.closest('.delete').parentElement.parentElement.parentElement;
      const id = row.children[0].innerText;
      deleteFunction(id);
    }
  });
};
const deleteFunction = (id) => {
  const deleteData = doc(database, 'users', id);
  deleteDoc(deleteData)
    .then(() => {
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '<h4 style="color:rgb(3, 133, 3)"> Success</h4>',
          text: 'Successfully Deleted',
          confirmButtonColor: 'rgb(3, 133, 3)',
        });
      });
    })
    .catch(() => {
      setTimeout(() => {
        Swal.fire({
          icon: 'Error',
          title: '<h4 style="color:rgb(179, 6, 6)">Error</h4>',
          text: 'Failed to Delete',
          confirmButtonColor: 'rgb(3, 133, 3)',
        });
      });
    });
};
//calling the function
renderItemTable();
updateHandler();
deleteHandler();

//refresh the page
refreshBtn.addEventListener('click', () => {
  window.location.reload();
});
//logout fuction
logout.logoutFunction(logoutEvent, element, modal, backdrop);
logout.closeModalFunction(closeEventClass, element, modal, backdrop);
logout.declineFunction(declineBtn, element, modal, backdrop);
//confirm logout
confirmBtn.addEventListener('click', () => {
  window.location.href = 'http://localhost:1234/';
});

//side menu bar
sidebar.sidebarfunction(sideMenuIcon, sidebarElement, sidebarBackdrop);
sidebar.closeSidebarFunction(sidebarBackdrop, sidebarElement);

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

toastr.options = {
  preventDuplicates: true,
  preventOpenDuplicate: true,
};
