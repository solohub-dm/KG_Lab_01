const ctxPr = canvasPreview?.getContext("2d");

function drawGrid(size, pad, step) {
  ctxPr.strokeStyle = "rgb(196, 199, 206)";
  ctxPr.lineWidth = 2;

  for (let cur = (size.x - pad.x) % step; cur < size.x; cur += step) {
    ctxPr.beginPath();
    ctxPr.moveTo(cur, 0);
    ctxPr.lineTo(cur, size.y);
    ctxPr.stroke();
  }

  for (let cur = pad.y % step; cur < size.y; cur += step) {
    ctxPr.beginPath();
    ctxPr.moveTo(0, cur);
    ctxPr.lineTo(size.x, cur);
    ctxPr.stroke();
  }
}

function drawBasis() {
  let size = new Point(canvasPreview.offsetWidth, canvasPreview.offsetHeight);

  canvasPreview.width = size.x;
  canvasPreview.height = size.y;

  let sPoint = new Point(
    trapez.coords.lStartPoint.x,
    trapez.coords.lStartPoint.y
  );
  let ePoint = new Point(trapez.coords.lEndPoint.x, trapez.coords.lEndPoint.y);

  // let sqPoint = minMaxPoint(sPoint, ePoint);

  moveToStart(sPoint, ePoint);
  let offset = maxPoint(sPoint, ePoint);

  let step = calcStep(size, offset);

  let pad = new Point(
    (size.x - offset.x * step) / 2,
    (size.y - offset.y * step) / 2
  );

  toCanvasCoords(pad, step, size.y, sPoint, ePoint);

  drawGrid(size, pad, step);

  // let mul = stepM / step;
  // let padM  = new Point (
  //     pad.x * mul,
  //     pad.y * mul
  // );
  // ctxPr.drawImage(
  //     canvasMain,
  //     cX(sqPoint.x) - padM.x,
  //     cX(-sqPoint.y) - padM.y,
  //     offset.x * stepM + padM.x * 2,
  //     offset.y * stepM  + padM.y * 2,

  //     0, 0, size.x, size.y);

  ctxPr.strokeStyle = trapez.proper.colorLine;
  ctxPr.fillStyle = trapez.proper.colorLine;
  ctxPr.lineWidth = 2;

  ctxPr.beginPath();
  ctxPr.moveTo(sPoint.x, sPoint.y);
  ctxPr.lineTo(ePoint.x, ePoint.y);
  ctxPr.stroke();

  ctxPr.beginPath();
  ctxPr.arc(sPoint.x, sPoint.y, 3, 0, Math.PI * 2);
  ctxPr.fill();

  let vecH = sPoint.unitVector(ePoint);
  let vecV = vecH.rotatePos90();

  let len = sPoint.distanceTo(ePoint) * 0.015;
  let asPoint = ePoint.subVecMul(vecH, len * 3);
  let aePoint = asPoint.subVecMul(vecV, len);
  asPoint = asPoint.addVecMul(vecV, len);

  ctxPr.beginPath();
  ctxPr.moveTo(asPoint.x, asPoint.y);
  ctxPr.lineTo(ePoint.x, ePoint.y);
  ctxPr.lineTo(aePoint.x, aePoint.y);
  ctxPr.stroke();
}

function drawBasisHeight() {
  let size = new Point(canvasPreview.offsetWidth, canvasPreview.offsetHeight);

  canvasPreview.width = size.x;
  canvasPreview.height = size.y;

  let sPoint = trapez.getLStartPoint().cpy();
  let ePoint = trapez.getLEndPoint().cpy();

  let vecH = trapez.getVecH();
  let vecV = trapez.getVecV();

  let heightLen = trapez.getHeightLen();

  let mPoint = sPoint.midlVector(ePoint);
  let hPoint = mPoint.addVecMul(vecV, heightLen);

  // let sqPoint = minMaxPoint(sPoint, ePoint, hPoint);

  moveToStart(sPoint, ePoint, mPoint, hPoint);
  let offset = maxPoint(sPoint, ePoint, hPoint);

  let step = calcStep(size, offset);
  let pad = new Point(
    (size.x - offset.x * step) / 2,
    (size.y - offset.y * step) / 2
  );

  toCanvasCoords(pad, step, size.y, sPoint, ePoint, mPoint, hPoint);

  drawGrid(size, pad, step);

  // let mul = stepM / step;
  // let padM  = new Point (
  //     pad.x * mul,
  //     pad.y * mul
  // );
  // ctxPr.drawImage(
  //     canvasMain,
  //     cX(sqPoint.x) - padM.x,
  //     cX(-sqPoint.y) - padM.y,
  //     offset.x * stepM + padM.x * 2,
  //     offset.y * stepM  + padM.y * 2,

  //     0, 0, size.x, size.y);

  ctxPr.strokeStyle = trapez.proper.colorLine;
  ctxPr.fillStyle = trapez.proper.colorFill;
  ctxPr.lineWidth = 2;

  ctxPr.beginPath();
  ctxPr.moveTo(sPoint.x, sPoint.y);
  ctxPr.lineTo(ePoint.x, ePoint.y);
  ctxPr.moveTo(mPoint.x, mPoint.y);
  ctxPr.lineTo(hPoint.x, hPoint.y);
  ctxPr.stroke();

  let dis = Math.min(size.x, size.y);
  drawHSqPre(mPoint, sPoint, ePoint, dis * 0.04);
}

