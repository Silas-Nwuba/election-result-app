import ApexCharts from 'apexcharts';
import { ref, onValue, getDatabase } from 'firebase/database';
import { app } from '../Modal/config/firebaseConfig';

const apcElement = document.querySelector('.apc-socore');
const pdpElement = document.querySelector('.pdp-score');
const labourElement = document.querySelector('.labour-score');
const totalScore = document.querySelector('.score-total');
const tableBody = document.querySelector('tbody');
const menuIcon = document.querySelector('.bi-list');
console.log(menuIcon);
const menu = document.querySelector('.menu');
const overlay = document.querySelector('.backdrop');
const profileIcon = document.querySelector('.user-profile-icon');
const dropdown = document.querySelector('.dropdown-content');
const notFoundElem = document.querySelector('.no-result-found');
const viewContainer = document.querySelector('.view-result-container');
const loader = document.querySelector('.loader-spinner');

//get data from firebase-realtime database
const getData = () => {
  try {
    const db = getDatabase(app);
    const starCountRef = ref(db, 'electionResult');
    let apc = 0;
    let pdp = 0;
    let labour = 0;
    loader.style.display = 'block';
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childsnapshot) => {
          if (childsnapshot) {
            const data = childsnapshot.val();
            const apcScore = +data.partyAScore;
            const pdpScore = +data.partyCScore;
            const labourScore = +data.partyBScore;
            apc += apcScore;
            pdp += pdpScore;
            labour += labourScore;
            totalScore.innerHTML = (apc + labour + pdp).toLocaleString('en-US');
            apcElement.innerHTML = apc.toLocaleString('en-US');
            labourElement.innerHTML = labour.toLocaleString('en-US');
            pdpElement.innerHTML = pdp.toLocaleString('en-US');
          }
        });
        viewContainer.style.display = 'block';
        loader.style.display = 'none';
        renderData(apc, labour, pdp);
        renderDataGraph(apc, labour, pdp);
      } else {
        notFoundElem.style.display = 'block';
        viewContainer.style.display = 'none';
      }
    });

    const renderData = (apc, labour, pdp) => {
      const doughnutOption = {
        series: [apc, labour, pdp],
        colors: ['rgb(5, 185, 185)', 'rgb(1, 78, 36)', 'rgb(194, 2, 2)'],
        chart: {
          width: 400,
          type: 'pie',
        },
        labels: ['APC', 'LABOUR PARTY', 'PDP'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      };
      //prettier-ignore
      const chartSummary = new ApexCharts(document.querySelector('.chart-summary'),doughnutOption);
      chartSummary.render();
    };

    const renderDataGraph = (apc, labour, pdp) => {
      const option = {
        series: [
          {
            name: 'Score',
            data: [
              { x: 'APC', y: apc, color: 'rgb(5, 185, 185)' },
              { x: 'LP', y: labour, color: 'rgb(1, 78, 36)' },
              { x: 'PDP', y: pdp, color: 'rgb(194, 2, 2)' },
            ],
          },
        ],
        chart: {
          type: 'area',
          stacked: false,
          height: 210,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        title: {
          text: 'Result Score Graph',
          align: 'left',
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100],
          },
        },
        yaxis: {
          title: {
            text: 'scores',
          },
        },
        markers: {
          size: 6, // Adjust marker size as needed
          colors: [], // Leave this empty, it will be filled dynamically
        },
        tooltip: {
          theme: 'light',
          y: {
            formatter: function (val) {
              return val;
            },
          },
        },
        legend: {
          position: 'bottom',
        },
      };
      var markerColors = option.series[0].data.map(function (point) {
        return point.color;
      });
      option.markers.colors = markerColors;
      const chart = new ApexCharts(document.querySelector('.chart'), option);
      chart.render();
    };
  } catch (error) {
    alert(error.message);
  }
};
const getDataTable = () => {
  try {
    const db = getDatabase(app);
    const starCountRef = ref(db, 'electionResult');
    let accredited = 0;
    let valid = 0;
    let apcScores = 0;
    let pdpScores = 0;
    let lpScores = 0;
    let uniqueKey = [];
    onValue(starCountRef, (snapshot) => {
      snapshot.forEach((childsnapshot) => {
        const id = childsnapshot.key;
        const data = childsnapshot.val();
        const lga = data.localGovt;
        const ward = data.ward;
        const poll = data.pollingUnit;
        //total acc and vald vote
        const accreditedVote = +data.totalAccredited;
        const validVote = +data.totalValidVote;
        const apcScore = +data.partyAScore;
        const pdpScore = +data.partyCScore;
        const lpScore = +data.partyBScore;

        accredited += accreditedVote;
        valid += validVote;
        apcScores += apcScore;
        pdpScores += pdpScore;
        lpScores += lpScore;

        if (!uniqueKey.includes(id)) {
          renderDataTable(
            id,
            lga,
            ward,
            poll,
            accreditedVote,
            validVote,
            apcScore,
            pdpScore,
            lpScore
          );
          uniqueKey.push(id);
        }
      });
    });
  } catch (error) {
    alert(error.message);
  }
};
document.addEventListener('DOMContentLoaded', getData);
getDataTable();

//prettier-ignore
const renderDataTable = ( id,lga,wards,pollingUnit, totalAc, totalValid, apc, labour, pdp) =>{
const newRow = tableBody.insertRow();
const cellId = newRow.insertCell(0)
const cellLga = newRow.insertCell(1)
const cellWards = newRow.insertCell(2)
const cellPoll = newRow.insertCell(3)
const cellTotalAccredited = newRow.insertCell(4)
const cellTotalValid = newRow.insertCell(5)
const cellApc = newRow.insertCell(6);
const cellLabour = newRow.insertCell(7);
const cellPdp = newRow.insertCell(8)

cellId.innerHTML = id.charAt(0).toUpperCase() + id.slice(1);
cellLga.innerHTML = lga
cellWards.innerHTML = wards;
cellPoll.innerHTML = pollingUnit;
cellTotalAccredited.innerHTML = totalAc;
cellTotalValid.innerHTML = totalValid;
cellApc.innerHTML = apc;
cellLabour.innerHTML = labour;
cellPdp.innerHTML = pdp;

}

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
