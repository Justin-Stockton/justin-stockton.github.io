(function () {
  var map = document.querySelector('[data-article-map]');
  var article = document.querySelector('#article-body');
  if (!map || !article) return;

  var headings = Array.prototype.slice.call(article.querySelectorAll('h2, h3'));
  if (!headings.length) return;

  var list = map.querySelector('[data-article-map-list]');
  var toggle = map.querySelector('[data-article-map-toggle]');
  var current = map.querySelector('[data-article-map-current]');
  var articleTitle = document.querySelector('h1').textContent.trim();
  var usedIds = {};

  function addLink(id, text, className) {
    var item = document.createElement('li');
    if (className) item.className = className;
    var link = document.createElement('a');
    link.href = '#' + id;
    link.textContent = text;
    link.addEventListener('click', function () {
      if (!compactMap.matches) return;
      map.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
    item.appendChild(link);
    list.appendChild(item);
  }

  addLink('article-body', articleTitle, 'is-introduction');

  headings.forEach(function (heading, index) {
    var base = heading.id || heading.textContent.trim().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'section-' + (index + 1);
    var id = base;
    var suffix = 2;
    while (usedIds[id] || (document.getElementById(id) && document.getElementById(id) !== heading)) id = base + '-' + suffix++;
    usedIds[id] = true;
    heading.id = id;

    addLink(id, heading.textContent, heading.tagName === 'H3' ? 'is-subsection' : '');
  });

  function select(id, text) {
    var links = list.querySelectorAll('a');
    links.forEach(function (link) {
      var active = link.hash === '#' + id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    current.textContent = text;
  }

  var compactMap = window.matchMedia('(max-width: 1050px)');
  function syncMapLayout() {
    map.classList.toggle('is-open', !compactMap.matches);
    toggle.setAttribute('aria-expanded', String(!compactMap.matches));
  }

  toggle.addEventListener('click', function () {
    if (!compactMap.matches) return;
    var open = map.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  compactMap.addEventListener('change', syncMapLayout);

  map.hidden = false;
  syncMapLayout();
  select('article-body', articleTitle);

  var ticking = false;
  function updateCurrentSection() {
    var activeId = 'article-body';
    var activeText = articleTitle;
    headings.forEach(function (heading) {
      if (heading.getBoundingClientRect().top <= window.innerHeight * 0.3) {
        activeId = heading.id;
        activeText = heading.textContent;
      }
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      var last = headings[headings.length - 1];
      activeId = last.id;
      activeText = last.textContent;
    }
    select(activeId, activeText);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateCurrentSection);
  }, { passive: true });
  updateCurrentSection();
})();
