const getElement = document.querySelector.bind(document);
//
//  Елементи інтерфейсу
//

const canvasPreview  = getElement("#canvas-preview");
const canvasMain  = getElement("#canvas-main");
const canvasMainStep  = getElement("#step-lenght");

const windowBtn  = getElement("#control-button-window");
const windowBtnIconAdd  = getElement("#icon-add-item");
const windowBtnIconList  = getElement("#icon-list-item");
const windowBtnText  = getElement("#text-button-window");

const layersWindow = getElement("#control-main-layers");
const layersDeleteBtn  = getElement("#control-delete-layers");
const layersElements  = getElement("#layers-panel");

const propertiesWindow = getElement("#control-main-properties");
const propertiesForm  = getElement("#form-properties");
const propertiesClearBtn  = getElement("#control-header-cancel");
const propertiesCreateBtn  = getElement("#control-header-create");

let isLayersMode = false;

// Зміна вікна програми
windowBtn.addEventListener("click", changeWindow);
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
// Зміна параметра відображення для елемента  
function changeDisplay(item) {
    let currentDisplay = getComputedStyle(item).display;
    item.style.display = (currentDisplay === "none") ? "flex" : "none";
}



// Масив для збереження даних створених трапецій
let trapeziums = [];
let trapez;

layersDeleteBtn.addEventListener("click", deleteAllTrapeziums);
function deleteAllTrapeziums() {
    layersElements.innerHTML = '';
    trapeziums = [];
    firstInSys = 0;
    ctx.clearRect(0, 0, sizeM, sizeM);
    ctx.drawImage(canvasSave, 0, 0);
}

// Функція створення трапеції із заданими параметрами
propertiesCreateBtn.addEventListener("click", createTrapezium);
function createTrapezium() {
    if (isErrorCoords || isErrorHeight || isErrorBasisLen) return;

    if (trName.value.trim() === "")
        textErrorName.textContent = "Enter name at first.";
    else if (isSomeCoordEmpty()) {
        textErrorCoords.textContent = "Enter all coords at first.";
    } else if (trHeightLen.value.trim() === "" || trSmallBasisLen.value.trim() === "") {
        textErrorLength.textContent = "Enter all lengths at first.";
    } else {
        if (isCorrectCoords && isCorrectHeight && isCorrectBasisLen) { 
            const newTrapez = _.cloneDeep(trapez);

            newTrapez.setProper(
                trColorsCbx[0].checked ? trColors[0].value : "transparent", 
                trColorsCbx[1].checked ? trColors[1].value : "transparent",
                getNewId()
            );
            newTrapez.proper.name = trName.value;
            newTrapez.map = new Map();
            trName.value = "Trapezium_" + (globalId + 1);
            createTrapeziumDiv(newTrapez);
            trapeziums.push(newTrapez);
            draw(newTrapez);

            console.log("Create");
            console.log(newTrapez);
        }
    }
}

// Масив для збереження елементів
let trapeziumItems = [];

