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


//let n = data.length;

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

    fill_sequence(seq, data) {

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

    draw_with_blotches(data) {

        ctx.globalAlpha = .22;

        const data_length = data.length;

        //const colors = ["dodgerblue", "tomato", "hotpink", "goldenrod", "green"];

        console.log(data)

        this.drawing_sequence.forEach( 

            (s, index) => {

                const pair = s.pair;
                //const color_index = index % 5;
                //let color = colors[color_index];

                /// reversing the spiral
                const cat = data[data_length - 1 - index];
                //let color = color_table[cat]; // cores categóricas
                let color = cat.colors;//data_colors[data_length - 1 - index]; // cores contínuas

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

    draw_watercolors(data) {



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

            //let color = data_colors[data.length - 1 - index]; // cores contínuas
            const cat = data[data_length - 1 - index];
            const color = cat.colors;
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
        grid.fill_sequence(seq, resdata);
        //console.log(index_data, spiral_n);
    }

    grid.draw_with_blotches(resdata);
    grid.draw_watercolors(resdata);
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


