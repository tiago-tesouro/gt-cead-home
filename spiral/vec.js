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

    mag() {

        return Math.sqrt(this.x * this.x + this.y * this.y);

    }

    get_dir() {

        let mag = this.mag();

        let dir = new Vec(this.x / mag, this.y / mag);

        return dir;

    }

    scale(k) {

        this.x *= k;
        this.y *= k;

    }

    rotate(fi) {

        const x_ = Math.cos(fi) * this.x - Math.sin(fi) * this.y;
        const y_ = Math.sin(fi) * this.x + Math.cos(fi) * this.y;

        this.x = x_;
        this.y = y_;

    }

    renderAsPoint(ctx, color = "black") {

        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

    }

}