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
            if (el.id !== 'typingText') { // <-- This is the change
                el.textContent = lang === 'bn' ? el.getAttribute('data-bn') : el.getAttribute('data-en');
            }
        });
        // The typingText itself will remain constant as per user request,
        // so we don't need to update its textContent here.

        // Update document title based on language
        if (lang === 'bn') {
            document.title = "কাজল হাসান - সৃজনশীল অভিযাত্রী";
        } else {
            document.title = "Kajol Hasan - The Creative Explorer";
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

    // Current Year for Footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
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

    // Contact Form Submission (Google Apps Script)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'form-status';
        contactForm.insertBefore(statusDiv, contactForm.querySelector('button[type="submit"]')); // Insert before submit button

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true; // Disable button to prevent multiple submissions
            statusDiv.textContent = 'Sending message...';
            statusDiv.style.color = '#3498db'; // Blue for sending

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    redirect: 'follow', // Follow redirects, important for Apps Script
                    headers: {
                        // Apps Script sometimes needs specific headers if CORS is strict
                        // 'Content-Type': 'application/x-www-form-urlencoded', // FormData sets this automatically
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
                        statusDiv.style.color = '#2ecc71'; // Green for success
                        contactForm.reset();
                    } else {
                        statusDiv.textContent = data.message || 'Submission failed. Please try again.';
                        statusDiv.style.color = '#e74c3c'; // Red for error
                    }
                }
            } catch (error) {
                console.error('Error during form submission:', error);
                if (statusDiv) {
                    statusDiv.textContent = `An error occurred: ${error.message}. Please try again.`;
                    statusDiv.style.color = '#e74c3c'; // Red for error
                }
            } finally {
                if (submitButton) {
                    submitButton.disabled = false; // Re-enable button
                }
                setTimeout(() => {
                    if (statusDiv) {
                        statusDiv.textContent = ''; // Clear status message after 5 seconds
                    }
                }, 5000);
            }
        });
    }
});
