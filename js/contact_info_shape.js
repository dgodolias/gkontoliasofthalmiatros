document.addEventListener('DOMContentLoaded', function () {
    adjustBackgroundContainers();

    window.addEventListener('resize', adjustBackgroundContainers);
  });

  function adjustBackgroundContainers() {
    var infoWrap = document.querySelector('.info-wrap');
    var backgroundContainers = document.querySelectorAll('.background-container');

    if (infoWrap) {
      var infoWrapWidth = infoWrap.offsetWidth + 'px'; // Get the width of .info-wrap
      var infoWrapLeftOffset = infoWrap.offsetLeft + 'px'; // Get the left offset of .info-wrap

      backgroundContainers.forEach(function (container, index) {
        container.style.width = infoWrapWidth; // Set the width of each background container
        container.style.position = 'absolute'; // Ensure the containers are positioned absolutely
        container.style.border = '2px solid rgb(232, 235, 235)'; // Add border styling

        // Adjust left and top positions based on index for layering
        switch (index) {
          case 1: // bg1
            container.style.top = 'calc(-10px)'; // Slightly more up
            container.style.left = `calc(${infoWrapLeftOffset} + 10px)`; // Same horizontal position as infoWrap
            break;
          case 0: // bg2
            container.style.top = 'calc(-20px)'; // More up
            container.style.left = `calc(${infoWrapLeftOffset} + 20px)`; // More to the right
            break;
          // Add more cases if there are more background containers
        }
      });
    }
  }
