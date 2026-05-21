/**
 * Typo Edit - Landing Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initKineticText();
    initFloatingButton();
    cleanTrackingUrl();
});

/**
 * Scroll Reveal Animations
 */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

/**
 * Kinetic Text Entry Animation
 */
function initKineticText() {
    const lines = document.querySelectorAll('.kinetic-text .line');
    const subtext = document.querySelector('.hero-subtext');
    
    // Very basic vanilla JS reveal logic for kinetic text
    lines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(50px)';
        line.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 100 + (index * 200));
    });

    if (subtext) {
        setTimeout(() => {
            subtext.style.opacity = '1';
            subtext.style.transform = 'translateY(0)';
            subtext.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }, 600);
    }
}

/**
 * Floating Install Button Visibility
 */
function initFloatingButton() {
    const fab = document.querySelector('.floating-install');
    if (!fab) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            fab.classList.add('visible');
        } else {
            fab.classList.remove('visible');
        }
    }, {passive: true});
}

/**
 * Clean URL (Hide UTM tags after GA4 grabs them)
 */
function cleanTrackingUrl() {
    if (window.history.replaceState && window.location.search.includes('utm_')) {
        setTimeout(() => {
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({path: cleanUrl}, '', cleanUrl);
        }, 1000);
    }
}
