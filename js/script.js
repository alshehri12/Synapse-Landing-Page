/**
 * Synapse Landing Page JavaScript
 * Author: Synapse Team
 * Last Updated: October 2025
 */

// ===========================
// Smooth Scroll for Anchor Links
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initMobileMenu();
    initScrollAnimations();
    initLazyLoadImages();
});

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize mobile menu toggle (for future implementation)
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

/**
 * Initialize scroll animations for elements
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoadImages() {
    // Add loaded class when images finish loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    lazyImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
                console.error('Failed to load image:', img.src);
                img.classList.add('loaded'); // Still show to prevent blank space
            });
        }
    });
}

/**
 * Utility: Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle scroll events (optional - for future features)
 */
const handleScroll = debounce(function() {
    // Add scroll-based functionality here
    // Example: Change navbar style on scroll
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
}, 100);

// window.addEventListener('scroll', handleScroll);

/**
 * Analytics event tracking (placeholder)
 */
function trackEvent(category, action, label) {
    // Integrate with Google Analytics or other analytics platform
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

/**
 * Track download button clicks
 */
document.querySelectorAll('[href*="download"]').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('Download', 'Click', 'App Download Button');
    });
});

/**
 * Form submission handler (for future contact forms)
 */
function handleFormSubmit(event) {
    event.preventDefault();

    // Add form validation and submission logic here
    console.log('Form submitted');

    // Example: Show success message
    // showNotification('Thank you! We\'ll be in touch soon.');
}

/**
 * Show notification (utility function)
 */
function showNotification(message, type = 'success') {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Performance monitoring
 */
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

        // Log performance metrics (optional)
        if (pageLoadTime > 0) {
            console.log(`Page load time: ${pageLoadTime}ms`);
        }
    });
}

/**
 * Error handling
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Send to error tracking service in production
});

/**
 * Service Worker registration (for future PWA features)
 */
if ('serviceWorker' in navigator) {
    // Uncomment when you have a service worker file
    /*
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
    */
}

// Export functions for testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSmoothScroll,
        initMobileMenu,
        trackEvent,
        debounce
    };
}
