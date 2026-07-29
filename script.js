// 1️⃣ 본인의 구글 Apps Script 웹 앱 URL을 넣어주세요.
const API_URL = "https://script.google.com/macros/s/AKfycbwHJxo7aobH3VPreVfezO8Hm4_cxIzgQGdaw-qQnjyf82-TloI6MaVg5j5Fpil5XlV-/exec";

// 2️⃣ 구글 시트의 1번째 줄(제목)에 적힌 이름을 대소문자, 띄어쓰기까지 똑같이 적어주세요!
const KEY_DATE = "날짜";       // 예: "Date", "운동일자", "날짜"
const KEY_DIST = "거리(km)";   // 예: "Distance", "거리", "거리(km)"
const KEY_PACE = "페이스";     // 예: "Pace", "평균 페이스"
const KEY_HR   = "심박수";     // 예: "Avg_HR", "심박수"

document.addEventListener("DOMContentLoaded", () => {
  fetchDataAndRender();
});

async function fetchDataAndRender() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("네트워크 응답이 좋지 않습니다.");
    const data = await response.json();
    
    if (!data || data.length === 0) return;

    renderKPI(data);
    renderCharts(data);
  } catch (error) {
    console.error("오류:", error);
  }
}

// 날짜 데이터에서 지저분한 텍스트 빼고 "YYYY-MM-DD"만 깔끔하게 뽑아내는 함수
function cleanDate(rawDate) {
  const dateStr = String(rawDate);
  const match = dateStr.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : dateStr.substring(0, 10);
}

// 1. KPI 카드 업데이트
function renderKPI(data) {
  // 총 거리
  const totalDist = data.reduce((acc, cur) => acc + (Number(cur[KEY_DIST]) || 0), 0);
  document.getElementById("total-distance").innerText = `${totalDist.toFixed(1)} km`;

  // 이번 주 거리
  const recentData = data.slice(-7);
  const weeklyDist = recentData.reduce((acc, cur) => acc + (Number(cur[KEY_DIST]) || 0), 0);
  document.getElementById("weekly-distance").innerText = `${weeklyDist.toFixed(1)} km`;

  // 평균 심박수
  const hrList = data.map(d => Number(d[KEY_HR])).filter(h => h > 0);
  const avgHR = hrList.length > 0 ? Math.round(hrList.reduce((a, b) => a + b, 0) / hrList.length) : 0;
  document.getElementById("avg-hr").innerText = `${avgHR} bpm`;

  // 최근 페이스
  const latestPace = data[data.length - 1]?.[KEY_PACE] || "0'00\"";
  document.getElementById("avg-pace").innerText = latestPace;
}

// 2. Chart.js 시각화
function renderCharts(data) {
  // 날짜 데이터 깔끔하게 정제
  const labels = data.map(d => cleanDate(d[KEY_DATE]));
  const distances = data.map(d => Number(d[KEY_DIST]) || 0);
  const hrs = data.map(d => Number(d[KEY_HR]) || 0);

  const commonOptions = {
    responsive: true,
    scales: {
      x: { ticks: { color: "#94a3b8" }, grid: { color: "#334155" } },
      y: { ticks: { color: "#94a3b8" }, grid: { color: "#334155", beginAtZero: true } }
    },
    plugins: {
      legend: { labels: { color: "#f8fafc" } }
    }
  };

  new Chart(document.getElementById("distanceChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "거리 (km)",
        data: distances,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: commonOptions
  });

  new Chart(document.getElementById("hrChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "심박수 (bpm)",
        data: hrs,
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: commonOptions
  });
}
