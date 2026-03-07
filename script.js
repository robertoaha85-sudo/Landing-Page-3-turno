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

    // Video Unmute Logic
    const videoContainer = document.getElementById('video-container');
    const video = document.getElementById('hero-video');
    const overlay = document.getElementById('video-overlay');

    if (videoContainer && video && overlay) {
        const unmuteVideo = () => {
            if (video.muted) {
                video.muted = false;
                video.currentTime = 0; // Restart video from beginning
                video.play().catch(e => console.log("Playback failed:", e));
                overlay.classList.add('hidden');
            }
        };

        overlay.addEventListener('click', unmuteVideo);
        
        // Prevent pausing by clicking
        video.addEventListener('click', (e) => {
            e.preventDefault();
            // If for some reason it's paused, play it
            if (video.paused) video.play();
        });

        // Ensure video keeps playing if it pauses for some reason
        video.addEventListener('pause', () => {
            if (!video.muted && !video.ended) {
                video.play();
            }
        });
    }
});
