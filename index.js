/* ========================================
   AI-FOCUSED LIGHT THEME — JAVASCRIPT
   Neural Particles · Scroll Reveal · Counters
   ======================================== */

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
    document.body.classList.toggle('menu-open', mobileNav.classList.contains('open'));
    toggle.setAttribute('aria-expanded', mobileNav.classList.contains('open') ? 'true' : 'false');
  });

  mobileNav.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      mobileNav.classList.remove('open');
      toggle.classList.remove('active');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      toggle.classList.remove('active');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
})();

// ---------- HASH PAGE ROUTER ----------
(function initPageRouter() {
  var pageIds = ['hero', 'about', 'group', 'research', 'publications', 'software', 'news', 'openings', 'contact'];
  var pages = pageIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function getCurrentPage() {
    var hash = window.location.hash.replace('#', '');
    return pageIds.indexOf(hash) >= 0 ? hash : 'hero';
  }

  function setActivePage(id) {
    pages.forEach(function (page) {
      page.classList.toggle('page-active', page.id === id);
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var target = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', target === id);
    });

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (id === 'hero') document.dispatchEvent(new CustomEvent('matiq:home-shown'));
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (link) {
      var href = link.getAttribute('href');
      var id = href.replace('#', '');
      if (pageIds.indexOf(id) === -1) return;
      e.preventDefault();
      if (window.location.hash !== href) {
        window.location.hash = id;
      } else {
        setActivePage(id);
      }
    }
  });

  document.addEventListener('matiq:content-ready', function () { setActivePage(getCurrentPage()); });

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


// ---------- HERO SLIDER ----------
// One slide per focus area. Arrows, dots, focus tabs, arrow keys and swipe all
// change slides; it also advances on its own. Each time a slide is shown (or the
// home page is revisited) its drawing animation replays.
(function initHeroSlider() {
  var SLIDE_MS = 7000;
  var index = 0, timer = null, paused = false;

  function el(sel) { return document.querySelector(sel); }
  function all(sel) { return document.querySelectorAll(sel); }

  function show(i) {
    var slides = all('.hero-figure .scene');
    var track = el('.hero-figure .slider-track');
    if (!slides.length || !track) return;
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-100 * index) + '%)';

    slides.forEach(function (slide, k) {
      slide.classList.remove('is-active');
      slide.setAttribute('aria-hidden', k === index ? 'false' : 'true');
      if (k === index) { void slide.offsetWidth; slide.classList.add('is-active'); }
    });
    all('.slider-dot').forEach(function (dot, k) {
      dot.classList.toggle('is-active', k === index);
      dot.setAttribute('aria-current', k === index ? 'true' : 'false');
    });
    all('.focus-tab').forEach(function (tab, k) {
      tab.classList.remove('is-active');
      tab.setAttribute('aria-pressed', k === index ? 'true' : 'false');
      if (k === index) { void tab.offsetWidth; tab.classList.add('is-active'); }
    });

    var count = el('.slider-count');
    if (count) count.textContent = (index + 1) + ' / ' + slides.length;
    var caption = el('.hero-figure .scene-caption');
    if (caption && window.MatIQScenes && window.MatIQScenes[index]) caption.textContent = window.MatIQScenes[index].caption;
    schedule();
  }

  function schedule() {
    window.clearTimeout(timer);
    var hero = document.getElementById('hero');
    if (paused || document.hidden || !hero || !hero.classList.contains('page-active')) return;
    timer = window.setTimeout(function () { show(index + 1); }, SLIDE_MS);
  }

  function setPaused(value) {
    if (value === paused) return;
    paused = value;
    all('.focus-tab').forEach(function (t) { t.classList.toggle('is-paused', paused); });
    schedule();
  }

  document.addEventListener('click', function (e) {
    var target = e.target.closest('.slider-arrow, .slider-dot, .focus-tab');
    if (!target) return;
    if (target.classList.contains('slider-arrow')) show(index + parseInt(target.getAttribute('data-dir'), 10));
    else show(parseInt(target.getAttribute('data-scene'), 10));
  });

  document.addEventListener('keydown', function (e) {
    if (!e.target.closest || !e.target.closest('.hero-figure')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
  });

  // Pause while the pointer is over the figure.
  document.addEventListener('mouseover', function (e) { setPaused(!!e.target.closest('.hero-figure')); });

  // Swipe on touch screens.
  var startX = null;
  document.addEventListener('touchstart', function (e) {
    startX = e.target.closest('.slider-viewport') ? e.touches[0].clientX : null;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  document.addEventListener('matiq:home-shown', function () { show(index); });
  document.addEventListener('matiq:content-ready', function () { show(index); });
  document.addEventListener('visibilitychange', schedule);
})();


// ---------- PUBLICATION DOI FETCHER ----------
(function initPublications() {
  var form = document.getElementById('publicationSearch');
  var input = document.getElementById('publicationQuery');
  var list = document.getElementById('publicationList');
  var status = document.getElementById('publicationStatus');
  if (!form || !input || !list || !status) return;

  var fallbackHTML = list.dataset.curatedHtml || list.innerHTML;
  document.addEventListener('matiq:content-ready', function () {
    fallbackHTML = list.dataset.curatedHtml || list.innerHTML;
  });
  var scholarProfile = 'https://scholar.google.com/citations?hl=en&user=_P6zuNAAAAAJ&view_op=list_works&sortby=pubdate';

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
      status.textContent = 'Showing ' + Math.min(filtered.length, 6) + ' DOI-indexed records from Crossref. Google Scholar does not provide a public browser API; use the profile link for the complete list.';
    } catch (error) {
      list.innerHTML = fallbackHTML;
      status.textContent = 'Live DOI lookup unavailable. Showing curated papers from CV and linking to Google Scholar.';
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
function initModals() {
  var cards = document.querySelectorAll('.research-card[data-modal]');
  var overlays = document.querySelectorAll('.modal-overlay');

  cards.forEach(function (card) {
    if (card.dataset.modalReady === 'true') return;
    card.dataset.modalReady = 'true';
    function openModal() {
      var modalId = card.getAttribute('data-modal');
      var modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        var close = modal.querySelector('.modal-close');
        if (close) close.focus();
      }
    }
    card.addEventListener('click', openModal);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
    });
  });

  document.querySelectorAll('.modal-close').forEach(function (btn) {
    if (btn.dataset.closeReady === 'true') return;
    btn.dataset.closeReady = 'true';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var overlay = btn.closest('.modal-overlay');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  overlays.forEach(function (overlay) {
    if (overlay.dataset.overlayReady === 'true') return;
    overlay.dataset.overlayReady = 'true';
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
}
initModals();
document.addEventListener('matiq:content-ready', initModals);

// Escape key to close modals
(function initModalEscape() {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
        overlay.classList.remove('open');
      });
      document.body.style.overflow = '';
    }
  });
})();
