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

    // Video Logic & Custom Controls
    const videoContainer = document.getElementById('video-container');
    const video = document.getElementById('hero-video');
    const customControls = document.getElementById('custom-controls');
    const seekBar = document.getElementById('seek-bar');
    const muteBtn = document.getElementById('mute-btn');
    const volumeBar = document.getElementById('volume-bar');
    const fullScreenBtn = document.getElementById('full-screen-btn');

    if (videoContainer && video) {
        // Ensure video plays muted initially (browser policy friendly)
        video.muted = true;
        video.play().catch(e => console.log("Autoplay failed:", e));

        // Sync initial controls state
        if (muteBtn && volumeBar) {
            muteBtn.textContent = '🔇';
            volumeBar.value = 0;
        }

        // Function to unmute and restart video
        const unmuteAndRestart = () => {
            video.muted = false;
            video.volume = 1.0;
            video.currentTime = 0;
            
            // Update UI
            if (muteBtn && volumeBar) {
                muteBtn.textContent = '🔊';
                volumeBar.value = 1;
            }
            
            video.play().catch(e => console.error("Play failed:", e));
        };

        // Click on video un-mutes it if muted
        video.addEventListener('click', (e) => {
            e.preventDefault();
            if (video.muted) {
                unmuteAndRestart();
            } else {
                // If already unmuted, ensure it keeps playing (no pause allowed)
                if (video.paused) video.play();
            }
        });

        // Ensure video keeps playing if it pauses for some reason
        video.addEventListener('pause', () => {
            if (!video.ended) {
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
                video.muted = false; // Unmute if volume changed
                
                if (video.volume === 0) {
                    muteBtn.textContent = '🔇';
                    video.muted = true;
                } else {
                    muteBtn.textContent = '🔊';
                }
            });

            // Mute button toggle
            muteBtn.addEventListener('click', () => {
                if (video.muted || video.volume === 0) {
                    // Unmute
                    video.muted = false;
                    video.volume = 1;
                    volumeBar.value = 1;
                    muteBtn.textContent = '🔊';
                } else {
                    // Mute
                    video.muted = true;
                    video.volume = 0;
                    volumeBar.value = 0;
                    muteBtn.textContent = '🔇';
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
