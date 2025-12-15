import { SimpleParticles } from './simple-particles.js';

// Initialization Logic
const initApp = () => {
    console.log('Avantik Scale: Initializing App...');

    // 1. Initialize Particles
    const particlesContainer = document.getElementById('tsparticles');
    if (particlesContainer) {
        // Clear existing canvas if any (hot reload safety)
        particlesContainer.innerHTML = '';

        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '1';
        canvas.style.pointerEvents = 'none';

        particlesContainer.appendChild(canvas);

        try {
            new SimpleParticles('particles-canvas');
            console.log('Avantik Scale: Particles active.');
        } catch (e) {
            console.error('Avantik Scale: Particles failed', e);
        }
    } else {
        console.warn('Avantik Scale: #tsparticles container not found.');
    }

    // 2. Scroll Reveal Animations
    initScrollReveal();
};

const initScrollReveal = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });
    console.log(`Avantik Scale: Scroll reveal valid for ${sections.length} sections.`);
};

// Robust Start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM already ready
    initApp();
}

console.log('Avantik Scale: Main module loaded.');
