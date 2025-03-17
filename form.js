let eps = 0.05;
const trName = getElement("#trapezium-name");

const trColorsCbx = [
  getElement("#checkbox-fill"),
  getElement("#checkbox-line"),
];
trColorsCbx.forEach((input) => {
  input.addEventListener("change", () => {
    checkColors(input);
  });
});
function checkColors(input) {
  if (trColorsCbx[0].checked === false && trColorsCbx[1].checked === false) {
    input.checked = true;
  }
}

const trColors = [getElement("#color-fill"), getElement("#color-line")];
trColors[0].addEventListener("change", () => {
  reViewFill();
});
trColors[1].addEventListener("change", () => {
  reViewLine();
});
trColorsCbx[0].addEventListener("change", () => {
  reViewFill();
});
trColorsCbx[1].addEventListener("change", () => {
  reViewLine();
});

function addRestrict(input, reg) {
  let inputs = Array.isArray(input) ? input : [input];

  inputs.forEach((input) => {
    input.addEventListener("keypress", (event) => {
      if (!reg.test(event.key)) {
        event.preventDefault();
      }
    });

    input.addEventListener("paste", (event) => {
      let pasteData = event.clipboardData.getData("text");
      if (!reg.test(pasteData)) {
        event.preventDefault();
      }
    });
  });
}

function reViewFill() {
  if (isCorrectCoords && isCorrectHeight && isCorrectBasisLen) {
    trapez.proper.colorFill = trColorsCbx[0].checked
      ? trColors[0].value
      : "transparent";
    drawPreview();
  }
}
function reViewLine() {
  if (isCorrectCoords) {
    trapez.proper.colorLine = trColorsCbx[1].checked
      ? trColors[1].value
      : "transparent";
    if (isCorrectHeight) {
      if (isCorrectBasisLen) drawPreview();
      else drawBasisHeight();
    } else {
      drawBasis();
    }
  }
}

const trCoords = [
  getElement("#coord-x1"),
  getElement("#coord-y1"),
  getElement("#coord-x2"),
  getElement("#coord-y2"),
];
trCoords.forEach((input) => {
  input.addEventListener("input", () => {
    checkCoords(input);
  });
});
addRestrict(trCoords, /^[0-9.-]$/);

const trHeightLen = getElement("#height-lenght");
const trSmallBasisLen = getElement("#smaller-basis-lenght");

const trLengths = [trHeightLen, trSmallBasisLen];
addRestrict(trLengths, /^[0-9.]$/);

const textErrorDivs = getElement("#error-divs");
const textErrorName = getElement("#error-name");
const textErrorCoords = getElement("#error-coords");
const textErrorLength = getElement("#error-length");

const trErrors = [textErrorName, textErrorCoords, textErrorLength];

// Функція відображення повідомлення про помилку
function showErrorMessageCoords(errorMessage, input) {
  canvasPreview.style.opacity = 0;
  canvasPreview.width = 0;

  textErrorCoords.textContent = errorMessage;
  textErrorLength.textContent = "";

  if (input) input.style.backgroundColor = "rgb(239, 117, 117)";
}

function showErrorMessageLength(errorMessage, input) {
  canvasPreview.style.opacity = 0;
  canvasPreview.width = 0;

  textErrorLength.textContent = errorMessage;

  if (input) input.style.backgroundColor = "rgb(239, 117, 117)";
}
// Функція для приховування повідомлення про помилку, якщо всі перевірки пройдено
function tryHideErrorMessage() {
  if (!isErrorCoords && !isErrorHeight && !isErrorBasisLen) {
    canvasPreview.style.opacity = 1;
    // errorPanel.style.display = "none";
    textErrorCoords.textContent = "";
    textErrorLength.textContent = "";
  }
}

// Змінні для контролю правильності введених координат
let isCorrectCoords = false;
let isErrorCoords = false;
// Функція перевірки правильності усіх координат
function checkCoords(input) {
  isCorrectCoords = false;

  trHeightLen.style.backgroundColor = "white";
  trSmallBasisLen.style.backgroundColor = "white";

  trCoords.forEach((input) => checkCoordInput(input));
  isErrorCoords = trCoords.some(
    (input) => input.style.backgroundColor === "rgb(239, 117, 117)"
  );
  if (!isSomeCoordEmpty() && !isErrorCoords) {
    if (
      trCoords[0].value === trCoords[2].value &&
      trCoords[1].value === trCoords[3].value
    ) {
      showErrorMessageCoords(
        "The base of a trapezium cannot be a point.",
        input
      );
      isErrorCoords = true;
    } else {
      trapez = new Trapezium();
      trapez.setFirst(
        new Properties(
          trColorsCbx[0].checked ? trColors[0].value : "transparent",
          trColorsCbx[1].checked ? trColors[1].value : "transparent"
        ),
        new Coords(
          new Point(Number(trCoords[0].value), Number(trCoords[1].value)),
          new Point(Number(trCoords[2].value), Number(trCoords[3].value))
        )
      );
      drawBasis();
      isCorrectCoords = true;
    }
  }

  if (!isErrorCoords) {
    textErrorCoords.textContent = "";
    checkHeight();
    checkSmaller();
    tryHideErrorMessage();
  }

  return isCorrectCoords;
}

