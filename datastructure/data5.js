class SparseMatrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = {};
        this.rowReferences = new Array(rows).fill(null);
        this.colReferences = new Array(cols).fill(null);
        this.initializeMatrix();
    }

    initializeMatrix() {
        for (let i = 0; i < this.rows; i++) {
            this.matrix[i] = {};
            this.rowReferences[i] = i;
        }
        for (let j = 0; j < this.cols; j++) {
            this.colReferences[j] = j;
        }
    }

    insert(row, col, value) {
        if (row >= this.rows || col >= this.cols) {
            this.resizeMatrix(row + 1, col + 1);
        }
        let actualRow = this.rowReferences[row];
        let actualCol = this.colReferences[col];
        this.matrix[actualRow][actualCol] = { value, col: actualCol };
    }

    insertRow(rowIndex) {
        if (rowIndex > this.rows) {
            this.resizeMatrix(rowIndex + 1, this.cols);
        }

        // Create new row
        let newRowId = this.rows;
        this.matrix[newRowId] = {};

        // Update row references
        this.rowReferences.splice(rowIndex, 0, newRowId);

        this.rows++;
    }

    insertColumn(colIndex) {
        if (colIndex > this.cols) {
            this.resizeMatrix(this.rows, colIndex + 1);
        }

        // Update column references
        let newColId = this.cols;
        this.colReferences.splice(colIndex, 0, newColId);

        this.cols++;
    }

    insertCell(rowIndex, colIndex, value) {
        if (rowIndex >= this.rows || colIndex >= this.cols) {
            this.resizeMatrix(Math.max(this.rows, rowIndex + 1), Math.max(this.cols, colIndex + 1));
        }

        let actualRow = this.rowReferences[rowIndex];

        // Shift columns to the right from the point of insertion
        for (let j = this.cols - 1; j > colIndex; j--) {
            let actualCol = this.colReferences[j];
            let prevCol = this.colReferences[j - 1];
            if (this.matrix[actualRow][prevCol]) {
                this.matrix[actualRow][actualCol] = { ...this.matrix[actualRow][prevCol], col: actualCol };
                delete this.matrix[actualRow][prevCol];
            }
        }

        // Insert the new value
        let actualCol = this.colReferences[colIndex];
        this.matrix[actualRow][actualCol] = { value, col: actualCol };
    }

    insertCellDown(rowIndex, colIndex, value) {
        if (rowIndex >= this.rows || colIndex >= this.cols) {
            this.resizeMatrix(Math.max(this.rows, rowIndex + 1), Math.max(this.cols, colIndex + 1));
        }

        let actualCol = this.colReferences[colIndex];

        // Shift rows down from the point of insertion
        for (let i = this.rows - 1; i > rowIndex; i--) {
            let actualRow = this.rowReferences[i];
            let prevRow = this.rowReferences[i - 1];
            if (this.matrix[prevRow][actualCol]) {
                this.matrix[actualRow][actualCol] = { ...this.matrix[prevRow][actualCol], col: actualCol };
                delete this.matrix[prevRow][actualCol];
            }
        }

        // Insert the new value
        let actualRow = this.rowReferences[rowIndex];
        this.matrix[actualRow][actualCol] = { value, col: actualCol };
    }

    resizeMatrix(newRows, newCols) {
        // Resize rows
        for (let i = this.rows; i < newRows; i++) {
            this.matrix[i] = {};
            this.rowReferences[i] = i;
        }
        this.rows = newRows;

        // Resize columns
        for (let j = this.cols; j < newCols; j++) {
            this.colReferences[j] = j;
        }
        this.cols = newCols;
    }

    printMatrix() {
        for (let i = 0; i < this.rows; i++) {
            let actualRow = this.rowReferences[i];
            let row = [];
            for (let j = 0; j < this.cols; j++) {
                let actualCol = this.colReferences[j];
                if (this.matrix[actualRow][actualCol]) {
                    let { value, col } = this.matrix[actualRow][actualCol];
                    row.push(`(${i}, ${j}, ${value})`);
                } else {
                    // row.push(`(${i}, ${j}, 0)`);
                }
            }
            console.log(row.join(' '));
        }
    }
}

// Example usage
let matrix = new SparseMatrix(3, 5);

matrix.insert(0, 4, 1);
matrix.insert(1, 0, 1);
matrix.insert(1, 4, 1);
matrix.insert(2, 0, 2);
matrix.insert(2, 1, 2);
matrix.insert(2, 3, 2);

console.log("Original matrix:");
matrix.printMatrix();

matrix.insertRow(1);
matrix.insertRow(4);
console.log("\nMatrix after inserting a row at index 1:");
matrix.printMatrix();

matrix.insertColumn(2);
matrix.insertColumn(9);
console.log("\nMatrix after inserting a column at index 2:");
matrix.printMatrix();

matrix.insertCell(1, 9, 5);
console.log("\nMatrix after inserting individual cell (1, 2, 5):");
matrix.printMatrix();

matrix.insertCellDown(1, 2, 9);
console.log("\nMatrix after inserting individual cell down (1, 2, 9):");
matrix.printMatrix();

matrix.insert(8, 9, 5);
console.log("\nMatrix after inserting individual cell (10, 12, 5):");
matrix.printMatrix();
