// Initialize AOS (Animate On Scroll) library
AOS.init();

document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
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

    // Photo Gallery Lightbox Functionality
    const photoGallery = document.querySelector('#galleryContent .gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (photoGallery) {
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
    window.closeLightbox = closeLightbox;

    // Gallery Show/Hide Toggle Logic
    const toggleGalleryBtn = document.getElementById('toggleGalleryBtn');
    const galleryContent = document.getElementById('galleryContent');

    if (toggleGalleryBtn && galleryContent) {
        toggleGalleryBtn.addEventListener('click', () => {
            if (galleryContent.style.display === 'none') {
                galleryContent.style.display = 'grid';
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

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
            }
            if (statusDiv) {
                statusDiv.textContent = 'Submitting...';
                statusDiv.style.color = '#3498db';
            }

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText || 'Unknown error'}`);
                }

                const contentType = response.headers.get("content-type");
                let data;
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    const responseText = await response.text();
                    console.warn('Received non-JSON response from Google Apps Script:', responseText);
                    data = { message: 'Form submitted successfully (non-JSON response from server).', status: 'success' };
                }

                if (statusDiv) {
                    if (data.status === 'success') {
                        statusDiv.textContent = data.message || 'Message sent successfully!';
                        statusDiv.style.color = '#2ecc71';
                        form.reset();
                    } else {
                        statusDiv.textContent = data.message || 'Submission failed. Please try again.';
                        statusDiv.style.color = '#e74c3c';
                    }
                }
            } catch (error) {
                console.error('Error during form submission:', error);
                if (statusDiv) {
                    statusDiv.textContent = `An error occurred: ${error.message}. Please try again.`;
                    statusDiv.style.color = '#e74c3c';
                }
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                }
                setTimeout(() => {
                    if (statusDiv) {
                        statusDiv.textContent = '';
                    }
                }, 5000);
            }
        });
    }
});
