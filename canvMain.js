
const canvasSave = document.createElement("canvas");
const ctxSave = canvasSave.getContext("2d");

// Функція завантаження при відкритті сторінки
window.addEventListener("load", () => {

    textNoIn = document.createElement("p");
    textNoIn.classList.add("text-no-in");
    textNoIn.id = "text-no-in";
    
    // Створюємо перший <span> із символом стрілки вниз
    const spanDown1 = document.createElement("span");
    spanDown1.classList.add("down");
    spanDown1.innerHTML = "&#9660;";
    
    // Створюємо <span> із текстом
    const spanText = document.createElement("span");
    spanText.classList.add("text");
    spanText.textContent = "Not in system of coordinates";
    
    // Створюємо другий <span> із символом стрілки вниз
    const spanDown2 = document.createElement("span");
    spanDown2.classList.add("down");
    spanDown2.innerHTML = "&#9660;";
    
    // Додаємо всі <span> до <p>
    textNoIn.appendChild(spanDown1);
    textNoIn.appendChild(spanText);
    textNoIn.appendChild(spanDown2);

    canvasSave.width = sizeM;
    canvasSave.height = sizeM;
    drawSystem();
    trName.value = "Trapezium_" + (globalId + 1);
});

canvasMainStep.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (canvasMainStep.value.trim() === "" ||
            Number(canvasMainStep.value) === divsCnt) {
            canvasMainStep.value = divsCnt;
            return;
        }
        const value = Number(canvasMainStep.value)
        if (value <= 0)
            alert("Value cannot be equal to zero.");
        else if (value > maxDivsCnt) {
            alert("Value cannot be greater than " + maxDivsCnt + ".");
            canvasMainStep.value = divsCnt;
        } else {
            drawSystem();
            checkCoords();
            reDrawCanvasMain();
        }        
    }
});
addRestrict(canvasMainStep, /^[0-9]$/);

function isInsideSystem(trap, divsCnt) {
    console.log("isInsideSystem");
    let { 
        lStartPoint: trP1, lEndPoint: trP2, 
        sStartPoint: trP3, sEndPoint: trP4 
    } = trap.coords;
    let trP = [trP1, trP2, trP3, trP4];

    return !trP.some((point) => !point.isInRangeAbs(divsCnt));
}

let textNoIn;
let firstInSys = 0;
function reDrawCanvasMain() {
    console.log("reDrawCanvasMain");
    let divsCntNew = Number(canvasMainStep.value);
    
    downOn(firstInSys);
    let isLower = divsCntNew < divsCnt;
    console.log("isLower: " + isLower);
    firstInSys = isLower ? firstInSys : 0;
    for (let i = firstInSys; i < trapeziums.length; i++) { 
        console.log(trapeziums[i].proper.name);
        console.log("inSyst before: " + trapeziums[i].inSyst);
        if (isLower) {
            if (trapeziums[i].inSyst)
                console.log("test isLower:");
                trapeziums[i].inSyst = isInsideSystem(trapeziums[i], divsCntNew);
        } else {
            if (!trapeziums[i].inSyst)
                console.log("test notIsLower:");
                trapeziums[i].inSyst = isInsideSystem(trapeziums[i], divsCntNew);
        }

        console.log("inSyst after: " + trapeziums[i].inSyst);
    }

    layersElements.innerHTML = "";
    let index = 0;
    for (let i = 0; i < trapeziums.length; i++) {
        if (trapeziums[i].inSyst) {
            layersElements.prepend(trapeziums[i].divElm);
            index++;
            controlOn(trapeziums[i].divElm);
            draw(trapeziums[i]);
        } else {
            const referenceNode = layersElements.children[index];
            if (referenceNode) {
                layersElements.insertBefore(trapeziums[i].divElm, referenceNode);
            } else {
                layersElements.append(trapeziums[i].divElm)
            }
            controlOff(trapeziums[i].divElm);
        }
    }

    const referenceNode = layersElements.children[index];
    if (referenceNode) {
        layersElements.insertBefore(textNoIn, referenceNode);
        textNoIn.style.display = "block";
    } else {
        textNoIn.style.display = "none";
    }

    for (let i = 0; i < trapeziums.length; i++) {
        if (trapeziums[i].inSyst) {
            firstInSys = i;
            console.log("firstInSys: " + firstInSys);
            console.log("firstInSys name: " + trapeziums[firstInSys].proper.name);
            downOff(firstInSys);
            break;
        }
    }
 }

 function downOff(index) {
    console.log("downOff");
    trapeziums[index].divElm.classList.add("no-down");
 } 
 function downOn(index) {
    console.log("downOn");
    trapeziums[index].divElm.classList.remove("no-down");
 }

 function controlOff(div) {
    div.classList.add("non-active");
 }
 function controlOn(div) {
    div.classList.remove("non-active");
 }


