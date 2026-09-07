/* Data-driven content renderer for the Mat-IQ website.
   Routine updates live in data/*.json. The website keeps HTML fallbacks so it still
   reads well if JavaScript or local fetch is unavailable. */
(function () {
  function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char];
    });
  }

  function safeInlineSVG(svg) {
    svg = String(svg || '').trim();
    if (!svg) return '';
    // Keep this intentionally conservative: JSON is local, but avoid rendering scripts/events.
    if (!/^<svg[\s>]/i.test(svg)) return '';
    if (/<script|on\w+=|javascript:/i.test(svg)) return '';
    return svg;
  }

  async function loadJSON(path) {
    const response = await fetch(path, { cache: 'no-cache' });
    if (!response.ok) throw new Error('Could not load ' + path);
    return response.json();
  }

  function showLoadError(path, error) {
    var map = {
      'data/site.json': ['hero-data', 'about-data', 'career-data', 'impact-data', 'join-data', 'contact-data'],
      'data/people.json': ['people-pi'],
      'data/research.json': ['research-grid-data'],
      'data/publications.json': ['publicationList'],
      'data/software.json': ['software-grid-data'],
      'data/news.json': ['news-list-data'],
      'data/openings.json': ['openings-list-data']
    };
    (map[path] || []).forEach(function (id) {
      var target = document.getElementById(id);
      if (target && (!target.children.length || target.querySelector('.content-loading'))) {
        target.innerHTML = '<div class="content-error glass-card"><strong>Content could not be loaded.</strong><span>Serve this folder through a web server so the browser can read ' + escapeHTML(path) + '.</span></div>';
      }
    });
    console.error('[Mat-IQ] Failed to load ' + path, error);
  }

  function loadAndRender(path, renderer) {
    return loadJSON(path).then(renderer).catch(function (error) {
      showLoadError(path, error);
      throw error;
    });
  }

  function linkAttrs(url) {
    return /^https?:/i.test(url || '') ? ' target="_blank" rel="noopener"' : '';
  }

  function renderSite(site) {
    var links = (site.navigation || []).map(function (item) {
      return '<a href="#' + escapeHTML(item.target) + '">' + escapeHTML(item.label) + '</a>';
    }).join('');
    ['navLinks', 'mobileNav'].forEach(function (id) {
      var target = document.getElementById(id); if (target) target.innerHTML = links;
    });

    var hero = site.hero || {};
    var pillars = (hero.pillars || []).map(function (item) { return '<div class="pillar liquid-glass"><span class="pillar-icon">' + escapeHTML(item.icon) + '</span><h4>' + escapeHTML(item.title) + '</h4><p>' + escapeHTML(item.text) + '</p></div>'; }).join('');
    var actions = (hero.actions || []).map(function (item) { return '<a href="' + escapeHTML(item.url) + '" class="btn-' + escapeHTML(item.style) + '">' + escapeHTML(item.label) + '</a>'; }).join('');
    var socials = (hero.socials || []).map(function (item) { return '<a href="' + escapeHTML(item.url) + '"' + linkAttrs(item.url) + ' aria-label="' + escapeHTML(item.label) + '"><span>' + escapeHTML(item.mark) + '</span></a>'; }).join('');
    var heroTarget = document.getElementById('hero-data');
    if (heroTarget) heroTarget.innerHTML = '<div class="hero-title-block"><h1><span class="hero-name">' + escapeHTML(hero.title) + '</span></h1></div><div class="hero-bottom"><div class="hero-content liquid-glass hero-glass"><p class="hero-subname">' + escapeHTML(hero.eyebrow) + '</p><p class="hero-tagline">' + escapeHTML(hero.tagline) + '</p><div class="hero-pillars">' + pillars + '</div><div class="hero-cta">' + actions + '</div><div class="hero-social">' + socials + '</div></div></div>';

    var about = site.about || {};
    var paragraphs = (about.paragraphs || []).map(function (p, i) { return '<p' + (i === 0 ? ' class="about-lead"' : '') + '>' + escapeHTML(p) + '</p>'; }).join('');
    var highlights = (about.highlights || []).map(function (item) { return '<div class="highlight-card glass-card"><div class="highlight-icon">' + escapeHTML(item.icon) + '</div><h3>' + escapeHTML(item.title) + '</h3><p><strong>' + escapeHTML(item.main) + '</strong></p><p class="subtle">' + escapeHTML(item.detail) + '</p></div>'; }).join('');
    var aboutTarget = document.getElementById('about-data');
    if (aboutTarget) aboutTarget.innerHTML = '<div class="section-header"><span class="section-tag">' + escapeHTML(about.tag) + '</span><h2>' + escapeHTML(about.title) + '</h2></div><div class="about-grid"><div class="about-text">' + paragraphs + '</div><div class="about-highlights">' + highlights + '</div></div>';

    var careerTarget = document.getElementById('career-data');
    if (careerTarget) careerTarget.innerHTML = '<div class="career-path"><div class="section-header compact-header"><span class="section-tag">Career Path</span><h2>Research Journey</h2></div><div class="timeline"><div class="timeline-track"></div>' + (site.career || []).map(function (item) { return '<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content glass-card"><span class="timeline-year">' + escapeHTML(item.year) + '</span><h3>' + escapeHTML(item.title) + '</h3><p>' + escapeHTML(item.text) + '</p></div></div>'; }).join('') + '</div></div>';

    var impact = site.impact || {}, impactTarget = document.getElementById('impact-data');
    if (impactTarget) impactTarget.innerHTML = (impact.metrics || []).map(function (item) { return '<div class="impact-stat"><span class="big-number">' + escapeHTML(item.value) + '</span><span>' + escapeHTML(item.label) + '</span></div>'; }).join('') + (impact.button ? '<a href="' + escapeHTML(impact.button.url) + '" class="btn-primary"' + linkAttrs(impact.button.url) + '>' + escapeHTML(impact.button.label) + '</a>' : '');

    var join = site.join || {}, joinTarget = document.getElementById('join-data');
    if (joinTarget) joinTarget.innerHTML = '<div class="join-cta glass-card"><h3>' + escapeHTML(join.title) + '</h3><p>' + escapeHTML(join.text) + '</p><div class="join-perks">' + (join.perks || []).map(function (item) { return '<div class="perk liquid-glass"><div class="perk-icon">' + escapeHTML(item.icon) + '</div><h4>' + escapeHTML(item.title) + '</h4><p>' + escapeHTML(item.text) + '</p></div>'; }).join('') + '</div><div class="join-action"><a href="#contact" class="btn-primary">Get in Touch →</a></div></div><p class="openings-disclaimer">' + escapeHTML(join.disclaimer) + '</p>';

    var contact = site.contact || {}, contactTarget = document.getElementById('contact-data');
    if (contactTarget) contactTarget.innerHTML = '<div class="section-header"><span class="section-tag">' + escapeHTML(contact.tag) + '</span><h2>' + escapeHTML(contact.title) + '</h2><p class="section-subtitle">' + escapeHTML(contact.subtitle) + '</p></div><div class="contact-grid">' + (contact.links || []).map(function (item) { var tag = item.url ? 'a' : 'div'; return '<' + tag + (item.url ? ' href="' + escapeHTML(item.url) + '"' + linkAttrs(item.url) : '') + ' class="contact-card glass-card"><span class="contact-mark">' + escapeHTML(item.mark) + '</span><h3>' + escapeHTML(item.label) + '</h3><span>' + escapeHTML(item.value) + '</span></' + tag + '>'; }).join('') + '</div>';
    var footerTarget = document.getElementById('footer-data');
    if (footerTarget && site.footer) footerTarget.innerHTML = '<span>' + escapeHTML(site.footer.copyright) + '</span><span class="footer-made">' + escapeHTML(site.footer.note) + '</span>';
  }

  function imageOrInitials(item, className) {
    if (item.photo) {
      return '<img class="group-photo ' + className + '" src="' + escapeHTML(item.photo) + '" alt="' + escapeHTML(item.name) + '">';
    }
    return '<div class="group-avatar ' + className + '">' + escapeHTML(item.initials || (item.name || '?').slice(0, 2)) + '</div>';
  }

  function personCard(person) {
    const isPi = person.section === 'pi';
    const isStudent = person.section === 'student';
    const isAlumni = person.section === 'alumni';
    const cardClass = isPi ? ' pi-card' : (isStudent ? ' student-card' : (isAlumni ? ' alumni-card' : ''));
    const avatarClass = isPi ? 'pi-avatar' : (isStudent ? 'student-avatar' : (isAlumni ? 'alumni-avatar' : ''));
    const details = (person.details || []).map(function (line) { return '<p>' + escapeHTML(line) + '</p>'; }).join('');
    return [
      '<div class="group-card glass-card' + cardClass + '">',
      imageOrInitials(person, avatarClass),
      '<div class="group-info">',
      '<h3>' + escapeHTML(person.name) + '</h3>',
      '<span class="group-role">' + escapeHTML(person.role || person.title) + '</span>',
      person.title && person.role !== person.title ? '<p>' + escapeHTML(person.title) + '</p>' : '',
      person.dates ? '<p class="stay-date">' + escapeHTML(person.dates) + '</p>' : '',
      details,
      '</div></div>'
    ].join('');
  }

  function renderPeople(people) {
    const pi = people.filter(function (p) { return p.section === 'pi'; });
    const postdocs = people.filter(function (p) { return p.section === 'postdoc'; });
    const students = people.filter(function (p) { return p.section === 'student'; });
    const alumni = people.filter(function (p) { return p.section === 'alumni'; });
    const piTarget = document.getElementById('people-pi');
    const postdocTarget = document.getElementById('people-postdocs');
    const studentTarget = document.getElementById('people-students');
    const alumniTarget = document.getElementById('people-alumni');
    if (piTarget) piTarget.innerHTML = pi.map(personCard).join('');
    if (postdocTarget) postdocTarget.innerHTML = postdocs.map(personCard).join('');
    if (studentTarget) studentTarget.innerHTML = students.map(personCard).join('');
    if (alumniTarget && alumni.length) alumniTarget.innerHTML = alumni.map(personCard).join('');
  }

  function researchCard(item) {
    const tags = (item.tags || []).map(function (tag) { return '<span>' + escapeHTML(tag) + '</span>'; }).join('');
    const icon = safeInlineSVG(item.iconSvg) || escapeHTML(item.icon || '✦');
    return [
      '<div class="research-card" data-tilt data-modal="' + escapeHTML(item.id) + '">',
      '<div class="card-glow"></div>',
      '<div class="card-icon ai-card-icon">' + icon + '</div>',
      '<h3>' + escapeHTML(item.title) + '</h3>',
      '<p>' + escapeHTML(item.summary) + '</p>',
      '<div class="card-tags">' + tags + '</div>',
      '<span class="card-cta">Learn more →</span>',
      '</div>'
    ].join('');
  }

  function researchModal(item) {
    return [
      '<div class="modal-overlay" id="' + escapeHTML(item.id) + '">',
      '<div class="modal-content glass-card">',
      '<button class="modal-close" aria-label="Close">&times;</button>',
      '<h2>' + escapeHTML(item.title) + '</h2>',
      item.body || '',
      '<a href="https://scholar.google.com/citations?hl=en&user=_P6zuNAAAAAJ&view_op=list_works&sortby=pubdate" target="_blank" rel="noopener" class="btn-primary">View Publications →</a>',
      '</div></div>'
    ].join('');
  }

  function renderResearch(items) {
    const grid = document.getElementById('research-grid-data');
    const modals = document.getElementById('research-modals-data');
    if (grid) grid.innerHTML = items.map(researchCard).join('');
    if (modals) modals.innerHTML = items.map(researchModal).join('');
  }

  function publicationCard(pub) {
    const links = (pub.links || []).map(function (link) {
      return '<a href="' + escapeHTML(link.url) + '" target="_blank" rel="noopener">' + escapeHTML(link.label) + '</a>';
    }).join('');
    return [
      '<article class="publication-card">',
      '<span class="publication-year">' + escapeHTML(pub.year) + '</span>',
      '<h4>' + escapeHTML(pub.title) + '</h4>',
      '<p>' + escapeHTML(pub.authors) + '</p>',
      '<p>' + escapeHTML(pub.venue) + '</p>',
      '<div class="publication-links">' + links + '</div>',
      '</article>'
    ].join('');
  }

  function renderPublications(publications) {
    const target = document.getElementById('publicationList');
    if (target && publications.length) {
      target.innerHTML = publications.map(publicationCard).join('');
      target.dataset.curatedHtml = target.innerHTML;
      var status = document.getElementById('publicationStatus');
      if (status) status.textContent = 'Showing ' + publications.length + ' curated papers loaded from data/publications.json.';
    }
  }

  function renderSoftware(items) {
    const target = document.getElementById('software-grid-data');
    if (!target) return;
    target.innerHTML = items.map(function (item) {
      const image = item.image ? '<img class="software-image" src="' + escapeHTML(item.image) + '" alt="' + escapeHTML(item.name) + '">' : '';
      return [
        '<a href="' + escapeHTML(item.url) + '" target="_blank" rel="noopener" class="software-card glass-card">',
        image,
        '<h3>' + escapeHTML(item.name) + '</h3>',
        '<p>' + escapeHTML(item.description) + '</p>',
        '<span class="software-tag">' + escapeHTML(item.tag) + '</span>',
        '</a>'
      ].join('');
    }).join('');
  }

  function renderNews(items) {
    const target = document.getElementById('news-list-data');
    if (!target) return;
    target.innerHTML = items.map(function (item) {
      const image = item.image ? '<img class="news-image" src="' + escapeHTML(item.image) + '" alt="' + escapeHTML(item.title) + '">' : '';
      return [
        '<article class="news-card glass-card">',
        image,
        '<span class="section-tag compact-tag">' + escapeHTML(item.tag || 'News') + ' · ' + escapeHTML(item.date) + '</span>',
        '<h3>' + escapeHTML(item.title) + '</h3>',
        '<p>' + escapeHTML(item.excerpt || '') + '</p>',
        '</article>'
      ].join('');
    }).join('');
  }


  function openingItem(item) {
    if (typeof item === 'string') {
      return '<li>' + escapeHTML(item) + '</li>';
    }
    if (item && item.url) {
      return '<li><a href="' + escapeHTML(item.url) + '" target="_blank" rel="noopener">' + escapeHTML(item.text || item.label || item.url) + '</a></li>';
    }
    return '<li>' + escapeHTML((item && (item.text || item.label)) || '') + '</li>';
  }

  function openingJob(job) {
    const items = (job.items || []).map(openingItem).join('');
    const button = job.buttonUrl ? '<a class="opening-link" href="' + escapeHTML(job.buttonUrl) + '"' + linkAttrs(job.buttonUrl) + '>' + escapeHTML(job.buttonLabel || 'Learn more') + '</a>' : '';
    return [
      '<article class="opening-card glass-card">',
      job.status ? '<div class="opening-status">' + escapeHTML(job.status) + '</div>' : '',
      '<h3>' + escapeHTML(job.title) + '</h3>',
      items ? '<ul>' + items + '</ul>' : '',
      job.note ? '<p class="opening-note">' + escapeHTML(job.note) + '</p>' : '',
      button,
      '</article>'
    ].join('');
  }

  function openingRow(section) {
    const jobs = (section.jobs || []).map(openingJob).join('');
    return [
      '<div class="opening-row" id="opening-' + escapeHTML(section.id || section.category || '') + '">',
      '<div class="opening-row-header">',
      '<div class="opening-level">' + escapeHTML(section.category) + '</div>',
      '<h3>' + escapeHTML(section.headline || section.category) + '</h3>',
      section.description ? '<p>' + escapeHTML(section.description) + '</p>' : '',
      '</div>',
      '<div class="opening-row-jobs">' + jobs + '</div>',
      '</div>'
    ].join('');
  }

  function renderOpenings(items) {
    const target = document.getElementById('openings-list-data');
    if (!target || !items.length) return;
    target.innerHTML = items.map(openingRow).join('');
  }

  window.MatIQContent = { loadJSON, renderSite, renderPeople, renderResearch, renderPublications, renderSoftware, renderNews, renderOpenings };

  document.addEventListener('DOMContentLoaded', function () {
    Promise.allSettled([
      loadAndRender('data/site.json', renderSite),
      loadAndRender('data/people.json', renderPeople),
      loadAndRender('data/research.json', renderResearch),
      loadAndRender('data/publications.json', renderPublications),
      loadAndRender('data/software.json', renderSoftware),
      loadAndRender('data/news.json', renderNews),
      loadAndRender('data/openings.json', renderOpenings)
    ]).then(function () {
      document.dispatchEvent(new CustomEvent('matiq:content-ready'));
    });
  });
})();
