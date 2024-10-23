const cv = document.querySelector("canvas");
const ctx = cv.getContext("2d");

const H = getComputedStyle(cv).height.slice(0, -2);
const W = getComputedStyle(cv).width.slice(0, -2);

cv.width = W;
cv.height = H;

const n = 330;
let data = [];

for (let i = 0; i < 330; i++) {

    data.push(i);

}

let index_data = 0;
let spiral_n = 0;

const L = Math.floor( Math.sqrt(n) );
const new_n = L * L;

data = data.slice(n - new_n, n);

let k = 0;

let seq_dir = ["h+", "v+", "h-", "v-"];

let i_dir = 0;

function get_next_sequence(
    //spiral_n
    ) {

    let seq = [];

    let dir = seq_dir[i_dir];

    if (dir == "h+") {

        for (let i = spiral_n; i < L - spiral_n; i++) {
            seq.push([i, spiral_n]);
        }

    }

    if (dir == "v+") {

        for (let j = spiral_n + 1; j < L - spiral_n; j++) {
            seq.push([L - spiral_n - 1, j])

        }

    }

    if (dir == "h-") {

        for (let i = L - spiral_n  - 2; i > spiral_n - 1; i--) {
            seq.push([i, L - spiral_n - 1]);

        }

    }

    if (dir == "v-") {
        for (let j = L - spiral_n - 2; j > spiral_n; j--) {
            seq.push([spiral_n, j]);
        }
        spiral_n++;
    }

    // incrementa
    i_dir = (i_dir + 1) % seq_dir.length

    return seq;

}

class Grid {

    constructor(L) {

        this.L = L;
        this.cell_size = Math.floor(W / L);

        this.grid = new Array(L * L);

    }

    get_index(pair) {

        return ( pair[0] + pair[1] * this.L );

    }

    fill_sequence(seq) {

        seq.forEach(pair => {
            this.fill_cell(pair, data[index_data]);
            index_data++;
        })

    }


    fill_cell(pair, value) {

        const index = this.get_index(pair);
        this.grid[index] = value;

    }

    draw() {

        this.grid.forEach( (cell, index) => {

            const i = index % this.L;
            const j = Math.floor( index / this.L );

            const x = i * this.cell_size + this.cell_size / 2;
            const y = j * this.cell_size + this.cell_size / 2;

            console.log(i, j, x, y);

            ctx.strokeRect(x - this.cell_size/2, y - this.cell_size/2, this.cell_size, this.cell_size);
            ctx.fillText(cell, x, y);
        })

    }

}

const grid = new Grid(L);

while (index_data < new_n) {
    let seq = get_next_sequence();
    grid.fill_sequence(seq);
    console.log(index_data, spiral_n);
}
