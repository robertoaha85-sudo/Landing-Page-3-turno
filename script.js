document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Urgency Countdown Timer (15 minutes)
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        let time = 15 * 60; // 15 minutes in seconds

        const updateCountdown = () => {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;

            countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (time > 0) {
                time--;
            } else {
                // Reset or stop
                time = 15 * 60; 
            }
        };

        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // Video Logic (Simple Autoplay)
    const video = document.getElementById('hero-video');
    
    if (video) {
        // Ensure video plays muted initially (browser policy friendly)
        video.muted = true;
        video.play().catch(e => console.log("Autoplay failed:", e));
        
        // Ensure video keeps playing if it pauses for some reason
        video.addEventListener('pause', () => {
            if (!video.ended && !video.seeking && !video.paused) { // Check if user intentionally paused? No, just ensure loop.
               // Actually, with native controls, user MIGHT want to pause.
               // So we should NOT force play on pause.
               // Just let native controls handle it.
            }
        });
    }
});
