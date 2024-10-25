class Vec {

    constructor(x, y) {

        this.x = x;
        this.y = y;

    }

    static fromAngle(theta, mag = 1) {

        // ___
        // \
        //  \ angulo positivo

        //  / angulo negativo
        // /__

        return new Vec(Math.cos(theta) * mag, Math.sin(theta) * mag);

    }

    static add(v1, v2) {

        return new Vec(v1.x + v2.x, v1.y + v2.y);

    }

    static sub(v1, v2) {

        return new Vec(v1.x - v2.x, v1.y - v2.y);

    }

    scale(k) {

        this.x *= k;
        this.y *= k;

    }

    renderAsPoint(ctx, color = "black") {

        ctx.save();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

    }

}