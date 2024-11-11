const svg = document.querySelector("svg");
const cv = document.querySelector("canvas");
const ctx = cv.getContext("2d");

let H = getComputedStyle(cv).height.slice(0, -2);
let W = getComputedStyle(cv).width.slice(0, -2);

const DIM = Math.min(H, W);

console.log(H,W);

cv.width = DIM * 2 ;
cv.height = DIM * 2 ;
svg.width = DIM * 2;
svg.height = DIM * 2;
svg.setAttribute("viewBox", `0 0 ${DIM*2} ${DIM*2}`);

H = 2 * DIM;
W = 2 * DIM;

const res = 2;

cv.style.width = DIM + "px";
cv.style.height = DIM + "px";
svg.style.width = DIM + "px";
svg.style.height = DIM + "px";

/*
const n = 330;
let data = [];

for (let i = 0; i < 330; i++) {

    data.push(i);

}*/

let data = ["neg","pos","pos","pos","pos","pos","neg","pos","neg","neg","pos","neg","pos","pos","pos","pos","neg","neg","neg","bem pos","neg","neg","neg","pos","pos","pos","pos","pos","neg","pos","pos","pos","pos","pos","pos","neg","pos","pos","pos","pos","pos","pos","pos","pos","pos","pos","pos","neg","pos","pos","pos","bem pos","pos","pos","pos","pos","pos","pos","pos","neg","pos","pos","pos","pos","pos","pos","pos","pos","bem pos","pos","pos","neg","pos","pos","pos","bem pos","pos","pos","pos","pos","pos","pos","pos","neg","pos","pos","pos","pos","pos","pos","pos","pos","pos","pos","pos","neg","pos","pos","pos","bem pos","pos","pos","pos","pos","pos","pos","pos","neg","pos","pos","pos","bem pos","pos","pos","pos","pos","pos","pos","neg","neg","bem pos","pos","pos","bem pos","pos","pos","pos","pos","pos","bem pos","pos","neg","bem pos","pos","bem pos","bem pos","pos","pos","pos","pos","pos","bem pos","neg","bem neg","pos","neg","pos","pos","neg","neg","pos","pos","neg","bem pos","pos","pos","bem pos","neg","neg","bem pos","neg","pos","pos","pos","muito pos","pos","pos","bem pos","bem pos","pos","pos","bem pos","pos","pos","pos","pos","pos","pos","pos","pos","bem pos","pos","pos","pos","pos","pos","pos","pos","pos","pos","neg","muito pos","bem pos","neg","neg","pos","pos","pos","pos","neg","neg","pos","muito pos","bem pos","pos","neg","pos","bem pos","neg","neg","neg","neg","bem neg","pos","neg","pos","pos","neg","pos","pos","neg","neg","neg","neg","neg","neg","bem neg","muito neg","pos","bem neg","neg","pos","bem neg","neg","bem neg","bem neg","bem neg","muito pos","muito neg","muito neg","bem pos","bem neg","neg","pos","bem neg","bem neg","bem neg","neg","bem neg","pos","pos","bem neg","bem pos","bem neg","bem neg","pos","neg","neg","neg","bem neg","bem neg","pos","neg","bem neg","bem pos","neg","bem neg","pos","neg","neg","neg","neg","bem neg","pos","neg","neg","muito pos","bem neg","bem neg","muito neg","muito neg","muito neg","muito neg","muito neg","muito neg","neg","neg","muito neg","muito pos","bem neg","pos","pos","bem neg","muito neg","neg","neg","pos","bem pos","pos","pos","muito pos","neg","neg","bem pos","bem neg","pos","pos","muito neg","pos","bem pos","neg","pos","muito pos","bem neg","neg","pos","bem neg","bem neg","bem neg","bem neg","pos","pos","bem neg","muito neg","muito pos","muito neg","neg","pos","muito neg","bem neg"];
//let data_colors = ["#FFFBFB","#F8FAFC","#EFF3F8","#F0F4F8","#FDFEFE","#FEFEFF","#FFFFFF","#EFF3F8","#FFFCFC","#FFFCFC","#FCFDFE","#FFF9F8","#FAFBFD","#FCFDFE","#E8EEF5","#EEF2F8","#FFFFFF","#FFF8F8","#FFFFFF","#C8D6E7","#FFFCFC","#FFF9F9","#FFFBFA","#EAEFF6","#F8FAFC","#F0F4F9","#D5DFED","#E8EDF5","#FFFDFC","#DCE5F0","#EBF0F6","#E7EDF5","#DFE7F1","#FAFCFD","#F8FAFC","#FFF8F8","#F2F5F9","#F2F5F9","#DCE5F0","#DDE5F0","#E6ECF4","#F1F4F9","#FCFDFE","#E3EAF3","#F2F5F9","#F6F8FB","#F4F7FA","#FFF9F8","#EAEFF6","#FAFBFD","#E2E9F2","#CAD7E8","#E3EAF3","#F2F5FA","#F5F8FB","#ECF1F7","#F3F6FA","#ECF1F7","#F9FAFC","#FFF0EF","#D1DCEB","#ECF0F7","#F0F3F8","#D4DFEC","#F1F5F9","#F2F5F9","#F2F5F9","#F5F8FB","#CCD9E9","#E4EAF3","#F8FAFC","#FFF6F6","#CFDBEA","#E6ECF4","#E4EBF3","#C0D0E4","#E7EDF5","#FAFBFD","#EDF1F7","#EFF3F8","#E7EDF5","#E4EAF3","#F0F4F9","#FFF0EF","#D2DDEC","#E4EBF4","#DBE4F0","#D3DEEC","#E8EEF5","#DDE5F0","#E9EFF6","#EAEFF6","#E3EAF3","#E3EAF3","#F5F7FB","#FFF9F8","#CEDBEA","#F3F6FA","#D9E3EF","#B7C9E0","#EFF3F8","#DEE6F1","#E4EBF3","#EAEFF6","#EFF3F8","#DEE6F1","#F8FAFC","#FFF6F6","#E9EEF5","#EBF0F6","#D7E1EE","#AFC4DD","#F0F4F9","#DEE6F1","#EFF3F8","#DDE5F0","#FDFDFE","#DAE3EF","#FFFEFE","#FFF3F2","#C1D1E4","#ECF1F7","#EAF0F6","#B4C8DF","#E9EEF5","#E4EAF3","#E4EBF3","#ECF1F7","#FFFFFF","#CCD9E9","#E8EDF5","#FFEFEE","#B0C5DD","#E4EBF4","#C9D7E8","#ABC1DB","#E3EAF3","#D8E2EE","#DBE4F0","#E0E8F2","#E1E8F2","#B6C9E0","#FFF7F6","#FFD9D7","#ECF1F7","#FFFDFD","#DFE7F1","#CFDBEA","#FFFEFE","#FFFEFE","#F8FAFC","#EFF3F8","#FFF1F0","#CAD8E8","#CDDAEA","#F6F8FB","#BFD0E4","#FFFDFD","#FFF7F6","#B4C8DF","#FFFEFE","#FCFDFE","#FCFDFE","#EEF2F7","#8AAACD","#DDE5F0","#FBFCFD","#C1D1E4","#C2D1E5","#F4F7FA","#D9E2EF","#BDCEE3","#EEF2F8","#D3DEEC","#D0DCEB","#F4F7FA","#E9EEF5","#CFDBEB","#ECF1F7","#F9FAFC","#AAC1DB","#E9EEF6","#E1E8F2","#D3DEEC","#F9FAFC","#FCFDFE","#F0F4F8","#F9FBFD","#FBFCFD","#DAE3EF","#FFF8F7","#92B0D1","#9AB5D4","#FFF5F4","#FFFEFE","#E6ECF4","#EAEFF6","#FCFDFE","#F2F5F9","#FFFFFE","#FFEFEE","#EDF1F7","#95B2D2","#CAD7E8","#D2DEEC","#FFFAFA","#F4F7FA","#C5D4E6","#FFEFEE","#FFFBFB","#FFFBFB","#FFF0EF","#FFE2E1","#F4F7FA","#FFF5F4","#FCFDFE","#DDE5F0","#FFF5F4","#FBFCFD","#DEE6F1","#FFF4F3","#FFF4F3","#FFF5F4","#FFF8F7","#FFF6F5","#FFEFED","#FFE5E3","#FEB4B1","#D2DDEB","#FFE1DF","#FFF6F5","#E4EBF3","#FFEBEA","#FFF4F3","#FFE9E7","#FFE8E6","#FFE2E0","#85A7CB","#FFD3D0","#FFB8B4","#CAD8E8","#FFE1DF","#FFF2F1","#DBE4F0","#FFDEDC","#FFE9E7","#FFE8E7","#FFF4F3","#FFE5E4","#F0F4F9","#FBFCFD","#FFE8E6","#A7BED9","#FFEAE8","#FFE4E2","#E6EDF4","#FFF3F2","#FFEDEC","#FFF7F6","#FFEAE8","#FFE6E5","#E5EBF4","#FFEEEC","#FFDDDB","#ACC2DC","#FFECEA","#FFE9E7","#EDF2F7","#FFF0EE","#FFF3F2","#FFF9F8","#FFEDEC","#FFEAE8","#E8EDF5","#FFEEED","#FFF0EF","#8AAACD","#FFE5E3","#FFE9E8","#FB9F9C","#F47B7A","#DC143C","#FCA5A2","#FB9D9A","#FEB2AE","#FFFCFB","#FFEDEB","#FFD4D1","#91AFD0","#FFEAE9","#FAFBFD","#D6E0ED","#FFEBEA","#FFB9B6","#FFEDEB","#FFF7F6","#FEFEFE","#BDCEE2","#F5F8FB","#DFE7F1","#4682B4","#FFEDEC","#FFF9F9","#BFD0E4","#FFDEDB","#DFE7F1","#D6E0ED","#FFD2D0","#EAEFF6","#C0D0E4","#FFF1F0","#F6F8FB","#4D85B6","#FFDDDB","#FFF9F9","#DEE6F1","#FFDAD8","#FFDAD8","#FFE2E0","#FFE9E8","#E7EDF5","#D9E3EF","#FFE0DE","#FCA19E","#558AB9","#FFD1CE","#FFFEFE","#E8EDF5","#FFCFCC","#FFE0DE"];
let data_colors = ["#FFCECB","#CBE1FE","#C4DAFC","#C5DAFD","#CEE5FF","#CEE5FF","#FFD1CE","#C5DAFD","#FFCFCC","#FFCFCC","#CDE4FF","#FFCCC9","#CCE2FE","#CDE4FF","#C0D5FC","#C4D9FC","#FFD1CE","#FFCCC9","#FFD1CE","#AABDF6","#FFCFCC","#FFCDCA","#FFCECB","#C1D6FC","#CAE0FE","#C5DBFD","#B3C6F8","#C0D4FB","#FFCFCC","#B8CBFA","#C2D7FC","#BFD4FB","#BACEFA","#CCE3FE","#CAE1FE","#FFCCC9","#C6DCFD","#C7DCFD","#B8CCFA","#B8CCFA","#BED3FB","#C6DBFD","#CDE4FF","#BDD1FB","#C6DCFD","#C9DFFE","#C8DEFD","#FFCCC9","#C1D6FC","#CCE2FE","#BCD0FA","#ABBEF7","#BCD0FB","#C7DCFD","#C9DFFE","#C3D8FC","#C7DDFD","#C3D8FC","#CBE1FE","#FFC6C2","#B0C3F8","#C2D7FC","#C5DAFD","#B2C5F8","#C6DCFD","#C6DCFD","#C6DCFD","#C9DFFE","#ADC0F7","#BDD1FB","#CAE1FE","#FFCAC7","#AFC2F7","#BED3FB","#BDD2FB","#A5B7F5","#BFD4FB","#CCE2FE","#C3D8FC","#C5DAFD","#BFD4FB","#BDD1FB","#C5DBFD","#FFC6C2","#B1C4F8","#BDD2FB","#B7CBF9","#B2C5F8","#C0D5FB","#B8CCFA","#C1D5FC","#C1D6FC","#BCD1FB","#BCD1FB","#C8DEFD","#FFCCC9","#AEC1F7","#C7DDFD","#B6CAF9","#9EB0F3","#C5DAFD","#B9CDFA","#BDD2FB","#C1D6FC","#C5DAFD","#B9CDFA","#CAE1FE","#FFCAC7","#C0D5FC","#C2D7FC","#B5C8F9","#98ABF2","#C6DBFD","#B9CDFA","#C4DAFC","#B8CCFA","#CEE4FF","#B6CAF9","#FFD0CD","#FFC8C4","#A5B8F5","#C3D8FC","#C2D6FC","#9CAFF3","#C0D5FC","#BDD1FB","#BDD2FB","#C2D8FC","#CFE6FF","#ADC0F7","#C0D4FB","#FEC5C1","#99ACF2","#BDD2FB","#ABBEF7","#95A8F1","#BDD1FB","#B5C8F9","#B7CBF9","#BBCFFA","#BBCFFA","#9EB0F3","#FFCBC7","#FDB4B0","#C2D7FC","#FFCFCC","#BACEFA","#AFC2F7","#FFD0CD","#FFD0CD","#CAE1FE","#C5DAFD","#FFC6C3","#ACBFF7","#AEC1F7","#C9DFFE","#A4B6F5","#FFCFCC","#FFCBC8","#9CAEF3","#FFD0CD","#CDE4FF","#CDE4FF","#C4D9FC","#7C91EC","#B8CCFA","#CCE3FE","#A5B8F5","#A6B8F5","#C8DEFD","#B6C9F9","#A2B5F5","#C4D9FC","#B2C5F8","#B0C3F8","#C8DEFD","#C0D5FC","#AFC2F8","#C2D7FC","#CBE1FE","#95A7F1","#C1D5FC","#BBCFFA","#B2C5F8","#CBE1FE","#CDE4FF","#C5DBFD","#CBE2FE","#CCE3FE","#B6CAF9","#FFCBC8","#8397ED","#889CEF","#FFC9C6","#FFD1CE","#BED3FB","#C1D6FC","#CDE4FF","#C7DCFD","#FFD1CE","#FEC5C2","#C3D8FC","#8599EE","#ABBEF7","#B1C4F8","#FFCDCA","#C8DEFD","#A8BBF6","#FEC5C1","#FFCECB","#FFCECB","#FFC6C2","#FEBBB7","#C8DEFD","#FFCAC6","#CDE3FF","#B8CCFA","#FFC9C6","#CDE3FE","#B9CDFA","#FFC9C5","#FFC8C5","#FFC9C6","#FFCBC8","#FFCAC7","#FEC4C1","#FEBDB9","#F99794","#B1C4F8","#FEBAB6","#FFCAC7","#BDD2FB","#FEC2BE","#FFC8C5","#FEC0BC","#FEBFBB","#FEBBB7","#788EEB","#FCAFAB","#F99A96","#ACBFF7","#FEBAB6","#FFC7C4","#B7CBF9","#FDB7B4","#FEC0BC","#FEC0BC","#FFC8C5","#FEBDBA","#C5DBFD","#CDE3FE","#FEBFBB","#92A5F1","#FEC1BD","#FEBCB9","#BFD3FB","#FFC8C4","#FEC3C0","#FFCBC8","#FEC1BD","#FEBEBA","#BED2FB","#FEC4C0","#FDB7B3","#96A9F2","#FEC2BF","#FEC0BC","#C3D9FC","#FEC5C2","#FFC7C4","#FFCCC9","#FEC3C0","#FEC1BD","#C0D4FB","#FEC4C0","#FFC5C2","#7C91EC","#FEBDB9","#FEC0BD","#F68685","#EF696B","#DC143C","#F68B89","#F58483","#F89592","#FFCECB","#FEC3C0","#FDB0AC","#8296ED","#FEC1BE","#CCE2FE","#B4C7F9","#FEC2BE","#F99B98","#FEC3BF","#FFCBC7","#CEE5FF","#A2B4F4","#C9DFFE","#BACEFA","#4169E1","#FEC3C0","#FFCDCA","#A4B6F5","#FDB7B4","#BACEFA","#B3C7F9","#FCAEAB","#C1D6FC","#A4B7F5","#FFC6C3","#C9DFFE","#486CE2","#FDB7B3","#FFCCC9","#B9CDFA","#FDB5B1","#FDB4B1","#FEBAB7","#FEC0BD","#BFD4FB","#B6C9F9","#FEB9B6","#F68886","#4F71E3","#FCADA9","#FFD0CD","#C0D4FB","#FCACA8","#FEB9B6"]

