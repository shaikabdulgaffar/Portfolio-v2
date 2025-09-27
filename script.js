const ENABLE_SCROLLING_ELEMENTS_ANIMATION = false;

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const mainContent = document.querySelector('.main-content');

    const useContainerScroll = () =>
        mainContent && (mainContent.scrollHeight - 1) > mainContent.clientHeight;

    function scrollToSection(id) {
        const target = document.getElementById(id);
        if (!target) return;

        if (useContainerScroll()) {
            mainContent.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        } else {
            const top = target.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top, behavior: 'smooth' });
        }
        history.replaceState(null, '', `#${id}`);
    }

    function setActiveNavFromScroll() {
        const pos = useContainerScroll()
            ? (mainContent.scrollTop + mainContent.clientHeight / 2)
            : (window.scrollY + window.innerHeight / 2);

        let currentIndex = 0;
        sections.forEach((section, i) => {
            const top = useContainerScroll()
                ? section.offsetTop
                : (section.getBoundingClientRect().top + window.scrollY);
            if (pos >= top) currentIndex = i;
        });

        navLinks.forEach(l => l.classList.remove('active'));
        if (navLinks[currentIndex]) navLinks[currentIndex].classList.add('active');
    }

    // Sidebar links -> smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').replace('#', '');
            scrollToSection(target);
        });
    });

    // CTA buttons -> smooth scroll
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const txt = this.textContent.trim();
            if (txt === "Let's Connect") scrollToSection('contact');
            if (txt === "My Works") scrollToSection('projects');
        });
    });

    // Debounced (rAF) active-link update
    let ticking = false;
    const handleScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                setActiveNavFromScroll();
                ticking = false;
            });
            ticking = true;
        }
    };

    // Dynamically bind the correct scroll root and rebind on resize
    let boundRoot = null;
    function bindScrollTarget() {
        const newRoot = useContainerScroll() ? mainContent : window;
        if (boundRoot === newRoot) return;
        if (boundRoot) boundRoot.removeEventListener('scroll', handleScroll);
        newRoot.addEventListener('scroll', handleScroll, { passive: true });
        boundRoot = newRoot;
        // update IntersectionObserver roots elsewhere if needed
    }

    bindScrollTarget();
    setActiveNavFromScroll();
    window.addEventListener('resize', () => {
        bindScrollTarget();
        // Ensure the active state recalculates after layout changes
        setActiveNavFromScroll();
    });

    // Anchor smooth-scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href').slice(1);
            if (!id) return;
            if (!document.getElementById(id)) return;
            e.preventDefault();
            scrollToSection(id);
        });
    });

    // Always land on Home on initial open (ignore any existing hash)
    (function ensureHomeOnOpen() {
        const go = () => {
            history.replaceState(null, '', '#home');
            if (useContainerScroll()) {
                mainContent.scrollTo({ top: 0, behavior: 'auto' });
            } else {
                window.scrollTo({ top: 0, behavior: 'auto' });
            }
            setActiveNavFromScroll();
        };
        // Run after initial layout and once on full load to override restored positions
        setTimeout(go, 0);
        window.addEventListener('load', go, { once: true });
    })();

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            removeNotification(notification);
        });
    }
    
    function removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Skill bar animation function
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            }, index * 100); // Stagger animation
        });
    }
    
    // Add hover effects for skill items
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add hover effects and animations for social links
    const socialLinks = document.querySelectorAll('.social-link, .bottom-social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Project card interactions
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Ensure any legacy in-sidebar hamburger is removed
    document.querySelectorAll('.mobile-menu-toggle').forEach(el => el.remove());

    // Add typing animation effect
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Apply typing effect to the greeting
    const greeting = document.querySelector('.greeting');
    if (greeting) {
        setTimeout(() => {
            typeWriter(greeting, 'Hello!', 150);
        }, 1000);
    }
    
    // Parallax effect for background elements
    // REPLACE window scroll listener to support container scroll too
    const parallaxHandler = () => {
        const scrolled = useContainerScroll() ? mainContent.scrollTop : window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    };
    if (ENABLE_SCROLLING_ELEMENTS_ANIMATION) {
        if (useContainerScroll()) {
            mainContent.addEventListener('scroll', parallaxHandler, { passive: true });
        } else {
            window.addEventListener('scroll', parallaxHandler, { passive: true });
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px',
        root: useContainerScroll() ? mainContent : null
    };

        if (ENABLE_SCROLLING_ELEMENTS_ANIMATION) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                        entry.target.classList.add('animate-in');
                        if (entry.target.id === 'skills') {
                            setTimeout(() => { /* animateSkillBars if you add bars */ }, 300);
                        }
                    }
                });
            }, observerOptions);

            sections.forEach(section => observer.observe(section));
            document.querySelectorAll('.project-card, .skill-item').forEach(card => observer.observe(card));
        }

    // CV Download functionality
    const cvButton = document.querySelector('.btn-cv');
    if (cvButton) {
        cvButton.addEventListener('click', function() {
            // Replace with actual CV file path
            const cvPath = 'assets/Shaik_Abdul_Gaffar_CV.pdf';
            
            // Try to download the CV
            try {
                const link = document.createElement('a');
                link.href = cvPath;
                link.download = 'Shaik_Abdul_Gaffar_CV.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showNotification('CV download started!', 'success');
            } catch (error) {
                showNotification('CV download functionality - Please add your CV file!', 'error');
            }
        });
    }
    
    // Loading screen
    function hideLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500);
        }
    }
    
    // Hide loading screen when everything is loaded
    window.addEventListener('load', hideLoadingScreen);
    
    // Performance optimization - lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Console welcome message
    console.log(`
    🚀 Portfolio loaded successfully!
    
    👋 Hi there! I'm Shaik Abdul Gaffar
    🎯 Full Stack Developer & Data Analyst
    📧 Contact: shaikabdulgaffar01@gmail.com
    🔗 GitHub: github.com/shaikabdulgaffar
    
    Thanks for checking out my portfolio!
    `);
});

