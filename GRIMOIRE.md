# Les Cuvées Grimoire - Dark Tavern Transformation

An immersive dark tavern grimoire experience with Diablo 2-inspired aesthetics for the Les Cuvées guild website.

## Features

### 📖 Opening Animation (Phase 2)
- 3D book opening animation with Les Cuvées emblem
- Shows once per session (sessionStorage)
- Skippable after 2 seconds
- 4-second animation duration
- Disabled on mobile devices

### 📄 Page Transitions (Phase 3)
- Immersive page-turning effects using View Transition API
- 3D page flip with perspective depth
- Graceful fallback for unsupported browsers
- Works with all internal navigation

### 🌫️ Atmospheric Effects (Phase 4)
- 3 drifting fog layers at different speeds
- ~12 floating dust particles with varied animations
- Subtle candle-flicker lighting on content
- Screen blend modes for ethereal effects

### 🎨 Visual Enhancements (Phase 1)
- Parchment texture overlay on content (15% opacity)
- Leather texture on navigation (20% opacity)
- Enhanced shadows and depth
- Subtle vignette effect

### ⚡ Performance (Phases 5-6)
- GPU-accelerated animations (60fps)
- Lazy loading for all images
- Mobile-optimized (heavy effects disabled)
- Reduced motion support
- Reduced data support
- Print-friendly styles

## Browser Support

| Feature | Chrome/Edge | Firefox | Safari |
|---------|------------|---------|--------|
| Opening Animation | ✅ 111+ | ✅ 115+ | ✅ 16+ |
| Page Transitions | ✅ 111+ | ✅ 115+ | ⚠️ Fade fallback |
| Fog & Particles | ✅ All | ✅ All | ✅ All |
| Mobile | ✅ Optimized | ✅ Optimized | ✅ Optimized |

## Debug API

The grimoire exposes a global `window.Grimoire` object for debugging:

```javascript
// Reset opening animation (shows on next page load)
Grimoire.resetOpening()

// Check feature support
Grimoire.checkSupport()
// Returns: { viewTransitions: boolean, reducedMotion: boolean, mobile: boolean }

// Access configuration
Grimoire.config
// Returns: { openingDuration, skipButtonDelay, particleCount, ... }

// Access individual managers
Grimoire.opening      // GrimoireOpening
Grimoire.transitions  // GrimoireTransitions
Grimoire.atmosphere   // GrimoireAtmosphere
Grimoire.session      // GrimoireSession
```

## Configuration

Edit `/assets/grimoire.js` to customize:

```javascript
const GRIMOIRE_CONFIG = {
  openingDuration: 4000,        // Opening animation duration (ms)
  skipButtonDelay: 2000,        // Show skip button after (ms)
  pageFlipDuration: 800,        // Page flip duration (ms)
  particleCount: 12,            // Number of concurrent particles
  particleMinSize: 2,           // Min particle size (px)
  particleMaxSize: 4,           // Max particle size (px)
  disableOnMobile: true,        // Disable heavy effects on mobile
  mobileBreakpoint: 700,        // Mobile breakpoint (px)
};
```

CSS variables in `/assets/grimoire.css`:

```css
:root {
  --grimoire-opening-duration: 4s;
  --grimoire-page-flip-duration: 0.8s;
  --grimoire-fog-speed-1: 60s;
  --grimoire-fog-speed-2: 75s;
  --grimoire-fog-speed-3: 45s;
  --grimoire-parchment-opacity: 0.15;
  --grimoire-leather-opacity: 0.2;
  --grimoire-vignette-intensity: 0.4;
}
```

## Mobile Optimization

Effects are automatically adjusted based on viewport size:

- **Desktop (>1080px)**: All effects enabled
- **Tablet (701-1080px)**: Reduced fog opacity
- **Mobile (≤700px)**:
  - Opening animation disabled
  - Fog layers disabled
  - Particles disabled
  - Textures reduced
  - Vignette lightened

## Accessibility

Respects user preferences:

- **prefers-reduced-motion**: Disables all animations
- **prefers-reduced-data**: Skips fog and particles
- **prefers-contrast: high**: Disables decorative effects
- **ARIA labels**: Proper labels on interactive elements
- **Keyboard navigation**: Skip button is keyboard accessible

## Performance

All animations are GPU-accelerated:

- `transform: translate3d()` for smooth movement
- `will-change` on animated elements
- `backface-visibility: hidden` for 3D transforms
- Automatic cleanup of particle elements
- Lazy loading for images

Target metrics:
- Lighthouse Performance: >90
- First Contentful Paint: <1.5s
- Animation frame rate: 60fps sustained
- Total page weight: <2MB

## File Structure

```
/assets/
├── grimoire.css        # All grimoire styles and animations
├── grimoire.js         # Interactive grimoire effects
├── style.css           # Base website styles
├── site.js             # Base website functionality
└── images/
    ├── google-docs-icon.png
    ├── google-drive-icon.png
    └── [113 guild images]
```

## Development

### Local Testing

```bash
# Start local server
python3 -m http.server 8000

# Visit http://localhost:8000
# Opening animation shows on first visit only
# Use Grimoire.resetOpening() to test again
```

### Reset Opening Animation

```javascript
// In browser console
Grimoire.resetOpening()
// Then refresh page
```

### Check Current State

```javascript
// Check if effects are active
Grimoire.checkSupport()

// Manually trigger opening animation (if not shown)
if (!Grimoire.session.hasShownOpening()) {
  Grimoire.opening.init()
}
```

## Implementation Phases

✅ **Phase 1**: Foundation with texture overlays
✅ **Phase 2**: 3D book opening animation
✅ **Phase 3**: Page-flip transitions
✅ **Phase 4**: Atmospheric effects
✅ **Phase 5**: Image optimization
✅ **Phase 6**: Mobile & accessibility polish

## Credits

Designed with Diablo 2-inspired dark tavern aesthetics for the Les Cuvées guild.

**Pour la gloire de Dieu et pour la nôtre!** ✠
