// 본인의 구글 Apps Script 웹 앱 URL을 쌍따옴표("") 사이에 정확히 넣어주세요.
const API_URL = "https://script.google.com/macros/s/AKfycbwHJxo7aobH3VPreVfezO8Hm4_cxIzgQGdaw-qQnjyf82-TloI6MaVg5j5Fpil5XlV-/exec";

document.addEventListener("DOMContentLoaded", () => {
  fetchDataAndRender();
});

async function fetchDataAndRender() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    console.log("서버에서 받아온 데이터:", data);

    if (!data || data.length === 0) {
      console.warn("데이터가 비어있습니다.");
      return;
    }

    renderKPI(data);
    renderCharts(data);
  } catch (error) {
    console.error("데이터를 불러오는 중 오류 발생:", error);
  }
}

// 1. KPI 카드 업데이트 (데이터 키값 자동 대응)
function renderKPI(data) {
  // 첫 번째 데이터 행을 기준으로 키값 자동 탐색 (오류 방지)
  const sample = data[0] || {};
  const keys = Object.keys(sample);

  // 거리 관련 키 찾기 (Distance, 거리 등 포함된 것)
  const distKey = keys.find(k => k.toLowerCase().includes('dist') || k.includes('거리')) || keys[2];
  // 심박수 관련 키 찾기 (HR, 심박 등 포함된 것)
  const hrKey = keys.find(k => k.toLowerCase().includes('hr') || k.includes('심박')) || keys[5];
  // 페이스 관련 키 찾기
  const paceKey = keys.find(k => k.toLowerCase().includes('pace') || k.includes('페이스')) || keys[4];

  // 총 거리 계산
  const totalDist = data.reduce((acc, cur) => acc + (Number(cur[distKey]) || 0), 0);
  const totalDistElem = document.getElementById("total-distance");
  if (totalDistElem) totalDistElem.innerText = `${totalDist.toFixed(1)} km`;

  // 이번 주 거리
  const recentData = data.slice(-7);
  const weeklyDist = recentData.reduce((acc, cur) => acc + (Number(cur[distKey]) || 0), 0);
  const weeklyDistElem = document.getElementById("weekly-distance");
  if (weeklyDistElem) weeklyDistElem.innerText = `${weeklyDist.toFixed(1)} km`;

  // 평균 심박수
  const hrList = data.map(d => Number(d[hrKey])).filter(h => h > 0);
  const avgHR = hrList.length > 0 ? Math.round(hrList.reduce((a, b) => a + b, 0) / hrList.length) : 0;
  const avgHRElem = document.getElementById("avg-hr");
  if (avgHRElem) avgHRElem.innerText = `${avgHR} bpm`;

  // 최근 페이스
  const latestPace = data[data.length - 1]?.[paceKey] || "0'00\"";
  const avgPaceElem = document.getElementById("avg-pace");
  if (avgPaceElem) avgPaceElem.innerText = latestPace;
}

// 2. Chart.js 시각화
function renderCharts(data) {
  const sample = data[0] || {};
  const keys = Object.keys(sample);

  const dateKey = keys.find(k => k.toLowerCase().includes('date') || k.includes('날짜')) || keys[0];
  const distKey = keys.find(k => k.toLowerCase().includes('dist') || k.includes('거리')) || keys[2];
  const hrKey = keys.find(k => k.toLowerCase().includes('hr') || k.includes('심박')) || keys[5];

  const labels = data.map(d => d[dateKey] || '');
  const distances = data.map(d => Number(d[distKey]) || 0);
  const hrs = data.map(d => Number(d[hrKey]) || 0);

  const commonOptions = {
    responsive: true,
    scales: {
      x: { ticks: { color: "#94a3b8" }, grid: { color: "#334155" } },
      y: { ticks: { color: "#94a3b8" }, grid: { color: "#334155" } }
    },
    plugins: {
      legend: { labels: { color: "#f8fafc" } }
    }
  };

  // 거리 차트
  const distCanvas = document.getElementById("distanceChart");
  if (distCanvas) {
    new Chart(distCanvas, {
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
  }

  // 심박수 차트
  const hrCanvas = document.getElementById("hrChart");
  if (hrCanvas) {
    new Chart(hrCanvas, {
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
}