// Add floating background elements
function createFloatingElements() {
    const container = document.querySelector('.main-content');
    
    for (let i = 0; i < 6; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.cssText = `
            position: absolute;
            width: ${Math.random() * 120 + 80}px;
            height: ${Math.random() * 120 + 80}px;
            background: linear-gradient(45deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1));
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 15 + 15}s infinite linear;
            pointer-events: none;
            z-index: 0;
            filter: blur(1px);
        `;
        
        container.appendChild(element);
    }
}

// CSS animations for floating elements and notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.7; 
        }
        25% { 
            transform: translateY(-30px) rotate(90deg); 
            opacity: 0.4; 
        }
        50% { 
            transform: translateY(-60px) rotate(180deg); 
            opacity: 0.2; 
        }
        75% { 
            transform: translateY(-30px) rotate(270deg); 
            opacity: 0.4; 
        }
        100% { 
            transform: translateY(0px) rotate(360deg); 
            opacity: 0.7; 
        }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: -400px;
        background: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        transition: all 0.3s ease;
        max-width: 350px;
        backdrop-filter: blur(10px);
    }
    
    .notification.show {
        right: 20px;
    }
    
    .notification-success {
        border-left: 4px solid #28a745;
        color: #155724;
    }
    
    .notification-error {
        border-left: 4px solid #dc3545;
        color: #721c24;
    }
    
    .notification-info {
        border-left: 4px solid #17a2b8;
        color: #0c5460;
    }
    
    .notification i {
        font-size: 20px;
        flex-shrink: 0;
    }
    
    .notification-success i {
        color: #28a745;
    }
    
    .notification-error i {
        color: #dc3545;
    }
    
    .notification-info i {
        color: #17a2b8;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #666;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        color: #333;
    }
    
    .mobile-menu-toggle {
        display: none;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        border: none;
        padding: 12px;
        border-radius: 10px;
        font-size: 18px;
        cursor: pointer;
        margin-bottom: 20px;
        transition: all 0.3s ease;
    }
    
    .mobile-menu-toggle:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(245, 87, 108, 0.3);
    }
    
    .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.5s ease;
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (max-width: 768px) {
        .mobile-menu-toggle {
            display: block;
        }
        
        .navigation {
            display: none;
        }
        
        .navigation.show {
            display: block;
        }
        
        .notification {
            right: -300px;
            max-width: 280px;
        }
        
        .notification.show {
            right: 10px;
        }
    }
`;
document.head.appendChild(style);

// Initialize floating elements (disabled when scrolling elements animation is off)
if (ENABLE_SCROLLING_ELEMENTS_ANIMATION) {
    createFloatingElements();
}

// Role rotation animation
(function () {
    const roles = [
        "I'm a Tech Enthusiast",
        "I'm a Python Developer",
        "I'm a Web Developer"
    ];
    const el = document.getElementById('role-rotator');
    if (!el) return;
    let i = 0;

    function swap() {
        // fade out
        el.classList.remove('fade-in');
        el.classList.add('fade-out');
        setTimeout(() => {
            i = (i + 1) % roles.length;
            el.textContent = roles[i];
            el.classList.remove('fade-out');
            el.offsetWidth; // force reflow
            el.classList.add('fade-in');
        }, 400);
    }

    // initial state
    el.classList.add('fade-in');
    setInterval(swap, 2800);
})();

// Error handling
window.addEventListener('error', function(e) {
    console.error('Portfolio Error:', e.error);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});