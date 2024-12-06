document.addEventListener('DOMContentLoaded', () => {
    const scrollBtn = document.querySelector('.scroll-btn');
    const lettersSection = document.getElementById('letters');
    const letters = document.querySelectorAll('.letter');
    
    // Scroll button functionality
    scrollBtn.addEventListener('click', () => {
        lettersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateScrollIndicator();
    });

    // Letter click handlers
    letters.forEach(letter => {
        // Remove existing click handler
        letter.removeEventListener('click', () => {});
        
        // Add touch and click handlers
        const handleInteraction = (e) => {
            e.preventDefault(); // Prevent double-firing on touch devices
            letter.classList.toggle('open');
        };

        letter.addEventListener('touchstart', handleInteraction, { passive: false });
        letter.addEventListener('click', handleInteraction);
    });

    // Cherry blossom animation
    function createPetal() {
        const petalContainer = document.querySelector('.cherry-blossom-container');
        const petal = document.createElement('div');
        const minSize = 10;
        const maxSize = 15;
        const size = Math.random() * (maxSize - minSize) + minSize;
        const startPosition = Math.random() * window.innerWidth;
        const fallDuration = Math.random() * 3 + 2; // 2-5 seconds
        const wind = Math.random() * 2 - 1; // Random wind direction

        petal.className = 'petal';
        petal.style.left = startPosition + 'px';
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.opacity = Math.random() * 0.6 + 0.4;
        petal.style.animationDuration = fallDuration + 's';
        petal.style.setProperty('--wind', wind);

        petalContainer.appendChild(petal);

        // Remove petal after animation
        setTimeout(() => {
            petal.remove();
        }, fallDuration * 1000);
    }

    function createPetals() {
        const numberOfPetals = 30;
        let petalCount = 0;

        function addPetal() {
            if (petalCount < numberOfPetals) {
                createPetal();
                petalCount++;
                setTimeout(addPetal, 200); // Add new petal every 200ms
            } else {
                setTimeout(createPetals, 2000); // Restart cycle after 2 seconds
            }
        }

        addPetal();
    }

    // Start cherry blossom animation
    createPetals();

    // Scroll indicator functionality
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const sections = ['landing', 'letters', 'music', 'memories'];
    let currentSection = 0;

    // Keep scroll indicator update function
    function updateScrollIndicator() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        sections.forEach((section, index) => {
            const element = document.getElementById(section) || document.querySelector(`.${section}-page`);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= windowHeight/2 && rect.bottom >= windowHeight/2) {
                    scrollDots.forEach(dot => dot.classList.remove('active'));
                    scrollDots[index].classList.add('active');
                    currentSection = index;
                }
            }
        });
    }

    // Keep scroll dot click handlers
    scrollDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const targetSection = dot.dataset.section;
            const element = document.getElementById(targetSection) || document.querySelector(`.${targetSection}-page`);
            
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Keep scroll event listeners
    window.addEventListener('scroll', updateScrollIndicator);
    updateScrollIndicator();

    // Keep audio player functionality
    const audioPlayer = {
        currentTrack: 0,
        audio: new Audio(),
        playlist: [
            {
                title: "What was i made for?",
                artist: "Billie Eilish",
                src: "audio/Billie Eilish - What Was I Made For_ (Lyrics).mp3",
                img: "./images/Screenshot 2024-12-03 125343.png"
            },
            {
                title: "TV",
                artist: "Billie Eilish",
                src: "audio/Billie Eilish - TV (Lyrics).mp3",
                img: "./images/Screenshot 2024-12-03 125614.png"
            },
            {
                title: "Voice Message",
                artist: "Special Message",
                src: "./audio/khushi.mp3",
                img: "./images/IMG-20241203-WA0011.jpg"
            }
        ],
        init() {
            // Get DOM elements
            this.playBtn = document.querySelector('.play-btn');
            this.prevBtn = document.querySelector('.prev-btn');
            this.nextBtn = document.querySelector('.next-btn');
            this.progress = document.querySelector('.progress');
            this.progressBar = document.querySelector('.progress-bar');
            this.currentTimeEl = document.querySelector('.current-time');
            this.durationEl = document.querySelector('.duration');
            this.volumeSlider = document.querySelector('.volume-slider');
            this.currentSongImg = document.querySelector('.current-song-img');
            this.currentSongTitle = document.querySelector('.current-song-title');
            this.currentSongArtist = document.querySelector('.current-song-artist');
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load first track
            this.loadTrack(0);
        },
        
        setupEventListeners() {
            // Play/Pause
            this.playBtn.addEventListener('click', () => this.togglePlay());
            
            // Previous track
            this.prevBtn.addEventListener('click', () => this.prevTrack());
            
            // Next track
            this.nextBtn.addEventListener('click', () => this.nextTrack());
            
            // Progress bar
            this.progressBar.addEventListener('click', (e) => this.setProgress(e));
            
            // Audio events
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
            this.audio.addEventListener('ended', () => this.nextTrack());
            
            // Volume
            this.volumeSlider.addEventListener('input', (e) => {
                this.audio.volume = e.target.value / 100;
            });
            
            // Playlist clicks
            document.querySelectorAll('.playlist-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    this.loadTrack(index);
                    this.playTrack();
                });
            });
            
            // Add loadedmetadata event
            this.audio.addEventListener('loadedmetadata', () => {
                if (this.audio.duration && isFinite(this.audio.duration)) {
                    this.durationEl.textContent = this.formatTime(this.audio.duration);
                }
            });
        },
        
        loadTrack(index) {
            this.currentTrack = index;
            
            // Reset progress and time display
            this.progress.style.width = '0%';
            this.currentTimeEl.textContent = '00:00';
            this.durationEl.textContent = '00:00';
            
            // Load new track
            this.audio.src = this.playlist[index].src;
            this.currentSongImg.src = this.playlist[index].img;
            this.currentSongTitle.textContent = this.playlist[index].title;
            this.currentSongArtist.textContent = this.playlist[index].artist;
            
            // Update playlist active state
            document.querySelectorAll('.playlist-item').forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
            
            // Preload the audio
            this.audio.load();
        },
        
        togglePlay() {
            if (this.audio.paused) {
                this.playTrack();
            } else {
                this.pauseTrack();
            }
        },
        
        playTrack() {
            this.audio.play();
            this.playBtn.textContent = '⏸';
        },
        
        pauseTrack() {
            this.audio.pause();
            this.playBtn.textContent = '▶';
        },
        
        prevTrack() {
            this.currentTrack--;
            if (this.currentTrack < 0) {
                this.currentTrack = this.playlist.length - 1;
            }
            this.loadTrack(this.currentTrack);
            this.playTrack();
        },
        
        nextTrack() {
            this.currentTrack++;
            if (this.currentTrack >= this.playlist.length) {
                this.currentTrack = 0;
            }
            this.loadTrack(this.currentTrack);
            this.playTrack();
        },
        
        setProgress(e) {
            const width = this.progressBar.clientWidth;
            const clickX = e.offsetX;
            const duration = this.audio.duration;
            
            // Check if duration is available and finite
            if (duration && isFinite(duration)) {
                const time = (clickX / width) * duration;
                // Ensure the time is valid before setting
                if (isFinite(time) && time >= 0 && time <= duration) {
                    this.audio.currentTime = time;
                }
            }
        },
        
        updateProgress() {
            if (this.audio.duration && isFinite(this.audio.duration)) {
                const duration = this.audio.duration;
                const currentTime = this.audio.currentTime;
                
                // Update progress bar
                const progressPercent = (currentTime / duration) * 100;
                this.progress.style.width = `${progressPercent}%`;
                
                // Update time displays
                this.currentTimeEl.textContent = this.formatTime(currentTime);
                this.durationEl.textContent = this.formatTime(duration);
            } else {
                // Reset progress if duration is not available
                this.progress.style.width = '0%';
                this.currentTimeEl.textContent = '00:00';
                this.durationEl.textContent = '00:00';
            }
        },
        
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        }
    };

    // Initialize audio player
    audioPlayer.init();

    // Add this new code for page navigation buttons
    const pageNavButtons = document.querySelectorAll('.page-nav-btn');
    
    pageNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            const nextSection = button.dataset.next;
            const targetElement = document.getElementById(nextSection);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Update the active dot in the scroll indicator
                const dotIndex = sections.indexOf(nextSection);
                if (dotIndex !== -1) {
                    scrollDots.forEach(dot => dot.classList.remove('active'));
                    scrollDots[dotIndex].classList.add('active');
                }
            }
        });
    });

    // Add this after your existing code inside DOMContentLoaded
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.querySelector('.memory-modal');
    const modalImage = modal.querySelector('.modal-image');
    const modalCaption = modal.querySelector('.modal-caption h3');
    const modalDescription = modal.querySelector('.modal-caption p');
    const modalDate = modal.querySelector('.modal-date');
    const modalClose = modal.querySelector('.modal-close');
    const modalPrev = modal.querySelector('.modal-prev');
    const modalNext = modal.querySelector('.modal-next');

    let currentImageIndex = 0;

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            updateModal(item);
            modal.classList.add('active');
        });
    });

    function updateModal(item) {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-overlay h3');
        const desc = item.querySelector('.gallery-overlay p');
        const date = item.querySelector('.memory-date');

        modalImage.src = img.src;
        modalCaption.textContent = title.textContent;
        modalDescription.textContent = desc.textContent;
        modalDate.textContent = date.textContent;
    }

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modalPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateModal(galleryItems[currentImageIndex]);
    });

    modalNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateModal(galleryItems[currentImageIndex]);
    });

    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    
    // Add this inside your DOMContentLoaded event listener
    const secretLetter = document.querySelector('.secret-letter');

    // Remove existing click handlers
    secretLetter.removeEventListener('click', () => {});

    const handleSecretLetterInteraction = (e) => {
        e.preventDefault();
        e.stopPropagation();
        secretLetter.classList.toggle('open');
    };

    secretLetter.addEventListener('touchstart', handleSecretLetterInteraction, { passive: false });
    secretLetter.addEventListener('click', handleSecretLetterInteraction);

    // Update document click/touch handler to close letter
    const handleDocumentInteraction = (e) => {
        if (!secretLetter.contains(e.target) && secretLetter.classList.contains('open')) {
            secretLetter.classList.remove('open');
        }
    };

    document.addEventListener('touchstart', handleDocumentInteraction, { passive: true });
    document.addEventListener('click', handleDocumentInteraction);


    // Add this at the end of your DOMContentLoaded event listener
    const giftBox = document.querySelector('.question-box-container');
    const noBtn = document.querySelector('.no-btn');
    const yesBtn = document.querySelector('.yes-btn');
    const questionContent = document.querySelector('.question-content');
    const successMessage = document.querySelector('.success-message');
    const answerButtons = document.querySelector('.answer-buttons');

    giftBox.addEventListener('click', function() {
        if (!this.classList.contains('opened')) {
            this.classList.add('opened');
            setTimeout(() => {
                questionContent.style.visibility = 'visible';
            }, 500);
        }
    });

    noBtn.addEventListener('mouseover', function() {
        const maxX = window.innerWidth - this.offsetWidth;
        const maxY = window.innerHeight - this.offsetHeight;
        
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        
        this.style.position = 'fixed';
        this.style.left = randomX + 'px';
        this.style.top = randomY + 'px';
    });

    yesBtn.addEventListener('click', function() {
        answerButtons.style.display = 'none';
        successMessage.classList.add('show');
        
        // Create heart burst animation
        const hearts = ['💖', '💝', '💕', '💗', '💓'];
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('span');
            heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = Math.random() * 100 + 'vh';
            heart.style.animation = `heartFall 3s linear forwards`;
            heart.style.fontSize = '2rem';
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 3000);
        }
    });

    // Add this CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes heartFall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Add this after your DOMContentLoaded event listener
    function addTouchSupport() {
        // Improve touch response time
        document.addEventListener('touchstart', function() {}, {passive: true});
        
        // Handle touch events for interactive elements
        const interactiveElements = document.querySelectorAll('.letter, .gallery-item, .playlist-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function(e) {
                this.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', function(e) {
                this.style.transform = '';
            });
        });
        
        // Improve scroll performance
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateScrollIndicator();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Call the function to add touch support
    addTouchSupport();

    // Update modal navigation for touch devices
    function updateModalNavigation() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        modal.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        modal.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent page scrolling while swiping
        }, { passive: false });

        modal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Only handle horizontal swipes (ignore vertical scrolling attempts)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
                if (diffX > 0) {
                    // Swipe left - next image
                    currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
                    updateModal(galleryItems[currentImageIndex]);
                } else {
                    // Swipe right - previous image
                    currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
                    updateModal(galleryItems[currentImageIndex]);
                }
            }
        }
    }
    
    updateModalNavigation();
});
