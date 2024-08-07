import { horizontalCnvCtx, verticalCnvCtx, spreadsheetCnvCtx, horizontalCanvas, verticalCanvas, spreadsheetCanvas } from "../index.js";
import { horizontallyScrolled } from "./scroll.js";


export let accWidthHor = 0;
export let currColInd = 0;
let horStartPos = 0;
let isResizing = false;

class HeaderCell {
    constructor(x, y, width, height, value) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = { "data": value };
        this.next = null;
        this.isSelected = false;
    }
}

export class MiniCanvas {
    constructor(numOfRows, numOfCols, initialWidthHorizontal, initialHeigthHorizontal, initialWidthVertical, initialHeigthVertical) {
        this.horizontalArr = [];
        this.verticalArr = [];
        this.numOfCols = numOfCols;
        this.numOfRows = numOfRows;
        this.initialWidthHorizontal = initialWidthHorizontal;
        this.initialHeigthHorizontal = initialHeigthHorizontal;
        this.initialWidthVertical = initialWidthVertical;
        this.initialHeigthVertical = initialHeigthVertical;


        this.init()
    }

    init() {
        //putting values the array
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.numOfCols; i++) {
            const cell = new HeaderCell(x, y, this.initialWidthHorizontal, this.initialHeigthHorizontal, i + 1);
            this.horizontalArr[i] = cell;
            x += this.initialWidthHorizontal;
        }

        // this.horizontalArr[2].width = 300;


        x = 0;
        y = 0;
        for (let i = 0; i < this.numOfRows; i++) {
            const cell = new HeaderCell(x, y, this.initialWidthVertical, this.initialHeigthVertical, i + 1);
            this.verticalArr[i] = cell;
            y += this.initialHeigthVertical;
        }
        // console.log(this.horizontalArr[0].width)

        accWidthHor = this.horizontalArr[0].width;

        // this.drawHorizontalCanvas(currColInd);
        this.drawHorizontalCanvas(currColInd);
        this.drawVerticalCanvas(0);
        this.drawMainCanvas(0, currColInd);