// Змінні для налаштування декартової системи на канвасі
let maxDivsCnt = 100;
let divsCnt;
let midl;
let stepM;

let sizeM = 500;
let offs;

const ctx = canvasMain?.getContext("2d");
// Функція малювання координатної системи
function drawSystem() {

    canvasMain.width = sizeM;
    canvasMain.height = sizeM;

    ctx.clearRect(0, 0, canvasMain.width, canvasMain.height);

    let height = canvasMain.height;
    let width = canvasMain.width;  
    if (width !== height) {
        return;
    } 

    const value = Number(canvasMainStep.value);
    divsCnt = value;
    const divs = value + 2;
    const size = width;
    stepM = Math.floor(size / divs / 2);
    offs = Math.floor((size / 2) % stepM);

    // Розмірна сітка
    ctx.strokeStyle = "rgb(196, 199, 206)";
    ctx.lineWidth = 1;

    if (value <= 45) {
        for (let cur = offs + stepM; cur < size - offs; cur += stepM) {
            ctx.beginPath();
            ctx.moveTo(cur, 0);
            ctx.lineTo(cur, height);
            ctx.moveTo(0, cur);
            ctx.lineTo(size, cur);
            ctx.stroke();
        }
    }
    
    // Осі координат
    ctx.strokeStyle = "rgb(33, 33, 33)";
    ctx.lineWidth = 1;

    midl = Math.floor(size / 2);
    ctx.beginPath();
    ctx.moveTo(midl, stepM + offs);
    ctx.lineTo(midl, height - stepM - offs);
    ctx.moveTo(stepM + offs, midl);
    ctx.lineTo(size - stepM - offs, midl);
    ctx.stroke();

    // Одиничні поділки на осях
    let markLen;
    if (value <= 20) 
        markLen = Math.floor(stepM / 5);
    else 
        markLen = 2;

    if (value <= 35) {
        let markS = midl - markLen;
        let markE = midl + markLen;

        // for (let cur = offs + stepM * 2; cur <= size - stepM * 2 - offs; cur += stepM) {
        for (let cur = offs + stepM * 2; cur <= size - stepM * 2 - offs; cur += stepM) {
            if (cur === midl) continue;

            ctx.beginPath();
            ctx.moveTo(cur, markS);
            ctx.lineTo(cur, markE);
            ctx.moveTo(markS, cur);
            ctx.lineTo(markE, cur);
            ctx.stroke();
        }   
    }
    

    // Точка на перетині осей
    ctx.beginPath();
    if (value <= 20) 
        ctx.arc(midl, midl, markLen / Math.sqrt(2), 0, Math.PI * 2);
    else 
        ctx.arc(midl, midl, 2, 0, Math.PI * 2);

    ctx.fill();

    // Стрілки осей
    ctx.lineWidth = 1.5;
    let shrt;
    let long;
    if (value <= 20) {
        let arrw = stepM / Math.sqrt(2);
        let degr = 15; 
        let rads = degr * (Math.PI / 180);
        shrt = arrw * Math.sin(rads);
        long = arrw * Math.cos(rads);
    } else {
        shrt = 2.7;
        long = 10;
    }

    ctx.beginPath();
    ctx.moveTo(midl - shrt, stepM + offs + long);
    ctx.lineTo(midl, stepM + offs);
    ctx.lineTo(midl + shrt, stepM + offs + long);
    ctx.moveTo(size - stepM - offs - long, midl - shrt);
    ctx.lineTo(size - stepM - offs, midl);
    ctx.lineTo(size - stepM - offs - long, midl + shrt);
    ctx.stroke();   


    // Підпис поділок додатнії осей
    ctx.textAlign = "center";
    ctx.font = "16px Arial";

    if (value <= 20) {
    ctx.fillText("X", size - stepM - offs, midl - 8);
    ctx.fillText("Y", midl + 12, stepM + offs + 4);
    } else {
        ctx.fillText("X", size - stepM - offs - 8, midl - 10);
        ctx.fillText("Y", midl + 13, stepM + offs + 15);
    }

    if (value <= 20) {
        if (value <= 14)
            ctx.font = "12px Arial";
        else if (value <= 17)
            ctx.font = "10px Arial";
        else
            ctx.font = "8px Arial";

        ctx.textAlign = "right";
        // for (let num = 1, cur = midl - stepM; cur > stepM * 2 - offs; cur -= stepM, num++) {
            for (let num = 1, cur = midl - stepM; num <= value; cur -= stepM, num++) {
            ctx.fillText(num, midl - 2 - markLen, cur + 3);
            // ctx.fillText(num, midl - 6, cur + 3);
        }
        ctx.textAlign = "center";

        // for (let num = 1, cur = midl + stepM; cur <= size - stepM * 2 - offs; cur += stepM, num++) {
        for (let num = 1, cur = midl + stepM; num <= value; cur += stepM, num++) {
            ctx.fillText(num, cur, midl + markLen + 11  );
            // ctx.fillText(num, cur, midl + 13);
        }
    
        ctx.textAlign = "right";
        ctx.fillText(0, midl - 2 - markLen, midl + 13);
    }

    ctxSave.clearRect(0, 0, sizeM, sizeM);
    ctxSave.drawImage(canvasMain, 0, 0);
}

