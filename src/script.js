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

// Intercept topnav 'work' link if it points to work.html and scroll to the embedded section
document.addEventListener('DOMContentLoaded', function() {
     const workLink = document.querySelector('.topnav a[href="work.html"], .topnav a[href="#work"]');
     if (workLink) {
          workLink.addEventListener('click', function(e) {
               // Prevent navigation if it would try to open work.html
               e.preventDefault();
               const target = document.getElementById('work');
               if (target) {
                    // Scroll taking into account the fixed nav; CSS also sets scroll-margin-top
                    const navOffset = 120;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
               }
          });
     }
});

// Pixel trail: create small retro "pixels" that trail and fade continuously
document.addEventListener('DOMContentLoaded', function() {
     const container = document.getElementById('pixel-trail');
     if (!container) return;

     const colors = ['#7DF9FF','#FFD166','#FF6B6B','#B983FF','#6EE7B7'];
     let mouseX = window.innerWidth / 2;
     let mouseY = window.innerHeight / 2;
     let lastTime = performance.now();
     let acc = 0;
     const spawnInterval = 80; // ms between spawns

     window.addEventListener('mousemove', (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
     }, {passive: true});

     window.addEventListener('touchmove', (e) => {
          const t = e.touches && e.touches[0];
          if (t) {
               mouseX = t.clientX;
               mouseY = t.clientY;
          }
     }, {passive: true});

     function spawnDot(x, y) {
          const dot = document.createElement('div');
          dot.className = 'pixel-dot';
          const r = Math.random();
          if (r < 0.18) dot.classList.add('big');
          else if (r < 0.46) dot.classList.add('small');

          dot.style.left = x + 'px';
          dot.style.top = y + 'px';
          dot.style.background = colors[Math.floor(Math.random() * colors.length)];
          container.appendChild(dot);

          requestAnimationFrame(() => {
               dot.style.transform = 'translate(-50%, -50%) scale(0.12)';
               dot.style.opacity = '0';
          });

          setTimeout(() => {
               if (dot.parentNode) dot.parentNode.removeChild(dot);
          }, 700);
     }

     function tick(now) {
          const dt = now - lastTime;
          lastTime = now;
          acc += dt;
          while (acc >= spawnInterval) {
               acc -= spawnInterval;
               spawnDot(mouseX, mouseY);
          }
          requestAnimationFrame(tick);
     }

     requestAnimationFrame(tick);
});

// Amis Drift video controls: play/pause and mute/unmute
document.addEventListener('DOMContentLoaded', function() {
     const video = document.getElementById('amis-video');
     const playBtn = document.getElementById('video-play');
     const muteBtn = document.getElementById('video-mute');
     if (!video || !playBtn || !muteBtn) return;

     // update button icon/state
     function updatePlayButton() {
          if (video.paused) {
               playBtn.classList.remove('playing');
               playBtn.classList.add('paused');
               playBtn.innerHTML = '<i class="fas fa-play"></i>';
          } else {
               playBtn.classList.remove('paused');
               playBtn.classList.add('playing');
               playBtn.innerHTML = '<i class="fas fa-pause"></i>';
          }
     }

     function updateMuteButton() {
          if (video.muted) {
               muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
          } else {
               muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
          }
     }

     // click play button
     playBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (video.paused) video.play(); else video.pause();
          updatePlayButton();
     });

     // click mute button
     muteBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          video.muted = !video.muted;
          updateMuteButton();
     });

     // clicking the video toggles play/pause
     video.addEventListener('click', function() {
          if (video.paused) video.play(); else video.pause();
          updatePlayButton();
     });

     // keep button states in sync
     video.addEventListener('play', updatePlayButton);
     video.addEventListener('pause', updatePlayButton);
     video.addEventListener('volumechange', updateMuteButton);

     // initialize icons
     updatePlayButton();
     updateMuteButton();
});

// Ensure the Amis Drift video attempts to autoplay (muted) when arriving at the page
document.addEventListener('DOMContentLoaded', function() {
     const v = document.getElementById('amis-video');
     if (!v) return;
     // prefer muted autoplay; ensure muted is set then try to play
     v.muted = true;
     const p = v.play();
     if (p && p.catch) p.catch(() => { /* autoplay blocked */ });
});