// Функція для створення нового елемента
function createTrapeziumDiv(trapez) {
    // Створення нового елемента трапеції
    const newTrapezium = document.createElement('div');
    newTrapezium.classList.add('trapezium-item');

    trapez.divElm = newTrapezium;

    // Створення та додавання контролів
    const controlDisplay = document.createElement('div');
    controlDisplay.classList.add('trapezium-control-display');

    const upButton = document.createElement('img');
    upButton.src = './img/up.png';
    upButton.alt = 'move up';
    upButton.classList.add('icon-show-button', 'arrow');

    const showButton = document.createElement('img');
    showButton.src = './img/show.png';
    showButton.alt = 'hide';
    showButton.classList.add('icon-show-button');

    // Заміна на правильний об'єкт (наприклад, newTrapezium)
    showButton.addEventListener('click', () => {
       showTrapezium(newTrapezium, showButton);
    });

    const downButton = document.createElement('img');
    downButton.src = './img/down.png';
    downButton.alt = 'move down';
    downButton.classList.add('icon-show-button', 'arrow');

    controlDisplay.appendChild(upButton);
    controlDisplay.appendChild(showButton);
    controlDisplay.appendChild(downButton);

    // Створення тексту для трапеції
    const trapeziumName = document.createElement('p');
    trapeziumName.classList.add('text-trapezium-name');
    trapeziumName.textContent = trapez.proper.name;

    // Створення кнопки видалення
    const deleteControl = document.createElement('div');
    deleteControl.classList.add('trapezium-control-display');

    const deleteButton = document.createElement('img');
    deleteButton.src = './img/delete.png';
    deleteButton.alt = 'delete trapezium';
    deleteButton.classList.add('icon-show-button');

    deleteControl.appendChild(deleteButton);

    // Додавання всіх елементів в контейнер
    newTrapezium.appendChild(controlDisplay);
    newTrapezium.appendChild(trapeziumName);
    newTrapezium.appendChild(deleteControl);

    // Додавання нового елемента до панелі
    layersElements.prepend(newTrapezium);

    // Додавання обробника події для кнопки видалення
    deleteButton.addEventListener('click', () => {
        deleteTrapezium(newTrapezium);
    });

    // Додавання обробників для інших кнопок (наприклад, для переміщення)
    upButton.addEventListener('click', () => {
        moveTrapeziumUp(newTrapezium);
    });

    downButton.addEventListener('click', () => {
        moveTrapeziumDown(newTrapezium);
    });

    return newTrapezium;
} 

function showTrapezium(trapeziumElement, showButton) {
    const index = trapeziums.findIndex(item => item.divElm === trapeziumElement);

     // Зміна зображення
    if (showButton.alt === 'hide') {
        clearTrapezuim(index);
        showButton.alt = 'show';
        showButton.src = './img/hide.png';  // Заміна на інше зображення
    } else {
        reDrawTrapezium(index);
        showButton.alt = 'hide';
        showButton.src = './img/show.png';  // Відновлення початкового зображення
    }
}

function clearTrapezuim(index) {

    let { 
        lStartPoint: lSTr, lEndPoint: lETr, 
        sStartPoint: sSTr, sEndPoint: sETr 
    } = trapeziums[index].coords;

    let luP = minMaxPoint(lSTr, lETr, sSTr, sETr);
    let rdP = maxMinPoint(lSTr, lETr, sSTr, sETr);
    let offs = 10;

    let luPC = new Point (
        cX(luP.x) - offs,
        cX(-luP.y - offs) 
    );
    let offset = new Point (
        cX(rdP.x) - luPC.x + offs * 2,
        cX(-rdP.y) - luPC.y + offs * 2 
    );

    ctx.clearRect(
        luPC.x, luPC.y,
        offset.x, offset.y);
    ctx.drawImage(
        canvasSave, 
        luPC.x, luPC.y,
        offset.x, offset.y,
        luPC.x, luPC.y,
        offset.x, offset.y);

    let rect = new Rectangle(
        new Point(luP.x, rdP.y),
        new Point(rdP.x, rdP.y),
        new Point(luP.x, luP.y),
        new Point(rdP.x, luP.y),
    )

    for (let i = 0; i < trapeziums.length; i++) {
        if (i == index) continue;
        if (tryTrapeziumsOverlap(trapeziums[i], rect)) {
            console.log("---draw: " + trapeziums[i].proper.name);
            draw(trapeziums[i]);
        }
    }
}

// Функція для видалення трапеції
function deleteTrapezium(trapeziumElement) {

    const index = trapeziums.findIndex(item => item.divElm === trapeziumElement);

    clearTrapezuim(index);
    console.log("deleteTrapezium");
    if (index !== -1) {
        trapeziums.splice(index, 1); // Видалення з масиву
        trapeziumElement.remove(); // Видалення з DOM
        console.log("firstInSys: " + firstInSys);
        console.log("index: " + index);
        if (index === firstInSys) {
            if (index === trapeziums.length) {
                // firstInSys = 0;
            } else {
                for (let i = firstInSys; i < trapeziums.length; i++) {
                    if (trapeziums[i].inSyst) {
                        firstInSys = i;
                        downOff(i);
                    }
                }
            }
        }
    }
}

