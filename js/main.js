/* Shared behaviour for every page: mobile menu, scroll-reveal, hover effects,
   scroll-spy on the home page and the click-to-load Google Map. No jQuery. */
(function () {
  document.documentElement.classList.remove('no-js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  // Mobile menu
  var menuBtn = document.querySelector('.mobile-menu-btn');
  var navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  if (!reduceMotion && finePointer) {
    // Magnetic buttons
    document.querySelectorAll('.magnetic-btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0, 0)';
      });
    });

    // Tilt effect on service cards
    document.querySelectorAll('.service-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var rotateX = (e.clientY - rect.top - rect.height / 2) / 20;
        var rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 20;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-15px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // Hero parallax + scroll-spy (home page only)
  var heroContent = document.querySelector('.hero-content');
  var sections = document.querySelectorAll('section[id]');
  var spyLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href^="/#"]');
  var ticking = false;

  function onScroll() {
    var scrolled = window.pageYOffset;
    if (heroContent && !reduceMotion && scrolled < window.innerHeight) {
      heroContent.style.transform = 'translateY(' + (scrolled * 0.4) + 'px)';
      heroContent.style.opacity = 1 - (scrolled / 700);
    }
    if (sections.length && spyLinks.length) {
      var pos = scrolled + 100;
      var activeId = null;
      sections.forEach(function (section) {
        if (pos >= section.offsetTop && pos < section.offsetTop + section.offsetHeight) {
          activeId = section.id;
        }
      });
      spyLinks.forEach(function (link) {
        var target = link.getAttribute('href').replace(/^\//, '');
        link.classList.toggle('active', activeId !== null && scrolled >= 300 && target === '#' + activeId);
      });
    }
    ticking = false;
  }

  if (heroContent || sections.length) {
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
    onScroll();
  }

  // Click-to-load Google Map
  document.querySelectorAll('.map-facade[data-map-src]').forEach(function (facade) {
    var btn = facade.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = facade.getAttribute('data-map-src');
      iframe.title = 'Χάρτης Google: ' + (facade.getAttribute('data-map-title') || 'Ιατρείο');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      facade.parentNode.replaceChild(iframe, facade);
    });
  });
})();
