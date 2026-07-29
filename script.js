const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYgZnKzzSVVRlgpcWCEapBhoFawkLyoSSrbm9NqCwE2UXhU5c7Qp08H4CK8KidAW93Ufs8z2icodHy/pub?output=csv";

async function loadData(){

  const response = await fetch(sheetURL);
  const csv = await response.text();

  const rows = csv.trim().split("\n");

  const headers = rows[0].split(",");

  const data = rows.slice(1).map(row=>{

    const values = row.split(",");

    let obj={};

    headers.forEach((h,i)=>{
      obj[h.trim()] = values[i]?.trim();
    });

    return obj;

  });


  renderDashboard(data);

}



function convertPace(value){

  if(!value) return "-";

  let num = Number(value);

  let min = Math.floor(num / 100);
  let sec = num % 100;

  return `${min}:${String(sec).padStart(2,"0")}`;

}



function renderDashboard(data){


  let totalDistance = 0;
  let totalTime = 0;


  data.forEach(item=>{

    totalDistance += Number(item["거리"]) || 0;
    totalTime += Number(item["운동시간"]) || 0;

  });



  document.getElementById("weekDistance").innerText =
  `${totalDistance.toFixed(1)} km`;


  document.getElementById("weekTime").innerText =
  `${totalTime} 분`;



  createChart(
    "distanceChart",
    "거리",
    data.map(x=>Number(x["거리"]))
  );


  createChart(
    "paceChart",
    "페이스",
    data.map(x=>convertPace(x["페이스(초)"]))
  );


  createChart(
    "hrChart",
    "평균심박",
    data.map(x=>Number(x["평균심박"]))
  );


  createChart(
    "cadenceChart",
    "케이던스",
    data.map(x=>Number(x["케이던스"]))
  );


  createChart(
    "timeChart",
    "운동시간",
    data.map(x=>Number(x["운동시간"]))
  );


  createChart(
    "preChart",
    "PRE",
    data.map(x=>Number(x["PRE[1~10]"]))
  );


}




function createChart(id,title,values){

  const chart = new ApexCharts(
    document.querySelector("#"+id),

    {

      chart:{
        type:"line",
        height:300
      },

      series:[
        {
          name:title,
          data:values
        }
      ]

    }

  );


  chart.render();

}



loadData();
