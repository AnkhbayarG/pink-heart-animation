
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let W, H, cx, cy, scale;
const particles = [];
const COUNT = 3500;
const TAU = Math.PI * 2;

function heart(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y: 13 * Math.cos(t)
           - 5 * Math.cos(2 * t)
           - 2 * Math.cos(3 * t)
           - Math.cos(4 * t)
    };
}

function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cx = W / 2;
    cy = H / 2;
    scale = Math.min(W / 38, H / 34, 15);

    particles.length = 0;

    for (let i = 0; i < COUNT; i++) {
        const t = Math.random() * TAU;
        const r = Math.sqrt(Math.random());
        const p = heart(t);

        particles.push({
            x: cx + p.x * scale * r,
            y: cy - p.y * scale * r,
            size: Math.random() * 1.5 + 0.4,
            phase: Math.random() * TAU,
            speed: Math.random() * 2 + 0.5,
            drift: Math.random() * 4 + 1,
            hue: 310 + Math.random() * 35
        });
    }
}

function draw(now) {
    const time = now / 1000;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    const beat = 1 + 0.035 *
        Math.pow(Math.max(0, Math.sin(time * 2.5)), 8);

    for (const p of particles) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const wave = Math.sin(time * p.speed + p.phase);

        const x = cx + dx * beat
            + Math.cos(time + p.phase) * p.drift * wave;
        const y = cy + dy * beat
            + Math.sin(time * 0.8 + p.phase) * p.drift * wave;

        const glow = 0.6 + 0.4 * Math.sin(time * 3 + p.phase);
        const radius = p.size * (0.7 + glow * 0.5);

        ctx.beginPath();
        ctx.arc(x, y, radius * 2.5, 0, TAU);
        ctx.fillStyle = `hsla(${p.hue},100%,65%,0.12)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TAU);
        ctx.fillStyle = `hsla(${p.hue},100%,${65 + glow * 25}%,${0.6 + glow * 0.4})`;
        ctx.fill();
    }

    requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(draw);
