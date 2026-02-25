/**
 * Lightweight image lightbox
 *
 * Usage: add class="lightbox" to any <img>.
 * Clicking opens a full-viewport overlay with the image.
 * Close with click, Escape, or the × button.
 */

(function () {
  'use strict';

  let overlay, imgEl, closeBtn;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image preview');
    overlay.hidden = true;

    closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close image preview');
    closeBtn.textContent = '\u00d7';

    imgEl = document.createElement('img');
    imgEl.className = 'lightbox-img';

    overlay.append(closeBtn, imgEl);
    document.body.append(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === closeBtn) close();
    });
    closeBtn.addEventListener('click', close);
  }

  function open(src, alt) {
    if (!overlay) buildOverlay();
    imgEl.src = src;
    imgEl.alt = alt || '';
    overlay.hidden = false;
    // force reflow then add active class for transition
    overlay.offsetHeight;           // eslint-disable-line no-unused-expressions
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // wait for fade-out transition before hiding
    setTimeout(function () {
      overlay.hidden = true;
      imgEl.src = '';
    }, 250);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  document.addEventListener('click', function (e) {
    var img = e.target.closest('img.lightbox');
    if (!img) return;
    e.preventDefault();
    open(img.src, img.alt);
  });

})();
