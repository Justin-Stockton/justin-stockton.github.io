(() => {
  const form = document.querySelector('#article-controls');
  if (!form) return;
  const fields = form.elements;
  const cards = [...document.querySelectorAll('[data-article]')];
  const sections = [...document.querySelectorAll('#article-results > section')];
  const nav = document.querySelector('[data-reading-sections]');
  const count = document.querySelector('#article-count');
  const empty = document.querySelector('#article-empty');
  const searches = cards.map(card => card.dataset.search.toLowerCase());

  function filter() {
    const words = fields.q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;
    cards.forEach((card, index) => {
      card.hidden = !!(fields.topic.value && card.dataset.topic !== fields.topic.value)
        || !!(fields.lane.value && card.dataset.lane !== fields.lane.value)
        || !words.every(word => searches[index].includes(word));
      if (!card.hidden) visible++;
    });
    sections.forEach(section => {
      section.hidden = !section.querySelector('[data-article]:not([hidden])');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.hidden = document.querySelector(link.getAttribute('href')).hidden;
    });
    nav.hidden = !nav.querySelector('a:not([hidden])');
    count.textContent = `${visible} of ${cards.length} articles`;
    empty.hidden = visible !== 0;
    const url = new URL(location.href);
    for (const name of ['q', 'topic', 'lane']) {
      const value = fields[name].value.trim();
      if (value) url.searchParams.set(name, value);
      else url.searchParams.delete(name);
    }
    history.replaceState(null, '', url);
  }

  function restore() {
    const params = new URLSearchParams(location.search);
    fields.q.value = params.get('q') || '';
    for (const name of ['topic', 'lane']) {
      const value = params.get(name) || '';
      fields[name].value = [...fields[name].options].some(option => option.value === value) ? value : '';
    }
    filter();
  }

  form.addEventListener('input', filter);
  form.addEventListener('submit', event => { event.preventDefault(); filter(); });
  form.addEventListener('reset', event => {
    event.preventDefault();
    for (const name of ['q', 'topic', 'lane']) fields[name].value = '';
    filter();
    fields.q.focus();
  });
  window.addEventListener('popstate', restore);
  restore();
  form.hidden = false;
})();
