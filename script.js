// ===== 打字训练核心逻辑（已修复夸克/Safari 空格误触发 START 的问题）=====

let words = [
    "ASDF",
    "JKL;",
    "QWER",
    "UIOP",
    "ZXCV",
    "BNM"
];

let target = "";
let position = 0;
let correct = 0;
let errors = 0;
let time = 60;
let timer = null;
let running = false;

const bgm = document.getElementById("bgm");
const text = document.getElementById("text");
const timeBox = document.getElementById("time");
const speedBox = document.getElementById("speed");
const accuracyBox = document.getElementById("accuracy");
const errorsBox = document.getElementById("errors");
const fingerBox = document.getElementById("finger");
const startBtn = document.getElementById("start");

bgm.load();

function newText(){
    target = "";
    for(let i=0;i<5;i++){
        target += words[Math.floor(Math.random()*words.length)];
        if(i<4){
            target += " ";
        }
    }
    position = 0;
    showText();
    showKeyboard(target[position]);
}

function showText(){
    let html = "";
    for(let i=0;i<target.length;i++){
        if(i<position){
            html += `<span class="typed">${target[i]}</span>`;
        }else{
            html += `<span class="normal">${target[i]}</span>`;
        }
    }
    text.innerHTML = html;
}

// 全局按键监听
document.addEventListener("keydown",function(e){

    // 修复：拦截空格 / 回车的浏览器默认行为。
    // 夸克等内核点完 START 后焦点会留在按钮上，按空格会被当成"再次点击 START"
    // 从而中途重开；这里阻止默认动作即可消除误触发（同时防止空格让页面上下滚动）。
    // 注意：preventDefault 不影响 e.key 的读取，所以正常打字（含词间空格）完全不受影响。
    if(e.key === " " || e.key === "Spacebar" || e.key === "Enter"){
        e.preventDefault();
    }

    if(!running)
        return;

    let key = e.key.toUpperCase();
    let current = target[position].toUpperCase();

    if(key === current){
        correct++;
        position++;
    }else{
        errors++;
    }

    if(position >= target.length){
        newText();
    }else{
        showText();
        showKeyboard(target[position]);
    }

    updateStats();
});

function showKeyboard(key){
    document.querySelectorAll("#keyboard span").forEach(k=>{
        k.classList.remove("highlight");
    });

    let displayKey = key;
    document.querySelectorAll("#keyboard span").forEach(k=>{
        if(k.innerText === displayKey){
            k.classList.add("highlight");
        }
    });

    let finger = "";
    switch(key){
        case "A": finger="左小指"; break;
        case "S": finger="左无名指"; break;
        case "D": finger="左中指"; break;
        case "F": finger="左食指"; break;
        case "J": finger="右食指"; break;
        case "K": finger="右中指"; break;
        case "L": finger="右无名指"; break;
        case ";": finger="右小指"; break;
        case " ": finger="空格键（拇指）"; break;
        default: finger="对应手指";
    }
    fingerBox.innerText = "请使用：" + finger;
}

function startGame(){

    // 修复：开始游戏后立刻让 START 按钮失去焦点。
    // 这样即使焦点曾被内核留在按钮上，后续按空格也不会再触发"点击 START"。
    startBtn.blur();

    running = true;
    correct = 0;
    errors = 0;
    time = 60;

    timeBox.innerText = time;

    newText();

    bgm.currentTime = 0;
    bgm.play();

    timer = setInterval(()=>{
        time--;
        timeBox.innerText = time;
        if(time <= 0){
            endGame();
        }
    },1000);
}

function endGame(){
    running = false;
    clearInterval(timer);
    bgm.pause();

    let total = correct + errors;
    let accuracy = total ? Math.round(correct/total*100) : 100;

    speedBox.innerText = Math.round(correct/5);
    accuracyBox.innerText = accuracy;
    fingerBox.innerText = "训练结束";
}

function updateStats(){
    errorsBox.innerText = errors;
    let total = correct + errors;
    accuracyBox.innerText = total ? Math.round(correct/total*100) : 100;
}

startBtn.onclick = startGame;
