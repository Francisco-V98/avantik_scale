import './styles/main.css';
import { SimpleParticles } from './simple-particles.js';

// Initialize Custom Particles
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the container exists and replace it with a canvas if needed working with the existing ID
    const container = document.getElementById('tsparticles');
    if (container) {
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '1';
        canvas.style.pointerEvents = 'none';

        container.appendChild(canvas);

        // Initialize
        new SimpleParticles('particles-canvas');
        console.log('Custom particles initialized');
    }
});


console.log('Avantik Scale website loaded');

// Mobile Menu Logic (Placeholder if needed, currently just scroll)

// Scroll Reveal Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // observer.unobserve(entry.target); // Keep observing if we want it to trigger again? No, usually once is better.
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });
});
