class Node {
    constructor(value, col) {
        this.value = value;
        this.col = col;
        this.next = null;
    }
}

class SparseMatrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.rowHeads = new Array(rows).fill(null);
        this.initializeMatrix();
    }

    initializeMatrix() {
        for (let i = 0; i < this.rows; i++) {
            this.rowHeads[i] = new Node(0, 0);
        }
    }

    insert(row, col, value) {
        if (row >= this.rows || col >= this.cols) {
            throw new Error("Invalid row or column");
        }

        let current = this.rowHeads[row];
        while (current.next && current.next.col < col) {
            current = current.next;
        }

        if (current.next && current.next.col === col) {
            current.next.value = value;
        } else {
            let newNode = new Node(value, col);
            newNode.next = current.next;
            current.next = newNode;
        }
    }

    insertRow(rowIndex) {
        if (rowIndex > this.rows) {
            throw new Error("Invalid row index");
        }

        // Insert new row
        this.rowHeads.splice(rowIndex, 0, new Node(0, 0));
        this.rows++;
    }

    printMatrix() {
        for (let i = 0; i < this.rows; i++) {
            let row = new Array(this.cols).fill(0);
            let current = this.rowHeads[i].next;
            while (current) {
                row[current.col] = current.value;
                current = current.next;
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

matrix.insertRow(3);
matrix.insertRow(0)
matrix.insertRow(0)
matrix.insertRow(0)
matrix.insertRow(0)
matrix.insert(2,3,4);
console.log("\nMatrix after inserting a row at index 1:");
matrix.printMatrix();