function reDrawTrapezium(index) {
    draw(trapeziums[index]);
    console.log("---draw: " + trapeziums[index].proper.name);
    for (let i = index + 1; i < trapeziums.length; i++) {
        if (tryTrapeziumsOverlap(
            trapeziums[i], 
            trapeziums[index]
        )) {
            console.log("---draw: " + trapeziums[i].proper.name);
            draw(trapeziums[i]);
        }
    }
}

function moveTrapeziumUp(trapeziumElement) {
    console.log("moveTrapeziumUp");

    const parent = trapeziumElement.parentElement;
    if (!parent || !trapeziumElement.previousElementSibling) return;

    // Поміняти місцями у DOM
    parent.insertBefore(trapeziumElement, trapeziumElement.previousElementSibling);
    // Оновити масив
    let index = trapeziums.findIndex(item => item.divElm === trapeziumElement);
    if (index == firstInSys) {
        downOff(index + 1);
        downOn(index);
    }
    if (index < trapeziums.length - 1) {        
        [trapeziums[index], trapeziums[index + 1]] = [trapeziums[index + 1], trapeziums[index]];
        // [trapeziums[index], trapeziums[index - 1]] = [trapeziums[index - 1], trapeziums[index]];

        if (tryTrapeziumsOverlap(
            trapeziums[index], 
            trapeziums[index + 1])
        ) {
            reDrawTrapezium(index + 1);
        }
    }
}

function moveTrapeziumDown(trapeziumElement) {
    console.log("moveTrapeziumDown");

    const parent = trapeziumElement.parentElement;
    if (!parent || !trapeziumElement.nextElementSibling) return;

    // Поміняти місцями у DOM
    // parent.insertBefore(trapeziumElement.nextElementSibling, trapeziumElement);

    parent.insertBefore(trapeziumElement.nextElementSibling, trapeziumElement);
    parent.insertBefore(trapeziumElement, trapeziumElement.nextElementSibling);     
    // Оновити масив
    let index = trapeziums.findIndex(item => item.divElm === trapeziumElement);
    if (index - 1 == firstInSys) {
        downOff(index);
        downOn(index - 1);
    }
    if (index > 0) {
        // [trapeziums[index], trapeziums[index + 1]] = [trapeziums[index + 1], trapeziums[index]];
        [trapeziums[index], trapeziums[index - 1]] = [trapeziums[index - 1], trapeziums[index]];

        if (tryTrapeziumsOverlap(
            trapeziums[index], 
            trapeziums[index - 1])
        ) {
            reDrawTrapezium(index);
        }
    }
}

function calcIntersections(p1, p2) {
    let x1 = p1.x, y1 = p1.y;
    let x2 = p2.x, y2 = p2.y;
    let intersections = []; 

    function isOnSegment(x, y) {
        return (x >= Math.min(x1, x2) && x <= Math.max(x1, x2) &&
                y >= Math.min(y1, y2) && y <= Math.max(y1, y2));
    }

    let m = (y2 - y1) / (x2 - x1);
    let b = y1 - m * x1;

    let yAtPosX = m * divsCnt+ b;
    let yAtNegX = m * -divsCnt+ b;

    if (Math.abs(yAtPosX) <= divsCnt && isOnSegment(divsCnt, yAtPosX)) {
        intersections.push(new Point(divsCnt, yAtPosX));
    }
    if (Math.abs(yAtNegX) <= divsCnt && isOnSegment(-divsCnt, yAtNegX)) {
        intersections.push(new Point(-divsCnt, yAtNegX));
    }

    let xAtPosY = (divsCnt- b) / m;
    let xAtNegY = (-divsCnt- b) / m;

    if (Math.abs(xAtPosY) <= divsCnt && isOnSegment(xAtPosY, divsCnt)) {
        intersections.push(new Point(xAtPosY, divsCnt));
    }
    if (Math.abs(xAtNegY) <= divsCnt && isOnSegment(xAtNegY, -divsCnt)) {
        intersections.push(new Point(xAtNegY, -divsCnt));
    }

    return intersections;
}

