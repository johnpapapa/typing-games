
//CONST
const QUESTION_COUNT = 30;
const chars = new Array("Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ","Ｈ","Ｉ",
                      "Ｊ","Ｋ","Ｌ","Ｍ","Ｎ","Ｏ","Ｐ","Ｑ","Ｒ",
                      "Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ");
const kcode = new Array(65,66,67,68,69,70,71,72,73,
                      74,75,76,77,78,79,80,81,82,
                      83,84,85,86,87,88,89,90);

//グローバル変数群
var gameFlag = false; //ゲームを実行しているか
var mondai = "";  //問題の文字列を格納
var cnt=0;  //何問目か格納
var miss=0; //ミスカウント
var timer;   //タイマー処理のオブジェクト
var typStart,typEnd   //開始時と終了時の時刻を格納
var rnd = new Array(); //乱数を格納

//0～25までの乱数をQUESTION_COUNT文だけ作成して配列rndに格納する関数

//経過時間を表示する関数
function showNowTime(){
  var typNow = new Date();
  document.getElementById("result-time").innerHTML = Math.floor((typNow - typStart)/1000) + "秒経過" ;
}

//タイマーを開始する関数
function startTimer(){
  timer = setInterval("showNowTime()", 1000);
  typStart = new Date();
}

//タイマーを停止する関数
function stopTimer(){
  clearInterval(timer);
  typEnd = new Date();
}

//ページ読み込み時に問題文を作成
window.onload = function(){
  gameFlag = true;
  //問題文とカウント数をクリアする
  mondai="";
  cnt=0;
  
  //乱数作成
  for ( var i = 0 ; i < QUESTION_COUNT ; i++ ){
    rnd[i] = Math.floor( Math.random() * 26 );
  }
  
  //問題文の作成
  var question_string = "";
  for ( var i = 0 ; i < QUESTION_COUNT ; i++){
    question_string += '<p id=\"'+ i +'\" class="disp-inline">' + chars[ rnd[i] ] + "</p>";
  }
  
  //問題を表示
  document.getElementById("moniter").innerHTML = question_string;
  document.getElementById(cnt).style.color="#ff0000";//最初の文字だけ赤く
}

//キー押下時の判定
document.onkeydown = function(event){
  //ゲームが終了している場合入力を無効
  if(cnt >= QUESTION_COUNT && !gameFlag){
    return;
  }

  //入力されたキー取得
  var kc;  //入力されたキーコードを格納する変数
  if (document.all){
    kc = event.keyCode;
  }
  else{
    kc = event.which;
  }

  //入力されたキーコードと、問題文のキーコードを比較
  if (kc == kcode[ rnd[cnt] ]){
    //以下、キーコードが一致した時の処理

    //最初の1文字が入力された時間を記録する
    if (cnt==0){ 
      startTimer();
      document.getElementById("game-notices").style.opacity = 0;
    }
    
    cnt++; //カウント数を＋１にする
    
    //全文字入力したか確認
    if ( cnt < QUESTION_COUNT){
      document.getElementById(cnt-1).style.color="#777";
      document.getElementById(cnt).style.color="#ff0000";
      
    }
    else{
      gameFlag = false;

      //終了時間を記録
      stopTimer();

      //結果の表示
      gameResult();
    }
  }
  else if(kc == 27){
    //ESCキーをおされた時の処理
    console.log(kc);
    console.log(location.reload(true));
    document.location.reload(true);
  }
  else{
    //以下、キーコードが一致しない場合の処理

    if(cnt > 0){
      miss++;
      document.getElementById("result-miss").innerHTML = "ミス = " + miss + "回";
    }
  }
}

//結果を表示する関数
function gameResult(){
  //経過時間を取得
  var elapsedTime = typEnd - typStart;
  var sec = Math.floor( elapsedTime/1000 );//秒数を取得
  var msec = elapsedTime % 1000;//ミリ秒を取得
  //var typeOfsec = QUESTION_COUNT / (elapsedTime/1000);
  var typeOfsec = Math.floor( QUESTION_COUNT / (elapsedTime/1000) * Math.pow( 10, 2 ) ) / Math.pow( 10, 2 )
  
  //結果画面の表示
  var result_strings="";
  result_strings += "<h1>GAME終了</h1>"
  result_strings += "<p>クリア時間：" + sec + "." + msec + "秒</p>";
  result_strings += "<p>打鍵数：" + typeOfsec + "回/秒</p>";
  result_strings += "<p>ミス: " + miss + "回</p>";
  
  //問題枠にゲーム終了を表示
  document.getElementById("games").innerHTML = result_strings;

  //ゲーム再スタートを行うボタンの表示
  document.getElementById("restart-button").style.display ="block";
}