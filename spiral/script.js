const cv = document.querySelector("canvas");
const ctx = cv.getContext("2d");

const H = getComputedStyle(cv).height.slice(0, -2);
const W = getComputedStyle(cv).width.slice(0, -2);

cv.width = W;
cv.height = H;

/*
const n = 330;
let data = [];

for (let i = 0; i < 330; i++) {

    data.push(i);

}*/

let data = ["neg","pos","pos","pos","pos","pos","neg","pos","neg","neg","pos","neg","pos","pos","pos","pos","neg","neg","neg","bem pos","neg","neg","neg","pos","pos","pos","pos","pos","neg","pos","pos","pos","pos","pos","pos","neg","pos","pos","pos","pos","pos","pos","pos","pos","pos","pos","pos","neg","pos","pos","pos","bem pos","pos","pos","pos","pos","pos","pos","pos","neg","pos","pos","pos","pos","pos","pos","pos","pos","bem pos","pos","pos","neg","pos","pos","pos","bem pos","pos","pos","pos","pos","pos","pos","pos","neg","pos","pos","pos","pos","pos","pos","pos","pos","pos","pos","pos","neg","pos","pos","pos","bem pos","pos","pos","pos","pos","pos","pos","pos","neg","pos","pos","pos","bem pos","pos","pos","pos","pos","pos","pos","neg","neg","bem pos","pos","pos","bem pos","pos","pos","pos","pos","pos","bem pos","pos","neg","bem pos","pos","bem pos","bem pos","pos","pos","pos","pos","pos","bem pos","neg","bem neg","pos","neg","pos","pos","neg","neg","pos","pos","neg","bem pos","pos","pos","bem pos","neg","neg","bem pos","neg","pos","pos","pos","muito pos","pos","pos","bem pos","bem pos","pos","pos","bem pos","pos","pos","pos","pos","pos","pos","pos","pos","bem pos","pos","pos","pos","pos","pos","pos","pos","pos","pos","neg","muito pos","bem pos","neg","neg","pos","pos","pos","pos","neg","neg","pos","muito pos","bem pos","pos","neg","pos","bem pos","neg","neg","neg","neg","bem neg","pos","neg","pos","pos","neg","pos","pos","neg","neg","neg","neg","neg","neg","bem neg","muito neg","pos","bem neg","neg","pos","bem neg","neg","bem neg","bem neg","bem neg","muito pos","muito neg","muito neg","bem pos","bem neg","neg","pos","bem neg","bem neg","bem neg","neg","bem neg","pos","pos","bem neg","bem pos","bem neg","bem neg","pos","neg","neg","neg","bem neg","bem neg","pos","neg","bem neg","bem pos","neg","bem neg","pos","neg","neg","neg","neg","bem neg","pos","neg","neg","muito pos","bem neg","bem neg","muito neg","muito neg","muito neg","muito neg","muito neg","muito neg","neg","neg","muito neg","muito pos","bem neg","pos","pos","bem neg","muito neg","neg","neg","pos","bem pos","pos","pos","muito pos","neg","neg","bem pos","bem neg","pos","pos","muito neg","pos","bem pos","neg","pos","muito pos","bem neg","neg","pos","bem neg","bem neg","bem neg","bem neg","pos","pos","bem neg","muito neg","muito pos","muito neg","neg","pos","muito neg","bem neg"]
let n = data.length;

let index_data = 0;
let spiral_n = 0;

const L = Math.floor( Math.sqrt(n) );
const new_n = L * L;

data = data.slice(n - new_n, n);

let k = 0;

let seq_dir = ["h+", "v+", "h-", "v-"];

const symbols = {

    "h+": "→", 
    "v+": "↓", 
    "h-": "←", 
    "v-": "↑"

};

const values = ["muito neg", "bem neg", "neg", "pos", "bem pos", "muito pos"];
const colors = ["crimson", "indianred", "lightcoral", "lightskyblue", "#1D5B99", "#174777"];

const color_table = {};

values.forEach( (cat, index) => color_table[cat] = colors[index]);

let i_dir = 0;

