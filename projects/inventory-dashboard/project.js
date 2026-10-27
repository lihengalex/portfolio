(function () {
  const root = document.documentElement;
  const button = document.getElementById('themeToggle');
  const saved = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  function apply(isDark) {
    root.dataset.theme = isDark ? 'dark' : 'light';
    button.setAttribute('aria-pressed', String(isDark));
    button.setAttribute('aria-label', isDark ? '切换浅色模式' : '切换深色模式');
    button.textContent = isDark ? '☀' : '☾';
  }
  apply(saved ? saved === 'dark' : prefersDark);
  button.addEventListener('click', function () {
    const isDark = root.dataset.theme !== 'dark';
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    apply(isDark);
  });
})();
