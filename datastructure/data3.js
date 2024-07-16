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
            throw new Error("Invalid row or column");
        }
        let actualRow = this.rowReferences[row];
        let actualCol = this.colReferences[col];
        this.matrix[actualRow][actualCol] = { value, col: actualCol };
    }

    insertRow(rowIndex) {
        if (rowIndex > this.rows) {
            throw new Error("Invalid row index");
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
            throw new Error("Invalid column index");
        }

        // Update column references
        let newColId = this.cols;
        this.colReferences.splice(colIndex, 0, newColId);

        this.cols++;
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
                    row.push(`(${i}, ${j}, 0)`);
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
matrix.insertColumn(6);
console.log("\nMatrix after inserting a column at index 2:");
matrix.printMatrix();