function get_next_sequence(
    //spiral_n
    ) {

    let seq = [];

    let dir = seq_dir[i_dir];

    if (dir == "h+") {

        for (let i = spiral_n; i < L - spiral_n; i++) {

            seq.push({
                pair : [i, spiral_n],
                direction : dir
            });
        }

    }

    if (dir == "v+") {

        for (let j = spiral_n + 1; j < L - spiral_n; j++) {

            seq.push({
                pair: [L - spiral_n - 1, j], 
                direction: dir
            });

        }

    }

    if (dir == "h-") {

        for (let i = L - spiral_n  - 2; i > spiral_n - 1; i--) {

            seq.push({
                pair: [i, L - spiral_n - 1],
                direction: dir
            });

        }

    }

    if (dir == "v-") {

        for (let j = L - spiral_n - 2; j > spiral_n; j--) {

            seq.push({
                pair: [spiral_n, j],
                direction: dir
            });

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
        this.drawing_sequence = [];

    }

    get_index(pair) {

        return ( pair[0] + pair[1] * this.L );

    }

    fill_sequence(seq) {

        seq.forEach( (s, k) => {

            const pair = s.pair;

            this.fill_cell(pair, data[index_data]);

            this.drawing_sequence.push(s);

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

    draw_arrows() {

        this.drawing_sequence.forEach( (s, index) => {

            const pair = s.pair;
            const dir = s.direction;

            const i = pair[0];
            const j = pair[1];

            const x = i * this.cell_size + this.cell_size / 2;
            const y = j * this.cell_size + this.cell_size / 2;

            //console.log(i, j, x, y);
            const sym = symbols[dir];

            ctx.strokeRect(x - this.cell_size/2, y - this.cell_size/2, this.cell_size, this.cell_size);
            ctx.fillText(sym, x, y);
        })

    }

    draw_single_blotch(x, y, r, color) {

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

    }

    draw_blotches(x0, y0, dir, color, n) {

        const random_seq = [];

        for (let k = 0; k < n; k++) {

            const x_ = Math.random();
            const y_ = Math.random();
            const r_ = Math.random();

            random_seq.push([x_, y_, r_]);

        }

        random_seq.forEach( comb => {

            let x, y, r;

            if (dir == "h+") {

                x = x0 + comb[0] * this.cell_size;
                y = y0 + (comb[1] - 0.5) * this.cell_size / 2;

            }

            if (dir == "v+") {

                x = x0 + (comb[0] - 0.5) * this.cell_size / 2;
                y = y0 + (comb[1]) * this.cell_size;

            }

            if (dir == "h-") {

                x = x0 - comb[0] * this.cell_size;
                y = y0 + (comb[1] - 0.5) * this.cell_size / 2;

            }

            if (dir == "v-") {

                x = x0 + (comb[0] - 0.5) * this.cell_size / 2;
                y = y0 - (comb[1]) * this.cell_size;

            }

            r = this.cell_size * (comb[2] * 0.7 + 0.3) / 3.5; // quero que o raio varie entre 0.3 e 1, e nAão 0 e 1;

            this.draw_single_blotch(x, y, r, color);

        })

        // para ter o ponto original
        //this.draw_single_blotch(x0, y0, 5, "black");

    }

    draw_with_blotches() {

        ctx.globalAlpha = 0.5;

        const data_length = data.length;

        //const colors = ["dodgerblue", "tomato", "hotpink", "goldenrod", "green"];

        this.drawing_sequence.forEach( 

            (s, index) => {

                const pair = s.pair;
                //const color_index = index % 5;
                //let color = colors[color_index];
                const cat = data[data_length - 1 - index];
                let color = color_table[cat];

                const i = pair[0];
                const j = pair[1];
    
                const x0 = i * this.cell_size + this.cell_size / 2;
                const y0 = j * this.cell_size + this.cell_size / 2;

                const dir = this.drawing_sequence[index + 1].direction;

                this.draw_blotches(x0, y0, dir, color, 20);

            }

        )

    }

    draw_spiral() {

        ctx.beginPath();

        this.drawing_sequence.forEach( (s, index) => {

            const pair = s.pair;

            const i = pair[0];
            const j = pair[1];

            const x = i * this.cell_size + this.cell_size / 2;
            const y = j * this.cell_size + this.cell_size / 2;

            console.log(x,y);

            if (index == 0) {

                ctx.moveTo(x, y);

            } else {

                ctx.lineTo(x,y);

            }

        })

        ctx.lineJoin = "round";
        ctx.lineWidth = this.cell_size / 2;
        ctx.stroke();

    }

    draw_spiral2() {

        let color;
        let last_cell;
        ctx.lineWidth = this.cell_size / 4;

        const colors = ["dodgerblue", "tomato", "hotpink", "goldenrod", "green"];

        this.drawing_sequence.forEach( (s, index) => {

            const pair = s.pair;

            const i = pair[0];
            const j = pair[1];

            const x = i * this.cell_size + this.cell_size / 2;
            const y = j * this.cell_size + this.cell_size / 2;

            console.log(x,y);

            const color_index = index % 5;

            color = colors[color_index];
            ctx.strokeStyle = color;
            ctx.fillStyle = color;

            //ctx.fillRect(x - this.cell_size/4, y - this.cell_size/4, this.cell_size/2, this.cell_size/2);
            
            if (index == 0) {

                //ctx.fillStyle = color;
                //ctx.fillRect(x - this.cell_size/4, y - this.cell_size/4, this.cell_size/2, this.cell_size/2);
                //ctx.moveTo(x, y);

            } else {

                ctx.beginPath();
                ctx.moveTo(last_cell[0], last_cell[1]);
                ctx.lineTo(x,y);
                console.log(color);
                ctx.stroke();
                ctx.closePath();


            }

            last_cell = [x,y];

        })

        //ctx.stroke();

    }

}

ctx.fillStyle = "#333";
ctx.fillRect(0, 0, W, H);

const grid = new Grid(L);

while (index_data < new_n) {
    const seq = get_next_sequence();
    grid.fill_sequence(seq);
    console.log(index_data, spiral_n);
}

