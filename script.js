// ⚠️ 아래 큰따옴표 안에 본인의 Google Apps Script 배포 URL을 넣어주세요!
const API_URL = https://script.google.com/macros/s/AKfycbwHJxo7aobH3VPreVfezO8Hm4_cxIzgQGdaw-qQnjyf82-TloI6MaVg5j5Fpil5XlV-/exec;

document.addEventListener("DOMContentLoaded", () => {
  fetchDataAndRender();
});

async function fetchDataAndRender() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    // API에서 받아온 데이터 구조에 맞춰 반영 (데이터 배열)
    // data 예시: [{ date: '2026-07-01', distance: 5.2, pace: '5:30', hr: 145 }, ...]
    renderKPI(data);
    renderCharts(data);
  } catch (error) {
    console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
  }
}

// 1. KPI 카드 업데이트
function renderKPI(data) {
  if (!data || data.length === 0) return;

  // 총 거리 계산
  const totalDist = data.reduce((acc, cur) => acc + (Number(cur.distance) || 0), 0);
  document.getElementById("total-distance").innerText = `${totalDist.toFixed(1)} km`;

  // 평균 심박수 계산
  const hrList = data.map(d => Number(d.hr)).filter(h => h > 0);
  const avgHR = hrList.length > 0 ? Math.round(hrList.reduce((a, b) => a + b, 0) / hrList.length) : 0;
  document.getElementById("avg-hr").innerText = `${avgHR} bpm`;

  // 이번 주 거리 (최근 7개 데이터 간단 합산)
  const recentData = data.slice(-7);
  const weeklyDist = recentData.reduce((acc, cur) => acc + (Number(cur.distance) || 0), 0);
  document.getElementById("weekly-distance").innerText = `${weeklyDist.toFixed(1)} km`;

  // 최근 페이스
  const latestPace = data[data.length - 1]?.pace || "0'00\"";
  document.getElementById("avg-pace").innerText = latestPace;
}

// 2. Chart.js 데이터 시각화
function renderCharts(data) {
  const labels = data.map(d => d.date);
  const distances = data.map(d => d.distance);
  const hrs = data.map(d => d.hr);

  // 차트 공통 옵션 (다크모드 스타일)
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

  // ① 거리 차트
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

  // ② 심박수 차트
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
