let sizeOfArr=50; //size of area
let timeOfOneFrameMS=100; //speed of progress
let container = document.getElementById("container");
let body = document.getElementById("body");
let counter = document.getElementById("counter");
let size = document.getElementById("size");
let speed = document.getElementById("speed");
let count=0;
container.style.gridTemplateColumns="repeat("+sizeOfArr+", 1fr)";
let dataArr = new Array(sizeOfArr);
let newDataArr = new Array(sizeOfArr);
let inprogress=false, mousePush=false;
let timeID; 
let deadColour="rgba(178, 204, 199, 0.7)";

size.value=sizeOfArr;
speed.value=timeOfOneFrameMS;

renderGame();

window.onclick = function (event) {
    if (event.target.className=='cel'){
        let a=0, b=0;
        a = Math.trunc(event.target.id/sizeOfArr);
        b = (event.target.id)%sizeOfArr;
        if (dataArr[a][b]==0){
            event.target.style.backgroundColor=colour(a,b);
            dataArr[a][b]=1;
        }
        else {
            event.target.style.backgroundColor=deadColour;
            dataArr[a][b]=0;
        }
    }
    else if (event.target.className=='start' && !inprogress){
        inprogress=true;
        event.target.innerText="STOP";
        timeID= setInterval(oneStepLife, timeOfOneFrameMS);
    }
    else if (event.target.className=='start' && inprogress){
        count=0;
        counter.innerText=count;
        inprogress=false;
        clearAll();
        event.target.innerText="START";
    }
}

size.onchange = function () {
    setSizeSpeed();
    renderGame();
}
speed.onchange = function () {
    setSizeSpeed();
    renderGame();
}

function setSizeSpeed() {
    sizeOfArr=parseInt(size.value);
    timeOfOneFrameMS=parseInt(speed.value);
}

function renderGame() {
    setSizeSpeed();
    body.removeChild(container);
    container = document.createElement("div");
    container.id="container";
    body.appendChild(container);
    container.style.gridTemplateColumns="repeat("+sizeOfArr+", 1fr)";
    dataArr = new Array(sizeOfArr);
    newDataArr = new Array(sizeOfArr);

    for (let i=0; i<dataArr.length; i++){
        dataArr[i]=new Array(sizeOfArr);
        newDataArr[i]=new Array(sizeOfArr);
        for(let j=0; j<dataArr[i].length;j++){
            dataArr[i][j]=0;
            newDataArr[i][j]=0;
        }
    }
    
    for (let a=0; a<dataArr.length; a++){
        for (let b=0; b<dataArr[a].length; b++){
            let cel = document.createElement("div");
            cel.className="cel";
            cel.id=a*sizeOfArr+b;
            cel.style.backgroundColor=deadColour;
            cel.style.width=90/sizeOfArr+"vmin";
            cel.style.height=90/sizeOfArr+"vmin";
            container.appendChild(cel);
        }
    }
}

window.onmouseover = function (event) {
    if (event.target.className=='cel' && mousePush){
        let a=0, b=0;
        a = Math.trunc(event.target.id/sizeOfArr);
        b = (event.target.id)%sizeOfArr;
        if (dataArr[a][b]==0){
            event.target.style.backgroundColor=colour(a,b);
            dataArr[a][b]=1;
        }
        else {
            event.target.style.backgroundColor=deadColour;
            dataArr[a][b]=0;
        }
    }
}

window.onmousedown = function (event) {
    mousePush=true;
}

window.onmouseup = function (event) {
    mousePush=false;
}

function oneStepLife() {
    newDataArr = coppyArr(dataArr, newDataArr);
    for (let a=0; a<dataArr.length; a++){
        for (let b=0; b<dataArr[a].length; b++){
            if(dataArr[a][b]==0 && suroundCount(a,b,dataArr)==3){
                newDataArr[a][b]=1;
                document.getElementById(a*sizeOfArr+b).style.backgroundColor=colour(a,b);
            }
            else if (dataArr[a][b]==1 && suroundCount(a,b,dataArr)>1 && suroundCount(a,b,dataArr)<4 ){
                newDataArr[a][b]=1;
                document.getElementById(a*sizeOfArr+b).style.backgroundColor=colour(a,b);
            }
            else {
                newDataArr[a][b]=0;
                document.getElementById(a*sizeOfArr+b).style.backgroundColor=deadColour;
            }
        }
    }
    dataArr=coppyArr(newDataArr,dataArr);
    if (allClear()){clearInterval(timeID); inprogress=false; document.getElementById("start").innerText="START";count=0;counter.innerText=count;}
    count+=1;
    counter.innerText=count;
}

function suroundCount(a,b, dataArr) {
    let count=0;
    if(a>0){
        if (dataArr[a-1][b]==1) count=count+1;
    }
    if (b>0){
        if (dataArr[a][b-1]==1) count=count+1;
    }
    if(a<sizeOfArr-1){
        if (dataArr[a+1][b]==1) count=count+1;
    }
    if(b<sizeOfArr-1){
        if (dataArr[a][b+1]==1) count=count+1;
    }
    if (a>0 && b>0){
        if (dataArr[a-1][b-1]==1) count=count+1;
    }
    if (a<sizeOfArr-1 && b<sizeOfArr-1){
        if (dataArr[a+1][b+1]==1) count=count+1;
    }
    if (a>0 && b<sizeOfArr-1){
        if (dataArr[a-1][b+1]==1) count=count+1;
    }
    if (a<sizeOfArr-1 && b>0){
        if (dataArr[a+1][b-1]==1) count=count+1;
    }
    return count;
}

function coppyArr(from, to) {
    for (let q=0; q<to.length; q++){
        for (let w=0; w<to[q].length; w++){
            to[q][w]=from[q][w];
        }
    }
    return to;
}

function allClear() {
    for (let q=0; q<dataArr.length; q++){
        for (let w=0; w<dataArr[q].length; w++){
            if (dataArr[q][w]==1) 
                return false;
        }
    }
    return true;
}

function clearAll() {
    for (let q=0; q<dataArr.length; q++){
        for (let w=0; w<dataArr[q].length; w++){
            dataArr[q][w]=0;
        }
    }
}

function colour(a,b) {
    let tmpR = 10+Math.trunc(245/sizeOfArr*a);
    let tmpG = 10+Math.trunc(245/sizeOfArr*b);
    let tmpB = 10+Math.trunc(245-tmpG);
    let name = "rgb("+tmpR +","+ tmpG +","+ tmpB+")";
    return name;
}