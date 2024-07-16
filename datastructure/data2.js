class SparseMatrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = {};
        this.rowReferences = new Array(rows).fill(null);
        this.initializeMatrix();
    }

    initializeMatrix() {
        for (let i = 0; i < this.rows; i++) {
            this.matrix[i] = { 0: { value: 0, col: 0 } };
            this.rowReferences[i] = i;
        }
    }

    insert(row, col, value) {
        if (row >= this.rows || col >= this.cols) {
            throw new Error("Invalid row or column");
        }
        let actualRow = this.rowReferences[row];
        this.matrix[actualRow][col] = { value, col };
    }

    insertRow(rowIndex) {
        if (rowIndex > this.rows) {
            throw new Error("Invalid row index");
        }

        // Create new row
        let newRowId = this.rows;
        this.matrix[newRowId] = { 0: { value: 0, col: 0 } };

        // Update row references
        this.rowReferences.splice(rowIndex, 0, newRowId);

        this.rows++;
    }

    printMatrix() {
        for (let i = 0; i < this.rows; i++) {
            let actualRow = this.rowReferences[i];
            let row = [];
            for (let j = 0; j < this.cols; j++) {
                if (this.matrix[actualRow][j]) {
                    let { value, col } = this.matrix[actualRow][j];
                    row.push(`(${i}, ${col}, ${value})`);
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