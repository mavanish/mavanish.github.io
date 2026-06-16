/* ========================================
   AI-FOCUSED LIGHT THEME — JAVASCRIPT
   Neural Particles · Scroll Reveal · Counters
   ======================================== */

// ---------- PARTICLE SYSTEM (Light Theme - Neural Network) ----------
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles, mouse;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  mouse = { x: -1000, y: -1000 };

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function Particle() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.radius = Math.random() * 2 + 0.5;
    this.opacity = Math.random() * 0.3 + 0.1;
  }

  function createParticles() {
    var count = Math.floor((w * h) / 14000);
    count = Math.min(count, 150);
    count = Math.max(count, 35);
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawLine(p1, p2, dist) {
    var maxDist = 150;
    if (dist > maxDist) return;
    var alpha = (1 - dist / maxDist) * 0.12;
    ctx.strokeStyle = 'rgba(0,102,255,' + alpha + ')';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // mouse interaction
      var dx = p.x - mouse.x;
      var dy = p.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x += dx * 0.012;
        p.y += dy * 0.012;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,102,255,' + p.opacity + ')';
      ctx.fill();

      // connections (neural network look)
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var ddx = p.x - p2.x;
        var ddy = p.y - p2.y;
        var d = Math.sqrt(ddx * ddx + ddy * ddy);
        drawLine(p, p2, d);
      }
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', function () {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  frame();
})();


// ---------- NAVBAR SCROLL ----------
(function initNavbar() {
  var navbar = document.getElementById('navbar');
  var lastY = 0;
  window.addEventListener('scroll', function () {
    var y = window.pageYOffset;
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastY = y;
  });
})();


// ---------- MOBILE NAV ----------
(function initMobileNav() {
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', function () {
    mobileNav.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  var links = mobileNav.querySelectorAll('a');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
})();

// ---------- HASH PAGE ROUTER ----------
(function initPageRouter() {
  var pageIds = ['hero', 'about', 'group', 'research', 'publications', 'software', 'openings', 'contact'];
  var pages = pageIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = document.querySelectorAll('a[href^="#"]');

  function getCurrentPage() {
    var hash = window.location.hash.replace('#', '');
    return pageIds.indexOf(hash) >= 0 ? hash : 'hero';
  }

  function setActivePage(id) {
    pages.forEach(function (page) {
      page.classList.toggle('page-active', page.id === id);
    });

    navLinks.forEach(function (link) {
      var target = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', target === id);
    });

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      var id = href.replace('#', '');
      if (pageIds.indexOf(id) === -1) return;
      e.preventDefault();
      if (window.location.hash !== href) {
        window.location.hash = id;
      } else {
        setActivePage(id);
      }
    });
  });

  window.addEventListener('hashchange', function () {
    setActivePage(getCurrentPage());
  });

  setActivePage(getCurrentPage());
})();

