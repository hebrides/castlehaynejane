/**
 * Lightweight image lightbox with navigation and captions.
 *
 * Usage:
 *   - Add class="lightbox" to any <img> to make it openable.
 *   - Add data-caption="Some text" on the <img> for a caption, OR put a
 *     <figcaption> inside the parent <figure>. If neither exist the caption
 *     bar is hidden.
 *
 * Keyboard:  Escape → close,  ← / → → previous / next
 */

(function () {
  'use strict';

  // ── DOM references (created once on first open) ─────────────────────────
  let overlay, figure, imgEl, captionEl, closeBtn, prevBtn, nextBtn;

  // ── State ────────────────────────────────────────────────────────────────
  let currentIndex = -1;
  let closeTimer   = null;

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** Return all lightbox images in DOM order for the current page. */
  function getImages() {
    return Array.from(document.querySelectorAll('img.lightbox'));
  }

  /** Resolve the caption for an <img>: data-caption → <figcaption> → ''. */
  function resolveCaption(img) {
    if (img.dataset.caption) return img.dataset.caption.trim();
    var fc = img.closest('figure') && img.closest('figure').querySelector('figcaption');
    return fc ? fc.textContent.trim() : '';
  }

  // ── Build overlay (runs once) ─────────────────────────────────────────────

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className  = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image preview');
    overlay.hidden = true;
    overlay.style.display = 'none';

    // Close button – SVG ×
    closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">' +
        '<line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' +
        '<line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' +
      '</svg>';

    // Prev / Next buttons
    prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-prev';
    prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">' +
        '<polyline points="15 4 7 12 15 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';

    nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-next';
    nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">' +
        '<polyline points="9 4 17 12 9 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';

    // Figure holds the image + caption
    figure = document.createElement('figure');
    figure.className = 'lightbox-figure';

    imgEl = document.createElement('img');
    imgEl.className = 'lightbox-img';

    captionEl = document.createElement('figcaption');
    captionEl.className = 'lightbox-caption';

    figure.append(imgEl, captionEl);
    overlay.append(closeBtn, prevBtn, nextBtn, figure);
    document.body.append(overlay);

    // ── Events ────────────────────────────────────────────────────────────

    // Backdrop click (only the backdrop itself – not the figure or its children)
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    // Close button – stopPropagation so the backdrop click above doesn't also fire
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      close();
    });

    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      navigate(-1);
    });

    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      navigate(1);
    });
  }

  // ── Open ─────────────────────────────────────────────────────────────────

  function open(index) {
    if (!overlay) buildOverlay();

    // Cancel any in-flight close timer so we don't accidentally re-hide a
    // freshly opened lightbox.
    if (closeTimer !== null) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    var images = getImages();
    if (!images.length) return;

    // Wrap index
    currentIndex = ((index % images.length) + images.length) % images.length;

    var img     = images[currentIndex];
    var caption = resolveCaption(img);

    imgEl.src             = img.src;
    imgEl.alt             = img.alt || '';
    captionEl.textContent = caption;
    captionEl.hidden      = !caption;

    // Show nav only when there are multiple images
    var multi      = images.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;

    // Make sure any interrupted close is visually reset before re-animating
    overlay.classList.remove('active');
    overlay.hidden = false;
    overlay.style.display = '';
    overlay.offsetHeight; // force reflow so transition fires
    overlay.classList.add('active');

    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  // ── Navigate ─────────────────────────────────────────────────────────────

  function navigate(dir) {
    var images = getImages();
    var next   = ((currentIndex + dir) % images.length + images.length) % images.length;
    open(next);
  }

  // ── Close ─────────────────────────────────────────────────────────────────

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    closeTimer = setTimeout(function () {
      overlay.hidden = true;
      overlay.style.display = 'none';
      imgEl.src      = '';
      closeTimer     = null;
    }, 260);
  }

  // ── Global keyboard handler ───────────────────────────────────────────────

  document.addEventListener('keydown', function (e) {
    if (!overlay || overlay.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // ── Delegated click to open ───────────────────────────────────────────────

  document.addEventListener('click', function (e) {
    var img = e.target.closest('img.lightbox');
    if (!img) return;
    e.preventDefault();
    open(getImages().indexOf(img));
  });

})();
