class Polygon {

    constructor(center, nSides, radius) {

        this.center = center;
        this.nSides = nSides;
        this.radius = radius;

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
        point.renderAsPoint(ctx);
        normal.renderAsPoint(ctx);
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

        this.vertices.forEach( (p, i, arr) => {

            const next_i = ( i + 1 ) % arr.length;

            //const middle = this.generate_middle_point(p, arr[next_i]);
            const middle = this.generate_extra_point(p, arr[next_i], 0.1);

            //normal.scale(50);
            //normal.rotate(Math.PI / 4);
            //normal = Vec.add(middle, normal);

            ctx.strokeStyle = "gray";
            ctx.beginPath();
            ctx.arc(middle.x, middle.y, 50, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();  
            
            let normal = this.get_normal(middle, p);
            console.log(normal);
            normal.scale(50);
            const normal_point = Vec.add(middle, normal);


            //let outer = new Vec(normal.x, normal.y);
            //outer.scale(100);
            //console.log(outer);
            //outer = Vec.add(middle, outer);
            //console.log(outer);

            /* normais "radiais"
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(this.center.x, this.center.y);
            ctx.lineTo(outer.x, outer.y);
            ctx.stroke();
            ctx.closePath(); */

            /* normais de verdade */
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.moveTo(middle.x, middle.y);
            ctx.lineTo(normal_point.x, normal_point.y);
            ctx.stroke();
            ctx.closePath();

            /*rotaciona a normal*/
            let dir = new Vec(normal.x, normal.y);
            dir.rotate(Math.PI/6);
            const dir_point = Vec.add(middle, dir);

            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(middle.x, middle.y);
            ctx.lineTo(dir_point.x, dir_point.y);
            ctx.stroke();
            ctx.closePath();

            middle.renderAsPoint(ctx, "yellow");
            normal_point.renderAsPoint(ctx, "blue");
            dir_point.renderAsPoint(ctx, "red");


        })

    }

    generate_extra_point(p1, p2, k) {

        const m = Vec.sub(p1, p2);

        if (!k) k = 0.1;

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

        this.vertices.forEach( (p, i) => {

            if (i == 0) {

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);

            } else {

                ctx.lineTo(p.x, p.y);

            }

            if (i == this.vertices.length - 1) {

                ctx.fillStyle = "khaki";
                ctx.strokeStyle = "khaki";

                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                ctx.restore();

            }

        })

    }

}





