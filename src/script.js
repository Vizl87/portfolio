          function openPopup(popupId) {
               document.getElementById(popupId).style.display = 'flex';
               document.body.style.overflow = 'hidden'; 
          }

          function closePopup(popupId) {
               document.getElementById(popupId).style.display = 'none';
               document.body.style.overflow = 'auto'; 
          }


          window.onclick = function(event) {
               const popups = document.querySelectorAll('.popup-overlay');
               popups.forEach(popup => {
                    if (event.target === popup) {
                         popup.style.display = 'none';
                         document.body.style.overflow = 'auto';
                    }
               });
          }

          document.addEventListener('keydown', function(event) {
               if (event.key === 'Escape') {
                    const openPopup = document.querySelector('.popup-overlay[style*="flex"]');
                    if (openPopup) {
                         openPopup.style.display = 'none';
                         document.body.style.overflow = 'auto';
                    }
               }
          });
          window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.topnav');
            const scrollTop = window.pageYOffset;
            
            navbar.style.transform = scrollTop > 100 ? 'translateY(-100%)' : 'translateY(0)';
        });


document.addEventListener('DOMContentLoaded', function() {
     const workLink = document.querySelector('.topnav a[href="work.html"], .topnav a[href="#work"]');
     if (workLink) {
          workLink.addEventListener('click', function(e) {
               e.preventDefault();
               const target = document.getElementById('work');
               if (target) {
                    const navOffset = 120;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
               }
          });
     }
});

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let w, h, dpr;
    const COUNT = 80;
    const CONNECT = 160;
    const CURSOR = 160;

    const mouse = { x: -9999, y: -9999 };

    function resize() {
        dpr = window.devicePixelRatio || 1;
        w = Math.max(window.innerWidth, 300);
        h = Math.max(window.innerHeight, 200);

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    const particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: 1.2 + Math.random() * 2.8,
        alpha: 0.45 + Math.random() * 0.55
    }));

    function animate() {
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;

            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (mouse.x > -9998 && dist < CURSOR && dist > 0.1) {
                const force = (1 - dist / CURSOR) * 0.225;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }

            p.vx *= 0.995;
            p.vy *= 0.995;

            if (p.x < -20) p.x = w + 20;
            else if (p.x > w + 20) p.x = -20;

            if (p.y < -20) p.y = h + 20;
            else if (p.y > h + 20) p.y = -20;

            ctx.beginPath();
            ctx.fillStyle = `rgba(200,230,255,${Math.min(0.95, p.alpha * 0.9)})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const d = Math.hypot(p.x - q.x, p.y - q.y);

                if (d < CONNECT) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(150,210,255,${(1 - d / CONNECT) * 0.28})`;
                    ctx.lineWidth = 1.4;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = mouse.y = -9999;
    });

     window.addEventListener("resize", () => {
     resize();

     particles.forEach(p => {
     if (p.x > w) p.x = Math.random() * w;
     if (p.y > h) p.y = Math.random() * h;
     });
     });

    animate();
});