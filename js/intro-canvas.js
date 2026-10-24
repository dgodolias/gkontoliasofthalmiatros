/* Animated background (three stacked canvases). Plain JavaScript, no jQuery.
   Skips entirely when the visitor prefers reduced motion, pauses while the
   tab is hidden, and draws fewer shapes on phones. */
(function () {
  var bg = document.getElementById('bg');
  if (!bg) return;
  var canvas = Array.prototype.slice.call(bg.querySelectorAll('canvas'));
  if (canvas.length < 3 || !canvas[0].getContext) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bg.style.background = 'linear-gradient(135deg, #0e4d64, #1883a8)';
    return;
  }

  var background = canvas[0],
    foreground1 = canvas[1],
    foreground2 = canvas[2],
    small = window.innerWidth < 768,
    config = {
      circle: { amount: small ? 9 : 18, layer: 3, color: [157, 97, 207], alpha: 0.3 },
      line: { amount: small ? 6 : 12, layer: 3, color: [255, 255, 255], alpha: 0.3 },
      speed: 0.5,
      angle: 20
    };

  var bctx = background.getContext('2d'),
    fctx1 = foreground1.getContext('2d'),
    fctx2 = foreground2.getContext('2d'),
    M = window.Math,
    degree = config.angle / 360 * M.PI * 2,
    circles = [],
    lines = [],
    wWidth, wHeight, timer;

  var setCanvasHeight = function () {
    wWidth = window.innerWidth;
    wHeight = window.innerHeight;
    canvas.forEach(function (c) {
      c.width = wWidth;
      c.height = wHeight;
    });
  };

  var drawCircle = function (x, y, radius, color, alpha) {
    var gradient = fctx1.createRadialGradient(x, y, radius, x, y, 0);
    gradient.addColorStop(0, 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + alpha + ')');
    gradient.addColorStop(1, 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (alpha - 0.1) + ')');
    fctx1.beginPath();
    fctx1.arc(x, y, radius, 0, M.PI * 2, true);
    fctx1.fillStyle = gradient;
    fctx1.fill();
  };

  var drawLine = function (x, y, width, color, alpha) {
    var endX = x + M.sin(degree) * width,
      endY = y - M.cos(degree) * width,
      gradient = fctx2.createLinearGradient(x, y, endX, endY);
    gradient.addColorStop(0, 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + alpha + ')');
    gradient.addColorStop(1, 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (alpha - 0.1) + ')');
    fctx2.beginPath();
    fctx2.moveTo(x, y);
    fctx2.lineTo(endX, endY);
    fctx2.lineWidth = 3;
    fctx2.lineCap = 'round';
    fctx2.strokeStyle = gradient;
    fctx2.stroke();
  };

  var drawBack = function () {
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.clearRect(0, 0, wWidth, wHeight);
    var gradient = [];

    gradient[0] = bctx.createRadialGradient(wWidth * 0.3, wHeight * 0.1, 0, wWidth * 0.3, wHeight * 0.1, wWidth * 0.9);
    gradient[0].addColorStop(0, 'rgb(0, 26, 77)');
    gradient[0].addColorStop(1, 'transparent');
    bctx.translate(wWidth, 0);
    bctx.scale(-1, 1);
    bctx.beginPath();
    bctx.fillStyle = gradient[0];
    bctx.fillRect(0, 0, wWidth, wHeight);

    gradient[1] = bctx.createRadialGradient(wWidth * 0.1, wHeight * 0.1, 0, wWidth * 0.3, wHeight * 0.1, wWidth);
    gradient[1].addColorStop(0, 'rgb(0, 150, 240)');
    gradient[1].addColorStop(0.8, 'transparent');
    bctx.translate(wWidth, 0);
    bctx.scale(-1, 1);
    bctx.beginPath();
    bctx.fillStyle = gradient[1];
    bctx.fillRect(0, 0, wWidth, wHeight);

    gradient[2] = bctx.createRadialGradient(wWidth * 0.1, wHeight * 0.5, 0, wWidth * 0.1, wHeight * 0.5, wWidth * 0.5);
    gradient[2].addColorStop(0, 'rgb(40, 20, 105)');
    gradient[2].addColorStop(1, 'transparent');
    bctx.beginPath();
    bctx.fillStyle = gradient[2];
    bctx.fillRect(0, 0, wWidth, wHeight);
  };

  var animate = function () {
    var sin = M.sin(degree),
      cos = M.cos(degree), i, len, item, x, y;

    fctx1.clearRect(0, 0, wWidth, wHeight);
    for (i = 0, len = circles.length; i < len; i++) {
      item = circles[i];
      x = item.x;
      y = item.y;
      if (x > wWidth + item.radius) x = -item.radius;
      else if (x < -item.radius) x = wWidth + item.radius;
      else x += sin * item.speed;
      if (y > wHeight + item.radius) y = -item.radius;
      else if (y < -item.radius) y = wHeight + item.radius;
      else y -= cos * item.speed;
      item.x = x;
      item.y = y;
      drawCircle(x, y, item.radius, item.color, item.alpha);
    }

    fctx2.clearRect(0, 0, wWidth, wHeight);
    for (i = 0, len = lines.length; i < len; i++) {
      item = lines[i];
      x = item.x;
      y = item.y;
      if (x > wWidth + item.width * sin) x = -item.width * sin;
      else if (x < -item.width * sin) x = wWidth + item.width * sin;
      else x += sin * item.speed;
      if (y > wHeight + item.width * cos) y = -item.width * cos;
      else if (y < -item.width * cos) y = wHeight + item.width * cos;
      else y -= cos * item.speed;
      item.x = x;
      item.y = y;
      drawLine(x, y, item.width, item.color, item.alpha);
    }

    timer = window.requestAnimationFrame(animate);
  };

  var createItem = function () {
    circles = [];
    lines = [];
    var i, j;
    for (i = 0; i < config.circle.amount / config.circle.layer; i++) {
      for (j = 0; j < config.circle.layer; j++) {
        circles.push({
          x: M.random() * wWidth,
          y: M.random() * wHeight,
          radius: M.random() * (20 + j * 5) + (20 + j * 5),
          color: config.circle.color,
          alpha: M.random() * 0.2 + (config.circle.alpha - j * 0.1),
          speed: config.speed * (1 + j * 0.5)
        });
      }
    }
    for (i = 0; i < config.line.amount / config.line.layer; i++) {
      for (j = 0; j < config.line.layer; j++) {
        lines.push({
          x: M.random() * wWidth,
          y: M.random() * wHeight,
          width: M.random() * (20 + j * 5) + (20 + j * 5),
          color: config.line.color,
          alpha: M.random() * 0.2 + (config.line.alpha - j * 0.1),
          speed: config.speed * (1 + j * 0.5)
        });
      }
    }
    window.cancelAnimationFrame(timer);
    timer = window.requestAnimationFrame(animate);
    drawBack();
  };

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      setCanvasHeight();
      createItem();
    }, 150);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      window.cancelAnimationFrame(timer);
    } else {
      window.cancelAnimationFrame(timer);
      timer = window.requestAnimationFrame(animate);
    }
  });

  setCanvasHeight();
  createItem();
})();
