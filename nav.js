/* Collapsible menu, shared by every page.
   On a phone the eight links wrapped onto three rows and pushed the content
   down on every page. The list is collapsed in CSS and opened from here, so a
   browser without JavaScript still sees the links: the stylesheet restores the
   row layout at 46rem, and this script only runs where the button exists. */
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  var list = nav.querySelector('ul');
  if (!list) return;

  var DURATION = 200;
  var timer = null;

  /* Height is animated explicitly in both directions. auto is not animatable,
     so each move pins the CURRENT height, forces a reflow so the browser has
     a real starting value, then sets the target. Without that flush the two
     values land in the same frame and the panel jumps. */
  function setOpen(open) {
    clearTimeout(timer);

    list.style.height = list.getBoundingClientRect().height + 'px';
    void list.offsetHeight;                       /* flush the start value */

    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');

    list.style.height = (open ? list.scrollHeight : 0) + 'px';

    /* Once open, hand the height back to the content so the menu still
       reflows if the viewport or the font changes while it is showing. */
    if (open) {
      timer = setTimeout(function () { list.style.height = 'auto'; }, DURATION);
    }
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

  /* Rotating a phone can cross the breakpoint with the menu open. Above it the
     stylesheet lays the links out in a row, so drop the inline height rather
     than leaving a stale pixel value on a row that no longer collapses. */
  window.addEventListener('resize', function () {
    if (window.getComputedStyle(btn).display === 'none') {
      clearTimeout(timer);
      list.style.height = '';
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
