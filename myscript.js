// サッカーゲーム
// ゴールからの距離75mからスタート。
// ゴール前15mまで、ひたすらドリブル。
// 15m前まで来たら、シュートする。

// 本当は、ドリブル・シュートの２つの選択肢が35m前から選べるようにしたかった。
// そのため、ちょっとその面影がコードにも滲み出ている。。。

/* *************************************************************** 
**************************  確率論について  ************************ 
****************************************************************** 

各フェイズにおいての確率
  1. まずディフェンダーにエンカウントする確率７割（３割の確率でスルーできる）
  2. ディフェンダーに遭遇した後に左右の一致判定
    - 相手と一致しなければ、確実にドリブル突破できる
    - 一致した場合、４割の確率でスライディングが炸裂する（６割の確率で強引に突破できる）
  3. シュートチャンスではまず右左の一致判定
    - 相手と一致しなければ、９割の確率でゴールとなる（豪快なシュートの場合、７割の確率でゴール）
    - 相手と一致した場合、２割の確率でゴールとなる（豪快なシュートの場合、４割の確率でゴール）

ゴールの確率について
  1. ディフェンダーにエンカウトしない確率 70%
  2. ディフェンダーと左右が一致しない確率 50%
  3. ディフェンダーと左右が一致しても突破する確率 60%
  4. シュートが決まる確率 55%
    - 豪快なシュートの場合
      -  90% * 1/2 + 20% * 1/2 = 55%
    - 隅を狙ったシュートの場合
      - 70% * 1/2 + 40% * 1/2 = 55%

計算式
  (100% * 3/10 + (100% * 1/2 + 60% * 1/2) * 7/10)^6 * 55% = 22.3%   */
  
// ****************************************************************
// ************************  変数宣言の一式  ************************
// ****************************************************************

let goalDistance = 75 ;
let distance = document.getElementById("distance");
let message = document.getElementById("message");
let attackingDirection = "";
let defendingDirection = "";
let randomInt = "";
let shootingPower = 0;
let countloss = 1;

// ****************************************************************
// ********************  ボタンの表示・非表示処理  ********************
// ****************************************************************

// ドリブル・シュートのボタンを表示
function showDSButton() {
  document.getElementsByClassName("dribble_shoot")[0].style.display = "inline-block";
  // document.getElementsByClassName("dribble_shoot")[1].style.display = "inline-block";  
};

// ドリブル・シュートのボタンを隠す
function hideDSButton() {
  document.getElementsByClassName("dribble_shoot")[0].style.display = "none";
  // document.getElementsByClassName("dribble_shoot")[1].style.display = "none";  
};

// 左・右のボタンを表示
function showLRButton(){
  document.getElementsByClassName("left_right")[0].style.display = "inline-block";
  document.getElementsByClassName("left_right")[1].style.display = "inline-block";  
};

// 左・右のボタンを隠す
function hideLRButton(){
  document.getElementsByClassName("left_right")[0].style.display = "none";
  document.getElementsByClassName("left_right")[1].style.display = "none";  
};

// シュートオプションボタンを表示：
//「豪快なシュートを左上へ！」「豪快なシュートに右上へ！」「ピンポイントに左下隅へ」「ピンポイントに右下隅へ」
function showSOButton(){
  for(let so = 0; so < document.getElementsByClassName("shoot_options").length; so ++){
    document.getElementsByClassName("shoot_options")[so].style.display = "inline-block";
  };
};

// シュートオプションボタンを隠す
function hideSOButton(){
  for(let so = 0; so < document.getElementsByClassName("shoot_options").length; so ++){
    document.getElementsByClassName("shoot_options")[so].style.display = "none";
  };
};

// ****************************************************************
// ***************************  乱数取得  **************************
// ****************************************************************

// ランダムに左・右のいずれかを取得
function getRandomDir() {
  let rd = Math.floor(Math.random() * 2); // 「0, 1」のいずれかをランダムに取得
  if (rd === 0){
    return "左";
  } 
  else {
    return "右";
  };
};

// ランダムに 0 ~ 9 の数値を取得 
function getRandomInt() {
  return Math.floor(Math.random() * 10); // 「0 ~ 9」の整数をランダムに取得 
};

