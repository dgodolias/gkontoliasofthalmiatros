/* Hero photo crossfade. The first image is marked .is-active in the HTML so
   it shows before this script runs; the rest are lazy-loaded. */
(function () {
  var images = document.querySelectorAll('.carousel .carousel-image');
  if (images.length < 2) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var current = 0;
  setInterval(function () {
    images[current].classList.remove('is-active');
    current = (current + 1) % images.length;
    images[current].classList.add('is-active');
  }, 5000);
})();
