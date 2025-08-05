document.addEventListener('DOMContentLoaded', () => {
    // Language Switcher functionality
    const langEnBtn = document.getElementById('lang-en');
    const langBnBtn = document.getElementById('lang-bn');

    const elements = document.querySelectorAll('[data-en], [data-bn]');

    const setLanguage = (lang) => {
        elements.forEach(element => {
            if (lang === 'en') {
                element.textContent = element.getAttribute('data-en');
                if (element.placeholder) {
                    element.placeholder = element.getAttribute('data-en-placeholder');
                }
            } else if (lang === 'bn') {
                element.textContent = element.getAttribute('data-bn');
                if (element.placeholder) {
                    element.placeholder = element.getAttribute('data-bn-placeholder');
                }
            }
        });
    };

    langEnBtn.addEventListener('click', () => {
        setLanguage('en');
        langEnBtn.classList.add('active');
        langBnBtn.classList.remove('active');
    });

    langBnBtn.addEventListener('click', () => {
        setLanguage('bn');
        langBnBtn.classList.add('active');
        langEnBtn.classList.remove('active');
    });

    // Initialize with English
    setLanguage('en');

    // Menu Toggle functionality for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navSocial = document.querySelector('.nav-social');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        navSocial.classList.toggle('nav-active');
        menuToggle.classList.toggle('toggle');
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    darkModeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Tabbed Interface functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to the clicked button and its corresponding content
            button.classList.add('active');
            const targetTabId = button.getAttribute('data-tab');
            document.getElementById(targetTabId).classList.add('active');
        });
    });

    // Photo Gallery Toggle
    const toggleGalleryBtn = document.getElementById('toggleGalleryBtn');
    const galleryGrid = document.querySelector('.gallery-grid');

    toggleGalleryBtn.addEventListener('click', () => {
        if (galleryGrid.style.display === 'none' || galleryGrid.style.display === '') {
            galleryGrid.style.display = 'grid';
            toggleGalleryBtn.querySelector('[data-en]').textContent = toggleGalleryBtn.getAttribute('data-en').replace('Hide', 'Hide'); // Keep the text for hide
            toggleGalleryBtn.querySelector('[data-bn]').textContent = toggleGalleryBtn.getAttribute('data-bn').replace('লুকান', 'লুকান'); // Keep the text for hide
            toggleGalleryBtn.setAttribute('data-en', 'Hide Gallery');
            toggleGalleryBtn.setAttribute('data-bn', 'গ্যালারি লুকান');
        } else {
            galleryGrid.style.display = 'none';
            toggleGalleryBtn.querySelector('[data-en]').textContent = 'Show Gallery';
            toggleGalleryBtn.querySelector('[data-bn]').textContent = 'গ্যালারি দেখান';
            toggleGalleryBtn.setAttribute('data-en', 'Show Gallery');
            toggleGalleryBtn.setAttribute('data-bn', 'গ্যালারি দেখান');
        }
    });

    // Typing effect for Hero section
    const typingTextElement = document.getElementById('typingText');
    const originalTextEn = typingTextElement.getAttribute('data-en');
    const originalTextBn = typingTextElement.getAttribute('data-bn');

    const typeWriter = (text, i, element) => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(text, i, element), 50);
        }
    };

    // Game functionality
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const startGameBtn = document.getElementById('startGameBtn');
    const resetGameBtn = document.getElementById('resetGameBtn');
    const gameStatus = document.getElementById('gameStatus');

    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    const ballRadius = 10;
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;
    let gameInterval;
    let gameRunning = false;

    // Game controls
    document.addEventListener('keydown', e => {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = true;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = true;
        }
    });

    document.addEventListener('keyup', e => {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = false;
        }
    });

    // Game loop functions
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
    }

    function draw() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                endGame();
                return;
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
        gameRunning = true;
        startGameBtn.style.display = 'none';
        resetGameBtn.style.display = 'block';
        gameStatus.textContent = '';
        gameInterval = setInterval(draw, 10);
    }

    function endGame() {
        gameRunning = false;
        clearInterval(gameInterval);
        gameStatus.textContent = 'Game Over!';
    }

    function resetGame() {
        clearInterval(gameInterval);
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
        gameRunning = false;
        gameStatus.textContent = '';
        startGameBtn.style.display = 'block';
        resetGameBtn.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    startGameBtn.addEventListener('click', startGame);
    resetGameBtn.addEventListener('click', resetGame);

    // Initial draw to show the paddle and ball
    resetGame();

    // App search functionality
    const appSearchInput = document.getElementById('appSearchInput');
    const appItems = document.querySelectorAll('.app-item');

    appSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        appItems.forEach(item => {
            const appName = item.querySelector('h3').textContent.toLowerCase();
            if (appName.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Initialize AOS
    AOS.init();

    // NEW FEATURE: Random Art Generator
    const randomArtBtn = document.getElementById('randomArtBtn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // An array of your portfolio image sources and their descriptions
    const portfolioImages = [
        { src: 'images/portfolio-1.jpg', title: 'Abstract Series', description: 'A collection exploring fluid forms and vibrant colors.' },
        { src: 'images/portfolio-2.jpg', title: 'Portrait Studies', description: 'Capturing expressions and human emotion.' },
        { src: 'images/portfolio-3.jpg', title: 'Nature\'s Canvas', description: 'Inspired by landscapes and natural elements.' },
    ];

    randomArtBtn.addEventListener('click', () => {
        // Hide all current portfolio items
        portfolioItems.forEach(item => item.style.display = 'none');

        // Select a random image from the array
        const randomIndex = Math.floor(Math.random() * portfolioImages.length);
        const randomArt = portfolioImages[randomIndex];

        // Get the first portfolio item to display the random art
        const firstPortfolioItem = portfolioItems[0];
        const img = firstPortfolioItem.querySelector('img');
        const h3 = firstPortfolioItem.querySelector('h3 span');
        const p = firstPortfolioItem.querySelector('p span');

        // Update its content with the random art
        img.src = randomArt.src;
        img.alt = randomArt.title;
        h3.textContent = randomArt.title;
        p.textContent = randomArt.description;

        // Show only the first portfolio item
        firstPortfolioItem.style.display = 'block';

    });

});