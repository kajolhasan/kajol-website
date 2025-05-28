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
            }); // Smooth scroll to top
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked (for smoother mobile navigation)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            navLinks.classList.remove('active'); // Close mobile menu after click

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Get the height of the fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;

                // Calculate the position to scroll to
                // Subtract navbarHeight to account for the fixed navbar
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight active nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('.nav-links li a');

    function highlightNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - document.querySelector('.navbar').offsetHeight; // Adjust for navbar height
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Call on load to set initial active link

    // Photo Gallery Lightbox Functionality
    const galleryImages = document.querySelectorAll('.gallery-grid img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');

    galleryImages.forEach(image => {
        image.addEventListener('click', () => {
            lightbox.classList.add('active');
            lightboxImg.src = image.src;
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });

    // Photo Gallery Show/Hide Option
    const toggleGalleryBtn = document.getElementById('toggleGalleryBtn');
    const galleryGrid = document.querySelector('.gallery-grid');

    if (toggleGalleryBtn && galleryGrid) {
        toggleGalleryBtn.addEventListener('click', () => {
            galleryGrid.classList.toggle('hidden');
            const currentLang = localStorage.getItem('language') || 'en'; // Get current language
            if (galleryGrid.classList.contains('hidden')) {
                toggleGalleryBtn.textContent = currentLang === 'bn' ? 'গ্যালারি দেখান' : 'Show Gallery';
            } else {
                toggleGalleryBtn.textContent = currentLang === 'bn' ? 'গ্যালারি লুকান' : 'Hide Gallery';
            }
        });
    }


    // Contact Form Submission (Google Apps Script)
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'form-status';
        contactForm.insertBefore(statusDiv, contactForm.querySelector('button[type="submit"]')); // Insert before submit button

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true; // Disable button to prevent multiple submissions

            // Determine text color based on dark mode
            const isDarkMode = document.body.classList.contains('dark-mode');
            const defaultTextColor = isDarkMode ? '#fff' : '#3498db'; // White in dark mode, blue in light mode
            const successTextColor = isDarkMode ? '#90ee90' : '#2ecc71'; // Light green in dark mode, green in light mode
            const errorTextColor = isDarkMode ? '#ff6347' : '#e74c3c'; // Tomato in dark mode, red in light mode

            statusDiv.textContent = 'Sending message...';
            statusDiv.style.color = defaultTextColor; // Set initial color

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
                    // Handle cases where Apps Script returns plain text or HTML (e.g., on error)
                    const responseText = await response.text();
                    console.warn('Received non-JSON response from Google Apps Script:', responseText);
                    // Attempt to parse if it's stringified JSON, or assume a success for simplicity
                    try {
                        data = JSON.parse(responseText);
                    } catch (parseError) {
                        data = { message: 'Form submitted successfully (non-JSON response from server).', status: 'success' };
                    }
                }

                if (statusDiv) {
                    if (data.status === 'success') {
                        statusDiv.textContent = data.message || 'Message sent successfully!';
                        statusDiv.style.color = successTextColor; // Set success color
                        contactForm.reset();
                    } else {
                        statusDiv.textContent = data.message || 'Submission failed. Please try again.';
                        statusDiv.style.color = errorTextColor; // Set error color
                    }
                }
            } catch (error) {
                console.error('Error during form submission:', error);
                if (statusDiv) {
                    statusDiv.textContent = `An error occurred: ${error.message}. Please try again.`;
                    statusDiv.style.color = errorTextColor; // Set error color
                }
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                }
                setTimeout(() => {
                    if (statusDiv) {
                        statusDiv.textContent = ''; // Clear status message after 5 seconds
                    }
                }, 5000);
            }
        });
    }

    // Current Year for Footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
