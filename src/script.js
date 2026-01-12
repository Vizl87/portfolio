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


