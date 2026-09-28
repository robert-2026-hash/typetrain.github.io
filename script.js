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





bgm.load();





function newText(){


    target="";


    for(let i=0;i<5;i++){


        target += words[
            Math.floor(Math.random()*words.length)
        ];


        if(i<4){

            target += " ";

        }


    }


    position=0;


    showText();

    showKeyboard(target[position]);


}






function showText(){


    let html="";


    for(let i=0;i<target.length;i++){


        if(i<position){


            html +=
            `<span class="typed">${target[i]}</span>`;


        }
        else{


            html +=
            `<span class="normal">${target[i]}</span>`;


        }


    }


    text.innerHTML=html;


}







document.addEventListener("keydown",function(e){


    if(!running)
        return;



    let key=e.key.toUpperCase();



    let current=target[position].toUpperCase();




    if(key===current){


        correct++;

        position++;


    }
    else{


        errors++;


    }





    if(position>=target.length){


        newText();


    }
    else{


        showText();


        showKeyboard(target[position]);


    }




    updateStats();



});









function showKeyboard(key){



    document
    .querySelectorAll("#keyboard span")
    .forEach(k=>{

        k.classList.remove("highlight");

    });



    let displayKey=key;



    document
    .querySelectorAll("#keyboard span")
    .forEach(k=>{


        if(k.innerText===displayKey){


            k.classList.add("highlight");


        }


    });





    let finger="";



    switch(key){


        case "A":
            finger="左小指";
            break;


        case "S":
            finger="左无名指";
            break;


        case "D":
            finger="左中指";
            break;


        case "F":
            finger="左食指";
            break;


        case "J":
            finger="右食指";
            break;


        case "K":
            finger="右中指";
            break;


        case "L":
            finger="右无名指";
            break;


        case ";":
            finger="右小指";
            break;


        default:
            finger="对应手指";


    }



    fingerBox.innerText=
    "请使用："+finger;


}








function startGame(){


    running=true;


    correct=0;

    errors=0;

    time=60;



    timeBox.innerText=time;



    newText();



    bgm.currentTime=0;

    bgm.play();




    timer=setInterval(()=>{


        time--;


        timeBox.innerText=time;



        if(time<=0){


            endGame();


        }


    },1000);


}








function endGame(){


    running=false;


    clearInterval(timer);


    bgm.pause();



    let total=correct+errors;



    let accuracy=
    total?
    Math.round(correct/total*100)
    :
    100;



    speedBox.innerText=
    Math.round(correct/5);



    accuracyBox.innerText=
    accuracy;



    fingerBox.innerText="训练结束";


}







function updateStats(){


    errorsBox.innerText=errors;


    let total=correct+errors;



    accuracyBox.innerText=
    total?
    Math.round(correct/total*100)
    :
    100;


}






document
.getElementById("start")
.onclick=startGame;