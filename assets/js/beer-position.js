// Function to position beer cup relative to visible image content
function positionBeerCupRelativeToImage() {
    const bgImage = document.querySelector('.bg-image');
    const beerCup = document.querySelector('.beer-cup-container');
    const container = document.querySelector('.background-image');
    
    if (!bgImage || !beerCup || !container) return;
    
    // Create contact icon if it doesn't exist
    let contactIcon = document.querySelector('.contact-icon');
    if (!contactIcon) {
        contactIcon = document.createElement('a');
        contactIcon.href = 'contact.html';
        contactIcon.className = 'contact-icon';
        contactIcon.innerHTML = '<img src="assets/icons/contact.svg" alt="Contact" class="contact-svg">';
        beerCup.appendChild(contactIcon);
    }
    
    function updatePosition() {
        // Wait for image to load
        if (!bgImage.complete) {
            bgImage.addEventListener('load', updatePosition);
            return;
        }
        
        // Get container dimensions
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // Get natural image dimensions
        const naturalWidth = bgImage.naturalWidth;
        const naturalHeight = bgImage.naturalHeight;
        
        // Calculate how the image is actually displayed with object-fit: cover
        const containerAspectRatio = containerWidth / containerHeight;
        const imageAspectRatio = naturalWidth / naturalHeight;
        
        let visibleImageWidth, visibleImageHeight;
        let imageOffsetX = 0, imageOffsetY = 0;
        
        if (containerAspectRatio > imageAspectRatio) {
            // Container is wider - image fills width, crops top/bottom
            visibleImageWidth = containerWidth;
            visibleImageHeight = containerWidth / imageAspectRatio;
            imageOffsetY = (containerHeight - visibleImageHeight) / 2;
        } else {
            // Container is taller - image fills height, crops left/right
            visibleImageHeight = containerHeight;
            visibleImageWidth = containerHeight * imageAspectRatio;
            imageOffsetX = (containerWidth - visibleImageWidth) / 2;
        }
        
        // Define beer cup position as percentage of the ACTUAL VISIBLE IMAGE
        const beerCupImageXPercent = 0.41; // Center horizontally for testing
        const beerCupImageYPercent = 0.665; // Center vertically for testing
        
        // Calculate position within the visible image area
        const beerCupX = imageOffsetX + (visibleImageWidth * beerCupImageXPercent);
        const beerCupY = imageOffsetY + (visibleImageHeight * beerCupImageYPercent);
        
        // Calculate size relative to visible image
        const beerCupWidthPercent = 0.38; // 39% of visible image width
        const beerCupWidth = visibleImageWidth * beerCupWidthPercent;
        
        // Apply positioning
        beerCup.style.position = 'absolute';
        beerCup.style.left = beerCupX + 'px';
        beerCup.style.top = beerCupY + 'px';
        beerCup.style.width = beerCupWidth + 'px';
        beerCup.style.transform = 'translate(-50%, -50%)'; // Center on the point
        beerCup.style.transition = 'transform 0.1s ease-out'; // Smooth animation
        
        // Enable pointer events for hover and make it clickable
        beerCup.style.pointerEvents = 'auto';
        beerCup.style.cursor = 'pointer';
        
        // Debug: log values to console
        console.log('Beer cup positioning:', {
            containerWidth, containerHeight,
            visibleImageWidth, visibleImageHeight,
            beerCupX, beerCupY, beerCupWidth
        });
    }
    
    // Add jiggle animation on hover
    function addJiggleAnimation() {
        let isJiggling = false;
        const contactIcon = document.querySelector('.contact-icon');
        
        function animateBoth(keyframes, duration) {
            const beerAnimation = beerCup.animate(keyframes, {
                duration: duration,
                easing: 'ease-out'
            });
            
            // Animate contact icon with same keyframes
            if (contactIcon) {
                contactIcon.animate(keyframes, {
                    duration: duration,
                    easing: 'ease-out'
                });
            }
            
            return beerAnimation;
        }
        
        beerCup.addEventListener('mouseenter', () => {
            if (isJiggling) return;
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
        });
        
        // Add a click handler for salute + navigation
        beerCup.addEventListener('click', () => {
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
                // Navigate to contact page after animation completes
                window.location.href = 'contact.html';
            });
        });
    }
    
    // Update on load and resize
    updatePosition();
    addJiggleAnimation();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('orientationchange', updatePosition);
    
    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', () => {
        setTimeout(updatePosition, 100);
    });
    document.addEventListener('webkitfullscreenchange', () => {
        setTimeout(updatePosition, 100);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', positionBeerCupRelativeToImage);
} else {
    positionBeerCupRelativeToImage();
}