// Sequential bubble spawning animation
function spawnBubblesSequentially() {
    const bubbles = document.querySelectorAll('.bubble-container');
    
    if (!bubbles.length) return;
    
    // Function to spawn a single bubble
    function spawnBubble(bubble, delay) {
        setTimeout(() => {
            // Animate bubble appearance
            bubble.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            bubble.style.opacity = '1';
            bubble.style.transform = 'scale(1)';
            
            // Add a slight bounce effect
            bubble.addEventListener('transitionend', function bounceEffect() {
                bubble.removeEventListener('transitionend', bounceEffect);
                
                // Quick bounce animation
                bubble.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.1)' },
                    { transform: 'scale(1)' }
                ], {
                    duration: 300,
                    easing: 'ease-out'
                });
            });
        }, delay);
    }
    
    // Spawn bubbles with increasing delays
    bubbles.forEach((bubble, index) => {
        // Randomize the delay a bit for more natural feel
        const baseDelay = index * 150; // 150ms between each bubble
        const randomOffset = Math.random() * 100; // Add up to 100ms random delay
        const totalDelay = baseDelay + randomOffset;
        
        spawnBubble(bubble, totalDelay);
    });
    
    // Optional: Add a "beer cup ready" effect after all bubbles are spawned
    const allBubblesDelay = (bubbles.length * 150) + 500; // Wait for all bubbles + extra time
    setTimeout(() => {
        // Make beer cup slightly more prominent when bubbles are done
        const beerCup = document.querySelector('.beer-cup-container');
        if (beerCup) {
            beerCup.animate([
                { transform: 'translate(-50%, -50%) scale(1)' },
                { transform: 'translate(-50%, -50%) scale(1.05)' },
                { transform: 'translate(-50%, -50%) scale(1)' }
            ], {
                duration: 600,
                easing: 'ease-out'
            });
        }
    }, allBubblesDelay);
}

// Start bubble spawning when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Small delay before starting to ensure everything is positioned
    setTimeout(spawnBubblesSequentially, 500);
});

// Re-spawn bubbles when coming back from another page (if needed)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Check if bubbles are hidden and re-spawn if needed
        const hiddenBubbles = document.querySelectorAll('.bubble-container[style*="opacity: 0"]');
        if (hiddenBubbles.length > 0) {
            setTimeout(spawnBubblesSequentially, 200);
        }
    }
});