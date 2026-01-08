const images = document.querySelectorAll('.carousel img');
const totalDuration = 5; // in seconds
const fadeDuration = 1.5; // in seconds

// Set initial styles for all images - ONLY opacity, NO transform
images.forEach((img, index) => {
  img.style.opacity = 0;
  img.style.transition = `opacity ${fadeDuration}s ease-in-out`;
  img.style.position = 'absolute';
  img.style.top = '0';
  img.style.left = '0';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
});

// Show the first image immediately
images[0].style.opacity = 1;

// Function to show the next image with crossfade
let currentImageIndex = 0;
function showNextImage() {
  // Fade out current image
  images[currentImageIndex].style.opacity = 0;
  
  // Get next index
  let nextImageIndex = (currentImageIndex + 1) % images.length;
  
  // Fade in next image
  images[nextImageIndex].style.opacity = 1;
  
  currentImageIndex = nextImageIndex;
}

// Start the animation loop
setInterval(showNextImage, totalDuration * 1000);