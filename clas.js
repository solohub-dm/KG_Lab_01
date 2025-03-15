// Клас для представлення точки на координатній площині
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    isInRangeAbs(value) {
        return Math.abs(this.x) <= value && Math.abs(this.y) <= value;
    }
    distanceTo(oPoint) {
        return Math.sqrt((this.x - oPoint.x) ** 2 + (this.y - oPoint.y) ** 2);
    }
    unitVector(ePoint) {
        let len = this.distanceTo(ePoint);
        return new Point(
           (ePoint.x - this.x) / len, (ePoint.y - this.y) / len 
        );
    }
    midlVector(oPoint) {
        return new Point((oPoint.x + this.x) / 2, (oPoint.y + this.y) / 2)
    }
    rotatePos90() {
        return new Point(-this.y, +this.x);
    }
    rotateNeg90() {
        return new Point(this.y, -this.x);
    }
    addVecMul(vec, len) {
        return new Point(this.x + vec.x * len, this.y + vec.y * len)
    }
    subVecMul(vec, len) {
        return new Point(this.x - vec.x * len, this.y - vec.y * len)
    }
    cpy () {
        return new Point(this.x, this.y);
    }

    cccpy () {
        return new Point(this.x, this.y);
    }
}

class Rectangle {
    constructor (
        lStartPoint, lEndPoint,
        sStartPoint, sEndPoint
    ) {
        this.lStartPoint = lStartPoint;  
        this.lEndPoint = lEndPoint; 
        this.sStartPoint = sStartPoint; 
        this.sEndPoint = sEndPoint; 
    }
}

class Coords {
    constructor(
        lStartPoint, 
        lEndPoint 
    ) {
        this.lStartPoint = lStartPoint;  
        this.lEndPoint = lEndPoint; 
        this.sStartPoint = undefined; 
        this.sEndPoint = undefined; 
        this.h1Point = undefined;
        this.h2Point = undefined;
    }
}

class Properties {
    constructor(
        colorFill = "transparent", 
        colorLine = "transparent", 
    ) {
        this.colorFill = colorFill;
        this.colorLine = colorLine;
        this.name = undefined;
        this.id = undefined;
    }
}

class UnitVector {
    constructor(
        vecH,
        vecV
    ) {
        this.vecH = vecH;
        this.vecV = vecV;
    }
}

class Dimensions {
    constructor(
        largerLen,
        heightLen,
        smallerLenMax
    ) {
        this.largerLen = largerLen;
        this.heightLen = heightLen;
        this.smallerLenMax = smallerLenMax;
        this.smallerLen = undefined;
        this.offsset = undefined;
    }
}

// Клас для збереження параметрів трапеції
class Trapezium {
    constructor(
 
    ) {
        this.coords = undefined;
        this.proper = undefined;
        this.dimens = undefined;
        this.vector = undefined;
        this.divElm = undefined;
        this.isShow = true;
        this.inSyst = true;
        this.map = undefined;
    }
    
    setFirst(proper, coords) {
        this.coords = coords;
        this.proper = proper;
    }
    setDimens(dimens, vector) {
        this.dimens = dimens;
        this.vector = vector;
    }
    setProper(colorFill, colorLine, id) {
        this.proper.colorFill = colorFill;
        this.proper.colorLine = colorLine;
        this.proper.id = id;
    }

    setCoords(
        sStartPoint, sEndPoint, 
        h1Point, h2Point, 
        smallerLen, offset
    ) {
        this.coords.sStartPoint = sStartPoint;
        this.coords.sEndPoint = sEndPoint;
        this.coords.h1Point = h1Point;
        this.coords.h2Point = h2Point;
        this.dimens.smallerLen = smallerLen;
        this.dimens.offset = offset;
    }

    getLStartPoint()    { return this.coords.lStartPoint    }
    getLEndPoint()      { return this.coords.lEndPoint      }
    getSStartPoint()    { return this.coords.sStartPoint    }
    getSEndPoint()      { return this.coords.sEndPoint      }
    getH1Point()        { return this.coords.h1Point        }
    getH2Point()        { return this.coords.h2Point        }
    getVecH()           { return this.vector.vecH           }
    getVecV()           { return this.vector.vecV           }
    getLargerLen()      { return this.dimens.largerLen      }
    getHeightLen()      { return this.dimens.heightLen      }
    getSmallerLenMax()  { return this.dimens.smallerLenMax  }
    getOffset()         { return this.dimens.offset         }

}
