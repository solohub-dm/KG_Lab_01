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


// Функція створення трапеції із заданими параметрами
propertiesCreateBtn.addEventListener("click", createTrapezium);
function createTrapezium() {
    if (trName.value.trim() === "")
        textErrorName.textContent = "Enter name at first.";
    else if (isSomeCoordEmpty()) {
        textErrorCoords.textContent = "Enter all coords at first.";
    } else if (trHeightLen.value.trim() === "" || trSmallBasisLen.value.trim() === "") {
        textErrorLength.textContent = "Enter all lengths at first.";
    } else {
        if (isCorrectCoords && isCorrectHeight && isCorrectBasisLen) { 
            trapez.setProper(
                trColorsCbx[0].checked ? trColors[0].value : "transparent", 
                trColorsCbx[1].checked ? trColors[1].value : "transparent",
                getNewId()
            );

            trapeziums.push(trapez);
            draw(trapez);
        }
    }
}


function calcIntersections(p1, p2) {
    let x1 = p1.x, y1 = p1.y;
    let x2 = p2.x, y2 = p2.y;
    let intersections = []; 

    let m = (y2 - y1) / (x2 - x1);
    let b = y1 - m * x1;

    let yAtPosX = m * divsCnt+ b;
    let yAtNegX = m * -divsCnt+ b;

    function isOnSegment(x, y) {
        return (x >= Math.min(x1, x2) && x <= Math.max(x1, x2) &&
                y >= Math.min(y1, y2) && y <= Math.max(y1, y2));
    }

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
