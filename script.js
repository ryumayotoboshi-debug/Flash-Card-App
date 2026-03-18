// ===== データ保存 =====
let data = JSON.parse(localStorage.getItem("studyData")) || [];

// ===== 画面 =====
const screen = document.getElementById("screen");

// ===== 初期画面 =====
showFolders();

// ===== フォルダ表示 =====
function showFolders(){
 screen.innerHTML = "<h2>フォルダ</h2>";

 data.forEach((f,i)=>{
  screen.innerHTML += `<button onclick="openFolder(${i})">${f.name}</button>`;
 });

 screen.innerHTML += `<br><button onclick="addFolder()">＋追加</button>`;
}

// ===== フォルダ追加 =====
function addFolder(){
 const name = prompt("フォルダ名");
 if(!name) return;

 data.push({name, decks:[]});
 save();
 showFolders();
}

// ===== フォルダ開く =====
function openFolder(i){
 const folder = data[i];

 screen.innerHTML = `<h2>${folder.name}</h2>`;

 folder.decks.forEach((d,j)=>{
  screen.innerHTML += `<button onclick="startQuiz(${i},${j})">${d.name}</button>`;
 });

 screen.innerHTML += `
 <br>
 <button onclick="addDeck(${i})">＋単語帳追加</button>
 <br>
 <button onclick="showFolders()">戻る</button>
 `;
}

// ===== 単語帳追加 =====
function addDeck(i){
 const name = prompt("単語帳名");
 if(!name) return;

 data[i].decks.push({name, questions:[]});
 save();
 openFolder(i);
}

// ===== クイズ開始 =====
let current = {};

function startQuiz(fi, di){
 current = {
  fi, di, index:0
 };
 showQuestion();
}

// ===== 問題表示 =====
function showQuestion(){
 const q = data[current.fi].decks[current.di].questions[current.index];

 if(!q){
  screen.innerHTML = "終了！<br><button onclick='showFolders()'>戻る</button>";
  return;
 }

 let html = `<div class="card"><h2>${q.question}</h2>`;

 if(q.type === "choice"){
  q.options.forEach((opt,i)=>{
   html += `<div class="choice" onclick="answer(${i})">${opt}</div>`;
  });
 }

 if(q.type === "truefalse"){
  html += `
  <button onclick="answer(true)">○</button>
  <button onclick="answer(false)">×</button>
  `;
 }

 html += "</div>";
 screen.innerHTML = html;
}

// ===== 回答処理 =====
function answer(val){
 const q = data[current.fi].decks[current.di].questions[current.index];

 let correct = val === q.answer;

 screen.innerHTML = `
 <div class="card">
 <h2>${correct ? "正解" : "不正解"}</h2>
 <p>${q.explanation}</p>
 <button onclick="next()">次へ</button>
 </div>
 `;
}

// ===== 次へ =====
function next(){
 current.index++;
 showQuestion();
}

// ===== 問題追加UI =====
function addQuestion(fi, di){
 const type = prompt("type: choice / truefalse");
 const question = prompt("問題文");
 const explanation = prompt("解説");

 let q = {type, question, explanation};

 if(type === "choice"){
  q.options = [
   prompt("選択肢1"),
   prompt("選択肢2"),
   prompt("選択肢3"),
   prompt("選択肢4")
  ];
  q.answer = Number(prompt("正解番号(0-3)"));
 }

 if(type === "truefalse"){
  q.answer = confirm("正解は○？（OK=○）");
 }

 data[fi].decks[di].questions.push(q);
 save();
}

// ===== 保存 =====
function save(){
 localStorage.setItem("studyData", JSON.stringify(data));
}