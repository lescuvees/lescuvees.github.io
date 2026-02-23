/* ═══════════════════════════════════════════════════════════════
 * LES CUVÉES - DIABLO II DARK SANCTUARY
 * Hellfire portal reveal + atmospheric effects
 * ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const CONFIG = {
    emberCount: 15,
    emberMinSize: 2,
    emberMaxSize: 5,
    mobileBreakpoint: 700,
    revealDuration: 4500,
    skipDelay: 1500,
    sessionKey: 'lesCuveesRevealed'
  };

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isMobile = () =>
    window.innerWidth <= CONFIG.mobileBreakpoint;

  const random = (min, max) =>
    Math.random() * (max - min) + min;

  /* ═══════════════════════════════════════════════════════════════
   * HELLFIRE PORTAL REVEAL - The WOW moment
   * ═══════════════════════════════════════════════════════════════ */

  const PortalReveal = {
    container: null,
    skipBtn: null,
    timeout: null,

    hasShown() {
      try {
        return sessionStorage.getItem(CONFIG.sessionKey) === 'true';
      } catch {
        return false;
      }
    },

    markShown() {
      try {
        sessionStorage.setItem(CONFIG.sessionKey, 'true');
      } catch {}
    },

    init() {
      // Skip on mobile, reduced motion, or already shown
      if (isMobile() || prefersReducedMotion() || this.hasShown()) {
        return;
      }

      this.create();
      this.start();
      this.markShown();
    },

    create() {
      // Create reveal container
      this.container = document.createElement('div');
      this.container.id = 'grimoire-reveal';

      // Hellfire background
      const hellfire = document.createElement('div');
      hellfire.className = 'reveal-hellfire';

      // Portal structure
      const portal = document.createElement('div');
      portal.className = 'reveal-portal';

      // Rings
      for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');
        ring.className = 'reveal-ring';
        portal.appendChild(ring);
      }

      // Spinning runes
      const runes = document.createElement('div');
      runes.className = 'reveal-runes';
      const runeSymbols = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ'];
      runeSymbols.forEach(symbol => {
        const rune = document.createElement('span');
        rune.className = 'reveal-rune';
        rune.textContent = symbol;
        runes.appendChild(rune);
      });
      portal.appendChild(runes);

      // Center emblem
      const emblem = document.createElement('div');
      emblem.className = 'reveal-emblem';

      const swords = document.createElement('span');
      swords.className = 'reveal-swords';
      swords.textContent = '⚔';

      const title = document.createElement('div');
      title.className = 'reveal-title';
      title.textContent = 'LES CUVÉES';

      const divider = document.createElement('div');
      divider.className = 'reveal-divider';

      const motto = document.createElement('div');
      motto.className = 'reveal-motto';
      motto.textContent = 'Pour la gloire de Dieu et pour la nôtre';

      emblem.appendChild(swords);
      emblem.appendChild(title);
      emblem.appendChild(divider);
      emblem.appendChild(motto);
      portal.appendChild(emblem);

      // Ember burst (particles at reveal)
      const emberBurst = document.createElement('div');
      emberBurst.className = 'reveal-ember-burst';
      for (let i = 0; i < 30; i++) {
        const ember = document.createElement('div');
        ember.className = 'grimoire-particle ember';
        ember.style.cssText = `
          position: absolute;
          left: ${random(20, 80)}%;
          top: ${random(30, 70)}%;
          width: ${random(2, 6)}px;
          height: ${random(2, 6)}px;
          animation: emberFloat ${random(2, 4)}s ease-out forwards;
          --drift-x: ${random(-100, 100)}px;
        `;
        emberBurst.appendChild(ember);
      }

      // Curtains
      const curtainLeft = document.createElement('div');
      curtainLeft.className = 'reveal-curtain-left';
      const curtainRight = document.createElement('div');
      curtainRight.className = 'reveal-curtain-right';

      // Skip button
      this.skipBtn = document.createElement('button');
      this.skipBtn.className = 'reveal-skip';
      this.skipBtn.textContent = 'Entrer';
      this.skipBtn.addEventListener('click', () => this.skip());

      // Assemble
      this.container.appendChild(hellfire);
      this.container.appendChild(portal);
      this.container.appendChild(emberBurst);
      this.container.appendChild(curtainLeft);
      this.container.appendChild(curtainRight);
      this.container.appendChild(this.skipBtn);

      // Add to DOM
      document.body.prepend(this.container);
    },

    start() {
      // Start opening animation
      requestAnimationFrame(() => {
        this.container.classList.add('opening');
      });

      // Auto-complete after duration
      this.timeout = setTimeout(() => {
        this.complete();
      }, CONFIG.revealDuration);
    },

    skip() {
      if (this.timeout) clearTimeout(this.timeout);
      this.complete();
    },

    complete() {
      this.container.classList.remove('opening');
      this.container.classList.add('closing');

      setTimeout(() => {
        this.container.classList.add('hidden');
      }, 800);
    },

    reset() {
      try {
        sessionStorage.removeItem(CONFIG.sessionKey);
        console.log('Portal reveal reset. Refresh to see it again.');
      } catch {}
    }
  };

  /* ═══════════════════════════════════════════════════════════════
   * PAGE TRANSITIONS - Blood fade between pages
   * ═══════════════════════════════════════════════════════════════ */

  const PageTransitions = {
    init() {
      if (isMobile() || prefersReducedMotion()) return;

      if (!('startViewTransition' in document)) return;

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
      ember.style.left = `${random(5, 95)}%`;
      ember.style.bottom = `${random(-5, 10)}%`;

      const driftX = random(-60, 60);
      ember.style.setProperty('--drift-x', `${driftX}px`);

      const duration = random(8, 16);
      const delay = random(0, 2);
      ember.style.animation = `emberFloat ${duration}s ease-out ${delay}s forwards`;

      document.body.appendChild(ember);
      this.particles.push(ember);

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
      console.log('⚔ Grimoire: Reduced motion - effects disabled');
      return;
    }

    console.log('⚔ Grimoire: Opening the portal...');

    // Portal reveal first (if not seen)
    PortalReveal.init();

    // Then atmospheric effects
    PageTransitions.init();
    HellFog.init();
    EmberParticles.init();
    TorchFlicker.init();

    console.log('⚔ Grimoire: The darkness awaits');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Debug API
  window.Grimoire = {
    config: CONFIG,
    portal: PortalReveal,
    fog: HellFog,
    embers: EmberParticles,
    resetPortal() {
      PortalReveal.reset();
    },
    cleanup() {
      HellFog.cleanup();
      EmberParticles.cleanup();
    }
  };

})();
