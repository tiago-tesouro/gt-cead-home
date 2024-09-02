const cv = document.querySelector("canvas");
const ctx = cv.getContext("2d");
const h = + window.getComputedStyle(cv).height.slice(0, -2);
const w = + window.getComputedStyle(cv).width.slice(0, -2);

cv.height = h;
cv.width = w;

const margin = 10;
const margin_v = h * 0.2;

fetch("result.json").then(result => result.json()).then(data => {

    console.log(data);

    const n = data.length;

    function x(i) {

        return margin + ( w - 2 * margin) * i / (n - 1);

    }

    function y(d) {

        return h - (margin_v + ( h - 2 * margin_v) * d);

    }

    const y0 = y(data[0]);

    const points = data.map( (d,i) => {

        return {

            x0: x(i),
            y0: y0,
            yf: y(d),

            current_y: y0

        }

    })

    console.log(points);

    ctx.strokeStyle = "#333333";
    ctx.globalAlpha = 0.5;

    function draw_curve() {

        ctx.clearRect(0,0,w,h);

        ctx.beginPath();
        ctx.moveTo(x(0), y0);
        
        points.forEach( (p,i) => {
    
            ctx.lineTo( p.x0, p.current_y );
            //ctx.arc(x(i), y(d), 1, 0, Math.PI * 2);
    
        })
    
        ctx.stroke();
        ctx.closePath();

    }

    draw_curve();

    //points.forEach(d => d.current_y = d.yf);

    gsap.to(
        points, {
            current_y : (i, target) => target.yf,
            //duration: 3,
            stagger: 0.01,
            onUpdate : draw_curve,
            yoyo: true,
            repeat: 5,
            ease: "elastic.out(1,0.3)"
        }
    )

    




})