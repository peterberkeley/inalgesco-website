/* Collapsible menu, shared by every page.
   On a phone the eight links wrapped onto three rows and pushed the content
   down on every page. The list is collapsed by default in CSS and opened from
   here, so a browser without JavaScript still gets the links: the stylesheet
   restores the row layout at 46rem, and this script only runs where the
   button exists. */
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  btn.addEventListener('click', function () {
    setOpen(!nav.classList.contains('is-open'));
  });

  /* Escape closes it and returns focus to the button, so the menu cannot trap
     somebody navigating by keyboard. */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      btn.focus();
    }
  });
})();
