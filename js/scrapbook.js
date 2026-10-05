(function () {
  var items = document.querySelectorAll('.reveal-section, .reveal-group');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(function (item) { item.classList.add('is-visible'); });
    return;
  }
  document.body.classList.add('motion-ready');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });
  items.forEach(function (item) { observer.observe(item); });
})();
