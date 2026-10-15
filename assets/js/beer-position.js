// Beer cup interactions.
//
// Positioning used to live here: this file replicated the background photo's
// `object-fit: cover` geometry in JavaScript and wrote inline left/top/width on
// every resize. That work now happens in CSS via the --img-x/--img-y/--img-w/
// --img-h variables (see "IMAGE-ANCHORED COORDINATE SYSTEM" in styles.css),
// using the same 0.41 / 0.665 / 0.38 constants. Doing it in CSS means the cup
// tracks the photo at any viewport size with no resize listeners, no reflow and
// no jump on first paint.
//
// What remains here is behaviour only: the salute/jiggle animations.

function initBeerCup() {
    const beerCup = document.querySelector('.beer-cup-container');
    if (!beerCup) return;

    // The contact link is hardcoded in index.html so crawlers and keyboard
    // users can reach it. Create it only as a fallback if it is missing.
    let contactIcon = beerCup.querySelector('.contact-icon');
    if (!contactIcon) {
        contactIcon = document.createElement('a');
        contactIcon.href = '#w-chat';
        contactIcon.className = 'contact-icon';
        contactIcon.setAttribute('data-label', 'Contact');
        contactIcon.setAttribute('aria-label', 'Contact');
        contactIcon.innerHTML = '<img src="assets/icons/contact.svg" alt="Contact" class="contact-svg">';
        beerCup.appendChild(contactIcon);
    }

    // Deliberately NOT setting pointerEvents on the container: it stays
    // `none` (from CSS) so its mostly-empty box is not a hover target, and
    // only the cup artwork and the chat icon are. Cursor is set in CSS too -
    // setting it inline here would beat the stylesheet's custom cursor.
    const cupArt = beerCup.querySelector('.beer-cup-image');

    // Users who ask for reduced motion get the navigation without the wobble
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let isJiggling = false;

    // Both the cup and the icon rest at translate(-50%, -50%), so the same
    // keyframes work for each. Keeping that translate in every frame is what
    // stops them snapping out of position for the duration of the animation.
    function animateBoth(keyframes, duration) {
        const options = { duration: duration, easing: 'ease-out' };
        const beerAnimation = beerCup.animate(keyframes, options);
        if (contactIcon) {
            contactIcon.animate(keyframes, options);
        }
        return beerAnimation;
    }

    // Only the cup drawing and the chat icon trigger the salute
    const hoverTargets = [cupArt, contactIcon].filter(Boolean);

    hoverTargets.forEach(target => target.addEventListener('mouseenter', () => {
        if (isJiggling || prefersReducedMotion) return;
        isJiggling = true;

        // Salute jiggle animation
        const jiggleKeyframes = [
            { transform: 'translate(-50%, -50%) rotate(0deg)' },
            { transform: 'translate(-50%, -50%) rotate(-5deg) scale(1.05)' },
            { transform: 'translate(-50%, -50%) rotate(5deg) scale(1.1)' },
            { transform: 'translate(-50%, -50%) rotate(-3deg) scale(1.05)' },
            { transform: 'translate(-50%, -50%) rotate(3deg) scale(1.1)' },
            { transform: 'translate(-50%, -50%) rotate(-2deg) scale(1.05)' },
            { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)' }
        ];

        const animation = animateBoth(jiggleKeyframes, 600);
        animation.addEventListener('finish', () => {
            isJiggling = false;
        });
    }));

    // Clicking the cup drawing salutes, then navigates. The chat icon is a real
    // <a> and handles its own clicks, so modifier- and middle-clicks still work.
    if (cupArt) cupArt.addEventListener('click', (e) => {
        e.preventDefault();

        if (prefersReducedMotion) {
            window.location.hash = 'w-chat';
            return;
        }

        if (isJiggling) return;
        isJiggling = true;

        // More enthusiastic salute on click, then navigate
        const enthusiasticJiggle = [
            { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)' },
            { transform: 'translate(-50%, -50%) rotate(-10deg) scale(1.2)' },
            { transform: 'translate(-50%, -50%) rotate(10deg) scale(1.3)' },
            { transform: 'translate(-50%, -50%) rotate(-8deg) scale(1.2)' },
            { transform: 'translate(-50%, -50%) rotate(8deg) scale(1.3)' },
            { transform: 'translate(-50%, -50%) rotate(-5deg) scale(1.15)' },
            { transform: 'translate(-50%, -50%) rotate(5deg) scale(1.25)' },
            { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)' }
        ];

        const animation = animateBoth(enthusiasticJiggle, 800);
        animation.addEventListener('finish', () => {
            isJiggling = false;
            // open the chat window rather than leaving the page
            window.location.hash = 'w-chat';
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBeerCup);
} else {
    initBeerCup();
}
