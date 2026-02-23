/* ═══════════════════════════════════════════════════════════════
 * LES CUVÉES - DIABLO II DARK SANCTUARY
 * Hellfire atmosphere with ember particles and blood fog
 * ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const CONFIG = {
    emberCount: 15,
    emberMinSize: 2,
    emberMaxSize: 5,
    mobileBreakpoint: 700,
  };

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isMobile = () =>
    window.innerWidth <= CONFIG.mobileBreakpoint;

  const random = (min, max) =>
    Math.random() * (max - min) + min;

  /* ═══════════════════════════════════════════════════════════════
   * PAGE TRANSITIONS - Blood fade between pages
   * ═══════════════════════════════════════════════════════════════ */

  const PageTransitions = {
    init() {
      if (isMobile() || prefersReducedMotion()) return;

      if (!('startViewTransition' in document)) {
        console.log('Grimoire: View transitions not supported');
        return;
      }

      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href ||
            href.startsWith('#') ||
            href.startsWith('http') ||
            href.startsWith('mailto:') ||
            link.target === '_blank') {
          return;
        }

        e.preventDefault();
        document.startViewTransition(() => {
          window.location.href = href;
        });
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════
   * HELLISH FOG - Blood-red drifting mist
   * ═══════════════════════════════════════════════════════════════ */

  const HellFog = {
    layers: [],

    init() {
      if (isMobile() || prefersReducedMotion()) return;

      for (let i = 1; i <= 3; i++) {
        const layer = document.createElement('div');
        layer.className = `grimoire-fog-layer grimoire-fog-layer-${i}`;
        document.body.appendChild(layer);
        this.layers.push(layer);
      }
    },

    cleanup() {
      this.layers.forEach(l => l.remove());
      this.layers = [];
    }
  };

  /* ═══════════════════════════════════════════════════════════════
   * EMBER PARTICLES - Floating fire motes
   * ═══════════════════════════════════════════════════════════════ */

  const EmberParticles = {
    particles: [],
    intervalId: null,

    init() {
      if (isMobile() || prefersReducedMotion()) return;

      // Spawn initial embers
      for (let i = 0; i < CONFIG.emberCount; i++) {
        setTimeout(() => this.spawn(), i * 200);
      }

      // Continuously spawn new embers
      this.intervalId = setInterval(() => this.spawn(), 1500);
    },

    spawn() {
      const ember = document.createElement('div');
      ember.className = 'grimoire-particle ember';

      const size = random(CONFIG.emberMinSize, CONFIG.emberMaxSize);
      ember.style.width = `${size}px`;
      ember.style.height = `${size}px`;

      // Random position along bottom
      ember.style.left = `${random(5, 95)}%`;
      ember.style.bottom = `${random(-5, 10)}%`;

      // Random drift direction
      const driftX = random(-60, 60);
      ember.style.setProperty('--drift-x', `${driftX}px`);

      // Random animation timing
      const duration = random(8, 16);
      const delay = random(0, 2);
      ember.style.animation = `emberFloat ${duration}s ease-out ${delay}s forwards`;

      document.body.appendChild(ember);
      this.particles.push(ember);

      // Cleanup after animation
      setTimeout(() => {
        ember.remove();
        const idx = this.particles.indexOf(ember);
        if (idx > -1) this.particles.splice(idx, 1);
      }, (duration + delay) * 1000);
    },

    cleanup() {
      if (this.intervalId) clearInterval(this.intervalId);
      this.particles.forEach(p => p.remove());
      this.particles = [];
    }
  };

  /* ═══════════════════════════════════════════════════════════════
   * TORCH FLICKER - Subtle lighting effect on content
   * ═══════════════════════════════════════════════════════════════ */

  const TorchFlicker = {
    init() {
      if (isMobile() || prefersReducedMotion()) return;

      const article = document.querySelector('article');
      if (article) {
        article.classList.add('grimoire-flicker');
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════
   * INITIALIZATION
   * ═══════════════════════════════════════════════════════════════ */

  const init = () => {
    if (prefersReducedMotion()) {
      console.log('Grimoire: Reduced motion - effects disabled');
      return;
    }

    console.log('⚔ Grimoire: Entering the dark sanctuary...');

    PageTransitions.init();
    HellFog.init();
    EmberParticles.init();
    TorchFlicker.init();

    console.log('⚔ Grimoire: Darkness awakens');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Debug API
  window.Grimoire = {
    config: CONFIG,
    fog: HellFog,
    embers: EmberParticles,
    cleanup() {
      HellFog.cleanup();
      EmberParticles.cleanup();
    }
  };

})();
