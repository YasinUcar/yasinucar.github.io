// Dark mode toggle and preference handling
(function () {
  const storageKey = 'site-theme';
  const themeToggle = document.getElementById('theme-toggle');

  function applyTheme(name) {
    const root = document.documentElement;
    if (name === 'dark' || name === 'light') {
      root.setAttribute('data-theme', name);
      if (themeToggle) themeToggle.textContent = name === 'dark' ? '☀️' : '🌙';
    } else {
      root.removeAttribute('data-theme');
      // set icon according to system preference
      const sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (themeToggle) themeToggle.textContent = sysDark ? '☀️' : '🌙';
    }
  }

  function getStoredTheme() {
    try { return localStorage.getItem(storageKey); } catch (e) { return null; }
  }

  function getSystemTheme() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  // Initialize: if user set a preference, apply it. Otherwise leave unset to respect OS setting.
  try {
    const stored = getStoredTheme();
    if (stored === 'dark' || stored === 'light') {
      applyTheme(stored);
    } else {
      applyTheme(null);
    }
  } catch (e) {}

  // Toggle handler
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const currentIsDark = (document.documentElement.getAttribute('data-theme') === 'dark') || (!document.documentElement.hasAttribute('data-theme') && getSystemTheme() === 'dark');
      const next = currentIsDark ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(storageKey, next); } catch (e) {}
    });
  }

  // React to OS-level changes when user hasn't set explicit preference
  try {
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = function (e) {
        if (!getStoredTheme()) {
          applyTheme(null); // update icon to reflect system
        }
      };
      mq.addEventListener ? mq.addEventListener('change', listener) : mq.addListener(listener);
    }
  } catch (e) {}

})();