// Функція переведення у координати канваса
function cX(value) {
    return midl + value * stepM; 
}

// Функція для малювання трапеції на канвасі
function draw(tr) {
    ctx.fillStyle = tr.proper.colorFill; 
    ctx.strokeStyle = tr.proper.colorLine; 
    ctx.lineWidth = 4;

    let lStartPoint = tr.getLStartPoint();
    let lEndPoint = tr.getLEndPoint();
    let sEndPoint = tr.getSEndPoint();
    let sStartPoint = tr.getSStartPoint();

    ctx.beginPath();
    ctx.moveTo(cX(lStartPoint.x),   cX(-lStartPoint.y));
    ctx.lineTo(cX(lEndPoint.x),     cX(-lEndPoint.y));
    ctx.lineTo(cX(sEndPoint.x),     cX(-sEndPoint.y));
    ctx.lineTo(cX(sStartPoint.x),   cX(-sStartPoint.y));
    ctx.closePath();

    ctx.stroke();
    ctx.fill();

    drawH(tr, sStartPoint, tr.coords.h1Point);
    drawH(tr, sEndPoint, tr.coords.h2Point);

    
    let isInside = (tr.dimens.offset < divsCnt / 35 * 2);
    // drawHSq(tr, tr.coords.h2Point, isInside);
    if (
        tr.dimens.offset > divsCnt / 35 * 2 && 
        divsCnt / 35 * 2 < tr.dimens.heightLen
    ) {
        drawHSq(tr, tr.coords.h2Point, isInside);
        drawHSq(tr, tr.coords.h1Point, false);
    }


    // drawHSq(tr, tr.coords.h1Point, false);
    // // let isInside = (tr.dimens.offset < divsCnt / 35 * 2);
    // // drawHSq(tr, tr.coords.h2Point, isInside);
    // if (tr.dimens.offset < divsCnt / 35 * 2)
    //     drawHSq(tr, tr.coords.h2Point, isInside);
}

// Функція для малювання висоти трапеції на канвасі
function drawH(tr, bPoint, hPoint) {
    ctx.strokeStyle = tr.colorLine; 
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(cX(hPoint.x), cX(-hPoint.y));
    ctx.lineTo(cX(bPoint.x), cX(-bPoint.y));
    ctx.stroke();
}

// Функція для малювання позначення висоти трапеції на канвасі (квадратик)
function drawHSq(tr, hPoint, isRev) {
    let iR = isRev ? -1 : 1;
    ctx.strokeStyle = tr.proper.colorLine; 
    ctx.lineWidth = 2;

    let len = divsCnt / 35;
    let vecH = tr.getVecH();
    let vecV = tr.getVecV();

    ctx.beginPath();
    ctx.moveTo(
        cX(hPoint.x + vecH.x * len * iR), 
        cX(-(hPoint.y + vecH.y * len * iR)));

    ctx.lineTo(
        cX(hPoint.x + vecH.x * len * iR + vecV.x * len), 
        cX(-(hPoint.y + vecH.y * len * iR + vecV.y * len)));

    ctx.lineTo (
        cX(hPoint.x + vecV.x * len), 
        cX(-(hPoint.y + vecV.y * len)));
    ctx.stroke();
}
