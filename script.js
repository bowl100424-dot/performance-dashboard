
// ===============================
// Performance Dashboard
// ===============================


// 테스트 데이터
// 나중에 Google Sheets 데이터로 교체

const workoutData = [

  {
    date:"2026-07-29",
    distance:8.4,
    time:45,
    pace:526,
    hr:155,
    cadence:187,
    pre:8
  },

  {
    date:"2026-07-27",
    distance:10,
    time:50,
    pace:500,
    hr:150,
    cadence:184,
    pre:7
  },

  {
    date:"2026-07-25",
    distance:15,
    time:75,
    pace:510,
    hr:148,
    cadence:182,
    pre:6
  }

];



// ===============================
// 페이스 변환
// 526 → 5:26
// 1032 → 10:32
// ===============================

function convertPace(value){

    let str = value.toString();

    let min;
    let sec;


    if(str.length <= 2){

        min = 0;
        sec = Number(str);

    } else {

        min = Math.floor(Number(str) / 100);
        sec = Number(str) % 100;

    }


    return `${min}:${sec.toString().padStart(2,"0")}`;

}



// ===============================
// 최근 7일 계산
// ===============================

let totalDistance = 0;
let totalTime = 0;


workoutData.forEach(item=>{

    totalDistance += item.distance;
    totalTime += item.time;

});


document.getElementById("weekDistance").innerText =
`${totalDistance.toFixed(1)} km`;


document.getElementById("weekTime").innerText =
`${totalTime} 분`;




// ===============================
// 그래프 생성 함수
// ===============================


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
],

xaxis:{
categories:
workoutData.map(x=>x.date)
}

}

);


chart.render();


}



// 거리

createChart(
"distanceChart",
"거리",
workoutData.map(x=>x.distance)
);


// 심박

createChart(
"hrChart",
"심박",
workoutData.map(x=>x.hr)
);


// 케이던스

createChart(
"cadenceChart",
"케이던스",
workoutData.map(x=>x.cadence)
);


// 시간

createChart(
"timeChart",
"운동시간",
workoutData.map(x=>x.time)
);


// PRE

createChart(
"preChart",
"PRE",
workoutData.map(x=>x.pre)
);



// 페이스

createChart(
"paceChart",
"페이스",
workoutData.map(x=>convertPace(x.pace))
);