// ---------- SCROLL REVEAL ----------
(function initReveal() {
  var targets = document.querySelectorAll(
    '.section-header, .about-grid, .research-card, .impact-banner, .timeline-item, ' +
    '.software-card, .group-card, .opening-card, .contact-card, .ai-method-banner, .career-path'
  );
  targets.forEach(function (el) {
    el.classList.add('reveal');
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();


// ---------- COUNTER ANIMATION ----------
(function initCounters() {
  var counters = document.querySelectorAll('.stat-number');
  var hasRun = false;

  function animateCounters() {
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // easeOutExpo
        var ease = 1 - Math.pow(2, -10 * progress);
        var current = Math.floor(ease * target);
        el.textContent = current.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(step);
    });
  }

  var hero = document.getElementById('hero');
  if (!hero) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          animateCounters();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(hero);
})();


// ---------- TILT EFFECT ON RESEARCH CARDS ----------
(function initTilt() {
  var cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rotateX = ((y - cy) / cy) * -3;
      var rotateY = ((x - cx) / cx) * 3;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
})();


// ---------- PUBLICATION DOI FETCHER ----------
(function initPublications() {
  var form = document.getElementById('publicationSearch');
  var input = document.getElementById('publicationQuery');
  var list = document.getElementById('publicationList');
  var status = document.getElementById('publicationStatus');
  if (!form || !input || !list || !status) return;

  var fallbackHTML = list.innerHTML;
  var scholarProfile = 'https://scholar.google.com/citations?user=_P6zuNAAAAAJ&hl=en';

  function text(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[char];
    });
  }

  function getYear(item) {
    var date = item.published || item['published-print'] || item['published-online'] || item.issued;
    return date && date['date-parts'] && date['date-parts'][0] ? date['date-parts'][0][0] : 'Recent';
  }

  function authorLine(authors) {
    if (!authors || !authors.length) return 'Avanish Mishra and collaborators';
    return authors.slice(0, 5).map(function (author) {
      return [author.given, author.family].filter(Boolean).join(' ');
    }).join(', ') + (authors.length > 5 ? ' et al.' : '');
  }

  function authorMatches(item) {
    var authors = item.author || [];
    return authors.some(function (author) {
      var family = (author.family || '').toLowerCase();
      var given = (author.given || '').toLowerCase();
      return family.indexOf('mishra') >= 0 && (given.indexOf('avanish') >= 0 || given === 'a' || given.indexOf('a.') === 0);
    });
  }

  function cardHTML(item) {
    var title = text((item.title && item.title[0]) || 'Untitled publication');
    var year = text(getYear(item));
    var authors = text(authorLine(item.author));
    var doi = item.DOI ? String(item.DOI) : '';
    var doiURL = doi ? 'https://doi.org/' + encodeURIComponent(doi) : '';
    var scholarURL = 'https://scholar.google.com/scholar?q=' + encodeURIComponent(title.replace(/&amp;/g, '&'));
    var container = item['container-title'] && item['container-title'][0] ? text(item['container-title'][0]) : 'DOI indexed record';

    return [
      '<article class="publication-card">',
      '<span class="publication-year">' + year + '</span>',
      '<h4>' + title + '</h4>',
      '<p>' + authors + '</p>',
      '<p>' + container + '</p>',
      '<div class="publication-links">',
      doiURL ? '<a href="' + doiURL + '" target="_blank" rel="noopener">DOI</a>' : '',
      '<a href="' + scholarURL + '" target="_blank" rel="noopener">Scholar</a>',
      '<a href="' + scholarProfile + '" target="_blank" rel="noopener">Profile</a>',
      '</div>',
      '</article>'
    ].join('');
  }

  function looksLikeDOI(query) {
    return /^10\.\d{4,9}\/\S+$/i.test(query.trim());
  }

  async function fetchPublications(query) {
    status.textContent = 'Loading DOI metadata...';
    list.classList.add('loading');

    try {
      var url;
      if (looksLikeDOI(query)) {
        url = 'https://api.crossref.org/works/' + encodeURIComponent(query.trim());
      } else {
        url = 'https://api.crossref.org/works?query=' + encodeURIComponent(query) +
          '&query.author=' + encodeURIComponent('Avanish Mishra') +
          '&rows=12&sort=published&order=desc';
      }

      var controller = new AbortController();
      var timeout = window.setTimeout(function () {
        controller.abort();
      }, 4500);

      var response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      window.clearTimeout(timeout);
      if (!response.ok) throw new Error('Crossref request failed');

      var data = await response.json();
      var items = looksLikeDOI(query) ? [data.message] : (data.message.items || []);
      var filtered = items.filter(authorMatches);
      if (!filtered.length && looksLikeDOI(query)) filtered = items;
      if (!filtered.length) throw new Error('No matching DOI records');

      list.innerHTML = filtered.slice(0, 6).map(cardHTML).join('');
      status.textContent = 'Showing ' + Math.min(filtered.length, 6) + ' DOI-indexed records from Crossref.';
    } catch (error) {
      list.innerHTML = fallbackHTML;
      status.textContent = 'Live DOI lookup unavailable. Showing curated papers from CV.';
    } finally {
      list.classList.remove('loading');
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    fetchPublications(input.value.trim() || 'Avanish Mishra materials science');
  });
})();


// ---------- RESEARCH MODALS ----------
(function initModals() {
  var cards = document.querySelectorAll('.research-card[data-modal]');
  var overlays = document.querySelectorAll('.modal-overlay');

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var modalId = card.getAttribute('data-modal');
      var modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var overlay = btn.closest('.modal-overlay');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Click overlay background to close
  overlays.forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Escape key to close
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      overlays.forEach(function (overlay) {
        overlay.classList.remove('open');
      });
      document.body.style.overflow = '';
    }
  });
})();
