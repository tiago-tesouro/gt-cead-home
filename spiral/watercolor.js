class Polygon {

    constructor(center, nSides, radius) {

        this.center = center;
        this.nSides = nSides;
        this.radius = radius;

        this.vertices = [];

        this.innerTheta = Math.PI * 2 / nSides;

        const nVertices = nSides + 1;

        for (let i = 0; i < nVertices; i++) {

            const p_ = Vec.fromAngle(this.innerTheta * i, this.radius);

            const p = Vec.add(this.center, p_);

            this.vertices.push(p);

        }

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