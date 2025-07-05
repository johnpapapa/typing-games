// 定数定義
const QUESTION_COUNT = 30;
const CHARS = [
  "Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ","Ｈ","Ｉ",
  "Ｊ","Ｋ","Ｌ","Ｍ","Ｎ","Ｏ","Ｐ","Ｑ","Ｒ",
  "Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ"
];
const KCODES = [
  65,66,67,68,69,70,71,72,73,
  74,75,76,77,78,79,80,81,82,
  83,84,85,86,87,88,89,90
];

// ゲーム状態管理用変数
let gameFlag = false;
let cnt = 0;
let miss = 0;
let timer = null;
let typStart = null;
let typEnd = null;
let rnd = [];

// 経過時間表示
function showNowTime() {
  if (!typStart) return;
  const typNow = new Date();
  document.getElementById("result-time").textContent = `${Math.floor((typNow - typStart) / 1000)}秒経過`;
}

// タイマー開始
function startTimer() {
  typStart = new Date();
  timer = setInterval(showNowTime, 1000);
}

// タイマー停止
function stopTimer() {
  clearInterval(timer);
  typEnd = new Date();
}

// ゲーム開始
function game() {
  gameFlag = true;
  cnt = 0;
  miss = 0;
  rnd = Array.from({ length: QUESTION_COUNT }, () => Math.floor(Math.random() * 26));

  // 問題文生成
  const questionString = rnd.map((r, i) => `<p id="${i}" class="disp-inline">${CHARS[r]}</p>`).join("");
  document.getElementById("title").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("moniter").innerHTML = questionString;
  document.getElementById(cnt).style.color = "#ff0000";
  document.getElementById("result-time").textContent = "0秒経過";
  document.getElementById("result-miss").textContent = "ミス = 0回";
  document.getElementById("game-notices").style.opacity = 1;
}

// キー押下時の判定
window.onkeydown = function (event) {
  if (!gameFlag || cnt >= QUESTION_COUNT) return;
  const kc = event.keyCode || event.which;
  if (kc === KCODES[rnd[cnt]]) {
    if (cnt === 0) {
      startTimer();
      document.getElementById("game-notices").style.opacity = 0;
    }
    document.getElementById(cnt).style.color = "#777";
    cnt++;
    if (cnt < QUESTION_COUNT) {
      document.getElementById(cnt).style.color = "#ff0000";
    } else {
      gameFlag = false;
      stopTimer();
      result();
    }
  } else if (kc === 27) {
    window.location.reload();
  } else {
    if (cnt > 0) {
      miss++;
      document.getElementById("result-miss").textContent = `ミス = ${miss}回`;
    }
  }
};

// 結果表示
function result() {
  const elapsedTime = typEnd - typStart;
  const sec = Math.floor(elapsedTime / 1000);
  const msec = elapsedTime % 1000;
  const typePerSec = Math.floor((QUESTION_COUNT / (elapsedTime / 1000)) * 100) / 100;
  document.getElementById("game").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("clear-time").textContent = `${sec}.${msec}秒`;
  document.getElementById("type-persec").textContent = `${typePerSec}回/秒`;
  document.getElementById("miss-count").textContent = miss;
}

// ゲームリスタート
function restartGame() {
  document.getElementById("result").style.display = "none";
  game();
}

// タイトルに戻る
function restartTitle() {
  window.location.reload();
}