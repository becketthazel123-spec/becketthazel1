/* Theme behavior: saved choice wins; otherwise follow the visitor's system setting. */
(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const storageKey = 'beckett-hazel-theme';
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const isDark = theme === 'dark';
    toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.querySelector('.theme-label').textContent = isDark ? 'Light mode' : 'Dark mode';
    themeColor.setAttribute('content', isDark ? '#141d19' : '#f6f7f4');
  }

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch (error) {
    // The theme still works for this visit when storage is unavailable.
  }
  applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (systemPreference.matches ? 'dark' : 'light'));

  toggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch (error) {
      // Ignore storage restrictions; keep the selected theme for this page view.
    }
  });

  systemPreference.addEventListener('change', (event) => {
    let hasSavedTheme = false;
    try {
      hasSavedTheme = localStorage.getItem(storageKey) !== null;
    } catch (error) {
      // Without storage, follow the current system preference.
    }
    if (!hasSavedTheme) applyTheme(event.matches ? 'dark' : 'light');
  });
})();
