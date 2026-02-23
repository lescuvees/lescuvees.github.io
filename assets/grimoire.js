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
   * PAGE TRANSITIONS (Phase 3 - placeholder for now)
   * View Transition API integration for page-flip effects
   * ═══════════════════════════════════════════════════════════════ */

  const GrimoireTransitions = {
    /**
     * Initialize page transition handling
     */
    init() {
      // Skip on mobile or if user prefers reduced motion
      if (isMobile() || prefersReducedMotion()) {
        return;
      }

      // Phase 3 will implement full View Transition API integration
      // For now, just log support status
      if (supportsViewTransitions()) {
        console.log('Grimoire: View Transition API supported');
      } else {
        console.log('Grimoire: View Transition API not supported, will use fallback');
      }
    },

    /**
     * Handle navigation click (Phase 3)
     */
    handleNavClick(event) {
      // To be implemented in Phase 3
    },

    /**
     * Perform page transition with View Transition API (Phase 3)
     */
    transition(url) {
      // To be implemented in Phase 3
    },

    /**
     * Fallback transition for unsupported browsers (Phase 3)
     */
    fallbackTransition(url) {
      // To be implemented in Phase 3
    }
  };

  /* ═══════════════════════════════════════════════════════════════
   * ATMOSPHERIC EFFECTS (Phase 4 - placeholder for now)
   * Fog layers and floating particles
   * ═══════════════════════════════════════════════════════════════ */

  const GrimoireAtmosphere = {
    fogLayers: [],
    particles: [],

    /**
     * Initialize atmospheric effects
     */
    init() {
      // Skip on mobile or if user prefers reduced motion
      if (isMobile() || prefersReducedMotion()) {
        return;
      }

      // Phase 4 will implement fog and particles
      console.log('Grimoire: Atmosphere effects will be added in Phase 4');
    },

    /**
     * Create fog layers (Phase 4)
     */
    createFogLayers() {
      // To be implemented in Phase 4
    },

    /**
     * Create floating particles (Phase 4)
     */
    createParticles() {
      // To be implemented in Phase 4
    },

    /**
     * Cleanup atmospheric effects
     */
    cleanup() {
      this.fogLayers.forEach(layer => layer.remove());
      this.particles.forEach(particle => particle.remove());
      this.fogLayers = [];
      this.particles = [];
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
