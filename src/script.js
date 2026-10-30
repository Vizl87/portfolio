document.addEventListener("DOMContentLoaded", () => {
    const modalToggles = document.querySelectorAll(".modal-toggle");
    const navbar = document.querySelector(".topnav");

    function updateBodyOverflow() {
        const modalIsOpen = [...modalToggles].some(toggle => toggle.checked);
        document.body.style.overflow = modalIsOpen ? "hidden" : "";
    }

    modalToggles.forEach(toggle => {
        toggle.addEventListener("change", updateBodyOverflow);
    });

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;

        modalToggles.forEach(toggle => {
            toggle.checked = false;
        });
        updateBodyOverflow();
    });

    window.addEventListener("scroll", () => {
        if (!navbar) return;

        navbar.style.transform = window.pageYOffset > 100
            ? "translateY(-100%)"
            : "translateY(0)";
    });

    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // values for the distance and how much do the particles push away from the cursor
    const CONNECT = 160;
    const CONNECT_SQ = CONNECT * CONNECT;
    const CURSOR = 160;
    const CURSOR_SQ = CURSOR * CURSOR;
    const WRAP = 20;
    const TAU = Math.PI * 2;

    let w, h, dpr;
    let particles = [];
    let isHidden = false;

    const mouse = { x: -9999, y: -9999 };

    document.addEventListener("visibilitychange", () => {
        isHidden = document.hidden;
    });

    // for the differerent colors of particles and t heri clows
    const particlePalette = [
        "rgba(74, 166, 255, ",
        "rgba(0, 245, 212, ",   
        "rgba(212, 241, 249, ", 
        "rgba(255, 255, 255, "  
    ];

    function getTargetParticleCount() {
        const count = Math.floor((w * h) / 9000); 
        return Math.min(Math.max(count, 45), 160); 
    }

    function createParticle() {
        const baseColor = particlePalette[Math.floor(Math.random() * particlePalette.length)];
        const alpha = 0.4 + Math.random() * 0.55;
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            r: 1.2 + Math.random() * 2.8,
            colorPrefix: baseColor,
            fillColor: `${baseColor}${alpha.toFixed(2)})`,
            glowColor: `${baseColor}0.8)`
        };
    }

    function resize() {
        dpr = window.devicePixelRatio || 1;
        w = Math.max(innerWidth, 300);
        h = Math.max(innerHeight, 200);

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineWidth = 1.2;

        const targetCount = getTargetParticleCount();
        if (particles.length < targetCount) {
            const toAdd = targetCount - particles.length;
            for (let i = 0; i < toAdd; i++) particles.push(createParticle());
        } else if (particles.length > targetCount) {
            particles.splice(targetCount);
        }

        particles.forEach(p => {
            if (p.x > w) p.x = Math.random() * w;
            if (p.y > h) p.y = Math.random() * h;
        });
    }

    resize();

    function updateParticle(p, mx, my) {
        p.x += p.vx;
        p.y += p.vy;

        const dx = p.x - mx;
        const dy = p.y - my;
        const distSq = dx * dx + dy * dy;

        if (mx > -9998 && distSq < CURSOR_SQ && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / CURSOR) * 0.25 / dist;
            p.vx += dx * force;
            p.vy += dy * force;
        }

        p.vx *= 0.992;
        p.vy *= 0.992;

        if (p.x < -WRAP) p.x = w + WRAP;
        else if (p.x > w + WRAP) p.x = -WRAP;
        if (p.y < -WRAP) p.y = h + WRAP;
        else if (p.y > h + WRAP) p.y = -WRAP;
    }

    function drawParticle(p) {
        ctx.save();
        ctx.shadowBlur = p.r * 3;
        ctx.shadowColor = p.glowColor;
        ctx.fillStyle = p.fillColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TAU);
        ctx.fill();
        ctx.restore();
    }

    function drawConnections(p, index) {
        const len = particles.length;
        for (let j = index + 1; j < len; j++) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < CONNECT_SQ) {
                const opacity = (1 - Math.sqrt(distSq) / CONNECT) * 0.32;
                ctx.strokeStyle = `rgba(100, 190, 255, ${opacity.toFixed(2)})`;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
            }
        }
    }

    function animate() {
        if (!isHidden) {
            ctx.clearRect(0, 0, w, h);

            const mx = mouse.x;
            const my = mouse.y;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                updateParticle(p, mx, my);
                drawParticle(p);
                drawConnections(p, i);
            }
        }
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("mousemove", ({ clientX, clientY }) => {
        mouse.x = clientX;
        mouse.y = clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    window.addEventListener("resize", resize);
});
