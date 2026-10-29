document.addEventListener('DOMContentLoaded', () => {

    // Active Navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.textContent = '🌙';
    }

    window.toggleTheme = function () {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            if (themeToggle) themeToggle.textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            if (themeToggle) themeToggle.textContent = '🌙';
        }
    };

    // Logout
    window.confirmLogout = function () {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        }
    };

    // Goal Cards
    window.toggleDetails = function (card) {
        const details = card.querySelector('.goal-details');
        if (!details) return;
        const isOpen = details.style.display === 'block';
        document.querySelectorAll('.goal-details').forEach(el => el.style.display = 'none');
        details.style.display = isOpen ? 'none' : 'block';
    };

    // Gallery Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    let currentIndex = 0;
    let images = [];

    if (thumbnails.length > 0) {
        images = Array.from(thumbnails).map(img => img.src);
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                currentIndex = index;
                openLightbox(images[currentIndex]);
            });
        });
    }

    window.openLightbox = function (src) {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = src;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function () {
        if (!lightbox) return;
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    };

    window.changeImage = function (direction) {
        if (images.length === 0) return;
        currentIndex = (currentIndex + direction + images.length) % images.length;
        lightboxImage.src = images[currentIndex];
    };

    document.addEventListener('keydown', (e) => {
        if (!lightbox || lightbox.style.display !== 'block') return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
    });

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Contact Form
    window.validateForm = function (event) {
        event.preventDefault();
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        const formStatus = document.getElementById('formStatus');

        let isValid = true;
        if (name.value.trim().length < 2) isValid = false;
        if (!email.value.includes('@')) isValid = false;
        if (subject.value.trim().length < 3) isValid = false;
        if (message.value.trim().length < 10) isValid = false;

        if (!isValid) {
            if (formStatus) {
                formStatus.textContent = 'Please fill out all fields correctly.';
                formStatus.style.color = '#ff7889';
            }
            return false;
        }

        const recipient = document.getElementById('contactForm').dataset.recipient;
        const body = `Name: ${name.value}\nEmail: \( {email.value}\n\n \){message.value}`;
        window.location.href = `mailto:\( {recipient}?subject= \){encodeURIComponent(subject.value)}&body=${encodeURIComponent(body)}`;

        if (formStatus) {
            formStatus.textContent = 'Opening your email app...';
            formStatus.style.color = '#4ade80';
        }
        return false;
    };

    // Copy Email
    const copyBtn = document.getElementById('copyEmailBtn');
    const copyFeedback = document.getElementById('copyFeedback');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('blanciachristianjay@gmail.com').then(() => {
                copyFeedback.textContent = 'Copied!';
                setTimeout(() => copyFeedback.textContent = '', 2000);
            });
        });
    }

    // Skill Bars
    const skillLevels = document.querySelectorAll('.skill-level');
    if (skillLevels.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.getAttribute('data-width');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        skillLevels.forEach(bar => observer.observe(bar));
    }

    // Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Back to Top
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.innerHTML = '↑';
    backToTop.title = 'Back to top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Typing Animation
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 70);
            }
        }
        typeWriter();
    }

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 80) {
                el.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

});