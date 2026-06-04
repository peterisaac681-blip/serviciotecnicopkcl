/**
 * MÓVIL CENTER LO ESPEJO - LANDING PAGE INTERACTIVE JAVASCRIPT
 * Technical Stack: Vanilla JavaScript ES6+
 * Optimization: Focus on CRO, Accessibility (A11y), and High Performance.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // STICKY HEADER & NAV ACTIVE STATES
    // ==========================================================================
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        // Sticky Header Toggle
        if (window.scrollY > 40) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }

        // Active Navigation Link on Scroll
        const sections = document.querySelectorAll('section[id], header[id]');
        const scrollPosition = window.scrollY + 120; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    activeLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run on init in case page is refreshed while scrolled
    handleScroll();

    // ==========================================================================
    // RESPONSIVE MOBILE NAVIGATION (HAMBURGER MENU)
    // ==========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const openMenu = () => {
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    };
    
    const closeMenu = () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = ''; // Unlock background scrolling
    };

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close menu when clicking outside of nav menu
    document.addEventListener('click', (e) => {
        const isClickInsideMenu = navMenu.contains(e.target);
        const isClickOnToggle = navToggle.contains(e.target);
        if (navMenu.classList.contains('active') && !isClickInsideMenu && !isClickOnToggle) {
            closeMenu();
        }
    });

    // Handle Resize (Close mobile menu if resized to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // ==========================================================================
    // SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Trigger only once to save performance
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null, // Viewport
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '0px 0px -40px 0px' // Margins around root
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    // ==========================================================================
    // FAQ ACCORDION (INTERACTIVE)
    // ==========================================================================
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const faqItem = trigger.parentElement;
            const faqContent = faqItem.querySelector('.faq-content');
            const isOpen = faqItem.classList.contains('active');

            // Collapse all other FAQ items for a clean premium accordion experience
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                    item.querySelector('.faq-content').hidden = true;
                }
            });

            // Toggle clicked item
            if (isOpen) {
                faqItem.classList.remove('active');
                trigger.setAttribute('aria-expanded', 'false');
                faqContent.hidden = true;
            } else {
                faqItem.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                faqContent.hidden = false;
            }
        });
    });

    // ==========================================================================
    // GALLERY MASONRY LIGHTBOX WITH KEYBOARD ACCESS
    // ==========================================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxPlaceholder = document.getElementById('lightbox-placeholder');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    let lastActiveElement = null; // To restore keyboard focus on close

    const openLightbox = (item) => {
        lastActiveElement = document.activeElement;
        
        const title = item.getAttribute('data-title');
        const desc = item.getAttribute('data-desc');
        const img = item.querySelector('img');
        const placeholderImg = item.querySelector('.gallery-placeholder-img');

        lightboxTitle.textContent = title || 'Gama PK.CL';
        lightboxDesc.textContent = desc || 'Accesorios y servicio técnico premium.';

        lightbox.classList.remove('has-img', 'has-placeholder');

        if (img) {
            // Real image gallery item
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('has-img');
        } else if (placeholderImg) {
            // Placeholder/Stylized SVG vector gallery item
            lightboxPlaceholder.className = placeholderImg.className; // copy styles
            lightboxPlaceholder.innerHTML = placeholderImg.innerHTML; // copy content
            lightbox.classList.add('has-placeholder');
        }

        lightbox.hidden = false;
        // Small delay to trigger CSS transitions
        setTimeout(() => {
            lightbox.classList.add('active');
            lightboxClose.focus(); // Shift focus to close button for screen readers
        }, 10);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.hidden = true;
            lightboxImg.src = '';
            lightboxImg.alt = '';
            lightboxPlaceholder.innerHTML = '';
            lightboxPlaceholder.className = 'gallery-placeholder-img';
            
            // Restore focus
            if (lastActiveElement) {
                lastActiveElement.focus();
            }
        }, 400); // match transition duration
    };

    galleryItems.forEach(item => {
        // Accessibility: allow keyboard activation for gallery items
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Ver detalles de: ${item.getAttribute('data-title')}`);

        item.addEventListener('click', () => openLightbox(item));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(item);
            }
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox when clicking the backdrop
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // ==========================================================================
    // PROMOTIONAL BANNER SLIDER (CAROUSEL)
    // ==========================================================================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let currentSlide = 0;
    let autoplayInterval = null;
    const autoplayDelay = 6000; // 6 seconds

    const showSlide = (index) => {
        if (slides.length === 0) return;

        // Boundary safety check
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Toggle slides active status
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Toggle dots active status
        dots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlide - 1);
    };

    // Button controls
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    // Dot indicators controls
    dots.forEach((dot, index) => {
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoplay();
        });
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showSlide(index);
                resetAutoplay();
            }
        });
    });

    // Autoplay logic
    const startAutoplay = () => {
        if (!autoplayInterval && slides.length > 0) {
            autoplayInterval = setInterval(nextSlide, autoplayDelay);
        }
    };

    const stopAutoplay = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    };

    const resetAutoplay = () => {
        stopAutoplay();
        startAutoplay();
    };

    // Pause slider on hover (UX best practice)
    const promotionsSection = document.getElementById('promociones');
    if (promotionsSection) {
        promotionsSection.addEventListener('mouseenter', stopAutoplay);
        promotionsSection.addEventListener('mouseleave', startAutoplay);
        
        // Keyboard arrow navigation inside promotions section
        promotionsSection.setAttribute('aria-roledescription', 'carrusel');
        promotionsSection.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                resetAutoplay();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                resetAutoplay();
            }
        });
    }

    // ==========================================================================
    // HERO SMARTPHONE SHOWCASE SLIDER (7 SLIDES)
    // ==========================================================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentHeroSlide = 0;
    let heroAutoplayInterval = null;
    const heroAutoplayDelay = 4500; // 4.5 seconds

    const showHeroSlide = (index) => {
        if (heroSlides.length === 0) return;

        if (index >= heroSlides.length) {
            currentHeroSlide = 0;
        } else if (index < 0) {
            currentHeroSlide = heroSlides.length - 1;
        } else {
            currentHeroSlide = index;
        }

        heroSlides.forEach((slide, i) => {
            if (i === currentHeroSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    };

    const nextHeroSlide = () => {
        showHeroSlide(currentHeroSlide + 1);
    };

    const startHeroAutoplay = () => {
        if (!heroAutoplayInterval && heroSlides.length > 0) {
            heroAutoplayInterval = setInterval(nextHeroSlide, heroAutoplayDelay);
        }
    };

    const stopHeroAutoplay = () => {
        if (heroAutoplayInterval) {
            clearInterval(heroAutoplayInterval);
            heroAutoplayInterval = null;
        }
    };

    // Pause autoplay on mouse enter
    const heroSliderContainer = document.querySelector('.hero-slider-container');
    if (heroSliderContainer) {
        heroSliderContainer.addEventListener('mouseenter', stopHeroAutoplay);
        heroSliderContainer.addEventListener('mouseleave', startHeroAutoplay);
    }

    // Initialize Hero Autoplay
    startHeroAutoplay();

    // ==========================================================================
    // KEYBOARD NAV CLOSURES (ESC KEY) & GENERAL ACCESSIBILITY
    // ==========================================================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('active')) {
                closeLightbox();
            }
            if (navMenu.classList.contains('active')) {
                closeMenu();
                navToggle.focus();
            }
        }
        
        // Trap focus inside Lightbox when open
        if (lightbox.classList.contains('active') && e.key === 'Tab') {
            const focusableElements = lightbox.querySelectorAll('button, [tabindex="0"]');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
});
