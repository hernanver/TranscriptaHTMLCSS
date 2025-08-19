document.querySelectorAll('.language-flags img').forEach(flag => {
  flag.addEventListener('click', () => {
    const lang = flag.getAttribute('data-lang');
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.location.href = url.toString();
  });
});

(function(){
  const btn = document.querySelector('#lang-desktop .lang-btn');
  const menu = document.querySelector('#lang-desktop .lang-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.style.display === 'block';
    menu.style.display = open ? 'none' : 'block';
    btn.setAttribute('aria-expanded', String(!open));
  });

  menu.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-lang]');
    if (!a) return;
    e.preventDefault();
    const lang = a.getAttribute('data-lang');
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
  });

  document.addEventListener('click', () => {
    menu.style.display = 'none';
    btn.setAttribute('aria-expanded','false');
  });
})();