// Функція перевірки коректності введених значень координати
function checkCoordInput(input) {
  let inputValue = input.value;
  input.style.backgroundColor = "white";

  if (input.value.trim() === "") {
    canvasPreview.width = 0;
  } else if (inputValue > divsCnt) {
    showErrorMessageCoords(
      "Value cannot be greater then " + divsCnt + ".",
      input
    );
  } else if (inputValue < -divsCnt) {
    showErrorMessageCoords(
      "Value cannot be lower then " + -divsCnt + ".",
      input
    );
  }
}

// Перевіряє, чи є серед координат хоча б одне порожнє поле
function isSomeCoordEmpty() {
  const hasEmptyValue = trCoords.some((input) => input.value.trim() === "");
  return hasEmptyValue;
}

// Змінні для контролю правильності введеної висоти
let isCorrectHeight = false;
let isErrorHeight = false;
// Відстеження змін довжини висоти
trHeightLen.addEventListener("input", checkHeight);
function checkHeight() {
  isCorrectHeight = false;
  trHeightLen.style.backgroundColor = "white";
  trSmallBasisLen.style.backgroundColor = "white";

  do {
    if (isErrorCoords) {
      break;
    }
    if (trHeightLen.value.trim() === "") {
      if (isCorrectCoords) drawBasis();
      break;
    }
    if (!isCorrectCoords) {
      showErrorMessageLength(
        "Enter all coords of larger bassis first.",
        trHeightLen
      );
      break;
    }
    if (trHeightLen.value < eps) {
      showErrorMessageLength(
        "Height lenght cannot be lower than " + roundTwoAfter(eps) + ".",
        trHeightLen
      );
      break;
    }
    if (trHeightLen.value > divsCnt * 2) {
      showErrorMessageLength(
        "Height cannot be higher than system of coordinates. Max allowed value: " +
          divsCnt * 2 +
          ".",
        trHeightLen
      );
      break;
    }

    let lStartPoint = trapez.getLStartPoint();
    let lEndPoint = trapez.getLEndPoint();

    let largerLen = lStartPoint.distanceTo(lEndPoint);
    let vecH = lStartPoint.unitVector(lEndPoint);
    let vecV = vecH.rotatePos90();

    let heightLen = Number(trHeightLen.value);
    let sqStartPoint = lStartPoint.addVecMul(vecV, heightLen);
    let sqEndPoint = lEndPoint.addVecMul(vecV, heightLen);
    let smallerLenMax;

    if (
      !sqStartPoint.isInRangeAbs(divsCnt) ||
      !sqEndPoint.isInRangeAbs(divsCnt)
    ) {
      smallerLenMax = calcSmallerLenMax(sqStartPoint, sqEndPoint);

      if (smallerLenMax <= eps) {
        let offset = eps / 2;

        let midStartPoint = lStartPoint.midlVector(lEndPoint);

        let sSqStartPoint = midStartPoint.addVecMul(vecH, offset);
        let sSqEndPoint = sSqStartPoint.addVecMul(vecV, heightLen);

        let eSqStartPoint = midStartPoint.subVecMul(vecH, offset);
        let eSqEndPoint = eSqStartPoint.addVecMul(vecV, heightLen);

        let maxHeight = Math.min(
          calcHightLenMax(sSqStartPoint, sSqEndPoint),
          calcHightLenMax(eSqStartPoint, eSqEndPoint)
        );
        maxHeight -= eps;

        showErrorMessageLength(
          "The height length exceeds the maximum allowed. " +
            "The figure will not fit in the coordinate system. " +
            "Max allowed length: " +
            roundTwoAfter(maxHeight) +
            ".",
          trHeightLen
        );
        break;
      }
    } else {
      smallerLenMax = largerLen;
    }

    trapez.setDimens(
      new Dimensions(largerLen, heightLen, smallerLenMax),
      new UnitVector(vecH, vecV)
    );

    drawBasisHeight();

    isCorrectHeight = true;
  } while (0);

  isErrorHeight = trHeightLen.value.trim() !== "" && !isCorrectHeight;
  if (!isErrorHeight) {
    checkSmaller();
    tryHideErrorMessage();
  }

  return isCorrectHeight;
}

function calcHightLenMax(p1, p2) {
  if (p1.x === p2.x) return divsCnt - p1.y;
  if (p1.y === p2.y) return divsCnt - p1.x;

  let intersections = calcIntersections(p1, p2);

  let lenMax;
  if (intersections.length === 0) lenMax = p1.distanceTo(p2);
  else if (intersections.length === 1) lenMax = p1.distanceTo(intersections[0]);

  return lenMax;
}

