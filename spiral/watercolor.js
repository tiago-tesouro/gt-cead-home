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

    get_normal(point) {

        let normal = Vec.sub(point, this.center);
        normal = normal.get_dir();

        return normal;

    }

    interpolate_sides() {

        this.vertices.forEach( (p, i, arr) => {

            const next_i = ( i + 1 ) % arr.length;

            const middle = this.generate_middle_point(p, arr[next_i]);

            let normal = this.get_normal(middle);

            normal.scale(50);
            normal.rotate(Math.PI / 4);
            normal = Vec.add(middle, normal);

            ctx.strokeStyle = "gray";
            ctx.beginPath();
            ctx.arc(middle.x, middle.y, 50, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();  
            
            console.log(normal);

            let outer = this.get_normal(middle);
            outer.scale(W/2);
            outer = Vec.add(middle, outer);

            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(this.center.x, this.center.y);
            ctx.lineTo(outer.x, outer.y);
            ctx.stroke();
            ctx.closePath();

            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.moveTo(middle.x, middle.y);
            ctx.lineTo(normal.x, normal.y);
            ctx.stroke();
            ctx.closePath();

            middle.renderAsPoint(ctx, "yellow");
            normal.renderAsPoint(ctx, "goldenrod");


        })

    }

    generate_middle_point(p1, p2) {

        const m = Vec.sub(p1, p2);

        m.scale(0.5);

        // para posicionar o ponto
        return Vec.add(p2, m);

    }

    generate_middle_point2(p1, p2) {

        return new Vec(
            (p1.x + p2.x) / 2,
            (p1.y + p2.y) / 2
        )

    }

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

                ctx.closePath();
                ctx.stroke();
                ctx.restore();

            }

        })

    }

}





