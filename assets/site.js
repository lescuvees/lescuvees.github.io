(() => {
  const body = document.body;
  const nav = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const currentPath = window.location.pathname.replace(/index\.html$/, '');
  nav?.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) {
      return;
    }
    const normalizedHref = href.replace(/index\.html$/, '');
    if (normalizedHref === currentPath || (normalizedHref === '/' && currentPath === '')) {
      link.classList.add('is-current');
    }
  });

  document.querySelectorAll('article a[href^="http"]').forEach((link) => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
})();
