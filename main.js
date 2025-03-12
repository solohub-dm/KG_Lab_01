const getElement = document.querySelector.bind(document);


// Елементи форми 
const trName  = getElement("#trapezium-name");

const trColorsCbx = [
    getElement("#checkbox-fill"),
    getElement("#checkbox-line")
];
trColorsCbx.forEach(input => {
    input.addEventListener("change", () => {
        checkColors(input);
    });
});

const trColors = [
    getElement("#color-fill"),
    getElement("#color-line")
];

const trCoords = [
    getElement("#coord-x1"),
    getElement("#coord-y1"),
    getElement("#coord-x2"),
    getElement("#coord-y2")
];
trCoords.forEach(input => {
    input.addEventListener("input", () => {
        checkCoords(input);
    });
});

const trHeightLen  = getElement("#height-lenght");
const trSmallBasisLen  = getElement("#smaller-basis-lenght");

function checkColors(input) {
    if (
        trColorsCbx[0].checked === false &&
        trColorsCbx[1].checked === false
    ) {
        input.checked = true;
    }
}

let lStartPoint; 
let lEndPoint; 
let len;

let sqStartPoint;
let sqEndPoint;

let sStartPoint;
let sEndPoint;

let vecH;
let vecV;

let h1Point;
let h2Point;

let heightLen;
let smallerLenMax;
let smallerLen;

function showErrorMessage(errorMessage, input) {
    console.log(errorMessage);
    canvasPreview.style.display = "none";
    errorPanel.style.display = "flex";
    errorText.textContent = errorMessage;

    if (input) {
        input.style.backgroundColor = "rgb(239, 117, 117)";
    }
}

function tryHideErrorMessage() {
    if (!isErrorCoords && !isErrorHeight && !isErrorBasisLen) {
        canvasPreview.style.display = "block";
        errorPanel.style.display = "none";
    } 
}


let isCorrectCoords = false;
let isErrorCoords = false;

function checkCoords(input) {
    isCorrectCoords = false;

    trHeightLen.style.backgroundColor = "white";
    trSmallBasisLen.style.backgroundColor = "white";
    
    trCoords.forEach(input => checkCoordInput(input));
    isErrorCoords = trCoords.some(input => input.style.backgroundColor === "rgb(239, 117, 117)");
    if (!isSomeCoordEmpty() && !isErrorCoords) {
        if (
            trCoords[0].value === trCoords[2].value 
            && trCoords[1].value === trCoords[3].value 
        ) {
            showErrorMessage("The base of a trapezium cannot be a point.", input);
            isErrorCoords = true;
        } else {
            isCorrectCoords = true;
        }
    }

    console.log("isCorrectCoords " + isCorrectCoords);
    if (!isErrorCoords) {
        checkHeight();
        checkSmaller();
        tryHideErrorMessage();
    } 

    return isCorrectCoords;
}

function checkCoordInput(input) {
    let inputValue = input.value;
    input.style.backgroundColor = "white";

    if (input.value.trim() === "") {

    } else if (inputValue > divsCnt ) {
        showErrorMessage("Value cannot be greater then " + divsCnt + ".", input);
    } else if (inputValue < -divsCnt) {
        showErrorMessage("Value cannot be lower then " + -divsCnt + ".", input);
    }
}

function isSomeCoordEmpty() {   
    const hasEmptyValue = trCoords.some(input => input.value.trim() === "");
    return hasEmptyValue;
}


