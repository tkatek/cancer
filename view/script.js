/* ==========================================
   Hope for Kids - Main JavaScript
   ========================================== */

// ==========================================
// DOM Elements
// ==========================================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('header');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const statNumbers = document.querySelectorAll('.stat-number');

// ==========================================
// Mobile Menu Toggle
// ==========================================
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        
        // Toggle icon between bars and times
        const icon = navToggle.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        
        // Reset icon to bars
        const icon = navToggle?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('show');
        
        // Reset icon to bars
        const icon = navToggle?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// ==========================================
// Smooth Scrolling
// ==========================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Smooth scroll for all anchor links (including CTA buttons)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const targetSection = document.querySelector(href);
        if (targetSection) {
            e.preventDefault();
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// Scroll Effects
// ==========================================
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header shadow on scroll
    if (scrollTop > 100) {
        header.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
    
    // Show/hide back to top button
    if (scrollTop > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
    
    lastScrollTop = scrollTop;
});

// Back to top button functionality
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// Animated Counters
// ==========================================
let hasAnimated = false;

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas for thousands
        if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString();
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function startCounterAnimation() {
    if (hasAnimated) return;
    
    const impactSection = document.getElementById('impact');
    if (!impactSection) return;
    
    const sectionTop = impactSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    // Start animation when section is 70% visible
    if (sectionTop < windowHeight * 0.7) {
        hasAnimated = true;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateCounter(stat, target);
        });
    }
}

// Check on scroll
window.addEventListener('scroll', startCounterAnimation);

// Check on page load
document.addEventListener('DOMContentLoaded', startCounterAnimation);

// ==========================================
// Form Validation
// ==========================================
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form fields
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Get error elements
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const messageError = document.getElementById('message-error');
        
        // Reset errors
        nameError.textContent = '';
        emailError.textContent = '';
        messageError.textContent = '';
        
        // Reset field styles
        nameInput.style.borderColor = '#e0e0e0';
        emailInput.style.borderColor = '#e0e0e0';
        messageInput.style.borderColor = '#e0e0e0';
        
        let isValid = true;
        
        // Validate name
        const name = nameInput.value.trim();
        if (name === '') {
            nameError.textContent = 'Please enter your full name';
            nameInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (name.length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            nameInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(name)) {
            nameError.textContent = 'Name can only contain letters and spaces';
            nameInput.style.borderColor = '#e74c3c';
            isValid = false;
        }
        
        // Validate email
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            emailError.textContent = 'Please enter your email address';
            emailInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.style.borderColor = '#e74c3c';
            isValid = false;
        }
        
        // Validate message
        const message = messageInput.value.trim();
        if (message === '') {
            messageError.textContent = 'Please enter your message';
            messageInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (message.length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            messageInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (message.length > 1000) {
            messageError.textContent = 'Message must be less than 1000 characters';
            messageInput.style.borderColor = '#e74c3c';
            isValid = false;
        }
        
        // If form is valid, show success message
        if (isValid) {
            // In a real application, you would send the data to a server here
            console.log('Form submitted:', { name, email, message });
            
            // Show success message
            const successMessage = document.getElementById('form-success');
            successMessage.classList.add('show');
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            // Scroll to first error
            const firstError = contactForm.querySelector('.form-error:not(:empty)');
            if (firstError) {
                firstError.closest('.form-group').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    });
    
    // Real-time validation on blur
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    nameInput.addEventListener('blur', () => {
        const name = nameInput.value.trim();
        const nameError = document.getElementById('name-error');
        
        if (name !== '' && name.length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            nameInput.style.borderColor = '#e74c3c';
        } else if (name !== '' && !/^[a-zA-Z\s]+$/.test(name)) {
            nameError.textContent = 'Name can only contain letters and spaces';
            nameInput.style.borderColor = '#e74c3c';
        } else {
            nameError.textContent = '';
            nameInput.style.borderColor = '#e0e0e0';
        }
    });
    
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email !== '' && !emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.style.borderColor = '#e74c3c';
        } else {
            emailError.textContent = '';
            emailInput.style.borderColor = '#e0e0e0';
        }
    });
    
    messageInput.addEventListener('blur', () => {
        const message = messageInput.value.trim();
        const messageError = document.getElementById('message-error');
        
        if (message !== '' && message.length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            messageInput.style.borderColor = '#e74c3c';
        } else if (message.length > 1000) {
            messageError.textContent = 'Message must be less than 1000 characters';
            messageInput.style.borderColor = '#e74c3c';
        } else {
            messageError.textContent = '';
            messageInput.style.borderColor = '#e0e0e0';
        }
    });
    
    // Clear error on input
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            const errorId = input.id + '-error';
            const error = document.getElementById(errorId);
            if (error && input.value.trim() !== '') {
                error.textContent = '';
                input.style.borderColor = '#e0e0e0';
            }
        });
    });
}

// ==========================================
// Scroll Down Arrow Animation
// ==========================================
const scrollDown = document.querySelector('.scroll-down');
if (scrollDown) {
    scrollDown.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = aboutSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// ==========================================
// Intersection Observer for Animations
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.program-card, .involved-card, .stat-card');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// ==========================================
// Console Log - Ready Message
// ==========================================
console.log('%c Hope for Kids - NGO Website ', 'background: #3498db; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('%c Website loaded successfully! ', 'color: #27ae60; font-size: 14px; font-weight: bold;');
console.log('%c No child should fight cancer alone 💙 ', 'color: #e74c3c; font-size: 12px; font-style: italic;');