        this.handleResizeHorizontal();
    }

    renderCanvas() {
        horizontalCnvCtx.reset();
        verticalCnvCtx.reset();
        spreadsheetCnvCtx.reset()
        this.drawHorizontalCanvas(currColInd);
        this.drawVerticalCanvas(0);
        this.drawMainCanvas(0, currColInd);
    }

    renderCanvasOnScroll() {

        let i = 0;
        accWidthHor = this.horizontalArr[0].width;
        while (accWidthHor < horizontallyScrolled) {
            i++;
            accWidthHor += this.horizontalArr[i].width;
        }

        currColInd = i;

        horStartPos = -horizontallyScrolled + accWidthHor - this.horizontalArr[i].width;

        horizontalCnvCtx.reset();
        verticalCnvCtx.reset();
        spreadsheetCnvCtx.reset()
        this.drawHorizontalCanvas(i);
        this.drawVerticalCanvas(0);
        this.drawMainCanvas(0, i);
    }


    getColName(n) {
        let columnName = '';
        while (n > 0) {
            let remainder = (n - 1) % 26;
            columnName = String.fromCharCode(65 + remainder) + columnName;
            n = Math.floor((n - 1) / 26);
        }
        return columnName;

    }

    drawHorizontalCanvas(startInd) {

        if (!horizontalCnvCtx) {
            alert("Horizontal Canvas ctx not found")
            return;
        }

        horizontalCnvCtx.clearRect(0, 0, horizontalCanvas.width, horizontalCanvas.height);

        //using stroke
        horizontalCnvCtx.strokeStyle = '#D3D3D3';
        horizontalCnvCtx.lineWidth = 1;

        let x = horStartPos;

        for (let j = startInd; j <= this.horizontalArr.length; j++) {
            //making vertical line
            horizontalCnvCtx.beginPath();
            horizontalCnvCtx.moveTo(x, 0);
            horizontalCnvCtx.lineTo(x, this.initialHeigthHorizontal);
            horizontalCnvCtx.stroke();

            if (!this.horizontalArr[j] || x >= horizontalCanvas.Width) {
                break;
            }
            // console.log("a")
            //making text
            let currCell = this.horizontalArr[j];
            horizontalCnvCtx.font = ' 14px Calibri ';
            horizontalCnvCtx.textAlign = 'center';
            horizontalCnvCtx.textBaseline = 'middle';
            horizontalCnvCtx.fillStyle = '#000';
            horizontalCnvCtx.fillText(this.getColName(currCell.value.data), x + currCell.width / 2, currCell.y + currCell.height / 2);

            (j < this.horizontalArr.length) ? x += this.horizontalArr[j].width : "";

        }

    }

    drawVerticalCanvas(startInd) {

        //using strokes
        if (!verticalCnvCtx) {
            alert("Vertical Canvas ctx not found")
            return;
        }

        verticalCnvCtx.clearRect(0, 0, verticalCanvas.width, verticalCanvas.height);

        verticalCnvCtx.strokeStyle = '#D3D3D3';
        verticalCnvCtx.lineWidth = 1;

        let y = 0;
        for (let j = startInd; j <= this.verticalArr.length; j++) {
            // console.log(j)

            //making horizontal lines
            verticalCnvCtx.beginPath();
            verticalCnvCtx.moveTo(0, y);
            verticalCnvCtx.lineTo(this.initialWidthVertical, y);
            verticalCnvCtx.stroke();

            if (!this.verticalArr[j] || y >= verticalCanvas.Height) {
                break;
            }
            //making text
            let currCell = this.verticalArr[j];
            verticalCnvCtx.font = '14px Calibri';
            verticalCnvCtx.textAlign = 'right';
            verticalCnvCtx.textBaseline = 'bottom';
            verticalCnvCtx.fillStyle = '#000';
            verticalCnvCtx.fillText(currCell.value.data, currCell.x + currCell.width - 10, y + currCell.height - 5);

            (j < this.verticalArr.length) ? y += this.verticalArr[j].height : "";

        }

    }

    drawCellContentAtRow(currRow, startColInd) {

        if (!currRow.next) {
            return;
        }

        let currRowEle = currRow.next;

        while (currRowEle != null) {

            let currCol = this.horizontalArr[currRowEle.col.data - 1];
            // console.log(currCol)

            //making text
            spreadsheetCnvCtx.font = '14px Calibri light';
            spreadsheetCnvCtx.textAlign = 'right';
            spreadsheetCnvCtx.textBaseline = 'bottom';
            spreadsheetCnvCtx.fillStyle = '#000';
            // console.log(horStartPos+ currCol.x)
            spreadsheetCnvCtx.fillText(currRowEle.data, currCol.x - horizontallyScrolled + currCol.width - 10, currRow.y + currRow.height - 5)

            currRowEle = currRowEle.right;

        }

    }

    drawMainCanvas(startRowInd, startColInd) {

        if (!spreadsheetCnvCtx) {
            alert("main Canvas ctx not found")
            return;
        }
        spreadsheetCnvCtx.clearRect(0, 0, spreadsheetCanvas.clientWidth, spreadsheetCanvas.clientHeight);

        spreadsheetCnvCtx.strokeStyle = '#D3D3D3';
        spreadsheetCnvCtx.lineWidth = 1;

        let x = horStartPos;
        for (let j = startColInd; j <= this.horizontalArr.length; j++) {
            spreadsheetCnvCtx.beginPath();
            spreadsheetCnvCtx.moveTo(x, 0);
            spreadsheetCnvCtx.lineTo(x, spreadsheetCanvas.height);
            spreadsheetCnvCtx.stroke();

            if (!this.horizontalArr[j] || x >= horizontalCanvas.Width) {
                break;
            }

            (j < this.horizontalArr.length) ? x += this.horizontalArr[j].width : "";

        }

        let y = 0;
        for (let j = startRowInd; j <= this.verticalArr.length; j++) {
            spreadsheetCnvCtx.beginPath();
            spreadsheetCnvCtx.moveTo(0, y);
            spreadsheetCnvCtx.lineTo(spreadsheetCanvas.width, y);
            spreadsheetCnvCtx.stroke();

            if (!this.verticalArr[j] || y >= verticalCanvas.Height) {
                break;
            }
            this.drawCellContentAtRow(this.verticalArr[j], startColInd);

            (j < this.verticalArr.length) ? y += this.verticalArr[j].height : "";
        }
    }

    printArrs() {
        for (let i = 0; i < this.horizontalArr.length; i++) {
            console.log(this.horizontalArr[i])

        }

        for (let i = 0; i < this.verticalArr.length; i++) {
            console.log(this.verticalArr[i])

        }
    }

    resizeColumn(index, diff) {
        this.horizontalArr[index].width = Math.max(50, this.horizontalArr[index].width + diff);
        if(this.horizontalArr[index].width > 50){
            for (let i = index + 1; i < this.horizontalArr.length; i++) {
                this.horizontalArr[i].x += diff;
            }
        }
        this.renderCanvas();
        // this.printArrs()
    }


    resizeRow(index, diff) {
        this.verticalArr[index].height += diff;
        for (let i = index + 1; i < this.verticalArr.length; i++) {
            this.verticalArr[i].y += diff;
        }
    }

    addRowAtInd(ind) {

        let oldRow = this.verticalArr[ind];

        let newRow = new HeaderCell(oldRow.x, oldRow.y, this.initialWidthVertical, this.initialHeigthVertical, ind + 1);

        this.verticalArr.splice(ind, 0, newRow)

        for (let i = ind + 1; i < this.verticalArr.length; i++) {
            this.verticalArr[i].value.data += 1;
            this.verticalArr[i].y += this.initialHeigthVertical;
        }
    }


    deleteRowAtInd(ind) {

        let rowToBeDeleted = this.verticalArr[ind];

        this.verticalArr.splice(ind, 1)

        for (let i = ind; i < this.verticalArr.length; i++) {
            this.verticalArr[i].value.data -= 1;
            this.verticalArr[i].y -= this.initialHeigthVertical;
        }
    }


    deleteColAtInd(ind) {

        let colToBeDeleted = this.horizontalArr[ind];
        let widthOfCol = colToBeDeleted.width;

        this.horizontalArr.splice(ind, 1);

        for (let i = ind; i < this.horizontalArr.length; i++) {
            this.horizontalArr[i].value.data -= 1;
            this.horizontalArr[i].x -= widthOfCol;
        }
    }

    addColAtInd(ind) {

        let oldCol = this.horizontalArr[ind];

        let newCol = new HeaderCell(oldCol.x, oldCol.y, this.initialWidthHorizontal, this.initialHeigthHorizontal, ind + 1);

        this.horizontalArr.splice(ind, 0, newCol)

        for (let i = ind + 1; i < this.horizontalArr.length; i++) {
            this.horizontalArr[i].value.data += 1;
            this.horizontalArr[i].x += this.initialWidthHorizontal;
        }
    }

    handleResizeHorizontal() {

        let resizingColumn = 0;
        let resizingColStartPosition = 0;
        let startXPos = 0;
        let resizeWidth = 15;

        horizontalCanvas.addEventListener('mousedown', (e) => {
            startXPos = e.offsetX;

            let colStartPosition = horStartPos;

            let colInd = currColInd;
            while (colStartPosition + resizeWidth < startXPos) {
                // The resize Width is added for getting correct Col start index , adding resizeWidth let us get correct Index by giving us extra space needed
                colStartPosition += this.horizontalArr[colInd].width;
                colInd += 1
            }
            if (colInd > 0 && Math.abs(startXPos - colStartPosition) < resizeWidth / 2) {
                isResizing = true;
                resizingColumn = colInd - 1;
                resizingColStartPosition = colStartPosition;
                // console.log(isResizing, resizingColumn, resizingColStartPosition)
            }
        })

        const onMouseMove = (e) => {

            let endXPos = e.offsetX;

            if (isResizing) {
                const diff = endXPos - startXPos;
                // console.log(diff)
                this.resizeColumn(resizingColumn, diff)
                startXPos = endXPos;
            }
        }

        const onMouseUp = (e) => {
            if (isResizing) {
                isResizing = false;
            }
        }


        horizontalCanvas.addEventListener('mousemove', onMouseMove);
        spreadsheetCanvas.addEventListener('mousemove', onMouseMove);

        horizontalCanvas.addEventListener('mouseup', onMouseUp);
        spreadsheetCanvas.addEventListener('mouseup', onMouseUp);

    }


}