let isCorrectHeight = false;
let isErrorHeight = false;
// Відстеження змін довжини висоти
trHeightLen.addEventListener("input", checkHeight);
function checkHeight() {
    isCorrectHeight = false;
    trHeightLen.style.backgroundColor = "white";
    trSmallBasisLen.style.backgroundColor = "white";

    do {
        if (trHeightLen.value.trim() === "") break;
     
        if (isErrorCoords) break;

        if (!isCorrectCoords) {
            showErrorMessage("Enter all coords of larger bassis first.", trHeightLen);
            break;
        }
        if (trHeightLen.value < 1) {
            showErrorMessage("Height lenght cannot be lower than 1.", trHeightLen);
            break;
        }
        if (trHeightLen.value > divsCnt * 2) {
            showErrorMessage("Height cannot be higher than system of coordinates.", trHeightLen);
            break;
        }

        lStartPoint = new Point(Number(trCoords[0].value), Number(trCoords[1].value)); 
        lEndPoint = new Point(Number(trCoords[2].value), Number(trCoords[3].value)); 

        console.log("lb X1: " + lStartPoint.x);
        console.log("lb Y1: " + lStartPoint.y);
        console.log("lb X2: " + lEndPoint.x);
        console.log("lb Y2: " + lEndPoint.y + "\n")

        len = lStartPoint.distanceTo(lEndPoint);
        vecH = new Point((lEndPoint.x - lStartPoint.x) / len, (lEndPoint.y - lStartPoint.y) / len);
        vecV = new Point(-vecH.y, +vecH.x);

        heightLen = Number(trHeightLen.value);
        sqStartPoint = new Point(lStartPoint.x + vecV.x * heightLen, lStartPoint.y + vecV.y * heightLen);
        sqEndPoint = new Point(lEndPoint.x + vecV.x * heightLen, lEndPoint.y + vecV.y * heightLen);

        console.log("sq X1: " + sqStartPoint.x);
        console.log("sq Y1: " + sqStartPoint.y);
        console.log("sq X2: " + sqEndPoint.x);
        console.log("sq Y2: " + sqEndPoint.y);

        if (!sqStartPoint.isInRangeAbs(divsCnt) || !sqEndPoint.isInRangeAbs(divsCnt)) {
            smallerLenMax = calcSmallerLenMax(sqStartPoint, sqEndPoint);
            smallerLenMax = Math.floor(smallerLenMax);

            if (smallerLenMax < 1) {
                showErrorMessage(
                    "The height length exceeds the maximum allowed. " +
                    "The figure will not fit in the coordinate system.", trHeightLen);
                break;
            }
        } else {
            smallerLenMax = len;
        }

        isCorrectHeight = true;
    } while (0);
    
    isErrorHeight = trHeightLen.value.trim() !== "" && !isCorrectHeight;
    if (!isErrorHeight) {
        checkSmaller();
        tryHideErrorMessage();
    };

    return isCorrectHeight;
}

function calcSmallerLenMax(p1, p2) {
    let x1 = p1.x, y1 = p1.y;
    let x2 = p2.x, y2 = p2.y;
    let intersections = []; 
    
    let isVertical = (x1 === x2);
    let isHorizontal = (y1 === y2);
    if (isVertical) return 0;
    if (isHorizontal) return 0;

    let m = (y2 - y1) / (x2 - x1);
    let b = y1 - m * x1;

    let yAtPosX = m * divsCnt+ b;
    let yAtNegX = m * -divsCnt+ b;

    function isOnSegment(x, y) {
        return (x >= Math.min(x1, x2) && x <= Math.max(x1, x2) &&
                y >= Math.min(y1, y2) && y <= Math.max(y1, y2));
    }

    if (Math.abs(yAtPosX) <= divsCnt&& isOnSegment(divsCnt, yAtPosX)) {
        intersections.push(new Point(divsCnt, yAtPosX));
    }
    if (Math.abs(yAtNegX) <= divsCnt&& isOnSegment(-divsCnt, yAtNegX)) {
        intersections.push(new Point(-divsCnt, yAtNegX));
    }

    let xAtPosY = (divsCnt- b) / m;
    let xAtNegY = (-divsCnt- b) / m;

    if (Math.abs(xAtPosY) <= divsCnt&& isOnSegment(xAtPosY, divsCnt)) {
        intersections.push(new Point(xAtPosY, divsCnt));
    }
    if (Math.abs(xAtNegY) <= divsCnt&& isOnSegment(xAtNegY, -divsCnt)) {
        intersections.push(new Point(xAtNegY, -divsCnt));
    }

    let lenMax;
    if (intersections.length === 0) {
        lenMax = 0;
    } else {
        let midPoint = new Point((x1 + x2) / 2, (y1 + y2) / 2);
        if (!midPoint.isInRangeAbs(divsCnt)) {
            lenMax = 0;
        } else if (intersections.length === 1) {
            lenMax = midPoint.distanceTo(intersections[0]);
        } else {
            lenMax = Math.min(
                midPoint.distanceTo(intersections[0]),
                midPoint.distanceTo(intersections[1])
            );
        }
    }
    return lenMax;
}

