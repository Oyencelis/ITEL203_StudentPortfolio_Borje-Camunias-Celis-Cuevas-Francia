// js/main.js

// Add this at the very top of the file
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleScroll);
} else {
    handleScroll();
}

function handleScroll() {
    // Check if we have a scroll target
    const target = localStorage.getItem('scrollTarget');
    if (target) {
        // Clear it immediately
        localStorage.removeItem('scrollTarget');
        
        // Force scroll after everything is loaded
        setTimeout(() => {
            const element = document.getElementById(target);
            if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 1000);
    }
}

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Configure GSAP
gsap.config({
    nullTargetWarn: false,
    trialWarn: false
});

gsap.defaults({
    overwrite: 'auto',
});

// Add force GPU acceleration
gsap.set('.project-card, .hero-container, .page-title', {
    willChange: 'transform',
    force3D: true
});

// Add this new function at the beginning of the file, right after the GSAP configurations
function handleHashScroll() {
    // Check if there's a hash in the URL
    if (window.location.hash) {
        // Remove the # from the hash
        const targetId = window.location.hash.slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Wait a brief moment for the page to settle
            setTimeout(() => {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
}

// Add this new code at the very beginning of main.js, before any other code
function scrollToSection() {
    console.log("Checking for scroll target...");
    
    // Get the target section from URL
    const urlParams = new URLSearchParams(window.location.search);
    const target = urlParams.get('goto');
    
    if (target) {
        console.log("Found target:", target);
        
        // Wait for page to be ready
        setTimeout(() => {
            const section = document.querySelector(`.${target}-section`);
            if (section) {
                console.log("Scrolling to section:", target);
                section.scrollIntoView({ behavior: 'smooth' });
                // Adjust for header
                window.scrollBy(0, -100);
            }
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    scrollToSection(); // Add this line first
    
    // Keep existing initializations
    initPageLoad();
    initHeroAnimations();
    initProjectsAnimations();
    initInfoAnimations();
    initContactAnimations();
    initInteractions();
    initScrollEffects();
    initStyleElements();
    initHeaderColorChange();
    initProjectPageAnimations();
    addImageStyles();
    preloadImages();
});

// Also add a popstate event listener to handle browser back/forward navigation
window.addEventListener('popstate', () => {
    handleHashScroll();
});

// Initialize page load animation
function initPageLoad() {
    gsap.from('body', {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => animateHeroSection()
    });
}

// Hero section animations
function initHeroAnimations() {
    const heroContainer = document.querySelector('.hero-container');
    if (!heroContainer) return;
    
    // Add subtle parallax to hero elements on scroll
    gsap.to(heroContainer, {
        y: (i, el) => el.offsetHeight * -0.1,
        ease: "none",
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5
        }
    });

    // Add subtle parallax to hero footer
    gsap.to('.hero-section footer', {
        y: 50,
        ease: "none",
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'center center',
            end: 'bottom top',
            scrub: 0.5
        }
    });

    // Add subtle rotation effect to logo on scroll
    gsap.to('.logo-image', {
        rotation: 360,
        scrollTrigger: {
            trigger: '.hero-section',
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });
}

// Function to animate hero section without scroll triggers
function animateHeroSection() {
    const heroTl = gsap.timeline();

    heroTl
        .from('.logo', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' })
        .from('nav ul li', { y: -50, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .from('.hero-container .icon', { y: 100, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
        .from('.headline', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.7')
        .from('.footer-column', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(1.7)' },)
        .from('.hero-footer', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
}

// Projects section animations
function initProjectsAnimations() {
    const projectsSection = document.querySelector('.projects-section');
    
    // Only run if projects section exists
    if (!projectsSection) return;

    gsap.from('.projects-section .page-title', {
        scrollTrigger: {
            trigger: '.projects-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length) {
        gsap.from(projectCards, {
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 100,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    const projectInfo = document.querySelectorAll('.project-info-container');
    if (projectInfo.length) {
        gsap.from(projectInfo, {
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            delay: 0.3,
            ease: 'power2.out'
        });
    }

    initHorizontalScroll();
    initProjectCardHoverEffects();
}

// Horizontal scroll for projects
function initHorizontalScroll() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    // Only initialize if projects grid exists
    if (!projectsGrid) return;

    const getTotalDistance = () => {
        const isMobile = window.innerWidth <= 768;
        const containerWidth = projectsGrid.scrollWidth;
        const viewportWidth = window.innerWidth;
        const extraSpace = isMobile ? viewportWidth * 0.6 : viewportWidth * 0.5;

        return -(containerWidth - viewportWidth + extraSpace);
    };

    gsap.to('.projects-grid', {
        x: getTotalDistance,
        ease: "none",
        scrollTrigger: {
            trigger: ".projects-section",
            start: "top top",
            end: () => {
                const distance = Math.abs(getTotalDistance());
                const isMobile = window.innerWidth <= 768;
                return `+=${isMobile ? distance + window.innerWidth * 0.5 : distance}`;
            },
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                gsap.utils.toArray('.project-card').forEach((card, i) => {
                    const speed = i * 0.05;
                    gsap.to(card, {
                        x: self.progress * speed * 100,
                        duration: 0.5,
                        ease: 'power1.out'
                    });
                });
            }
        }
    });
}

// Project card hover effects
function initProjectCardHoverEffects() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const image = card.querySelector('.project-image');
        const info = card.querySelector('.project-info');
        const arrow = card.querySelector('.project-arrow');

        gsap.set(card, { perspective: 1000 });

        const hoverTl = gsap.timeline({ paused: true });

        hoverTl
            .to(image, { scale: 1.05, duration: 0.5, ease: 'power2.out' })
            .to(card, { rotationY: 5, rotationX: -5, boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)', duration: 0.3, ease: 'power2.out' }, '-=0.5')
            .to(info, { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.5')
            .to(arrow, { rotation: 45, duration: 0.3, ease: 'power2.out' }, '-=0.3');

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const xPos = (e.clientX - rect.left) / rect.width - 0.5;
            const yPos = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(card, { rotationY: xPos * 10, rotationX: yPos * -10, duration: 0.3, ease: 'power2.out' });
        });

        card.addEventListener('mouseenter', () => hoverTl.play());
        card.addEventListener('mouseleave', () => {
            hoverTl.reverse();
            gsap.to(card, { rotationY: 0, rotationX: 0, boxShadow: 'none', duration: 0.5, ease: 'power2.out' });
        });
    });
}

// Info section animations
function initInfoAnimations() {
    const infoTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.info-section',
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
        }
    });

    infoTl
        .from('.info-title', { y: 50, opacity: 0, duration: 0.8, ease: 'power4.out' })
        .from('.info-item', { y: 30, opacity: 0, stagger: 0.2, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .from('.service-item', { y: 20, opacity: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' }, '-=0.2');

    gsap.utils.toArray('.info-row').forEach((row) => {
        gsap.from(row, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: row,
                start: "top 80%",
                end: "bottom 70%",
                toggleActions: "play none none reverse"
            }
        });
    });

    gsap.utils.toArray('.info-label').forEach((label) => {
        const line = document.createElement('div');
        line.className = 'label-line';
        label.appendChild(line);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: label,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        tl.from(label, { x: -50, opacity: 0, duration: 0.6, ease: "power2.out" })
          .from(line, { width: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.3");
    });

    const infoParagraphs = document.querySelectorAll('.info-content p');
    infoParagraphs.forEach(paragraph => {
        const lines = paragraph.innerHTML.split('. ');
        paragraph.innerHTML = '';

        lines.forEach((line, i) => {
            const lineElement = document.createElement('span');
            lineElement.className = 'animated-line';
            lineElement.innerHTML = i < lines.length - 1 ? line + '. ' : line;
            paragraph.appendChild(lineElement);
        });

        gsap.utils.toArray(paragraph.querySelectorAll('.animated-line')).forEach((line, i) => {
            gsap.from(line, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: paragraph,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        });
    });

    initServiceItems();
    initReadMoreButton();
}

// Service item animations
function initServiceItems() {
    const serviceItems = document.querySelectorAll('.services-column div');
    serviceItems.forEach((item, index) => {
        const numberPrefix = document.createElement('span');
        numberPrefix.className = 'service-number';
        numberPrefix.textContent = `0${index + 1}. `;
        item.prepend(numberPrefix);

        gsap.from(item, {
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.6,
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                backgroundColor: 'rgba(0, 184, 148, 0.1)',
                borderRadius: '4px',
                paddingLeft: '10px',
                boxShadow: '0 2px 10px rgba(0, 184, 148, 0.2)',
                duration: 0.3
            });

            gsap.to(item.querySelector('.service-number'), {
                color: 'var(--gray-color)',
                duration: 0.3
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                backgroundColor: 'transparent',
                borderRadius: '0px',
                paddingLeft: '0px',
                boxShadow: 'none',
                duration: 0.3
            });

            gsap.to(item.querySelector('.service-number'), {
                color: 'var(--gray-color)',
                duration: 0.3
            });
        });
    });
}

// Read more button animations
function initReadMoreButton() {
    const readMoreButton = document.querySelector('.read-more');
    if (readMoreButton) {
        readMoreButton.classList.add('fancy');

        gsap.from(readMoreButton, {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: readMoreButton,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });

        readMoreButton.addEventListener('mouseenter', () => {
            gsap.to(readMoreButton, {
                scale: 1.05,
                duration: 0.3,
                ease: "power1.out"
            });
        });

        readMoreButton.addEventListener('mouseleave', () => {
            gsap.to(readMoreButton, {
                scale: 1,
                duration: 0.3,
                ease: "power1.out"
            });
        });
    }
}

// Header color change logic
function initHeaderColorChange() {
    const header = document.querySelector('.header');

    function updateHeaderColor() {
        const projectsSection = document.querySelector('.projects-section');
        const headerRect = header.getBoundingClientRect();
        const headerCenter = headerRect.top + headerRect.height / 2;

        if (isElementInViewport(projectsSection, headerCenter)) {
            header.style.color = '#ffffff';
        } else {
            header.style.color = '#1a1a1a';
        }
    }

    function isElementInViewport(element, yPosition) {
        const rect = element.getBoundingClientRect();
        return (rect.top <= yPosition && rect.bottom >= yPosition);
    }

    updateHeaderColor();

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                updateHeaderColor();
                scrollTimeout = null;
            }, 10);
        }
    }, { passive: true });

    window.addEventListener('resize', updateHeaderColor);

    ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: () => updateHeaderColor()
    });
}

// Interactive elements
function initInteractions() {
    initNavLinks();
    initProjectTitles();
    initFooterTitles();
    initHeadlineEffect();
    initPageTitleEffect();

    gsap.from('.footer-column', {
        scrollTrigger: {
            trigger: 'footer',
            start: 'top bottom',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out'
    });
}

// Navigation links effect
function initNavLinks() {
    document.querySelectorAll('nav ul li a').forEach(link => {
        // Clear existing content and create letter spans
        const text = link.textContent;
        link.textContent = '';
        
        // Split text into individual letters
        text.split('').forEach(letter => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.display = 'inline-block';
            span.style.transform = 'translateY(0)';
            link.appendChild(span);
        });

        const letters = link.querySelectorAll('span');

        // Hover animation
        link.addEventListener('mouseenter', () => {
            gsap.to(letters, {
                y: -3,
                stagger: { amount: 0.2, from: "start" },
                ease: "power2.out"
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(letters, {
                y: 0,
                stagger: { amount: 0.2, from: "end" },
                ease: "power2.in"
            });
        });

        // Click handling for navigation
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Handle links with hash
            if (href.includes('#')) {
                // If it's a link to another page with a hash
                if (href.includes('.html#')) {
                    const [pagePath, hash] = href.split('#');
                    
                    // If we're already on the target page
                    if (window.location.pathname.endsWith(pagePath)) {
                        e.preventDefault();
                        const target = document.querySelector('#' + hash);
                        if (target) {
                            gsap.to(window, {
                                duration: 1,
                                scrollTo: {
                                    y: target,
                                    offsetY: 50
                                },
                                ease: 'power3.inOut'
                            });
                        }
                    } else {
                        // If going to another page, store the target in localStorage
                        localStorage.setItem('scrollTarget', hash);
                    }
                } else if (href.startsWith('#')) {
                    // Same page anchor link
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        // Create flash effect
                        const flashHighlight = document.createElement('div');
                        flashHighlight.style.position = 'fixed';
                        flashHighlight.style.top = '0';
                        flashHighlight.style.left = '0';
                        flashHighlight.style.width = '100%';
                        flashHighlight.style.height = '100%';
                        flashHighlight.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        flashHighlight.style.pointerEvents = 'none';
                        flashHighlight.style.zIndex = '9999';
                        document.body.appendChild(flashHighlight);

                        gsap.to(flashHighlight, {
                            opacity: 0,
                            duration: 0.5,
                            onComplete: () => document.body.removeChild(flashHighlight)
                        });

                        gsap.to(window, {
                            duration: 1,
                            scrollTo: {
                                y: target,
                                offsetY: 50
                            },
                            ease: 'power3.inOut'
                        });
                    }
                }
            }
        });
    });
}

// Project titles hover effect
function initProjectTitles() {
    document.querySelectorAll('.project-title').forEach(title => {
        const hoverTl = gsap.timeline({ paused: true });

        hoverTl.to(title, {
            color: '#00B894',
            duration: 0.3,
            ease: "power2.out"
        });

        title.parentElement.parentElement.addEventListener('mouseenter', () => hoverTl.play());
        title.parentElement.parentElement.addEventListener('mouseleave', () => hoverTl.reverse());
    });
}

// Footer titles hover effect
function initFooterTitles() {
    document.querySelectorAll('.footer-title').forEach(title => {
        title.addEventListener('mouseenter', () => {
            gsap.to(title, {
                scale: 1.1,
                color: '#00B894',
                duration: 0.3,
                ease: "power2.out"
            });
        });

        title.addEventListener('mouseleave', () => {
            gsap.to(title, {
                scale: 1,
                color: 'inherit',
                duration: 0.3,
                ease: "power2.in"
            });
        });
    });
}

// Headline hover effect
function initHeadlineEffect() {
    const headline = document.querySelector('.headline');
    const words = headline.textContent.split(' ');
    headline.innerHTML = '';

    words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline';
        wordSpan.textContent = word;

        wordSpan.addEventListener('mousemove', (e) => {
            const rect = wordSpan.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const moveX = (e.clientX - centerX) * 0.05;
            const moveY = (e.clientY - centerY) * 0.05;

            gsap.to(wordSpan, {
                x: moveX,
                y: moveY,
                scale: 1.05,
                color: '#00B894',
                duration: 0.3,
                ease: "power2.out"
            });

            const siblings = [...headline.children];
            siblings.forEach((sibling, i) => {
                if (sibling !== wordSpan) {
                    const distance = Math.abs(i - wordIndex);
                    gsap.to(sibling, {
                        opacity: 0.98 - (distance * 0.02),
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });

        wordSpan.addEventListener('mouseleave', () => {
            gsap.to(wordSpan, {
                x: 0,
                y: 0,
                scale: 1,
                color: 'var(--text-color)',
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });

            const siblings = [...headline.children];
            siblings.forEach(sibling => {
                gsap.to(sibling, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        headline.appendChild(wordSpan);

        if (wordIndex < words.length - 1) {
            const space = document.createElement('span');
            space.innerHTML = ' ';
            space.style.display = 'inline';
            headline.appendChild(space);
        }
    });
}

// Page title magnetic effect
function initPageTitleEffect() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.addEventListener('mousemove', (e) => {
            const rect = pageTitle.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const moveX = (e.clientX - centerX) * 0.1;
            const moveY = (e.clientY - centerY) * 0.1;

            gsap.to(pageTitle, {
                x: moveX,
                y: moveY,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        pageTitle.addEventListener('mouseleave', () => {
            gsap.to(pageTitle, {
                x: 0,
                y: 0,
                duration: 1,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }
}

// Add scroll effects
function initScrollEffects() {
    gsap.utils.toArray('.hero-section, .projects-section, .info-section').forEach(section => {
        gsap.to(section, {
            backgroundPositionY: "30%",
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
}

// Add style elements
function initStyleElements() {
    const combinedStyles = `
        /* Headline */
        .headline { display: block; line-height: 1.3; letter-spacing: -0.02em; text-align: left; cursor: default; }
        .headline span { display: inline; will-change: transform, opacity; }

        /* Info animations */
        .label-line { height: 2px; width: 100%; background: var(--accent-color); margin-top: 8px; opacity: 0.7; }
        .animated-line { display: inline; position: relative; }
        .service-number { color: var(--gray-color); font-weight: 500; margin-right: 5px; transition: color 0.3s ease; }
        .services-column div { padding: 5px; margin-bottom: 15px; cursor: pointer; transition: all 0.3s ease; }
        .info-label { position: relative; overflow: hidden; }

        /* Fancy underline for read-more */
        .fancy { position: relative; overflow: hidden; }
        .fancy:after {
            content: '';
            position: absolute;
            bottom: 0; left: 0;
            width: 100%; height: 1px;
            background-color: currentColor;
            transform: scaleX(0); transform-origin: right;
            transition: transform 0.3s ease;
        }
        .fancy:hover:after {
            transform: scaleX(1); transform-origin: left;
        }

        /* Nav link letters */
        nav ul li a span { display: inline-block; transition: transform 0.3s ease; }

        /* Misc titles */
        .page-title, .project-title, .footer-title { cursor: default; transition: all 0.3s ease; }

        /* Nav link hover effect */
        nav ul li a {
            position: relative;
            display: inline-block;
            padding: 4px 0;
            overflow: hidden;
        }
        
        nav ul li a span {
            display: inline-block;
            transition: transform 0.3s ease;
            will-change: transform;
        }
        
        nav ul li a:hover span {
            color: #808080;
        }
    `;
    addStyleToDocument(combinedStyles);
}

function addStyleToDocument(styles) {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// Make sure to refresh ScrollTrigger on resize
window.addEventListener('resize', () => {
    setTimeout(() => {
        ScrollTrigger.refresh(true);
    }, 100);
});

// Contact section animations
function initContactAnimations() {
    const contactTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 70%',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
        }
    });

    contactTl
        .from('.contact-section .page-title', { y: 50, opacity: 0, duration: 0.8, ease: 'power4.out' })
        .from('.contact-headline', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .from('.contact-text', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .from('.contact-email', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .from('.back-button', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.3')
        .from('.social-link', { x: 30, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }, '-=0.4')
        .from('.copyright', { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' }, '-=0.2');

    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('mouseenter', () => {
            gsap.to(backButton, { scale: 1.1, duration: 0.3, ease: 'power2.out' });
        });

        backButton.addEventListener('mouseleave', () => {
            gsap.to(backButton, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });

        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: 0 },
                ease: 'power3.inOut'
            });
        });
    }

    document.querySelectorAll('.social-link').forEach(link => {
        const originalText = link.textContent;

        link.addEventListener('mouseenter', () => {
            const timeline = gsap.timeline();
            timeline
                .to(link, { color: '#808080', duration: 0.2 })
                .to(link, { text: originalText + ' →', duration: 0.2 });
        });

        link.addEventListener('mouseleave', () => {
            const timeline = gsap.timeline();
            timeline
                .to(link, { text: originalText, duration: 0.2 })
                .to(link, { color: 'var(--bg-color)', duration: 0.2 }, '-=0.1');
        });
    });
}

// Add this at the beginning of main.js, before any other code
document.addEventListener('DOMContentLoaded', function() {
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section) {
        let targetElement;
        
        // Find the correct element based on the section parameter
        if (section === 'projects') {
            targetElement = document.getElementById('work');
        } else if (section === 'info') {
            targetElement = document.getElementById('info');
        }
        
        if (targetElement) {
            // Force scroll after a delay
            setTimeout(() => {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 500);
        }
    }
});

// Add this new function after initPageLoad()
function initProjectPageAnimations() {
    // Only run on project pages and team page (not on index.html)
    if (!window.location.pathname.includes('index.html')) {
        // Animate header elements
        gsap.from('.header', {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        // Animate the title and overview section
        const infoContainer = document.querySelector('.info-container');
        if (infoContainer) {
            gsap.from('.info-title', {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.info-title',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });

            // Animate each info row
            gsap.utils.toArray('.info-row').forEach((row, index) => {
                gsap.from(row, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    delay: index * 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });
        }

        // Enhanced image animations with scroll trigger
        gsap.utils.toArray('img, .image-placeholder').forEach((image, index) => {
            // Initial state
            gsap.set(image, {
                opacity: 0,
                y: 100,
                scale: 0.95
            });

            // Create timeline for each image
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: image,
                    start: "top 85%",
                    end: "top 15%",
                    toggleActions: "play none none reverse",
                    markers: false
                }
            });

            // Add animations to timeline
            tl.to(image, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: "power3.out",
                clearProps: "all" // Cleans up inline styles after animation
            });

            // Optional parallax effect
            ScrollTrigger.create({
                trigger: image,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                onUpdate: (self) => {
                    const yPos = self.progress * 50; // 50px of parallax movement
                    gsap.to(image, {
                        y: yPos,
                        ease: "none",
                        duration: 0.1
                    });
                }
            });
        });

        // Add reveal animation for image captions if they exist
        gsap.utils.toArray('.image-caption, figcaption').forEach((caption, index) => {
            if (caption) {
                gsap.from(caption, {
                    opacity: 0,
                    y: 20,
                    duration: 0.8,
                    delay: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: caption,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });

        // Add stagger effect for multiple images in a row/grid
        const imageGroups = document.querySelectorAll('.image-grid, .gallery, .project-images');
        imageGroups.forEach(group => {
            const images = group.querySelectorAll('img');
            if (images.length > 1) {
                gsap.from(images, {
                    opacity: 0,
                    y: 100,
                    scale: 0.9,
                    stagger: {
                        amount: 0.6,
                        ease: "power2.out"
                    },
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: group,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });

        // Add hover effect for images
        gsap.utils.toArray('img').forEach(img => {
            img.addEventListener('mouseenter', () => {
                gsap.to(img, {
                    scale: 1.02,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });

            img.addEventListener('mouseleave', () => {
                gsap.to(img, {
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        });

        // Special animation for team page
        const teamGrid = document.querySelector('.team-grid');
        if (teamGrid) {
            gsap.from('.team-member', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.team-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // Animate the footer
        gsap.from('.site-footer', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.site-footer',
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });
    }
}

// Add this new function for handling image loading
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            imageLoaded(img);
        } else {
            img.addEventListener('load', () => imageLoaded(img));
        }
    });
}

function imageLoaded(img) {
    // Add a class to handle fade-in
    img.classList.add('loaded');
    
    // Optional: Add a subtle reveal animation when image loads
    gsap.from(img, {
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });
}

// Add this CSS to your styles
const imageStyles = `
    img {
        opacity: 0;
        transition: transform 0.5s ease;
        will-change: transform;
    }

    img.loaded {
        opacity: 1;
    }

    .image-grid, .gallery, .project-images {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    .image-caption {
        margin-top: 8px;
        font-size: 0.9em;
        color: var(--text-color);
        opacity: 0.8;
    }
`;

// Add the new styles to the document
function addImageStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = imageStyles;
    document.head.appendChild(styleElement);
}
