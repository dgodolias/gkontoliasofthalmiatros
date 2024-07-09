const images = document.querySelectorAll('.carousel img');
const totalDuration = 4.3; // in seconds (adjust as needed)
const enterTransitionDuration = 4; // in seconds (adjust as needed)
const exitTransitionDuration = 4; // in seconds (adjust as needed)
const overlapDuration = 4; // in seconds (adjust as needed) - Time during which both images are transitioning

// Set initial styles for all images
images.forEach((img, index) => {
  img.style.opacity = 0;
  img.style.transition = `opacity ${enterTransitionDuration}s ease-in-out, transform ${enterTransitionDuration}s ease-in-out`;
  img.style.transform = 'translateX(100%) scale(0.5)';
});

// Function to show the next image
let currentImageIndex = 0;
function showNextImage() {
  // Hide the current image with a faster transition
  images[currentImageIndex].style.transition = `opacity ${exitTransitionDuration}s ease-in-out, transform ${exitTransitionDuration}s ease-in-out`;
  images[currentImageIndex].style.opacity = 0;
  images[currentImageIndex].style.transform = 'translateX(-100%) scale(0.5)';

  // Prepare the next image to come from the right with a slower transition
  let nextImageIndex = (currentImageIndex + 1) % images.length;

  // Reset the next image to be off-screen to the right
  images[nextImageIndex].style.transition = 'none';
  images[nextImageIndex].style.transform = 'translateX(100%) scale(0.5)';
  images[nextImageIndex].style.opacity = 0;
  
  // Force a reflow to apply the reset position immediately
  images[nextImageIndex].offsetHeight; // This forces a reflow

  // Show the next image slightly before the current image completely leaves
  setTimeout(() => {
    images[nextImageIndex].style.transition = `opacity ${enterTransitionDuration}s ease-in-out, transform ${enterTransitionDuration}s ease-in-out`;
    images[nextImageIndex].style.opacity = 1;
    images[nextImageIndex].style.transform = 'translateX(0) scale(1)';
  }, (exitTransitionDuration - overlapDuration) * 1000);

  currentImageIndex = nextImageIndex;
}

// Show the first image initially
images[0].style.opacity = 1;
images[0].style.transform = 'translateX(0) scale(1)';

// Start the animation loop
setInterval(showNextImage, totalDuration * 1000);
