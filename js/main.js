document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');

    toggle.addEventListener('click', function() {
        menu.classList.toggle('active');
        toggle.textContent = menu.classList.contains('active') ? '✕' : '☰';
    });

    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                menu.classList.remove('active');
                toggle.textContent = '☰';
            }
        });
    });

    // Animations au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.programme-card, .actu-card, .stat-card').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${i * 0.1}s`;
        observer.observe(el);
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 30px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        }
        
        lastScroll = currentScroll;
    });
});