function crossProduct(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

// Функція для перевірки, чи два відрізки перетинаються
function segmentsIntersect(p1, p2, q1, q2) {

    let d1 = crossProduct(q1, q2, p1);
    let d2 = crossProduct(q1, q2, p2);
    let d3 = crossProduct(p1, p2, q1);
    let d4 = crossProduct(p1, p2, q2);

    if ((d1 * d2 < 0) && (d3 * d4 < 0)) return true;
    return false;
}

// Функція для перевірки, чи точка всередині трапеції
function isPointInsideTrapezium(point, pTr) {

    let [ lSTr, lETr, sSTr, sETr ] = pTr;

    let signs = [
        crossProduct(lSTr, lETr, point),
        crossProduct(lETr, sETr, point),
        crossProduct(sETr, sSTr, point),
        crossProduct(sSTr, lSTr, point)
    ];

    // Якщо всі знаки однакові (всі позитивні або всі негативні) – точка всередині
    return signs.every(s => s >= 0) || signs.every(s => s <= 0);
}

function tryTrapeziumsOverlap(trap1, trap2) {
    let isOverlap = false;
    console.log("tryTrapeziumsOverlap");
    console.log(trap1.proper.name + " " + trap1.proper.id);
    if (trap2.proper)
        console.log(trap2.proper.name + " " + trap2.proper.id);
    else 
        console.log("second no trap");

    if (trap2.proper) {
        console.log("tryMap");
        if (trap1.map.has(trap2.proper.id)) {
            console.log("succes");
            isOverlap = trap1.map.get(trap2.proper.id);
        } else {
            console.log("error");
            isOverlap = trapeziumsOverlap(trap1.coords, trap2.coords);
    
            trap1.map.set(trap2.proper.id, isOverlap);
            trap2.map.set(trap1.proper.id, isOverlap);
        }
    } else {
        console.log("noMap");
        isOverlap = trapeziumsOverlap(trap1.coords, trap2);
    }

    return isOverlap;
}

// Функція для перевірки накладання трапецій
function trapeziumsOverlap(trap1, trap2) {
    let { 
        lStartPoint: lSTr1, lEndPoint: lETr1, 
        sStartPoint: sSTr1, sEndPoint: sETr1 
    } = trap1;

    let { 
        lStartPoint: lSTr2, lEndPoint: lETr2, 
        sStartPoint: sSTr2, sEndPoint: sETr2 
    } = trap2;

    // Створюємо масиви точок для кожної трапеції
    const pTr1 = [lSTr1, lETr1, sSTr1, sETr1];
    const pTr2 = [lSTr2, lETr2, sSTr2, sETr2];

    // Створюємо масиви сторін для кожної трапеції
    let eTr1 = [
        [lSTr1, lETr1],
        [lETr1, sSTr1],
        [sSTr1, sETr1],
        [sETr1, lSTr1]
    ];
    let eTr2 = [
        [lSTr2, lETr2],
        [lETr2, sSTr2],
        [sSTr2, sETr2],
        [sETr2, lSTr2]
    ];

    for (let [p1, p2] of eTr1) {
        for (let [q1, q2] of eTr2) {
            if (segmentsIntersect(p1, p2, q1, q2)) {
                return true;
            }
        }
    }

    // Перевіряємо, чи одна трапеція повністю всередині іншої
    if (pTr1.some(p => isPointInsideTrapezium(p, pTr2)) ||
        pTr2.some(p => isPointInsideTrapezium(p, pTr1))) {
        
        return true;
    }

    return false;
}
