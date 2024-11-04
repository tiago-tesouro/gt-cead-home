class Polygon {

    constructor(center, nSides, radius, color) {

        this.center = center;
        this.nSides = nSides;
        this.radius = radius;
        this.color = color;

        this.vertices = [];
        this.current_vertices = [];

        this.innerTheta = Math.PI * 2 / nSides;

        const nVertices = nSides    ;

        for (let i = 0; i < nVertices; i++) {

            const p_ = Vec.fromAngle(this.innerTheta * i, this.radius);

            const p = Vec.add(this.center, p_);

            this.vertices.push(p);

        }

    }

    get_normal(point, p1) {

        const sub_vector = Vec.sub(p1, point);
    
        let dir = sub_vector//.get_dir();

        dir.rotate(Math.PI/2);

        let normal = Vec.add(point, dir);
        //point.renderAsPoint(ctx);
        //normal.renderAsPoint(ctx);
        normal = Vec.sub(normal, point);
        normal = normal.get_dir();

        return normal;

    }

    get_normal_r(point) {

        let normal = Vec.sub(point, this.center);
        normal = normal.get_dir();

        return normal;

    }

    interpolate_sides() {

        const new_vertices = [];

        this.vertices.forEach( (p, i, arr) => {

            /* números aleatórios */
            const m = gaussianRand();
            const k = gaussianRand();
            const theta = gaussianRand() * Math.PI / 2;

            //console.log(m, k, theta);

            const next_i = ( i + 1 ) % arr.length;
            const p2 = arr[next_i];

            // RANDOM
            const middle = this.generate_extra_point(p, p2, m);

            /* debug */
            /*
            ctx.strokeStyle = "gray";
            ctx.beginPath();
            ctx.arc(middle.x, middle.y, 50, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();  
            */
            
            let normal = this.get_normal(middle, p);
            /* só para debug */
            /*
            console.log(normal);
            normal.scale(50);
            const normal_point = Vec.add(middle, normal);

            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.moveTo(middle.x, middle.y);
            ctx.lineTo(normal_point.x, normal_point.y);
            ctx.stroke();
            ctx.closePath();
            */

            /*rotaciona a normal*/
            let dir = new Vec(normal.x, normal.y);

            //RANDOM
            
            dir.rotate(theta);
            //RANDOM
            const tamanho_lado = Vec.get_distance(p, p2);

            dir.scale(k * tamanho_lado);

            const dir_point = Vec.add(middle, dir);

            /* para debug */
            /*
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(middle.x, middle.y);
            ctx.lineTo(dir_point.x, dir_point.y);
            ctx.stroke();
            ctx.closePath();

            middle.renderAsPoint(ctx, "yellow");
            normal_point.renderAsPoint(ctx, "blue");
            dir_point.renderAsPoint(ctx, "red");
            */

            //console.log(p, dir_point, p2);
            //dir_point.renderAsPoint(ctx, "red");


            new_vertices.push(p);
            new_vertices.push(dir_point);

        })

        this.vertices = [...new_vertices];

    }

    generate_extra_point(p1, p2, k) {

        const m = Vec.sub(p1, p2);

       // if (!k) k = 0.1;
       //console.log(k);

        m.scale(k);

        // para posicionar o ponto
        return Vec.add(p2, m);

    }

    // faz a mesma coisa, com k = 0.5
    generate_middle_point(p1, p2) {

        return new Vec(
            (p1.x + p2.x) * 0.5,
            (p1.y + p2.y) * 0.5
        )

    }

    randomize_middle_point() {}

    render(ctx) {

        ctx.globalAlpha = .15;
        ctx.fillStyle = this.color;

        this.vertices.forEach( (p, i) => {

            if (i == 0) {

                //ctx.save();
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);

            } else {

                ctx.lineTo(p.x, p.y);

            }

            if (i == this.vertices.length - 1) {

                ctx.closePath();
                //ctx.stroke();
                ctx.fill();
                //ctx.restore();

            }

        })

    }

    render_contour(ctx) {

        this.vertices.forEach( (p, i) => {

            if (i == 0) {

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);

            } else {

                ctx.lineTo(p.x, p.y);

            }

            if (i == this.vertices.length - 1) {

                //ctx.fillStyle = "khaki";
                ctx.strokeStyle = "black";

                ctx.closePath();
                ctx.stroke();
                //ctx.fill();
                ctx.restore();

            }

        })

    }

    plot(ctx) {

        // ctx.globalAlpha = .15;
        // ctx.fillStyle = this.color;

        this.render(ctx);

        const rep = 15;
        for (let i = 0; i < rep; i++) {
            this.interpolate_sides();
            this.render(ctx);
        }

    }

    iterate(ctx, rep) {

        for (let i = 0; i < rep; i++) {
            this.interpolate_sides();
            this.render(ctx);
        } 

    }

}

function gaussianRandom(mean=0, stdev=1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1)
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    if (isNaN(z * stdev + mean)) return "pem";
    return z * stdev + mean;
}

//https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve/39187274#39187274
function gaussianRand() {
    var rand = 0;
  
    for (var i = 0; i < 6; i += 1) {
      rand += Math.random();
    }
  
    return rand / 6; // 0 and 1
  }
/*
const times = [];
const random_values = [];

for (let i = 0; i <= 1000; i++) {

    const t0 = performance.now();
    const new_v = gaussianRand();//gaussianRandom(0, 1);
    random_values.push(new_v);
    const t1 = performance.now();
    times.push(t1-t0);

}*/

function chart(ctx) {

    const w = 500;
    const h = 400;

    const m = 20;

    const x0 = 100;
    const y0 = 100;

    ctx.fillStyle = "white";
    ctx.fillRect(x0, y0, 500, 400);
    ctx.fill();

    // ranges v
    const range_v = [Math.min(...random_values), Math.max(...random_values)];
    const range_y = [y0 + h - m, y0 + m];
    const range_x = [x0 + m, x0 + w - m];
    const range_i = [0, random_values.length];

    console.log(range_v, range_y);

    function scale_y(v) {

        return (range_y[1] - range_y[0]) * (v - range_v[0]) / (range_v[1] - range_v[0]) + range_y[0];

    }

    function scale_x(i) {

        return (range_x[1] - range_x[0]) * (i - range_i[0]) / (range_i[1] - range_i[0]) + range_x[0];

    }

    ctx.beginPath();
    
    random_values.forEach( (v, i, arr) => {

        const x = scale_x(i);
        const y = scale_y(v);

        //console.log(x,y)

        if (i == 0) {ctx.moveTo(x,y)}
        else {
            ctx.lineTo(x,y);
        }

        if (i == arr.length - 1) {
            ctx.strokeStyle = "dodgerblue";
            ctx.stroke();
        }

    })



}