// ****************************************************************
// ***************************  勝敗表示  **************************
// ****************************************************************

// ゲームで勝ちになった。メッセージを表示する。
function win(){
  distance.innerHTML = "";
  message.innerHTML = "ゴール！！！！！";
  message.style.color = "red";
  message.style.fontWeight = "bold";
  message.style.fontSize = "2em";
  setTimeout("celebrate()", 2000);
};

// 更新を促すポップアップを表示する。
function celebrate(){
  if (window.confirm("おめでとうございます！ ＯＫを押すとリロードします")){
    location.reload();
  };
};

// ゲームで負けになった。ポップアップを表示し、リスタートさせる。
function lose(){
  countloss += 1
  challenge.innerHTML = `久保さんを目指して${countloss}回目の挑戦！`;
  distance.innerHTML = "";
  message.innerHTML = "";
  window.confirm("最初からやり直しです。。。")
  goalDistance = 75 ;
  shootingPower = 0;
  showDSButton();
};

// ****************************************************************
// ***************************  ドリブル  **************************
// ****************************************************************

//「ドリブルボタン」を押すと実行する関数
// ディフェンダーにエンカウントするかしないかで分岐する
function dribble(){
  // ゴールまでの距離を表示する
  distance.innerHTML = `ゴールまでの距離${goalDistance}ｍです！`;

  // 乱数（0 ~ 9）を取得し、定義する
  randomInt = getRandomInt();

  // ディフェンダーがいない場合
  if (randomInt >= 7){
    message.innerHTML = "ディフェンダーは追いつかない！ ゴールへと向かっていく！";
    // ゴールに10m近づく
    goalDistance = goalDistance - 10 ;
    distance.innerHTML = `ゴールまでの距離${goalDistance}ｍです！`;
    vsGoalee();
  }
  // ディフェンダーがいた場合
  else{
    message.innerHTML = "ディフェンダーが行く手を阻む！";
    hideDSButton();
    //「左にドリブル」「右にドリブル」のボタンが表示される
    // ボタンクリックにより、goLeft(fake)か、goRight(fake)のいずれかの関数を実行する
    showLRButton();
  };
};

// ****************************************************************
// *****************  goLeft(fake), goRight(fake)  ****************
// *****************  関連する関数：vsDefender()など  ****************
// ****************************************************************

//「左にドリブル」のボタンをクリックすると実行
function goLeft(vsDefender) {
  attackingDirection = "左";
  vsDefender();
};

// 「右にドリブル」のボタンをクリックすると実行
function goRight(vsDefender) {
  attackingDirection = "右";
  vsDefender();
};

// ディフェンダーとの勝負に勝てるか判定する関数
function vsDefender() {
  // 相手ディフェンダーが守備する方向（左/右）をランダムに取得し、再代入する
  defendingDirection = getRandomDir();
  // プレイヤーが選んだ方向と相手ディフェンダーが守備する方向が一致する場合
  if (attackingDirection === defendingDirection){
    // 乱数（0 ~ 9）を取得し、定義する
    randomInt = getRandomInt();
    // 乱数により、ディフェンダーに勝つか判断する
    // ディフェンダーに勝った場合
    if (randomInt >= 4){
      message.innerHTML = "ディフェンダーも食らい付くが、強引なドリブルで突破！ ";
      showDSButton();
      hideLRButton();
      // ゴールに10m近づく
      get10MCloser();
    }
    // ディフェンダーに負けた場合
    else{
      // 負けたのでリスタートさせるポップアップを表示する
      message.innerHTML = "スライディングタックルが炸裂！ ボールを失った・・・";
      hideLRButton();
      setTimeout("lose()", 1000);
    };
  }
  // プレイヤーが選んだ方向と相手ディフェンダーが守備する方向が一致しない場合
  // ディフェンダーに100％勝つ
  else{
    message.innerHTML = `${defendingDirection}と見せかけて${attackingDirection}へ！ ディフェンダーは付いて来れない！`; 
    showDSButton();
    hideLRButton();
    get10MCloser();
  };
};

