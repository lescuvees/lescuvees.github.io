/* ═══════════════════════════════════════════════════════════════
 * LES CUVÉES GRIMOIRE - DARK TAVERN TRANSFORMATION
 * Interactive grimoire effects with Diablo 2-inspired aesthetics
 * ═══════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════
   * CONFIGURATION
   * ═══════════════════════════════════════════════════════════════ */

  const GRIMOIRE_CONFIG = {
    // Opening animation settings (Phase 2)
    openingDuration: 4000,        // Total animation duration in ms
    skipButtonDelay: 2000,        // Show skip button after 2s
    sessionKey: 'grimoireOpened', // sessionStorage key

    // Page transition settings (Phase 3)
    pageFlipDuration: 800,        // Page flip animation duration in ms

    // Particle settings (Phase 4)
    particleCount: 12,            // Number of floating particles
    particleMinSize: 2,           // Minimum particle size in px
    particleMaxSize: 4,           // Maximum particle size in px

    // Performance settings
    disableOnMobile: true,        // Disable heavy effects on mobile
    mobileBreakpoint: 700,        // Mobile breakpoint in px
  };

  /* ═══════════════════════════════════════════════════════════════
   * UTILITY FUNCTIONS
   * ═══════════════════════════════════════════════════════════════ */

  /**
   * Check if user prefers reduced motion
   */
  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /**
   * Check if viewport is mobile size
   */
  const isMobile = () => {
    return window.innerWidth <= GRIMOIRE_CONFIG.mobileBreakpoint;
  };

  /**
   * Check if View Transition API is supported
   */
  const supportsViewTransitions = () => {
    return 'startViewTransition' in document;
  };

  /**
   * Random number between min and max
   */
  const random = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  /* ═══════════════════════════════════════════════════════════════
   * SESSION MANAGEMENT (Phase 2)
   * Track whether opening animation has been shown this session
   * ═══════════════════════════════════════════════════════════════ */

  const GrimoireSession = {
    /**
     * Check if grimoire opening has been shown this session
     */
    hasShownOpening() {
      try {
        return sessionStorage.getItem(GRIMOIRE_CONFIG.sessionKey) === 'true';
      } catch (e) {
        // Fallback if sessionStorage is unavailable
        return true; // Skip animation if we can't track it
      }
    },

    /**
     * Mark grimoire opening as shown
     */
    markOpeningShown() {
      try {
        sessionStorage.setItem(GRIMOIRE_CONFIG.sessionKey, 'true');
      } catch (e) {
        // Silent fail if sessionStorage is unavailable
        console.warn('Grimoire: sessionStorage unavailable');
      }
    },

    /**
     * Reset opening state (for testing)
     */
    reset() {
      try {
        sessionStorage.removeItem(GRIMOIRE_CONFIG.sessionKey);
      } catch (e) {
        console.warn('Grimoire: sessionStorage unavailable');
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════
   * OPENING ANIMATION (Phase 2)
   * 3D book opening sequence with Les Cuvées emblem
   * ═══════════════════════════════════════════════════════════════ */

  const GrimoireOpening = {
    container: null,
    skipButton: null,
    skipTimeout: null,
    animationTimeout: null,

    /**
     * Initialize opening animation
     */
    init() {
      // Skip on mobile or if user prefers reduced motion
      if (isMobile() || prefersReducedMotion()) {
        return;
      }

      // Skip if already shown this session
      if (GrimoireSession.hasShownOpening()) {
        return;
      }

      // Create and start opening animation
      this.create();
      this.start();

      // Mark as shown for this session
      GrimoireSession.markOpeningShown();
    },

    /**
     * Create opening animation structure
     */
    create() {
      // Create container
      this.container = document.createElement('div');
      this.container.id = 'grimoire-opening';

      // Create book structure
      const book = document.createElement('div');
      book.className = 'grimoire-book';

      const bookInner = document.createElement('div');
      bookInner.className = 'grimoire-book-inner';

      // Create book cover (front)
      const coverFront = document.createElement('div');
      coverFront.className = 'grimoire-cover-front';

      // Create emblem
      const emblem = document.createElement('div');
      emblem.className = 'grimoire-emblem';

      const emblemSymbol = document.createElement('div');
      emblemSymbol.className = 'grimoire-emblem-symbol';
      emblemSymbol.textContent = '✠';

      const emblemText = document.createElement('div');
      emblemText.className = 'grimoire-emblem-text';
      emblemText.innerHTML = 'Les<br/>Cuvées';

      emblem.appendChild(emblemSymbol);
      emblem.appendChild(emblemText);
      coverFront.appendChild(emblem);

      // Create pages (right side - visible after opening)
      const pagesRight = document.createElement('div');
      pagesRight.className = 'grimoire-pages-right';

      // Create spine
      const spine = document.createElement('div');
      spine.className = 'grimoire-spine';

      // Assemble book
      bookInner.appendChild(coverFront);
      bookInner.appendChild(pagesRight);
      bookInner.appendChild(spine);
      book.appendChild(bookInner);

      // Create skip button
      this.skipButton = document.createElement('button');
      this.skipButton.className = 'grimoire-skip';
      this.skipButton.textContent = 'Passer';
      this.skipButton.addEventListener('click', () => this.skip());

      // Assemble container
      this.container.appendChild(book);
      this.container.appendChild(this.skipButton);

      // Add to DOM
      document.body.appendChild(this.container);
    },

    /**
     * Start opening animation
     */
    start() {
      if (!this.container) return;

      // Activate container (fade in)
      requestAnimationFrame(() => {
        this.container.classList.add('active');
      });

      // Start book opening animation
      setTimeout(() => {
        this.container.classList.add('opening');
      }, 100);

      // Show skip button after 2 seconds
      this.skipTimeout = setTimeout(() => {
        if (this.skipButton) {
          this.skipButton.classList.add('visible');
        }
      }, GRIMOIRE_CONFIG.skipButtonDelay);

      // Auto-close after full animation (4 seconds)
      this.animationTimeout = setTimeout(() => {
        this.close();
      }, GRIMOIRE_CONFIG.openingDuration);
    },

    /**
     * Skip opening animation
     */
    skip() {
      this.close();
    },

    /**
     * Close and cleanup opening animation
     */
    close() {
      if (!this.container) return;

      // Start closing animation
      this.container.classList.add('closing');

      // Remove from DOM after animation completes
      setTimeout(() => {
        this.cleanup();
      }, 1200);
    },

    /**
     * Cleanup opening animation
     */
    cleanup() {
      if (this.skipTimeout) clearTimeout(this.skipTimeout);
      if (this.animationTimeout) clearTimeout(this.animationTimeout);
      if (this.container) {
        this.container.remove();
        this.container = null;
      }
      this.skipButton = null;
    }
  };

  /* ═══════════════════════════════════════════════════════════════
   * PAGE TRANSITIONS (Phase 3)
   * View Transition API integration for page-flip effects
   * ═══════════════════════════════════════════════════════════════ */

  const GrimoireTransitions = {
    enabled: false,

    /**
     * Initialize page transition handling
     */
    init() {
      // Skip on mobile or if user prefers reduced motion
      if (isMobile() || prefersReducedMotion()) {
        console.log('Grimoire: Page transitions disabled (mobile or reduced motion)');
        return;
      }

      // Check View Transition API support
      if (supportsViewTransitions()) {
        console.log('Grimoire: View Transition API supported - enabling page flips');
        this.enabled = true;
        this.attachNavigationListeners();
      } else {
        console.log('Grimoire: View Transition API not supported - using fade fallback');
        this.enabled = true;
        this.attachNavigationListeners();
      }
    },

    /**
     * Attach click listeners to internal navigation links
     */
    attachNavigationListeners() {
      document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href]');

        // Only intercept internal links
        if (!link) return;

        const href = link.getAttribute('href');

        // Skip external links, anchors, and special protocols
        if (!href ||
            href.startsWith('#') ||
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('mailto:') ||
            link.target === '_blank') {
          return;
        }

        // Intercept navigation
        event.preventDefault();
        this.navigateTo(href);
      });
    },

    /**
     * Navigate to URL with page transition
     */
    navigateTo(url) {
      // Use View Transition API if available
      if (supportsViewTransitions()) {
        document.startViewTransition(() => {
          window.location.href = url;
        });
      } else {
        // Fallback: simple fade transition
        this.fallbackTransition(url);
      }
    },

    /**
     * Fallback transition for unsupported browsers
     */
    fallbackTransition(url) {
      const main = document.querySelector('main');
      if (main) {
        main.classList.add('grimoire-page-transition-fallback');
      }

      // Navigate after fade starts
      setTimeout(() => {
        window.location.href = url;
      }, 150);
    }
  };

  /* ═══════════════════════════════════════════════════════════════
   * ATMOSPHERIC EFFECTS (Phase 4)
   * Fog layers and floating particles
   * ═══════════════════════════════════════════════════════════════ */

  const GrimoireAtmosphere = {
    fogLayers: [],
    particles: [],
    particleIntervalId: null,

    /**
     * Initialize atmospheric effects
     */
    init() {
      // Skip on mobile or if user prefers reduced motion
      if (isMobile() || prefersReducedMotion()) {
        return;
      }

      console.log('Grimoire: Creating atmospheric effects (fog + particles)');

      // Create fog layers
      this.createFogLayers();

      // Create initial batch of particles
      this.createParticles();

      // Continuously spawn new particles
      this.particleIntervalId = setInterval(() => {
        this.spawnParticle();
      }, 2000); // New particle every 2 seconds

      // Add subtle candle flicker to article
      const article = document.querySelector('article');
      if (article) {
        article.classList.add('grimoire-flicker');
      }
    },

    /**
     * Create fog layers
     */
    createFogLayers() {
      for (let i = 1; i <= 3; i++) {
        const fogLayer = document.createElement('div');
        fogLayer.className = `grimoire-fog-layer grimoire-fog-layer-${i}`;
        document.body.appendChild(fogLayer);
        this.fogLayers.push(fogLayer);
      }

      console.log('Grimoire: Created 3 fog layers');
    },

    /**
     * Create initial batch of particles
     */
    createParticles() {
      const initialCount = GRIMOIRE_CONFIG.particleCount;
      for (let i = 0; i < initialCount; i++) {
        // Stagger initial particles
        setTimeout(() => {
          this.spawnParticle();
        }, i * 300);
      }
    },

    /**
     * Spawn a single floating particle
     */
    spawnParticle() {
      const particle = document.createElement('div');
      particle.className = 'grimoire-particle';

      // Random size within configured range
      const size = random(
        GRIMOIRE_CONFIG.particleMinSize,
        GRIMOIRE_CONFIG.particleMaxSize
      );
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Random starting position (anywhere on screen)
      particle.style.left = `${random(0, 100)}%`;
      particle.style.top = `${random(50, 100)}vh`; // Start from bottom half

      // Random animation (one of 4 variations)
      const animationIndex = Math.floor(random(1, 5));
      const duration = random(15, 25); // 15-25 seconds
      const delay = random(0, 3); // 0-3 second delay

      particle.style.animation = `particleFloat${animationIndex} ${duration}s linear ${delay}s forwards`;

      // Add to DOM
      document.body.appendChild(particle);
      this.particles.push(particle);

      // Remove after animation completes
      setTimeout(() => {
        particle.remove();
        const index = this.particles.indexOf(particle);
        if (index > -1) {
          this.particles.splice(index, 1);
        }
      }, (duration + delay) * 1000);
    },

    /**
     * Cleanup atmospheric effects
     */
    cleanup() {
      // Clear particle spawn interval
      if (this.particleIntervalId) {
        clearInterval(this.particleIntervalId);
        this.particleIntervalId = null;
      }

      // Remove fog layers
      this.fogLayers.forEach(layer => layer.remove());
      this.fogLayers = [];

      // Remove particles
      this.particles.forEach(particle => particle.remove());
      this.particles = [];

      // Remove candle flicker
      const article = document.querySelector('article');
      if (article) {
        article.classList.remove('grimoire-flicker');
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════
   * INITIALIZATION
   * Main entry point - called when DOM is ready
   * ═══════════════════════════════════════════════════════════════ */

  const initGrimoire = () => {
    console.log('🕮 Grimoire: Initializing dark tavern effects...');

    // Skip all effects if user prefers reduced motion
    if (prefersReducedMotion()) {
      console.log('Grimoire: Reduced motion preference detected, skipping effects');
      return;
    }

    // Phase 1: Foundation (current)
    console.log('Grimoire: Phase 1 - Foundation loaded');

    // Phase 2: Opening animation (to be implemented)
    GrimoireOpening.init();

    // Phase 3: Page transitions (to be implemented)
    GrimoireTransitions.init();

    // Phase 4: Atmospheric effects (to be implemented)
    GrimoireAtmosphere.init();

    console.log('🕮 Grimoire: Initialization complete');
  };

  /* ═══════════════════════════════════════════════════════════════
   * WINDOW LOAD EVENT
   * Initialize grimoire when DOM is fully loaded
   * ═══════════════════════════════════════════════════════════════ */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGrimoire);
  } else {
    initGrimoire();
  }

  /* ═══════════════════════════════════════════════════════════════
   * GLOBAL API (for debugging and testing)
   * Expose grimoire controls to window object
   * ═══════════════════════════════════════════════════════════════ */

  window.Grimoire = {
    config: GRIMOIRE_CONFIG,
    session: GrimoireSession,
    opening: GrimoireOpening,
    transitions: GrimoireTransitions,
    atmosphere: GrimoireAtmosphere,

    // Utility to reset and test opening animation
    resetOpening() {
      GrimoireSession.reset();
      console.log('Grimoire: Opening state reset. Refresh page to see animation.');
    },

    // Utility to check feature support
    checkSupport() {
      return {
        viewTransitions: supportsViewTransitions(),
        reducedMotion: prefersReducedMotion(),
        mobile: isMobile(),
      };
    }
  };

})();

/* ═══════════════════════════════════════════════════════════════
 * PHASE 1 COMPLETE - Foundation Ready
 * Next phases will implement:
 * - Phase 2: Book opening animation
 * - Phase 3: Page flip transitions with View Transition API
 * - Phase 4: Fog animations and particle effects
 * ═══════════════════════════════════════════════════════════════ */
