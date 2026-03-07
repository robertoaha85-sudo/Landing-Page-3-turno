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

    // Video Logic & Custom Controls - SIMPLIFIED & ROBUST
    const video = document.getElementById('hero-video');
    const overlay = document.getElementById('video-overlay');
    const customControls = document.getElementById('custom-controls');
    const seekBar = document.getElementById('seek-bar');
    const muteBtn = document.getElementById('mute-btn');
    const volumeBar = document.getElementById('volume-bar');
    const fullScreenBtn = document.getElementById('full-screen-btn');

    if (video) {
        // 1. Force Autoplay Muted (Browser Standard)
        video.muted = true;
        video.play().catch(e => console.log("Autoplay error:", e));

        // 2. Setup Initial UI State
        if (customControls) {
            customControls.style.opacity = '0';
            customControls.style.pointerEvents = 'none';
        }

        // 3. Activation Function (The "Click to Unmute" logic)
        const activateVideo = () => {
            video.muted = false;
            video.volume = 1.0;
            video.currentTime = 0;
            
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Hide Overlay
                    if (overlay) {
                        overlay.style.display = 'none'; // Completely remove from layout flow
                    }
                    // Show Controls
                    if (customControls) {
                        customControls.style.opacity = '1';
                        customControls.style.pointerEvents = 'auto';
                    }
                    // Sync Buttons
                    if (muteBtn) muteBtn.textContent = '🔊';
                    if (volumeBar) volumeBar.value = 1;
                }).catch(e => console.error("Activation play failed:", e));
            }
        };

        // 4. Overlay Click Listener
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.stopPropagation();
                activateVideo();
            });
            // Touch support
            overlay.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                e.preventDefault(); // Prevent double-firing on some devices
                activateVideo();
            }, { passive: false });
        }

        // 5. Video Click Listener (Toggle Play/Pause AFTER activation)
        video.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.muted) {
                activateVideo();
            } else {
                if (video.paused) video.play();
                else video.pause();
            }
        });

        // 6. Controls Logic
        if (customControls) {
            // Prevent clicks on controls from bubbling to video
            customControls.addEventListener('click', (e) => e.stopPropagation());
            customControls.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });

            // Seek Bar
            if (seekBar) {
                video.addEventListener('timeupdate', () => {
                    if (!isNaN(video.duration)) {
                        seekBar.value = (100 / video.duration) * video.currentTime;
                    }
                });
                
                seekBar.addEventListener('input', (e) => {
                    e.stopPropagation();
                    if (!isNaN(video.duration)) {
                        video.currentTime = (seekBar.value / 100) * video.duration;
                    }
                });
            }

            // Volume Bar
            if (volumeBar) {
                volumeBar.addEventListener('input', (e) => {
                    e.stopPropagation();
                    video.volume = volumeBar.value;
                    video.muted = false;
                    if (muteBtn) muteBtn.textContent = video.volume === 0 ? '🔇' : '🔊';
                });
            }

            // Mute Button (Small one in controls)
            if (muteBtn) {
                muteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    video.muted = !video.muted;
                    muteBtn.textContent = video.muted ? '🔇' : '🔊';
                    if (volumeBar) volumeBar.value = video.muted ? 0 : video.volume;
                });
            }

            // Fullscreen Button
            if (fullScreenBtn) {
                fullScreenBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (!document.fullscreenElement) {
                        if (video.requestFullscreen) video.requestFullscreen();
                        else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen(); // Safari
                        else if (video.msRequestFullscreen) video.msRequestFullscreen(); // IE11
                        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iOS
                    } else {
                        if (document.exitFullscreen) document.exitFullscreen();
                    }
                });
            }
        }
    }
});
