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

    // Video Unmute Logic & Custom Controls
    const videoContainer = document.getElementById('video-container');
    const video = document.getElementById('hero-video');
    const overlay = document.getElementById('video-overlay');
    const customControls = document.getElementById('custom-controls');
    const seekBar = document.getElementById('seek-bar');
    const muteBtn = document.getElementById('mute-btn');
    const volumeBar = document.getElementById('volume-bar');
    const fullScreenBtn = document.getElementById('full-screen-btn');

    if (videoContainer && video && overlay) {
        const unmuteVideo = () => {
            if (video.muted) {
                video.muted = false;
                video.currentTime = 0; // Restart video from beginning
                video.volume = 1; // Set volume to max
                video.play().catch(e => console.log("Playback failed:", e));
                overlay.classList.add('hidden');
                
                // Show custom controls
                if (customControls) {
                    customControls.classList.add('visible');
                }
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

        // Custom Controls Logic
        if (customControls && seekBar && muteBtn && volumeBar && fullScreenBtn) {
            // Update seek bar as video plays
            video.addEventListener('timeupdate', () => {
                if (!isNaN(video.duration)) {
                    const value = (100 / video.duration) * video.currentTime;
                    seekBar.value = value;
                }
            });

            // Seek functionality
            seekBar.addEventListener('input', () => {
                if (!isNaN(video.duration)) {
                    const time = (seekBar.value / 100) * video.duration;
                    video.currentTime = time;
                }
            });

            // Volume functionality
            volumeBar.addEventListener('input', () => {
                video.volume = volumeBar.value;
                if (video.volume === 0) {
                    muteBtn.textContent = '🔇';
                } else {
                    muteBtn.textContent = '🔊';
                }
            });

            // Mute button toggle
            muteBtn.addEventListener('click', () => {
                if (video.volume > 0) {
                    video.volume = 0;
                    volumeBar.value = 0;
                    muteBtn.textContent = '🔇';
                } else {
                    video.volume = 1;
                    volumeBar.value = 1;
                    muteBtn.textContent = '🔊';
                }
            });

            // Fullscreen functionality
            fullScreenBtn.addEventListener('click', () => {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) { /* Safari */
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) { /* IE11 */
                    video.msRequestFullscreen();
                }
            });
        }
    }
});
