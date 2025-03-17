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

function showErrorMessageDivs(errorMessage) {
  isErrorDivs = true;
  textErrorDivs.textContent = errorMessage;
  canvasMainStep.style.backgroundColor = "rgb(239, 117, 117)";
}

function hideErrorMessageDivs() {
  canvasMainStep.style.backgroundColor = "rgb(255, 255, 255)";
  textErrorDivs.textContent = "";
  isErrorDivs = false;
}

let isErrorDivs = false;

canvasMainStep.addEventListener("blur", function () {
  if (canvasMainStep.value.trim() === "" || isErrorDivs) {
    canvasMainStep.value = divsCnt;
  }
  if (isErrorDivs) hideErrorMessageDivs();
});

let inputTimeout;
canvasMainStep.addEventListener("input", function (event) {
  clearTimeout(inputTimeout);
  inputTimeout = setTimeout(() => {
    if (
      canvasMainStep.value.trim() === "" ||
      Number(canvasMainStep.value) === divsCnt
    ) {
      if (isErrorDivs) hideErrorMessageDivs();
      return;
    }
    const value = Number(canvasMainStep.value);
    if (value <= 0) {
      showErrorMessageDivs("Value cannot be equal to zero.");
    } else if (value > maxDivsCnt) {
      showErrorMessageDivs("Value cannot be greater than " + maxDivsCnt + ".");
    } else {
      if (isErrorDivs) hideErrorMessageDivs();

      let divsCntBefore = divsCnt;
      drawSystem();
      checkCoords();
      reDrawCanvasMain(divsCntBefore);
    }
  }, 150);
});
addRestrict(canvasMainStep, /^[0-9]$/);

function isInsideSystem(trap) {
  let {
    lStartPoint: trP1,
    lEndPoint: trP2,
    sStartPoint: trP3,
    sEndPoint: trP4,
  } = trap.coords;
  let trP = [trP1, trP2, trP3, trP4];

  return !trP.some((point) => !point.isInRangeAbs(divsCnt));
}

