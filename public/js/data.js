var ctx = document.getElementById("myChart").getContext('2d');
// var Alldata = [];
// var dataOne = [];
// var dataTwo = [];
// var dataThree = [];
// var dataFour = [];
// $.ajax({
//   type:'GET',
//   url:'',
//   success:function(data) {
//
//   },
//   error:function(err) {
//
//   }
// });


var bgColorArr = [
  'rgba(75, 192, 192, 0.2)',
  'rgba(255, 241, 173, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)'
];
var bdColorArr = [
  'rgba(75, 192, 192, 1)',
  'rgba(255, 241, 173, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)'
];

var bgColor = bgColorArr[0];
var bdColor = bdColorArr[0];

createDataMap();

var collegeAll = document.querySelector('#collegeAll');
var collegeOne = document.querySelector('#collegeOne');
var collegeTwo = document.querySelector('#collegeTwo');
var collegeThree = document.querySelector('#collegeThree');
var collegeFour = document.querySelector('#collegeFour');

collegeAll.addEventListener('click', function() {
  bgColor = bgColorArr[0];
  bdColor = bdColorArr[0];
  createDataMap();
});

collegeOne.addEventListener('click', function() {
  bgColor = bgColorArr[1];
  bdColor = bdColorArr[1];
  createDataMap();
});

collegeTwo.addEventListener('click', function() {
  bgColor = bgColorArr[2];
  bdColor = bdColorArr[2];
  createDataMap();
});

collegeThree.addEventListener('click', function() {
  bgColor = bgColorArr[3];
  bdColor = bdColorArr[3];
  createDataMap();
});

collegeFour.addEventListener('click', function() {
  bgColor = bgColorArr[4];
  bdColor = bdColorArr[4];
  createDataMap();
});


function createDataMap() {
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
              label: '义工服务次数',
              data: [8, 6, 3, 5, 2, 3],
              backgroundColor: bgColor,
              borderColor: bdColor,
              borderWidth: 1
          }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: '义工数据统计表'
        },
        tooltips: {
          mode: 'index',
          intersect: true
        },
        annotation: {
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 5,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth:1,
            label: {
              enabled: false,
              content: 'Test label'
            }
          }]
        },
        scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
  }
  });
}