function drawPreview() {
  let size = new Point(canvasPreview.offsetWidth, canvasPreview.offsetHeight);

  canvasPreview.width = size.x;
  canvasPreview.height = size.y;

  let slPoint = trapez.getLStartPoint().cpy();
  let elPoint = trapez.getLEndPoint().cpy();
  let ssPoint = trapez.getSStartPoint().cpy();
  let esPoint = trapez.getSEndPoint().cpy();
  let h1Point = trapez.getH1Point().cpy();
  let h2Point = trapez.getH2Point().cpy();

  // let sqPoint = minMaxPoint(slPoint, elPoint, ssPoint, esPoint);

  moveToStart(slPoint, elPoint, ssPoint, esPoint, h1Point, h2Point);
  let offset = maxPoint(slPoint, elPoint, ssPoint, esPoint);

  let step = calcStep(size, offset);
  let pad = new Point(
    (size.x - offset.x * step) / 2,
    (size.y - offset.y * step) / 2
  );

  toCanvasCoords(
    pad,
    step,
    size.y,
    slPoint,
    elPoint,
    ssPoint,
    esPoint,
    h1Point,
    h2Point
  );

  drawGrid(size, pad, step);

  // let mul = stepM / step;
  // let padM  = new Point (
  //     pad.x * mul,
  //     pad.y * mul
  // );
  // ctxPr.drawImage(
  //     canvasMain,
  //     cX(sqPoint.x) - padM.x,
  //     cX(-sqPoint.y) - padM.y,
  //     offset.x * stepM + padM.x * 2,
  //     offset.y * stepM  + padM.y * 2,

  //     0, 0, size.x, size.y);

  let off = slPoint.distanceTo(h1Point);

  ctxPr.strokeStyle = trapez.proper.colorLine;
  ctxPr.fillStyle = trapez.proper.colorFill;
  ctxPr.lineWidth = 4;

  ctxPr.beginPath();
  ctxPr.moveTo(ssPoint.x, ssPoint.y);
  ctxPr.lineTo(slPoint.x, slPoint.y);
  ctxPr.lineTo(elPoint.x, elPoint.y);
  ctxPr.lineTo(esPoint.x, esPoint.y);
  ctxPr.lineTo(ssPoint.x, ssPoint.y);
  ctxPr.stroke();

  ctxPr.fill();
  ctxPr.lineWidth = 2;

  ctxPr.beginPath();
  ctxPr.moveTo(ssPoint.x, ssPoint.y);
  ctxPr.lineTo(h1Point.x, h1Point.y);
  ctxPr.moveTo(esPoint.x, esPoint.y);
  ctxPr.lineTo(h2Point.x, h2Point.y);
  ctxPr.stroke();

  let dis = Math.min(size.x, size.y);
  if (dis * 0.08 < ssPoint.distanceTo(h1Point)) {
    if (off > dis * 0.05) {
      drawHSqPre(h1Point, slPoint, elPoint, dis * 0.04);
      if (off > dis * 0.08) drawHSqPre(h2Point, slPoint, elPoint, dis * 0.04);
    }
  }
}

function drawHSqPre(point, slPoint, elPoint, len, isRev = false) {
  vecH = slPoint.unitVector(elPoint);
  vecV = vecH.rotatePos90();

  let sqlPoint;
  if (isRev) sqlPoint = point.subVecMul(vecH, len);
  else sqlPoint = point.addVecMul(vecH, len);

  let sqmPoint = sqlPoint.subVecMul(vecV, len);
  let sqhPoint = point.subVecMul(vecV, len);

  ctxPr.beginPath();
  ctxPr.moveTo(sqlPoint.x, sqlPoint.y);
  ctxPr.lineTo(sqmPoint.x, sqmPoint.y);
  ctxPr.lineTo(sqhPoint.x, sqhPoint.y);
  ctxPr.stroke();
}

function calcStep(size, offset) {
  let padProc = 0.1;
  let step;
  if (offset.x / size.x > offset.y / size.y) {
    step = (size.x * (1 - padProc * 2)) / offset.x;
  } else {
    step = (size.y * (1 - padProc * 2)) / offset.y;
  }
  return step;
}

function moveToStart(...points) {
  let xMin = Math.min(...points.map((p) => p.x));
  let yMin = Math.min(...points.map((p) => p.y));

  points.forEach((p) => {
    p.x -= xMin;
    p.y -= yMin;
  });
}

function toCanvasCoords(pad, step, height, ...points) {
  points.forEach((point, index) => {
    point.x = pad.x + point.x * step;
    point.y = height - pad.y - point.y * step;
  });
}

function maxPoint(...points) {
  let xMax = Math.max(...points.map((p) => p.x));
  let yMax = Math.max(...points.map((p) => p.y));

  return new Point(xMax, yMax);
}

function minMaxPoint(...points) {
  let xMin = Math.min(...points.map((p) => p.x));
  let yMax = Math.max(...points.map((p) => p.y));

  return new Point(xMin, yMax);
}

function maxMinPoint(...points) {
  let xMax = Math.max(...points.map((p) => p.x));
  let yMin = Math.min(...points.map((p) => p.y));

  return new Point(xMax, yMin);
}
