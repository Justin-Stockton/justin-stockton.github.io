document.querySelectorAll('#article-body pre').forEach(function (pre) {
  var code = pre.querySelector('code');
  if (!code) return;
  var container = pre.closest('.highlighter-rouge') || pre;
  var type = Array.from(container.classList).find(function (name) { return name.startsWith('language-'); });
  var language = type ? type.slice(9) : 'text';
  var label = document.createElement('span');
  label.textContent = {go: 'Go', python: 'Python', sql: 'SQL', bash: 'Shell', shell: 'Shell', text: 'Text', json: 'JSON', html: 'HTML'}[language] || language;
  var button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Copy code';
  button.setAttribute('aria-label', 'Copy ' + label.textContent + ' code');
  var status = document.createElement('span');
  status.setAttribute('role', 'status');
  var bar = document.createElement('div');
  bar.className = 'article-code-bar';
  bar.append(label, status, button);
  var block = document.createElement('div');
  block.className = 'article-code';
  container.before(block);
  block.append(bar, container);
  button.addEventListener('click', async function () {
    button.disabled = true;
    status.textContent = '';
    var text = code.textContent;
    try {
      try {
        if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(text);
      } catch (_) {
        // Keep copy usable when the Clipboard API is unavailable.
        var field = document.createElement('textarea');
        field.value = text;
        field.readOnly = true;
        field.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.append(field);
        try {
          field.select();
          if (!document.execCommand('copy')) throw new Error('Copy rejected');
        } finally {
          field.remove();
          button.focus({preventScroll: true});
        }
      }
      status.textContent = 'Copied';
    } catch (_) {
      status.textContent = 'Copy failed. Select the code to copy it.';
    } finally {
      button.disabled = false;
    }
  });
});