let n = data.length;

let index_data = 0;
let spiral_n = 0;

/*
const L = Math.floor( Math.sqrt(n) );
const new_n = L * L;
*/

/*
data = data.slice(n - new_n, n);
data_colors = data_colors.slice(n - new_n, n);
*/

let k = 0;

let seq_dir = ["h+", "v+", "h-", "v-"];

const symbols = {

    "h+": "→", 
    "v+": "↓", 
    "h-": "←", 
    "v-": "↑"

};

const values = ["muito neg", "bem neg", "neg", "pos", "bem pos", "muito pos"];
const colors = ["crimson", "indianred", "lightcoral", 
    "lightskyblue", 
    "#1D5B99", 
    "#174777"];
//const colors = ["#FF00FF", "#FFCCFF", "#FFDDFF", "#DDFFFF", "#CCFFFF", "#00FFFF"];

const color_table = {};

values.forEach( (cat, index) => color_table[cat] = colors[index]);

let i_dir = 0;

function get_next_sequence(L
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

    build_grid_overlay(svg, extdata) {

        const data_length = extdata.length;

        this.drawing_sequence.forEach( (cell, index) => {

            /// reversing the spiral
            const datapoint = extdata[data_length - 1 - index];

            const pair = cell.pair;

            const i = pair[0];
            const j = pair[1];
            //const i = index % this.L;
            //const j = Math.floor( index / this.L );

            const x = i * this.cell_size;
            const y = j * this.cell_size;

            const sq = document.createElementNS("http://www.w3.org/2000/svg", "rect");

            sq.setAttribute("x", x);
            sq.setAttribute("y", y);
            sq.setAttribute("width", this.cell_size);
            sq.setAttribute("height", this.cell_size);
            sq.setAttribute("transform-origin", `${x + this.cell_size / 2} ${y + this.cell_size / 2}`);

            const line_top = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const line_bottom = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const line_left = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const line_right = document.createElementNS("http://www.w3.org/2000/svg", "line");

            line_top.setAttribute("x1", x);
            line_top.setAttribute("x2", x + this.cell_size);
            line_top.setAttribute("y1", y);
            line_top.setAttribute("y2", y);

            line_left.setAttribute("x1", x);
            line_left.setAttribute("x2", x);
            line_left.setAttribute("y1", y);
            line_left.setAttribute("y2", y + this.cell_size);

            line_bottom.setAttribute("x1", x);
            line_bottom.setAttribute("x2", x + this.cell_size);
            line_bottom.setAttribute("y1", y + this.cell_size);
            line_bottom.setAttribute("y2", y + this.cell_size);

            line_right.setAttribute("x1", x + this.cell_size);
            line_right.setAttribute("x2", x + this.cell_size);
            line_right.setAttribute("y1", y);
            line_right.setAttribute("y2", y + this.cell_size);

            line_top.classList.add("line-top");
            line_bottom.classList.add("line-bottom");
            line_right.classList.add("line-right");
            line_left.classList.add("line-left");

            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

            g.dataset.year = datapoint.year;
            g.dataset.month = datapoint.month;
            g.dataset.value = datapoint.value;
            g.dataset.pandemia = datapoint.pandemia;
            g.dataset.i = i;
            g.dataset.j = j;

            g.appendChild(sq);

            g.appendChild(line_top);
            g.appendChild(line_bottom);
            g.appendChild(line_right);
            g.appendChild(line_left);

            svg.appendChild(g);



        })

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

            //console.log(i, j, x, y);

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
                y = y0 + (comb[1] - 0.5) * this.cell_size / 4; // quanto maior esse denominador, menos variação transversal

            }

            if (dir == "v+") {

                x = x0 + (comb[0] - 0.5) * this.cell_size / 4;
                y = y0 + (comb[1]) * this.cell_size;

            }

            if (dir == "h-") {

                x = x0 - comb[0] * this.cell_size;
                y = y0 + (comb[1] - 0.5) * this.cell_size / 4;

            }

            if (dir == "v-") {

                x = x0 + (comb[0] - 0.5) * this.cell_size / 4;
                y = y0 - (comb[1]) * this.cell_size;

            }

            if (dir == "none") {

                x = x0 + (comb[0] - 0.5);
                y = y0 + (comb[1] - 0.5);

            }

            r = this.cell_size * (comb[2] * 1 + 0.3) / 6; // quero que o raio varie entre 0.3 e 1, e nAão 0 e 1;

            this.draw_single_blotch(x, y, r, color);

        })

        // para ter o ponto original
        //this.draw_single_blotch(x0, y0, 5, "black");

    }

    draw_with_blotches() {

        ctx.globalAlpha = .22;

        const data_length = data.length;

        //const colors = ["dodgerblue", "tomato", "hotpink", "goldenrod", "green"];

        this.drawing_sequence.forEach( 

            (s, index) => {

                const pair = s.pair;
                //const color_index = index % 5;
                //let color = colors[color_index];

                /// reversing the spiral
                const cat = data[data_length - 1 - index];
                //let color = color_table[cat]; // cores categóricas
                let color = data_colors[data_length - 1 - index]; // cores contínuas

                const i = pair[0];
                const j = pair[1];
    
                const x0 = i * this.cell_size + this.cell_size / 2;
                const y0 = j * this.cell_size + this.cell_size / 2;

                //const dir = this.drawing_sequence[index + 1].direction;

                let dir = index + 1 == this.drawing_sequence.length 
                    ? "none"
                    : this.drawing_sequence[index + 1].direction
                ;

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

            //console.log(x,y);

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

        const colors = ["#00FFFF", "#CCFFFF", "ghostwhite", "#FFCCFF", "#FF00FF" ];
        //const colors = ["dodgerblue", "tomato", "hotpink", "goldenrod", "green"];

        this.drawing_sequence.forEach( (s, index) => {

            const pair = s.pair;

            const i = pair[0];
            const j = pair[1];

            const x = i * this.cell_size + this.cell_size / 2;
            const y = j * this.cell_size + this.cell_size / 2;

            //console.log(x,y);

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
                //console.log(color);
                ctx.stroke();
                ctx.closePath();


            }

            last_cell = [x,y];

        })

        //ctx.stroke();

    }

    draw_watercolors() {

        ctx.beginPath();

        this.polygons = [];

        const x0s = {
            "h+" : 1.5,
            "h-" : -1.5,
            "v+" : 0,
            "v-" : 0,
            "none" : 0
        }

        const y0s = {
            "v+" : 1.5,
            "v-" : -1.5,
            "h+" : 0,
            "h-" : 0,
            "none" : 0
        }

        const data_length = data.length;

        this.drawing_sequence.forEach( (s, index) => {

            let color = data_colors[data.length - 1 - index]; // cores contínuas
            const cat = data[data_length - 1 - index];
            //let color = color_table[cat]; // cores categóricas

            const pair = s.pair;

            const i = pair[0];
            const j = pair[1];

            const x = i * this.cell_size + this.cell_size / 2;
            const y = j * this.cell_size + this.cell_size / 2;

            let dir = index + 1 == this.drawing_sequence.length ? 
                "none" :
                this.drawing_sequence[index + 1].direction;

            //console.log(dir);

            const size = this.cell_size / 4.5; //* (0.5 + Math.random());

            const p = new Polygon(new Vec(x, y), 10, 
                size,//this.cell_size/5, 
                color, dir);

            // extra polygon

            /*
            const xd = x0s[dir] * this.cell_size;
            const yd = y0s[dir] * this.cell_size;
            const p_extra = new Polygon(new Vec(x + xd, y + yd), 8, this.cell_size/4, color, dir);
            */

            p.render(ctx, 0.3);
            p.iterate(ctx, 6, 0.3);
            //p_extra.render(ctx);
            //p_extra.iterate(ctx, 4);

            this.polygons.push(p);

        })

    }

}

