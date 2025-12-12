// Interactive mouse tracking (X and Y axis) — colors only applied to footer coords
const body = document.body;
let mouseX = 0.5;
let mouseY = 0.5;

// Precompute values that we will use for footer coloring
let hueX = Math.round(mouseX * 360);
let hueY = Math.round(mouseY * 360);
let saturation = Math.round(50 + (1 - mouseY) * 50);
let lightness = Math.round(35 + mouseY * 35);

document.addEventListener('mousemove', (event) => {
  // Update normalized mouse position (0 to 1)
  mouseX = event.clientX / window.innerWidth;
  mouseY = event.clientY / window.innerHeight;

  // Recalculate color parameters but do NOT change the page background
  hueX = Math.round(mouseX * 360);
  hueY = Math.round(mouseY * 360);
  saturation = Math.round(50 + (1 - mouseY) * 50);
  lightness = Math.round(35 + mouseY * 35);
});

/* ==================================================
   Two-column enforcement + image lightbox
   - ensure first column is text-only and second column holds images
   - attach click handlers to images in second column to open modal
   ================================================== */

function ensureTwoColumnImages() {
  document.querySelectorAll('.two-columns').forEach(container => {
    const cols = container.querySelectorAll('.column');
    if (cols.length < 2) return;
    const first = cols[0];
    const second = cols[1];

    // Move images from first column into second column if necessary
    const imgsInFirst = first.querySelectorAll('img');
    if (imgsInFirst.length && !second.querySelector('img')) {
      imgsInFirst.forEach(img => {
        second.appendChild(img);
      });
    }
  });
}

function setupImageLightbox() {
  if (document.querySelector('.lightbox-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';

  const content = document.createElement('div');
  content.className = 'lightbox-content';

  const img = document.createElement('img');
  img.alt = '';
  content.appendChild(img);

  const btn = document.createElement('button');
  btn.className = 'lightbox-close';
  btn.innerHTML = '✕';
  content.appendChild(btn);

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('open'), 10);
  }

  function close() {
    overlay.classList.remove('open');
    setTimeout(() => overlay.style.display = 'none', 160);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  btn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Attach click listeners to images in second column
  function attachListeners() {
    document.querySelectorAll('.two-columns').forEach(container => {
      const cols = container.querySelectorAll('.column');
      if (cols.length < 2) return;
      const second = cols[1];
      second.querySelectorAll('img').forEach(image => {
        image.style.cursor = 'zoom-in';
        if (!image.dataset.lightboxAttached) {
          image.addEventListener('click', () => open(image.src, image.alt));
          image.dataset.lightboxAttached = '1';
        }
      });
    });
  }

  // Run initial attach and also observe DOM changes (in case content is injected)
  attachListeners();

  const observer = new MutationObserver(() => {
    ensureTwoColumnImages();
    attachListeners();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize enforcement + lightbox when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ensureTwoColumnImages();
    setupImageLightbox();
  });
} else {
  ensureTwoColumnImages();
  setupImageLightbox();
}

// No background reset — background is static; only footer coordinates change color

// Display mouse coordinates in footer only
let coordsElement = null;
let footerBottom = null;

document.addEventListener('DOMContentLoaded', () => {
  footerBottom = document.querySelector('.footer-bottom');
  if (footerBottom) {
    // create coords element
    coordsElement = document.createElement('p');
    coordsElement.className = 'mouse-coords';
    coordsElement.style.cssText = `
      margin-top: 1rem;
      font-family: 'Space Mono', monospace;
      font-size: 0.85rem;
      color: rgba(0, 212, 255, 0.8);
      letter-spacing: 0.5px;
    `;
    footerBottom.appendChild(coordsElement);

    // Smooth background transitions for interactive footer
    footerBottom.style.transition = 'background 160ms linear, color 160ms linear';
    footerBottom.style.willChange = 'background';
  }
});

document.addEventListener('mousemove', (event) => {
  if (coordsElement) {
    const x = Math.round(event.clientX);
    const y = Math.round(event.clientY);

    // Build colored spans for X and Y using the calculated HSL values
    const colorX = `hsl(${hueX}, ${saturation}%, ${lightness}%)`;
    const colorY = `hsl(${hueY}, ${saturation}%, ${lightness}%)`;

    coordsElement.innerHTML = `Mouse Position → X: <span style="color: ${colorX}; font-weight:700">${x}</span> | Y: <span style="color: ${colorY}; font-weight:700">${y}</span>`;

    // Also update the footer background only (interactive background localized to footer)
    if (footerBottom) {
      const angle = Math.round(mouseX * 360);
      const posX = Math.round(mouseX * 100);
      const posY = Math.round(mouseY * 100);

      const grad1 = `hsl(${hueX}, ${saturation}%, ${Math.max(lightness,10)}%)`;
      const grad2 = `hsl(${hueY}, ${Math.max(40, Math.min(saturation + 10, 90))}%, ${Math.max(lightness - 8, 10)}%)`;

      footerBottom.style.background = `radial-gradient(circle at ${posX}% ${posY}%, ${grad1} 0%, ${grad2} 60%), linear-gradient(${angle}deg, rgba(0,0,0,0.12), rgba(0,0,0,0.02))`;
    }
  }
});
