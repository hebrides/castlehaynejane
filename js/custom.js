/**
 * Lightweight custom.js (no jQuery)
 * - Adds 'postload' to <body>
 * - Hamburger opens/closes the nav-panel menu
 * - Overlay + ESC close the menu
 */

document.addEventListener('DOMContentLoaded', function () {

  const body     = document.body;
  const menu     = document.getElementById('menu');        // nav-panel
  const hamburger= document.querySelector('.hamburger');
  const overlay  = document.querySelector('.overlay');

  // --- Menu open/close helpers ---
  function openMenu() {
    body.classList.add('open', 'nav-open'); // overlay & body lock 
    if (menu) menu.classList.add('active');          // expand nav-panel 
  }

  function closeMenu() {
    body.classList.remove('open', 'nav-open');
    if (menu) menu.classList.remove('active');

    // Clean up any submenu state if present
    document.querySelectorAll('.submenu, .expanded').forEach(el => {
      if (el.classList.contains('submenu')) el.remove();
      el.classList?.remove('expanded');
    });
    body.classList.remove('submenu-expanded');
  }

  // --- Open/close events ---
  if (hamburger) {
    hamburger.addEventListener('click', function (e) {
      e.preventDefault();
      if (body.classList.contains('nav-open')) closeMenu();
      else openMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function (e) {
      e.preventDefault();
      closeMenu();
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

});
