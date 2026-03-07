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
        // Ensure video plays muted initially (required for autoplay)
        video.muted = true;
        video.play().catch(e => console.log("Autoplay failed:", e));

        // Sync initial controls state
        if (muteBtn && volumeBar) {
            muteBtn.textContent = '🔇';
            volumeBar.value = 0;
        }

        // Function to unmute and restart video
        const unmuteAndRestart = () => {
            if (video.muted) {
                video.muted = false;
                video.volume = 1.0;
                video.currentTime = 0;
                
                // Update UI
                if (muteBtn && volumeBar) {
                    muteBtn.textContent = '🔊';
                    volumeBar.value = 1;
                }
                
                video.play().catch(e => console.error("Play failed:", e));
            }
        };

        // GLOBAL UNMUTE STRATEGY:
        // Try to unmute on ANY interaction with the page (click, scroll, touch)
        const enableSoundOnInteraction = () => {
            unmuteAndRestart();
            // Remove listeners after first successful interaction
            document.removeEventListener('click', enableSoundOnInteraction);
            document.removeEventListener('touchstart', enableSoundOnInteraction);
            document.removeEventListener('keydown', enableSoundOnInteraction);
            document.removeEventListener('scroll', enableSoundOnInteraction);
        };

        document.addEventListener('click', enableSoundOnInteraction);
        document.addEventListener('touchstart', enableSoundOnInteraction);
        document.addEventListener('keydown', enableSoundOnInteraction);
        // Note: Scroll might be too aggressive/annoying if they just want to read, 
        // but user asked for sound ASAP. Let's stick to click/touch for now to be safe, 
        // or maybe just click/touch is enough. Scroll often blocks audio context start.
        // Let's keep click/touchstart/keydown.

        // Specific video click listener (backup)
        video.addEventListener('click', (e) => {
            e.preventDefault();
            unmuteAndRestart();
        });
        
        // Also handle touchstart specifically for the video to be responsive immediately
        video.addEventListener('touchstart', (e) => {
            // Don't prevent default on touchstart globally as it breaks scrolling, 
            // but for video specifically it might be okay if we want to catch the tap.
            // However, let's just trigger the unmute.
            unmuteAndRestart();
        }, { passive: true });

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