// Функція обчислення максимально можливої довжини меншої висоти
// за даних значень координат та висоти
function calcSmallerLenMax(p1, p2) {
  if (p1.x === p2.x) return 0;
  if (p1.y === p2.y) return 0;

  let intersections = calcIntersections(p1, p2);

  let lenMax;
  if (intersections.length === 0) {
    lenMax = 0;
  } else {
    let midPoint = new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
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

// Змінні для контролю правильності введеної довжини меншої основи
let isCorrectBasisLen = false;
let isErrorBasisLen = false;
// Відстеження змін довжини меншої основи
trSmallBasisLen.addEventListener("input", checkSmaller);
function checkSmaller() {
  isCorrectBasisLen = false;
  trSmallBasisLen.style.backgroundColor = "white";

  do {
    if (isErrorCoords || isErrorHeight) break;
    if (trSmallBasisLen.value.trim() === "") {
      if (isCorrectCoords) {
        if (isCorrectHeight) {
          drawBasisHeight();
        } else {
          drawBasis();
        }
      }
      break;
    }

    if (!isCorrectHeight) {
      if (isSomeCoordEmpty()) {
        showErrorMessageLength(
          "Enter all coords of larger bassis first.",
          trSmallBasisLen
        );
      } else if (trHeightLen.value.trim() === "") {
        showErrorMessageLength("Enter height lenght first.", trSmallBasisLen);
      }
      break;
    }

    let smallerLen = Number(trSmallBasisLen.value);
    let len = trapez.getLargerLen();
    let smallerLenMax = trapez.getSmallerLenMax();

    if (smallerLen < eps) {
      showErrorMessageLength(
        "Smaller basis lenght cannot be lower than " + roundTwoAfter(eps) + ".",
        trSmallBasisLen
      );
      break;
    }
    if (smallerLen >= len) {
      showErrorMessageLength(
        "Smaller basis lenght must be lower than larger one. Max allowed value: " +
          roundTwoAfter(len - eps) +
          ".",
        trSmallBasisLen
      );
      break;
    }
    if (smallerLen > smallerLenMax) {
      showErrorMessageLength(
        "The smaller basis length exceeds the maximum allowed. " +
          "The figure will not fit in the coordinate system. " +
          "Max allowed length: " +
          roundTwoAfter(smallerLenMax - eps) +
          ".",
        trSmallBasisLen
      );
      break;
    }

    let vecH = trapez.getVecH();
    let vecV = trapez.getVecV();
    let lStartPoint = trapez.getLStartPoint();
    let lEndPoint = trapez.getLEndPoint();
    let heightLen = trapez.getHeightLen();

    let offset = (len - smallerLen) / 2;
    let h1Point = lStartPoint.addVecMul(vecH, offset);
    let h2Point = lEndPoint.subVecMul(vecH, offset);

    let sStartPoint = h1Point.addVecMul(vecV, heightLen);
    let sEndPoint = h2Point.addVecMul(vecV, heightLen);

    trapez.setCoords(
      sStartPoint,
      sEndPoint,
      h1Point,
      h2Point,
      smallerLen,
      offset
    );

    drawPreview();
    isCorrectBasisLen = true;
  } while (0);

  isErrorBasisLen = trSmallBasisLen.value.trim() !== "" && !isCorrectBasisLen;
  if (!isErrorBasisLen) {
    tryHideErrorMessage();
  }
}

function roundTwoAfter(val) {
  return Math.floor(val * 100) / 100;
}

// Функція очищення форми
propertiesClearBtn.addEventListener("click", clearForm);
function clearForm() {
  isErrorCoords = false;
  isErrorHeight = false;
  isErrorBasisLen = false;

  isCorrectCoords = false;
  isCorrectHeight = false;
  isCorrectBasisLen = false;

  trColorsCbx[0].checked = true;
  trColorsCbx[1].checked = true;
  trColors[0].value = "#000000";
  trColors[1].value = "#000000";
  trCoords.forEach((input) => {
    input.style.backgroundColor = "white"; // Змінює фон
    input.value = ""; // Очищує поле вводу
  });
  trLengths.forEach((input) => {
    input.style.backgroundColor = "white"; // Змінює фон
    input.value = ""; // Очищує поле вводу
  });
  trErrors.forEach((input) => {
    input.textContent = "";
  });

  trapez = new Trapezium();
  trName.value = "Trapezium_" + (globalId + 1);

  canvasPreview.width = 0;
  canvasPreview.style.opacity = 1;
}

// Функція для отримання унікального id
let globalId = 0;
function getNewId() {
  return globalId++;
}

trName.addEventListener("change", () => {
  trName.style.backgroundColor = "white";
  textErrorCoords.textContent = "";
});