let isCorrectBasisLen = false;
let isErrorBasisLen = false;
// Відстеження змін довжини меншої основи
trSmallBasisLen.addEventListener("input", checkSmaller);
function checkSmaller() {
    isCorrectBasisLen = false;
    trSmallBasisLen.style.backgroundColor = "white";

    do {
        if (trSmallBasisLen.value.trim() === "") break;
        if (isErrorCoords || isErrorHeight) break;

        if (!isCorrectHeight) {
            if (isSomeCoordEmpty()) {
                showErrorMessage("Enter all coords of larger bassis first.");
            } else if (trHeightLen.value.trim() === "") {
                showErrorMessage("Enter height lenght first.");
            }
            break;
        }

        smallerLen = Number(trSmallBasisLen.value);
        console.log("Smaller basis: " + smallerLen);
        if (smallerLen < 1) {
            showErrorMessage("Smaller basis lenght cannot be lower than 1.", trSmallBasisLen);
            break;
        }
        if (smallerLen >= len) {
            showErrorMessage("Smaller basis lenght cannot be higher than larger one.", trSmallBasisLen);
            break;
        }
        if (smallerLen > smallerLenMax) {
            showErrorMessage(
                "The smaller basis length exceeds the maximum allowed. " +
                "The figure will not fit in the coordinate system." +
                "Max allowed length: " + smallerLenMax + ".", trSmallBasisLen);
            break;
        }

        let offset = (len - smallerLen) / 2;  
        h1Point = new Point(lStartPoint.x + vecH.x * offset, lStartPoint.y + vecH.y * offset);
        h2Point = new Point(lEndPoint.x - vecH.x * offset, lEndPoint.y - vecH.y * offset);

        sStartPoint = new Point(h1Point.x + vecV.x * heightLen, h1Point.y + vecV.y * heightLen);
        sEndPoint = new Point(h2Point.x + vecV.x * heightLen, h2Point.y + vecV.y * heightLen);

        console.log("sb X1: " + sStartPoint.x);
        console.log("sb Y1: " + sStartPoint.y);
        console.log("sb X2: " + sEndPoint.x);
        console.log("sb Y2: " + sEndPoint.y + "\n")

        isCorrectBasisLen = true;
    } while (0);

    isErrorBasisLen = trSmallBasisLen.value.trim() !== "" && !isCorrectBasisLen;
    if (!isErrorBasisLen) {
        tryHideErrorMessage();
    }
}


class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    isInRangeAbs(value) {
        return Math.abs(this.x) <= value && Math.abs(this.y) <= value;
    }
    distanceTo(otherPoint) {
        return Math.sqrt((this.x - otherPoint.x) ** 2 + (this.y - otherPoint.y) ** 2);
    }
}

class Trapezium {
    constructor(
        lStartPoint, 
        lEndPoint, 
        sStartPoint, 
        sEndPoint, 
        h1Point,
        h2Point,
        vecH,
        vecV,
        heightLen, 
        smallerLen, 
        colorFill = "transparent", 
        colorLine = "transparent", 
        id
    ) {
        this.id = id;
        this.heightLen = heightLen;
        this.smallerLen = smallerLen;
        this.colorFill = colorFill;
        this.colorLine = colorLine;

        this.lStartPoint =  Object.assign({}, lStartPoint); 
        this.lEndPoint =  Object.assign({}, lEndPoint); 
        this.sStartPoint =  Object.assign({}, sStartPoint); 
        this.sEndPoint =  Object.assign({}, sEndPoint); 

        this.vecH = Object.assign({}, vecH);
        this.vecV = Object.assign({}, vecV);

        this.h1Point = Object.assign({}, h1Point);
        this.h2Point = Object.assign({}, h2Point);
    }
}

const errorPanel  = getElement("#error-panel");
const errorText  = getElement("#text-error");

const canvasPreview  = getElement("#canvas-preview");
const canvasMain  = getElement("#canvas-main");
const canvasMainStep  = getElement("#step-lenght");

const windowBtn  = getElement("#control-button-window");
const windowBtnIconAdd  = getElement("#icon-add-item");
const windowBtnIconList  = getElement("#icon-list-item");
const windowBtnText  = getElement("#text-button-window");

const layersWindow = getElement("#control-main-layers");
const layersDeleteBtn  = getElement("#control-delete-layers");

const propertiesWindow = getElement("#control-main-properties");
const propertiesForm  = getElement("#form-properties");
const propertiesClearBtn  = getElement("#control-header-cancel");
const propertiesCreateBtn  = getElement("#control-header-create");

let isLayersMode = false;

windowBtn.addEventListener("click", changeWindow);
propertiesClearBtn.addEventListener("click", clearForm);

function clearForm() {
    propertiesForm.reset();
    const textInputs = document.querySelectorAll('input[type="text"], input[type="number"]');
    textInputs.forEach(input => {
        input.style.backgroundColor = "white";
    });
    trName.value = "Trapezium";

    canvasPreview.style.display = "block";
    errorPanel.style.display = "none";
}

let trapeziums = [];
let globalId = 0;
function getNewId() {
    return ++globalId;
}

