// Initialize AOS (Animate On Scroll) library
AOS.init();

document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const toggle = document.getElementById('darkModeToggle');
    toggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Language Toggle Function
    function setLanguage(lang) {
        const elements = document.querySelectorAll('[data-en]');
        elements.forEach(el => {
            el.textContent = lang === 'bn' ? el.getAttribute('data-bn') : el.getAttribute('data-en');
        });
        if (lang === 'bn') {
            document.title = "কাজল হাসান - সৃজনশীল অভিযাত্রী";
        } else {
            document.title = "Kajol Hasan - The Creative Explorer";
        }
    }
    // Make setLanguage globally accessible since it's called from inline HTML
    window.setLanguage = setLanguage;

    // Photo Gallery Lightbox Functionality (using event delegation for efficiency)
    const photoGallery = document.querySelector('#galleryContent .gallery'); // Target the inner gallery div
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (photoGallery) { // Ensure the gallery element exists
        photoGallery.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                lightboxImg.src = e.target.src;
                lightbox.style.display = 'flex';
            }
        });
    }

    function closeLightbox() {
        document.getElementById('lightbox').style.display = 'none';
    }
    // Make closeLightbox globally accessible since it's called from inline HTML
    window.closeLightbox = closeLightbox;

    // Gallery Show/Hide Toggle
    const toggleGalleryBtn = document.getElementById('toggleGalleryBtn');
    const galleryContent = document.getElementById('galleryContent');

    if (toggleGalleryBtn && galleryContent) { // Ensure both elements exist
        toggleGalleryBtn.addEventListener('click', () => {
            if (galleryContent.style.display === 'none') {
                galleryContent.style.display = 'grid'; // Set to 'grid' to match .gallery CSS
                toggleGalleryBtn.textContent = 'Hide Gallery';
            } else {
                galleryContent.style.display = 'none';
                toggleGalleryBtn.textContent = 'Show Gallery';
            }
        });
    }

    // Contact Form Submission (Google Apps Script)
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('status');

    if (form) { // Ensure the form element exists
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Disable the submit button to prevent multiple submissions
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            statusDiv.textContent = 'Submitting...';

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                });

                // Check if the response was successful (status 200-299)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Attempt to parse JSON; if not JSON, handle as plain text
                const contentType = response.headers.get("content-type");
                let data;
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    data = await response.json();
                } else {
                    data = { message: 'Submission successful, but no JSON response from server.', status: 'success' };
                }

                statusDiv.textContent = data.message;
                if (data.status === 'success') {
                    form.reset();
                }
            } catch (error) {
                console.error('Error:', error);
                statusDiv.textContent = 'An error occurred. Please try again.';
            } finally {
                submitButton.disabled = false;
            }
        });
    }
});