let textNoIn;
let firstInSys = 0;
function reDrawCanvasMain(divsCntBefore) {
  if (!trapeziums.length) return;

  downOn(firstInSys);
  let isLower = divsCntBefore > divsCnt;
  firstInSys = isLower ? firstInSys : 0;

  for (let i = firstInSys; i < trapeziums.length; i++) {
    if (isLower)
      if (trapeziums[i].inSyst)
        trapeziums[i].inSyst = isInsideSystem(trapeziums[i]);
      else if (!trapeziums[i].inSyst)
        trapeziums[i].inSyst = isInsideSystem(trapeziums[i]);
  }

  layersElements.innerHTML = "";
  let index = 0;
  for (let i = 0; i < trapeziums.length; i++) {
    if (trapeziums[i].inSyst) {
      layersElements.prepend(trapeziums[i].divElm);
      index++;
      controlOn(trapeziums[i].divElm);
      if (trapeziums[i].isShow) draw(trapeziums[i]);
    } else {
      const referenceNode = layersElements.children[index];
      if (referenceNode) {
        layersElements.insertBefore(trapeziums[i].divElm, referenceNode);
      } else {
        layersElements.append(trapeziums[i].divElm);
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
      downOff(firstInSys);
      break;
    }
  }
}

function downOff(index) {
  trapeziums[index].divElm.classList.add("no-down");
}
function downOn(index) {
  trapeziums[index].divElm.classList.remove("no-down");
}

function controlOff(div) {
  div.classList.add("non-active");
}
function controlOn(div) {
  div.classList.remove("non-active");
}

// Змінні для налаштування декартової системи на канвасі
let minDivsStep = 16;
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

  console.log("size: " + size);

  console.log("divsCnt: " + divsCnt);
  console.log("divs: " + divs);

  stepM = Math.floor(size / divs / 2);
  console.log("stepM: " + stepM);
  let divsV = Math.ceil(minDivsStep / stepM);
  console.log("divsV: " + divsV);
  console.log("value / divsV: " + (value / divsV));
  let stepD = Math.floor(size / (Math.ceil(value / divsV) + 2) / 2);
  console.log("stepD: " + stepD);
  if (stepD % 2) stepD--; 
  console.log("stepD: " + stepD);

  stepM = stepD / divsV;
  
  offs = Math.floor((size / 2) % stepD);

  // Розмірна сітка
  ctx.strokeStyle = "rgb(196, 199, 206)";
  ctx.lineWidth = 1;


  // if (value <= 45) {
    for (let cur = offs + stepD; cur < size - offs; cur += stepD) {
      ctx.beginPath();
      ctx.moveTo(cur, 0);
      ctx.lineTo(cur, height);
      ctx.moveTo(0, cur);
      ctx.lineTo(size, cur);
      ctx.stroke();
    }
  // }

  // Осі координат
  ctx.strokeStyle = "rgb(33, 33, 33)";
  ctx.lineWidth = 1;

  midl = Math.floor(size / 2);
  ctx.beginPath();
  ctx.moveTo(midl, stepD + offs);
  ctx.lineTo(midl, height - stepD - offs);
  ctx.moveTo(stepD + offs, midl);
  ctx.lineTo(size - stepD - offs, midl);
  ctx.stroke();

  // Одиничні поділки на осях
  let markLen;
  if (value <= 20) markLen = Math.floor(stepM / 5);
  else markLen = 2;

  
    let markS = midl - markLen;
    let markE = midl + markLen;

    for (
      let cur = offs + stepD * 2;
      cur <= size - stepD * 2 - offs;
      cur += stepD
    ) {
      if (cur === midl) continue;

      ctx.beginPath();
      ctx.moveTo(cur, markS);
      ctx.lineTo(cur, markE);
      ctx.moveTo(markS, cur);
      ctx.lineTo(markE, cur);
      ctx.stroke();
    }


  // Точка на перетині осей
  ctx.beginPath();
  if (value <= 20) ctx.arc(midl, midl, markLen / Math.sqrt(2), 0, Math.PI * 2);
  else ctx.arc(midl, midl, 2, 0, Math.PI * 2);

  ctx.fill();

  // Стрілки осей
  ctx.lineWidth = 1.5;
  let shrt;
  let long;
  if (value <= 20) {
    let arrw = stepD / Math.sqrt(2);
    let degr = 15;
    let rads = degr * (Math.PI / 180);
    shrt = arrw * Math.sin(rads);
    long = arrw * Math.cos(rads);
  } else {
    shrt = 2.7;
    long = 10;
  }

  ctx.beginPath();
  ctx.moveTo(midl - shrt, stepD + offs + long);
  ctx.lineTo(midl, stepD + offs);
  ctx.lineTo(midl + shrt, stepD + offs + long);
  ctx.moveTo(size - stepD - offs - long, midl - shrt);
  ctx.lineTo(size - stepD - offs, midl);
  ctx.lineTo(size - stepD - offs - long, midl + shrt);
  ctx.stroke();

  // Підпис поділок додатнії осей
  ctx.textAlign = "center";
  ctx.font = "16px Arial";

  if (value <= 20) {
    ctx.fillText("X", size - stepD - offs, midl - 8);
    ctx.fillText("Y", midl + 12, stepD + offs + 4);
  } else {
    ctx.fillText("X", size - stepD - offs - 8, midl - 10);
    ctx.fillText("Y", midl + 13, stepD + offs + 15);
  }

 
    ctx.font = "10px Arial";


    ctx.textAlign = "right";
    for (let num = divsV, cur = midl - stepD; num <= Math.ceil(value / divsV) * divsV; cur -= stepD, num += divsV)
      ctx.fillText(num, midl - 2 - markLen, cur + 3);

    ctx.textAlign = "center";
    for (let num = divsV, cur = midl + stepD; num <= Math.ceil(value / divsV) * divsV ; cur += stepD, num += divsV)
      ctx.fillText(num, cur, midl + markLen + 11);

    ctx.textAlign = "right";
    ctx.fillText(0, midl - 2 - markLen, midl + 13);
  

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
  ctx.moveTo(cX(lStartPoint.x), cX(-lStartPoint.y));
  ctx.lineTo(cX(lEndPoint.x), cX(-lEndPoint.y));
  ctx.lineTo(cX(sEndPoint.x), cX(-sEndPoint.y));
  ctx.lineTo(cX(sStartPoint.x), cX(-sStartPoint.y));
  ctx.closePath();

  ctx.stroke();
  ctx.fill();

  drawH(tr, sStartPoint, tr.coords.h1Point);
  drawH(tr, sEndPoint, tr.coords.h2Point);

  let isInside = tr.dimens.offset < (divsCnt / 35) * 2;
  if (
    tr.dimens.offset > (divsCnt / 35) * 2 &&
    (divsCnt / 35) * 2 < tr.dimens.heightLen
  ) {
    drawHSq(tr, tr.coords.h2Point, isInside);
    drawHSq(tr, tr.coords.h1Point, false);
  }
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
    cX(-(hPoint.y + vecH.y * len * iR))
  );

  ctx.lineTo(
    cX(hPoint.x + vecH.x * len * iR + vecV.x * len),
    cX(-(hPoint.y + vecH.y * len * iR + vecV.y * len))
  );

  ctx.lineTo(cX(hPoint.x + vecV.x * len), cX(-(hPoint.y + vecV.y * len)));
  ctx.stroke();
}
