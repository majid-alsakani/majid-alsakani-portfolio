(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem('majid-theme');
  root.dataset.theme = stored || 'dark';

  var theme = document.getElementById('theme');
  if (theme) {
    theme.textContent = root.dataset.theme === 'light' ? '☼' : '◐';
    theme.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('majid-theme', root.dataset.theme);
      theme.textContent = root.dataset.theme === 'light' ? '☼' : '◐';
    });
  }

  document.querySelectorAll('#year').forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });
})();