propertiesCreateBtn.addEventListener("click", createTrapezium);
function createTrapezium() {
    if (isCorrectCoords && isCorrectHeight && isCorrectBasisLen) {
        const textInputs = document.querySelectorAll('input[type="text"], input[type="number"]');
        if (Array.from(textInputs).some(input => input.value.trim() === "")) {
            showErrorMessage("Enter all fields to create.");
            return;
        }
        let newTrapezium = new Trapezium (
            lStartPoint, lEndPoint,
            sStartPoint, sEndPoint,
            h1Point, h2Point,
            vecH, vecV,
            heightLen, smallerLen,
            trColorsCbx[0].checked ? trColors[0].value : "transparent", 
            trColorsCbx[1].checked ? trColors[1].value : "transparent",
            getNewId()
        );
        trapeziums.push(newTrapezium);
        draw(newTrapezium);
    }
    
}

function cX(value) {
    return midl + value * step; 
}

function draw(tr) {
    ctx.fillStyle = tr.colorFill; 
    ctx.strokeStyle = tr.colorLine; 
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(cX(tr.lStartPoint.x), cX(-tr.lStartPoint.y));
    ctx.lineTo(cX(tr.lEndPoint.x), cX(-tr.lEndPoint.y));
    ctx.lineTo(cX(tr.sEndPoint.x), cX(-tr.sEndPoint.y));
    ctx.lineTo(cX(tr.sStartPoint.x), cX(-tr.sStartPoint.y));
    ctx.closePath();

    ctx.stroke();
    ctx.fill();

    drawH(tr, tr.sStartPoint, tr.h1Point);
    drawH(tr, tr.sEndPoint, tr.h2Point);
    drawHSq(tr, tr.h1Point, false);
    drawHSq(tr, tr.h2Point, true);
}

function drawH(tr, bPoint, hPoint) {
    ctx.strokeStyle = tr.colorLine; 
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(cX(hPoint.x), cX(-hPoint.y));
    ctx.lineTo(cX(bPoint.x), cX(-bPoint.y));
    ctx.stroke();
}


function drawHSq(tr, hPoint, isRev) {
    let iR = isRev ? -1 : 1;
    ctx.strokeStyle = tr.colorLine; 
    ctx.lineWidth = 2;

    let len = divsCnt / 35;

    ctx.beginPath();
    ctx.moveTo(
        cX(hPoint.x + tr.vecH.x * len * iR), 
        cX(-(hPoint.y + tr.vecH.y * len * iR)));

    ctx.lineTo(
        cX(hPoint.x + tr.vecH.x * len * iR + tr.vecV.x * len), 
        cX(-(hPoint.y + tr.vecH.y * len * iR + tr.vecV.y * len)));

    ctx.lineTo (
        cX(hPoint.x + tr.vecV.x * len), 
        cX(-(hPoint.y + tr.vecV.y * len)));
    ctx.stroke();
}

function changeDisplay(item) {
    let currentDisplay = getComputedStyle(item).display;
    item.style.display = (currentDisplay === "none") ? "flex" : "none";
}

function changeWindow() {
    if (isLayersMode)
        windowBtnText.textContent = "Show layers menu";
    else
        windowBtnText.textContent = "Create trapezium";
    
    changeDisplay(windowBtnIconAdd);
    changeDisplay(windowBtnIconList);
    changeDisplay(propertiesWindow);
    changeDisplay(layersWindow);

    isLayersMode = !isLayersMode;
}

let divsCnt;
let midl;
let step;
const ctx = canvasMain?.getContext("2d");

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
        else if (value > canvasMain.width / 2 - 5)
            alert("Value cannot be greater than " + (canvasMain.width / 2 - 5) + ".");
        else 
            drawSystem();
    }
});

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

    ctx.strokeStyle = "rgb(196, 199, 206)";
    ctx.lineWidth = 1;

    if (value <= 45) {
        for (let cur = offs + step; cur < size - offs; cur += step) {
            ctx.beginPath();
            ctx.moveTo(cur, 0);
            ctx.lineTo(cur, height);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.moveTo(0, cur);
            ctx.lineTo(size, cur);
            ctx.stroke();
        }
    }
    
    ctx.strokeStyle = "rgb(33, 33, 33)";
    ctx.lineWidth = 1;

    midl = Math.floor(size / 2);
    ctx.beginPath();
    ctx.moveTo(midl, step + offs);
    ctx.lineTo(midl, height - step - offs);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(step + offs, midl);
    ctx.lineTo(size - step - offs, midl);
    ctx.stroke();

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
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(markS, cur);
            ctx.lineTo(markE, cur);
            ctx.stroke();
        }   
    }

    ctx.beginPath();
    if (value <= 20) 
        ctx.arc(midl, midl, markLen / Math.sqrt(2), 0, Math.PI * 2);
    else 
        ctx.arc(midl, midl, 2, 0, Math.PI * 2);

    ctx.fill();

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
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(size - step - offs - long, midl - shrt);
    ctx.lineTo(size - step - offs, midl);
    ctx.lineTo(size - step - offs - long, midl + shrt);
    ctx.stroke();   

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
