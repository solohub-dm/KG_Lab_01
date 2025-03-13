
// Функція завантаження при відкритті сторінки
window.addEventListener("load", () => {
    drawSystem();
    trName.value = "Trapezium";
});
canvasMainStep.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const value = Number(canvasMainStep.value)
        if (value <= 0)
            alert("Value cannot be lower than 1.");
        else if (value > maxDivsCnt)
            alert("Value cannot be greater than " + maxDivsCnt + ".");
        else {
            drawSystem();
            checkCoords();
        }        
    }
});


// Змінні для налаштування декартової системи на канвасі
let maxDivsCnt = 100;
let divsCnt;
let midl;
let step;

const ctx = canvasMain?.getContext("2d");
// Функція малювання координатної системи
function drawSystem() {

    canvasMain.width = 500;
    canvasMain.height = 500;

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
    step = Math.floor(size / divs / 2);
    const offs = Math.floor((size / 2) % step);

    // Розмірна сітка
    ctx.strokeStyle = "rgb(196, 199, 206)";
    ctx.lineWidth = 1;

    if (value <= 45) {
        for (let cur = offs + step; cur < size - offs; cur += step) {
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
    ctx.moveTo(midl, step + offs);
    ctx.lineTo(midl, height - step - offs);
    ctx.moveTo(step + offs, midl);
    ctx.lineTo(size - step - offs, midl);
    ctx.stroke();

    // Одиничні поділки на осях
    let markLen;
    if (value <= 20) 
        markLen = Math.floor(step / 5);
    else 
        markLen = 2;

    if (value <= 35) {
        let markS = midl - markLen;
        let markE = midl + markLen;

        // for (let cur = offs + step * 2; cur <= size - step * 2 - offs; cur += step) {
        for (let cur = offs + step * 2; cur <= size - step * 2 - offs; cur += step) {
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
        let arrw = step / Math.sqrt(2);
        let degr = 15; 
        let rads = degr * (Math.PI / 180);
        shrt = arrw * Math.sin(rads);
        long = arrw * Math.cos(rads);
    } else {
        shrt = 2.7;
        long = 10;
    }

    ctx.beginPath();
    ctx.moveTo(midl - shrt, step + offs + long);
    ctx.lineTo(midl, step + offs);
    ctx.lineTo(midl + shrt, step + offs + long);
    ctx.moveTo(size - step - offs - long, midl - shrt);
    ctx.lineTo(size - step - offs, midl);
    ctx.lineTo(size - step - offs - long, midl + shrt);
    ctx.stroke();   


    // Підпис поділок додатнії осей
    ctx.textAlign = "center";
    ctx.font = "16px Arial";

    if (value <= 20) {
    ctx.fillText("X", size - step - offs, midl - 8);
    ctx.fillText("Y", midl + 12, step + offs + 4);
    } else {
        ctx.fillText("X", size - step - offs - 8, midl - 10);
        ctx.fillText("Y", midl + 13, step + offs + 15);
    }

    if (value <= 20) {
        if (value <= 14)
            ctx.font = "12px Arial";
        else if (value <= 17)
            ctx.font = "10px Arial";
        else
            ctx.font = "8px Arial";

        ctx.textAlign = "right";
        // for (let num = 1, cur = midl - step; cur > step * 2 - offs; cur -= step, num++) {
            for (let num = 1, cur = midl - step; num <= value; cur -= step, num++) {
            ctx.fillText(num, midl - 2 - markLen, cur + 3);
            // ctx.fillText(num, midl - 6, cur + 3);
        }
        ctx.textAlign = "center";

        // for (let num = 1, cur = midl + step; cur <= size - step * 2 - offs; cur += step, num++) {
        for (let num = 1, cur = midl + step; num <= value; cur += step, num++) {
            ctx.fillText(num, cur, midl + markLen + 11  );
            // ctx.fillText(num, cur, midl + 13);
        }
    
        ctx.textAlign = "right";
        ctx.fillText(0, midl - 2 - markLen, midl + 13);
    }
}

// Функція переведення у координати канваса
function cX(value) {
    return midl + value * step; 
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
