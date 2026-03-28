/**
 * ARISE SOLO - Mobile First System Design
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollReveal();
    initSmoothScroll();
    initBtnEffects();
    initScreenshotSlider();
    initFloatingButton();
    cleanTrackingUrl();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const body = document.body;
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
            menuBtn.innerHTML = nav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                body.style.overflow = '';
            });
        });
    }
}

/**
 * Intersection Observer for scroll animations
 */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // observer.unobserve(entry.target); // Optional: if you want it to trigger once
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    // Also include feature cards in the reveal
    document.querySelectorAll('.feature-card').forEach(card => {
        card.classList.add('reveal');
        observer.observe(card);
    });
}

/**
 * Smooth Scroll to sections
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle initial hash if present
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

/**
 * System UI Effects
 */
function initBtnEffects() {
    document.querySelectorAll('.btn, .floating-install').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const isExternal = btn.getAttribute('target') === '_blank';
            const btnName = btn.innerText || btn.getAttribute('aria-label') || 'Install Button';
            
            // GA4 Event tracking
            if (typeof gtag === 'function') {
                gtag('event', 'app_download_click', {
                    'button_name': btnName,
                    'is_external': isExternal
                });
            }

            showSystemNotification('System Signal: ' + (isExternal ? 'Redirecting' : 'Processing'));
        });
    });
}

function showSystemNotification(text) {
    const existing = document.querySelector('.system-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'system-toast';
    toast.innerHTML = `<i class="fas fa-bolt"></i> ${text}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: rgba(15, 23, 42, 0.95);
        color: #3b82f6;
        padding: 12px 24px;
        border: 1px solid #3b82f6;
        border-radius: 8px;
        font-weight: 800;
        text-transform: uppercase;
        font-size: 14px;
        letter-spacing: 1px;
        z-index: 9999;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        transform: translate3d(0, 100px, 0);
        transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1);
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.style.transform = 'translate3d(0, 0, 0)', 50);
    setTimeout(() => {
        toast.style.transform = 'translate3d(0, 150px, 0)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

/**
 * Screenshot Slider - Auto-slide and Dots
 */
function initScreenshotSlider() {
    const slider = document.querySelector('.screenshot-slider');
    const dots = document.querySelectorAll('.dot');
    if (!slider || dots.length === 0) return;

    let currentIndex = 0;
    const totalSlides = dots.length;
    let autoSlideInterval;

    const startAutoSlide = () => {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            const scrollWidth = slider.offsetWidth;
            slider.scrollTo({
                left: scrollWidth * currentIndex,
                behavior: 'smooth'
            });
        }, 3500);
    };

    const updateDots = (index) => {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };

    // Update dots and index on scroll
    let isScrolling;
    slider.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            const index = Math.round(slider.scrollLeft / slider.offsetWidth);
            if (index !== currentIndex) {
                currentIndex = index;
                updateDots(currentIndex);

                // GA4 Event tracking for slider engagement
                if (typeof gtag === 'function') {
                    gtag('event', 'screenshot_swipe', {
                        'screen_index': currentIndex,
                        'screen_name': document.querySelectorAll('.screenshot-slider img')[currentIndex].alt
                    });
                }
            }
        }, 50);
    });

    // Interaction handling
    slider.addEventListener('touchstart', () => {
        clearInterval(autoSlideInterval);
    }, {passive: true});

    slider.addEventListener('touchend', () => {
        startAutoSlide();
    }, {passive: true});

    // Start initial
    startAutoSlide();
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
        }, 1000); // Wait 1 second to ensure GA4 has grabbed the data
    }
}