// ゴールに10m近く関数
function get10MCloser() {
  goalDistance = goalDistance - 10 ;
  distance.innerHTML = `ゴールまでの距離${goalDistance}ｍです！`;
  vsGoalee();
};

// ゴールディスタンスが残り15mの場合、キーパーと１対１の分岐へ
function vsGoalee() {
  if ( goalDistance === 15 ){
    distance.innerHTML = `ゴールまでの距離${goalDistance}ｍです！`;
    message.innerHTML = "ペナルティエリアに突入！ キーパーと１対１だ！ ";
    hideDSButton();
    showSOButton();
    };
};

// ****************************************************************
// ***************************  シュート  **************************
// ****************************************************************

// シュートオプション① 「豪快なシュートを左上へ！」
function chooseUpperLeft(shoot) {
  attackingDirection = "左";
  shootingPower = 2;
  shoot();
};

// シュートオプション② 「豪快なシュートに右上へ！」
function chooseUpperRight(shoot) {
  attackingDirection = "右"
  shootingPower = 2;
  shoot();
};

// シュートオプション③ 「ピンポイントに左下隅へ」
function chooseLowerLeft(shoot) {
  attackingDirection = "左"
  shoot();
};

// シュートオプション④ 「ピンポイントに右下隅へ」
function chooseLowerRight(shoot) {
  attackingDirection = "右"
  shoot();
};

// シュートが相手キーパーの守備方向と一致するか判定する関数
function shoot() {

  // ここでユーザーがボタンを押し、左上、右上、左下、右下のいずれかを決定する
  // 相手キーパーが守備する方向（左/右）をランダムに取得し、再代入する
  defendingDirection = getRandomDir();
  hideSOButton();

  // プレイヤーが選んだ方向と相手キーパーが守備する方向が一致する場合
  if (attackingDirection === defendingDirection){
    message.innerHTML = `キーパー、${attackingDirection}方向のシュートに反応している！！！`
    if (window.confirm("果たして・・・シュートは決まるのか！？")){
      setTimeout("notLikelyToGoal()", 2000);
    };
  }
  
  // プレイヤーが選んだ方向と相手キーパーが守備する方向が一致しない場合    
  else{
    message.innerHTML = "キーパー、反応が遅れている！"
    if (window.confirm("これは決まったか！？")){
      setTimeout("likelyToGoal()", 2000);
    };
  };

};

// 守備方向が一致してしまった場合の関数（ゴールの可能性は低くなる）
function notLikelyToGoal() {

  // 乱数（0 ~ 9）を取得し、定義する
  randomInt = getRandomInt();

  // キーパーに勝った場合
  if (randomInt + shootingPower >= 8){ //「豪快なシュートを○上へ！」を選んだ場合、shootingPower = 2 によりゴールの可能性が上がる
    message.innerHTML = "しかし！！ キーパー、必死に手を伸ばすが届かない！！！"
    setTimeout("win()", 2000);
  }

  // キーパーに負けた場合
  else{
    // 負けたのでリスタートさせるポップアップを表示する
    message.innerHTML = "キーパー、シュートを難なくキャッチング！！！";
    setTimeout("lose()", 1000);
  };

};

// 守備方向が不一致となった場合の関数（ゴールの可能性は高くなる）
function likelyToGoal() {

  // 乱数（0 ~ 9）を取得し、定義する
  randomInt = getRandomInt();

  // キーパーに勝った場合
  if (randomInt - shootingPower >= 1){ //「豪快なシュートを○上へ！」を選んだ場合、shootingPower = 2 により、枠外シュートとなってノーゴールの可能性が上がる
    message.innerHTML = "やはり、キーパー届かない！！！"
    setTimeout("win()", 2000);
  }

  // キーパーに負けた場合
  else{
    // 負けたのでリスタートさせるポップアップを表示する
    if (shootingPower === 2){
      message.innerHTML = "・・・なんと！ シュートは大きく枠外へと外れていった！！！";
    }
    else {
      message.innerHTML = "・・・キーパー決死のパンチングで何とかクリア！！！";
    };
    setTimeout("lose()", 1000);
  };

};





