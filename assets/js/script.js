// Interactive Wall Stickers
document.addEventListener('DOMContentLoaded', function() {
    const stickers = document.querySelectorAll('.sticker');

    stickers.forEach(sticker => {
        // Add hover effects
        sticker.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1)';
        });

        sticker.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    // Expose the menu state to assistive tech
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');

    function toggleMenu() {
        const isOpen = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', toggleMenu);

    // Keyboard support: the hamburger is a <div>, so Enter/Space need wiring up
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', closeMenu));
}

// NOTE: there used to be a smooth-scroll handler here that called
// preventDefault() on every in-page anchor. That silently broke every :target
// window: preventing the default stops the URL fragment from changing, so
// :target never matched and clicking About / Let's chat / CV or any bench
// object did nothing at all. Smooth scrolling is handled natively by
// `html { scroll-behavior: smooth }` in styles.css, so no JS is needed.

// Navbar background on scroll (the homepage has no navbar, so guard it)
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(247, 251, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(59, 30, 77, 0.10)';
            navbar.style.borderBottom = '1px solid rgba(59, 30, 77, 0.10)';
        } else {
            navbar.style.background = 'rgba(247, 251, 255, 0.95)';
            navbar.style.boxShadow = 'none';
            navbar.style.borderBottom = '1px solid rgba(59, 30, 77, 0.07)';
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ---------------------------------------------------------------------------
// Pop-up windows (both pages)
//
// CSS :target is the baseline - it works with no JavaScript at all, gives deep
// links (index.html#w-cv) and makes the back button close a window. This layer
// mirrors the same state onto an .is-open class so the windows keep working
// even if :target misbehaves, and wires up Escape plus the close button.
//
// Do NOT add a click handler that calls preventDefault() on in-page anchors:
// that stops the URL fragment changing, which silently breaks every one of
// these windows. Smooth scrolling is CSS (`scroll-behavior`) already.
// ---------------------------------------------------------------------------
const popupWindows = document.querySelectorAll('.win');

if (popupWindows.length) {
    // Somewhere harmless to point the fragment when closing
    const restAnchor = document.getElementById('bench') ? '#bench'
                     : document.getElementById('home')  ? '#home'
                     : '#';

    function syncFromHash() {
        const id = window.location.hash.slice(1);
        popupWindows.forEach(win => win.classList.toggle('is-open', win.id === id));
    }

    function closePopup() {
        popupWindows.forEach(win => win.classList.remove('is-open'));
        // location.replace (not history.replaceState) so :target re-evaluates
        // too, and so we swap the history entry instead of stacking one
        if (window.location.hash && window.location.hash !== restAnchor) {
            window.location.replace(restAnchor);
        }
    }

    window.addEventListener('hashchange', syncFromHash);
    syncFromHash();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePopup();
    });

    // The close button and the scrim are real links, so they already work
    // without this; handling them directly makes closing instant and immune to
    // anything odd in the :target chain.
    document.querySelectorAll('.win__close, .win__scrim').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            closePopup();
        });
    });

    // clicking the padding around the frame also closes
    popupWindows.forEach(win => {
        win.addEventListener('click', (e) => {
            if (e.target === win) closePopup();
        });
    });
}
