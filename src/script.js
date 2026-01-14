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

/* Background: particles with connecting lines + drifting marks */
document.addEventListener('DOMContentLoaded', function () {
     const canvas = document.getElementById('bg-canvas');
     if (!canvas) return;
     const ctx = canvas.getContext('2d');
     let w = 0, h = 0, dpr = 1;
     function resize() {
          dpr = window.devicePixelRatio || 1;
          w = Math.max(window.innerWidth, 300);
          h = Math.max(window.innerHeight, 200);
          canvas.width = Math.round(w * dpr);
          canvas.height = Math.round(h * dpr);
          canvas.style.width = w + 'px';
          canvas.style.height = h + 'px';
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
     }

     // start with a sized canvas
     resize();

     // helper: draw rounded rectangle path then fill/stroke externally
     function roundRect(ctx, x, y, width, height, radius) {
           if (width <= 0 || height <= 0) return;
           if (typeof radius === 'number') {
                radius = { tl: radius, tr: radius, br: radius, bl: radius };
           } else {
                radius = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, radius);
           }
           ctx.beginPath();
           ctx.moveTo(x + radius.tl, y);
           ctx.lineTo(x + width - radius.tr, y);
           ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
           ctx.lineTo(x + width, y + height - radius.br);
           ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
           ctx.lineTo(x + radius.bl, y + height);
           ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
           ctx.lineTo(x, y + radius.tl);
           ctx.quadraticCurveTo(x, y, x + radius.tl, y);
           ctx.closePath();
     }

         // Particle system initialization
         // - `particleCount` determines the number of particles on-screen.
         // - Each particle stores position (x,y), velocity (vx,vy), radius `r`, and `alpha` for brightness.
         // - Velocities are small to create a subtle, floating motion; damping (below) prevents runaway speeds.
         // - Initialize positions relative to the current canvas size so particles fill the viewport.
         const particleCount = 80;
         const particles = [];
         for (let i = 0; i < particleCount; i++) {
              particles.push({
                   x: Math.random() * w,
                   y: Math.random() * h,
                   // small random velocities; tuned for a calm drifting effect
                   vx: (Math.random() - 0.5) * 0.8,
                   vy: (Math.random() - 0.5) * 0.8,
                   // visual radius and base alpha
                   r: 1.2 + Math.random() * 2.8,
                   alpha: 0.45 + Math.random() * 0.55
              });
         }

     const marks = [];
     function spawnMark() {
          const size = 100 + Math.random() * 220;
          marks.push({
               x: -size - 40,
               y: 40 + Math.random() * (h * 0.6),
               w: size,
               h: 10 + Math.random() * 28,
               vx: 0.6 + Math.random() * 2.2,
               alpha: 0.18 + Math.random() * 0.32,
               angle: -8 + Math.random() * 16
          });
          if (marks.length > 12) marks.shift();
     }

     for (let i = 0; i < 4; i++) spawnMark();
     let lastSpawn = performance.now();

     // cursor tracking for avoidance
     const cursor = { x: -9999, y: -9999 };
     window.addEventListener('mousemove', (e) => {
          cursor.x = e.clientX;
          cursor.y = e.clientY;
     });
     window.addEventListener('mouseleave', () => { cursor.x = -9999; cursor.y = -9999; });

     function step(now) {
          // Clear the canvas each frame. We redraw all particles and connecting lines every tick.
          ctx.clearRect(0, 0, w, h);


          // update & draw particles with avoidance behavior
          for (let i = 0; i < particles.length; i++) {
               const p = particles[i];

               // base motion
               p.x += p.vx;
               p.y += p.vy;

 

               // avoid cursor if nearby
               const dxC = p.x - cursor.x;
               const dyC = p.y - cursor.y;
               const distC = Math.sqrt(dxC*dxC + dyC*dyC);
               const cursorRadius = 160;
               if (cursor.x > -9998 && distC < cursorRadius && distC > 0.1) {
                    const repelC = (1 - distC / cursorRadius) * 1.25;
                    p.vx += (dxC / distC) * repelC * 0.18;
                    p.vy += (dyC / distC) * repelC * 0.18;
               }

               // damping to keep speeds reasonable
               p.vx *= 0.995;
               p.vy *= 0.995;

               // wrap
               if (p.x < -20) p.x = w + 20;
               if (p.x > w + 20) p.x = -20;
               if (p.y < -20) p.y = h + 20;
               if (p.y > h + 20) p.y = -20;

               // draw soft bright dot
               ctx.beginPath();
               ctx.fillStyle = `rgba(200,230,255,${Math.min(0.95, p.alpha * 0.9)})`;
               ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
               ctx.fill();

               // Connect to nearby particles:
               // - For performance it only check pairs once (j > i).
               // - If two particles are within `maxDist`, it draws a translucent line between them.
               // - The line alpha decreases with distance so close particles appear more strongly connected.
               for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist2 = dx * dx + dy * dy;
                    const maxDist = 160;
                    if (dist2 < maxDist * maxDist) {
                         // alpha falloff based on distance (normalized)
                         const alpha = (1 - Math.sqrt(dist2) / maxDist) * 0.28;
                         ctx.beginPath();
                         ctx.strokeStyle = `rgba(150,210,255,${alpha})`;
                         ctx.lineWidth = 1.4;
                         ctx.moveTo(p.x, p.y);
                         ctx.lineTo(q.x, q.y);
                         ctx.stroke();
                    }
               }
          }

          requestAnimationFrame(step);
     }

     window.addEventListener('resize', resize);
     requestAnimationFrame(step);
});