ctx.fillStyle = "#111";//"floralwhite";
//ctx.fillStyle = "#333";
//ctx.fillRect(0, 0, W, H);

fetch("../result.json").then(response => response.json()).then(resdata => {
    console.log(resdata);

    const len = resdata.length
    const L = Math.floor( Math.sqrt(len) );
    const new_n = L * L;

    resdata = resdata.slice(len - new_n, len);

    const grid = new Grid(L);

    while (index_data < new_n) {
        const seq = get_next_sequence(L);
        grid.fill_sequence(seq);
        //console.log(index_data, spiral_n);
    }

    grid.draw_with_blotches();
    grid.draw_watercolors();
    grid.build_grid_overlay(svg, resdata);


    const rects = document.querySelectorAll("rect");
    const tt = document.querySelector(".tooltip");
    const tt_width = +getComputedStyle(tt).width.slice(0,-2);
    const tt_height = +getComputedStyle(tt).height.slice(0,-2);

    //console.log(tt);

    let last_target_year;

    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    const formata = new Intl.NumberFormat('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });

    svg.addEventListener("mouseover", function(e) {

        if (e.target.tagName == "rect") {

            const data = e.target.parentElement.dataset;
            const year = data.year;
            const month = data.month;
            const pand = data.pandemia;
            const value = data.value;
            const i = data.i;
            const j = data.j;

            // mostra e posiciona o tooltip
            tt.classList.add("active");
            let x = i * grid.cell_size / res + grid.cell_size / res + 10;
            let y = j * grid.cell_size / res + grid.cell_size / res + 10;
        
            if  ((x + tt_width) > W / res) x = i * grid.cell_size / res - tt_width - 10;
            if  ((y + tt_width) > H / res) y = j * grid.cell_size / res - tt_height - 10;

            tt.style.transform = `translate(${x}px, ${y}px)`;

            document.querySelector(".tt-periodo").innerHTML = meses[month-1] + ' de ' + year;
            document.querySelector(".tt-resultado").innerHTML = formata.format(value) + ' milhões';
            document.querySelector(".tt-resultado").style.color = 
                value < 0 ?
                "crimson" :
                "steelblue";

            document.querySelector(".tt-pandemia").innerHTML = pand;
            

            if (last_target_year != year) {

                // destaca os quadradinhos do ano
                rects.forEach(rect => {

                    if (rect.parentElement.dataset.year == year) {
                        rect.classList.add("highlight");
                    } else {rect.classList.remove("highlight")}
    
                });

            }

        } else {

            tt.classList.remove("active");

        }

    });

    svg.addEventListener("mouseout", function(e) {
        rects.forEach(
            rect => rect.classList.remove("highlight")
        )
        tt.classList.remove("active");
    });

})

//grid.draw_with_blotches()


//const p2 = new Polygon(new Vec(W/3, H/2), 8, 150, "dodgerblue");
//const p1 = new Polygon(new Vec(2*W/3, H/2), 8, 150, "crimson");


    

//const p3 = new Polygon(new Vec(W/2, H/2), 8, 200);
//ctx.globalAlpha = 1;
/*
p3.render_contour(ctx);
//p3.render_contour(ctx);

for (let i = 0; i < 2; i++) {
    p3.interpolate_sides();
    p3.render_contour(ctx);
}*/


