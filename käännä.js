let angle = 0; // Starting rotation angle
let speed = 30; // Initial speed (degrees per frame)
let accelerating = false;
let rotate = false;
 // Tracks if the spacebar is being held

// Listen for keydown and keyup events
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    accelerating = true; // Start accelerating when spacebar is pressed
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    accelerating = false; // Stop accelerating when spacebar is released
    speed = 30; // Reset to initial speed
  }
});

function rotateSite() {
  if (accelerating) {
      speed += 2; // Increase speed while spacebar is held
  }
  angle += speed; // Apply the current speed to the rotation angle
  document.body.style.transform = `rotate(${angle}deg)`; // Rotate the site
  requestAnimationFrame(rotateSite); // Smoothly animate the rotation
}

// Start the rotation
rotateSite();
