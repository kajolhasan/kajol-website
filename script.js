// Initialize AOS (Animate On Scroll) library
AOS.init();

document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        // Set initial state from localStorage or system preference
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            toggle.checked = true;
        } else if (savedDarkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // If no preference saved, use system preference
            document.body.classList.add('dark-mode');
            toggle.checked = true;
        }

        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
            }
            // Redraw game elements to apply new colors immediately
            // Check if draw function and isGameRunning are defined before calling
            if (typeof draw === 'function' && isGameRunning) {
                draw();
            }
        });
    }


    // Language Toggle Function
    function setLanguage(lang) {
        const elements = document.querySelectorAll('[data-en]');
        elements.forEach(el => {
            // Exclude the typingText element from language changes
            if (el.id !== 'typingText') {
                el.textContent = lang === 'bn' ? el.getAttribute('data-bn') : el.getAttribute('data-en');
            }
        });

        // Update document title based on language
        if (lang === 'bn') {
            document.title = "কাজল হাসান - সৃজনশীল অভিযাত্রী";
        } else {
            document.title = "Kajol Hasan - The Creative Explorer";
        }

        // Update the "Toggle Gallery" button text based on language
        const toggleGalleryBtn = document.getElementById('toggleGalleryBtn');
        const galleryGrid = document.querySelector('.gallery-grid');
        if (toggleGalleryBtn && galleryGrid) {
            if (galleryGrid.classList.contains('hidden')) {
                toggleGalleryBtn.textContent = lang === 'bn' ? 'গ্যালারি দেখান' : 'Show Gallery';
            } else {
                toggleGalleryBtn.textContent = lang === 'bn' ? 'গ্যালারি লুকান' : 'Hide Gallery';
            }
        }

        // Update Mini Game button texts
        const startGameBtn = document.getElementById('startGameBtn');
        const resetGameBtn = document.getElementById('resetGameBtn');
        if (startGameBtn) {
            startGameBtn.textContent = lang === 'bn' ? startGameBtn.getAttribute('data-bn') : startGameBtn.getAttribute('data-en');
        }
        if (resetGameBtn) {
            resetGameBtn.textContent = lang === 'bn' ? resetGameBtn.getAttribute('data-bn') : resetGameBtn.getAttribute('data-en');
        }

        // Update the tab button texts
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            const span = button.querySelector('span');
            if (span) {
                span.textContent = lang === 'bn' ? span.getAttribute('data-bn') : span.getAttribute('data-en');
            }
        });

        // Redraw game elements to update score/lives text immediately
        if (typeof draw === 'function' && isGameRunning) {
            draw();
        }
    }
    window.setLanguage = setLanguage;

    // Set initial language based on localStorage or default to EN
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        setLanguage(savedLang);
        document.getElementById(`lang-${savedLang}`).classList.add('active');
        if (savedLang === 'en') {
            document.getElementById('lang-bn').classList.remove('active');
        } else {
            document.getElementById('lang-en').classList.remove('active');
        }
    } else {
        // Default to English if no preference is saved
        setLanguage('en');
        document.getElementById('lang-en').classList.add('active');
    }

    // Language switcher event listeners
    const langEnBtn = document.getElementById('lang-en');
    const langBnBtn = document.getElementById('lang-bn');

    if (langEnBtn) {
        langEnBtn.addEventListener('click', () => {
            setLanguage('en');
            localStorage.setItem('language', 'en');
            langEnBtn.classList.add('active');
            langBnBtn.classList.remove('active');
        });
    }

    if (langBnBtn) {
        langBnBtn.addEventListener('click', () => {
            setLanguage('bn');
            localStorage.setItem('language', 'bn');
            langBnBtn.classList.add('active');
            langEnBtn.classList.remove('active');
        });
    }


    // Typing Effect for Hero Subtitle
    const typingTextElement = document.getElementById('typingText');
    const sentences = [
        typingTextElement.getAttribute('data-en'),
        typingTextElement.getAttribute('data-bn')
    ]; // Get both English and Bengali versions
    let sentenceIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';
    const typingSpeed = 70; // typing speed
    const deletingSpeed = 40; // deleting speed
    const delayBetweenSentences = 1500; // delay before typing next sentence

    function type() {
        const fullTxt = sentences[sentenceIndex];
        if (isDeleting) {
            currentText = fullTxt.substring(0, charIndex - 1);
        } else {
            currentText = fullTxt.substring(0, charIndex + 1);
        }

        typingTextElement.textContent = currentText;

        let typeSpeed = typingSpeed;
        if (isDeleting) {
            typeSpeed /= 2; // Speed up deletion
        }

        if (!isDeleting && currentText === fullTxt) {
            typeSpeed = delayBetweenSentences;
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            sentenceIndex = (sentenceIndex + 1) % sentences.length; // Loop through sentences
            typeSpeed = 500; // Delay before starting to type next sentence
        }

        charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

        setTimeout(type, typeSpeed);
    }

    if (typingTextElement) {
        // Start typing effect only if the element exists
        // Initial call to set the first sentence based on current language
        const currentLang = localStorage.getItem('language') || 'en';
        if (currentLang === 'bn') {
            sentenceIndex = 1; // Start with Bengali if it's the active language
        } else {
            sentenceIndex = 0; // Start with English
        }
        type();
    }


    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            if (window.scrollY > 300) { // Show button after scrolling down 300px
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }


    // Smooth Scrolling for Nav Links (Updated to handle new tabs)
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            if (targetId === 'tabbed-interface') {
                e.preventDefault(); // Prevent default anchor behavior
                // Find and activate the first tab in the tabbed interface
                const firstTabButton = document.querySelector('.tab-button[data-tab="portfolio"]');
                if (firstTabButton) {
                    firstTabButton.click();
                    // Scroll to the tabbed interface section
                    const targetElement = document.getElementById('tabbed-interface');
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - navbarHeight;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            } else {
                e.preventDefault(); // Prevent default anchor behavior
                navLinks.classList.remove('active'); // Close mobile menu after click
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Get the height of the fixed navbar
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    // Calculate the position to scroll to
                    // Subtract navbarHeight to account for the fixed navbar
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - navbarHeight;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });


    // Highlight active nav link on scroll (Modified for new tabbed interface)
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('.nav-links li a');
    function highlightNavLink() {
        let current = '';
        const navbarHeight = document.querySelector('.navbar').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 1; // Adjust for navbar height
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Special handling for the tabbed interface section
        if (current === 'portfolio' || current === 'gallery') {
            current = 'tabbed-interface';
        }

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', highlightNavLink);
    window.addEventListener('load', highlightNavLink); // Call on load to set initial state


    // NEW: Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to the clicked button and its corresponding content
                const tabName = button.getAttribute('data-tab');
                const targetContent = document.getElementById(tabName);
                if (targetContent) {
                    button.classList.add('active');
                    targetContent.classList.add('active');
                }
            });
        });
    }


    // Photo Gallery Toggle
    const toggleGalleryBtn = document.getElementById('toggleGalleryBtn');
    const galleryGrid = document.querySelector('.gallery-grid');

    if (toggleGalleryBtn && galleryGrid) {
        toggleGalleryBtn.addEventListener('click', () => {
            galleryGrid.classList.toggle('hidden');
            const currentLang = localStorage.getItem('language') || 'en';
            if (galleryGrid.classList.contains('hidden')) {
                toggleGalleryBtn.textContent = currentLang === 'bn' ? 'গ্যালারি দেখান' : 'Show Gallery';
            } else {
                toggleGalleryBtn.textContent = currentLang === 'bn' ? 'গ্যালারি লুকান' : 'Hide Gallery';
            }
        });
    }


    // App Search Functionality
    const appSearchInput = document.getElementById('appSearchInput');
    const appItems = document.querySelectorAll('.app-item');
    if (appSearchInput) {
        appSearchInput.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            appItems.forEach(item => {
                const appName = item.querySelector('h3').textContent.toLowerCase();
                const appDescription = item.querySelector('p').textContent.toLowerCase();
                if (appName.includes(searchTerm) || appDescription.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

});


// --- Mini Game Logic ---
const canvas = document.getElementById('myCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const gameStatusDiv = document.getElementById('gameStatus');
    const startGameBtn = document.getElementById('startGameBtn');
    const resetGameBtn = document.getElementById('resetGameBtn');
    let gameInterval;
    let isGameRunning = false;

    // Ball properties
    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2; // Ball speed in x direction
    let dy = -2; // Ball speed in y direction

    // Paddle properties
    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;

    // Brick properties
    let brickRowCount = 5;
    let brickColumnCount = 3;
    let brickWidth = 75;
    let brickHeight = 20;
    let brickPadding = 10;
    let brickOffsetTop = 30;
    let brickOffsetLeft = 30;
    let bricks = [];

    // Game state
    let score = 0;
    let lives = 3;

    function initBricks() {
        bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false;
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0; // Mark brick as hit
                        score++;
                        if (score === brickRowCount * brickColumnCount) {
                            const currentLang = localStorage.getItem('language') || 'en';
                            const winMessage = currentLang === 'bn' ? "অভিনন্দন, আপনি জিতেছেন!" : "CONGRATULATIONS, YOU WIN!";
                            gameStatusDiv.textContent = winMessage;
                            stopGame();
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#e74c3c"; // Red ball
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#3498db"; // Blue paddle
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    let brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#2ecc71"; // Green bricks
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawScore() {
        const currentLang = localStorage.getItem('language') || 'en';
        const scoreText = currentLang === 'bn' ? `স্কোর: ${score}` : `Score: ${score}`;
        const isDarkMode = document.body.classList.contains('dark-mode');
        ctx.font = "16px Montserrat";
        ctx.fillStyle = isDarkMode ? "#fff" : "#000";
        ctx.fillText(scoreText, 8, 20);
    }

    function drawLives() {
        const currentLang = localStorage.getItem('language') || 'en';
        const livesText = currentLang === 'bn' ? `জীবন: ${lives}` : `Lives: ${lives}`;
        const isDarkMode = document.body.classList.contains('dark-mode');
        ctx.font = "16px Montserrat";
        ctx.fillStyle = isDarkMode ? "#fff" : "#000";
        ctx.fillText(livesText, canvas.width - 65, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                lives--;
                if (!lives) {
                    const currentLang = localStorage.getItem('language') || 'en';
                    const gameOverMessage = currentLang === 'bn' ? "খেলা শেষ" : "GAME OVER";
                    gameStatusDiv.textContent = gameOverMessage;
                    stopGame();
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;
    }

    function startGame() {
        if (!isGameRunning) {
            startGameBtn.style.display = 'none';
            resetGameBtn.style.display = 'inline-block';
            gameStatusDiv.textContent = '';
            initBricks(); // Reset bricks before starting
            score = 0;
            lives = 3;
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 2;
            dy = -2;
            gameInterval = setInterval(draw, 10); // Start the game loop
            isGameRunning = true;
        }
    }

    function stopGame() {
        clearInterval(gameInterval); // Stop the game loop
        isGameRunning = false;
        startGameBtn.style.display = 'inline-block';
        resetGameBtn.style.display = 'none';
    }

    function resetGame() {
        stopGame(); // Ensure game is stopped before resetting
        initBricks();
        score = 0;
        lives = 3;
        const currentLang = localStorage.getItem('language') || 'en';
        const gameReadyMessage = currentLang === 'bn' ? "খেলা শুরু করতে ক্লিক করুন" : "Click to Start Game";
        gameStatusDiv.textContent = gameReadyMessage;
        startGameBtn.textContent = currentLang === 'bn' ? "খেলা শুরু করুন" : "Start Game";
    }

    if (startGameBtn) {
        startGameBtn.addEventListener('click', startGame);
    }
    if (resetGameBtn) {
        resetGameBtn.addEventListener('click', resetGame);
    }

    // Initial message on load
    const currentLang = localStorage.getItem('language') || 'en';
    const gameReadyMessage = currentLang === 'bn' ? "খেলা শুরু করতে ক্লিক করুন" : "Click to Start Game";
    gameStatusDiv.textContent = gameReadyMessage;
}


// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const statusDiv = document.getElementById('formStatus');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const isDarkMode = document.body.classList.contains('dark-mode');
        const defaultTextColor = isDarkMode ? '#fff' : '#3498db'; // White in dark mode, blue in light mode
        const successTextColor = isDarkMode ? '#90ee90' : '#2ecc71'; // Light green in dark mode, green in light mode
        const errorTextColor = isDarkMode ? '#ff6347' : '#e74c3c'; // Tomato in dark mode, red in light mode

        statusDiv.textContent = 'Sending message...';
        statusDiv.style.color = defaultTextColor; // Set initial color
        submitBtn.disabled = true; // Disable button to prevent multiple submissions

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                redirect: 'follow', // Follow redirects, important for Apps Script
                headers: {
                    'Accept': 'application/json' // Requesting JSON response
                }
            });

            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                // Handle cases where Apps Script returns plain text or HTML
                data = { result: 'success' };
            }

            if (response.ok && data.result === 'success') {
                statusDiv.textContent = 'Message sent successfully!';
                statusDiv.style.color = successTextColor;
                contactForm.reset(); // Clear the form
            } else {
                const errorMessage = data.error || (response.statusText ? `Error: ${response.statusText}` : 'An unknown error occurred.');
                statusDiv.textContent = `Failed to send message. ${errorMessage}`;
                statusDiv.style.color = errorTextColor;
            }
        } catch (error) {
            statusDiv.textContent = `Failed to send message: ${error.message}. Please try again later.`;
            statusDiv.style.color = errorTextColor;
        } finally {
            submitBtn.disabled = false; // Re-enable the button
        }
    });
}