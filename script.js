
// Mobile Menu Toggle
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');

// Create mobile menu overlay for clicking outside
const menuOverlay = document.createElement('div');
menuOverlay.classList.add('menu-overlay');
document.body.appendChild(menuOverlay);

function closeMobileMenu() {
    if (navMenu) navMenu.classList.remove('show-menu');
    menuOverlay.classList.remove('show-overlay');
    if (navToggle) {
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}

if (navToggle) {
    navToggle.addEventListener('click', (e) => {
        // Prevent click from bubbling to document immediately
        e.stopPropagation();
        navMenu.classList.toggle('show-menu');
        menuOverlay.classList.toggle('show-overlay');
        
        // Toggle icon between bars and times (close)
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('show-menu')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu when clicking on the overlay
['click', 'touchstart'].forEach(eventType => {
    menuOverlay.addEventListener(eventType, (e) => {
        e.preventDefault(); // prevent triggering click under it
        closeMobileMenu();
    });
});

// Sticky Header on Scroll
const header = document.getElementById('header');

function scrollHeader() {
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    if (window.scrollY >= 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', scrollHeader);

// Active Link highlighting on scroll
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        
        // Find the corresponding link in the navbar
        const link = document.querySelector('.nav-menu a[href*=' + sectionId + ']');
        
        if(link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}
window.addEventListener('scroll', scrollActive);

// Smooth Scrolling for anchor links (fallback for browsers not supporting scroll-behavior: smooth)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// =====================================
// SUBTLE LUXURY ANIMATIONS
// =====================================

// 1. Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Slight delay for the outline for a smooth trailing effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Cursor hover effects on links and buttons
    const interactables = document.querySelectorAll('a, button, .magnetic');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover');
        });
    });
}

// 2. Magnetic Buttons
const magneticElements = document.querySelectorAll('.magnetic');

magneticElements.forEach(magnetic => {
    magnetic.addEventListener('mousemove', (e) => {
        const position = magnetic.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        
        magnetic.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    magnetic.addEventListener('mouseleave', () => {
        magnetic.style.transform = `translate(0px, 0px)`;
    });
});



// 4. Reveal On Scroll (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal-up');

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});





