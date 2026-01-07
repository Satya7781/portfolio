/* ========================================
   PREMIUM PORTFOLIO - JAVASCRIPT
   Award-Winning Interactions & 3D Scene
   ======================================== */

// ========================================
// PRELOADER WITH PERCENTAGE COUNTER
// ========================================
class Preloader {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.counter = document.querySelector('.preloader-counter');
        this.progress = 0;
    }

    init() {
        this.animateCounter();
    }

    animateCounter() {
        const duration = 2000;
        const start = Date.now();

        const animate = () => {
            const elapsed = Date.now() - start;
            this.progress = Math.min((elapsed / duration) * 100, 100);

            this.counter.textContent = Math.floor(this.progress) + '%';

            if (this.progress < 100) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    this.preloader.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }, 500);
            }
        };

        animate();
    }
}

// ========================================
// 3D BACKGROUND - MORPHING LIQUID METAL
// ========================================
class Background3D {
    constructor() {
        this.canvas = document.getElementById('webgl-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
    }

    init() {
        this.setupScene();
        this.createMesh();
        this.setupLights();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x050505, 10, 50);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    createMesh() {
        // Create complex geometry - Torus Knot for abstract shape
        const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32, 2, 3);

        // Metallic material with HDR-like properties
        const material = new THREE.MeshStandardMaterial({
            color: 0x4a9eff,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x1a3a5a,
            emissiveIntensity: 0.3,
            wireframe: false
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);

        // Add wireframe overlay for premium look
        const wireframeGeometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32, 2, 3);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        this.mesh.add(wireframeMesh);
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        // Key light (rim lighting effect)
        const keyLight = new THREE.DirectionalLight(0x4a9eff, 1.5);
        keyLight.position.set(5, 5, 5);
        this.scene.add(keyLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xd4af37, 0.8);
        fillLight.position.set(-5, 0, -5);
        this.scene.add(fillLight);

        // Back light for rim effect
        const backLight = new THREE.DirectionalLight(0xffffff, 1);
        backLight.position.set(0, -5, -5);
        this.scene.add(backLight);

        // Point lights for dynamic glow
        const pointLight1 = new THREE.PointLight(0x4a9eff, 2, 10);
        pointLight1.position.set(3, 3, 3);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xd4af37, 2, 10);
        pointLight2.position.set(-3, -3, -3);
        this.scene.add(pointLight2);
    }

    setupEventListeners() {
        // Mouse movement for parallax
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            this.targetRotation.x = this.mouse.y * 0.3;
            this.targetRotation.y = this.mouse.x * 0.3;
        });

        // Scroll for rotation
        window.addEventListener('scroll', () => {
            const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            this.mesh.rotation.z = scrollProgress * Math.PI * 2;
        });

        // Resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth inertia rotation
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;

        // Apply rotation with auto-rotation
        this.mesh.rotation.x = this.currentRotation.x + Date.now() * 0.0001;
        this.mesh.rotation.y = this.currentRotation.y + Date.now() * 0.0002;

        // Subtle pulsing effect
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
        this.mesh.scale.set(scale, scale, scale);

        this.renderer.render(this.scene, this.camera);
    }
}

// ========================================
// SMOOTH SCROLL (LENIS-STYLE)
// ========================================
class SmoothScroll {
    constructor() {
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.ease = 0.08;
    }

    init() {
        this.animate();

        window.addEventListener('scroll', () => {
            this.targetScrollY = window.scrollY;
        });
    }

    animate() {
        this.scrollY += (this.targetScrollY - this.scrollY) * this.ease;

        // Apply smooth transform to body
        document.body.style.transform = `translateY(${-this.scrollY}px)`;

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// NAVIGATION
// ========================================
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.navItems = document.querySelectorAll('.nav-link');
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupActiveState();
    }

    setupScrollEffect() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            if (currentScroll > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    setupMobileMenu() {
        if (!this.menuToggle) return;

        this.menuToggle.addEventListener('click', () => {
            this.menuToggle.classList.toggle('active');
            this.navLinks.classList.toggle('active');
            document.body.style.overflow = this.navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu on link click
        this.navItems.forEach(link => {
            link.addEventListener('click', () => {
                this.menuToggle.classList.remove('active');
                this.navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    setupActiveState() {
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            this.navItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// ========================================
// SCROLL PROGRESS BAR
// ========================================
class ScrollProgress {
    constructor() {
        this.progressBar = document.querySelector('.scroll-progress');
    }

    init() {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            this.progressBar.style.width = scrolled + '%';
        });
    }
}

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('[data-scroll-reveal]');
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        this.elements.forEach(el => observer.observe(el));
    }
}

// ========================================
// CUSTOM CURSOR
// ========================================
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.cursorOutline = document.querySelector('.cursor-outline');
        this.mouseX = 0;
        this.mouseY = 0;
        this.outlineX = 0;
        this.outlineY = 0;
    }

    init() {
        if (window.innerWidth < 768) return;

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            this.cursorDot.style.left = this.mouseX + 'px';
            this.cursorDot.style.top = this.mouseY + 'px';
        });

        // Smooth follow for outline
        const animateOutline = () => {
            this.outlineX += (this.mouseX - this.outlineX) * 0.15;
            this.outlineY += (this.mouseY - this.outlineY) * 0.15;

            this.cursorOutline.style.left = this.outlineX + 'px';
            this.cursorOutline.style.top = this.outlineY + 'px';

            requestAnimationFrame(animateOutline);
        };
        animateOutline();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .work-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
            });
        });
    }
}

// ========================================
// PROJECT CARDS - MOUSE TRACKING
// ========================================
class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .work-card');
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                card.style.setProperty('--mouse-x', x + '%');
                card.style.setProperty('--mouse-y', y + '%');
            });

            card.addEventListener('mouseleave', () => {
                card.style.removeProperty('--mouse-x');
                card.style.removeProperty('--mouse-y');
            });
        });
    }
}

// ========================================
// CONTACT FORM
// ========================================
class ContactForm {
    constructor() {
        this.form = document.querySelector('#contact-form');
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = this.form.querySelector('.btn-primary');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
            submitBtn.style.pointerEvents = 'none';

            try {
                // Submit to Formspree via AJAX
                const formData = new FormData(this.form);
                const response = await fetch(this.form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show success modal
                    showModal();

                    // Reset form
                    this.form.reset();

                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.pointerEvents = 'auto';
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);

                // Show error message
                submitBtn.innerHTML = '<span class="btn-text">Error! Try Again</span>';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.pointerEvents = 'auto';
                }, 3000);
            }
        });

        // Input animations
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

// Modal functions
function showModal() {
    const modal = document.getElementById('thankYouModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('thankYouModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('thankYouModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});


// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
class PerformanceOptimizer {
    constructor() {
        this.rafId = null;
        this.ticking = false;
    }

    init() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-smooth', '0s');
            document.documentElement.style.setProperty('--transition-bounce', '0s');
        }

        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause heavy animations
                document.body.classList.add('paused');
            } else {
                document.body.classList.remove('paused');
            }
        });
    }
}

// ========================================
// INITIALIZE ALL MODULES
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    const preloader = new Preloader();
    preloader.init();

    // 3D Background
    const background3D = new Background3D();
    background3D.init();

    // Navigation
    const navigation = new Navigation();
    navigation.init();

    // Scroll Progress
    const scrollProgress = new ScrollProgress();
    scrollProgress.init();

    // Scroll Reveal
    const scrollReveal = new ScrollReveal();
    scrollReveal.init();

    // Custom Cursor
    const customCursor = new CustomCursor();
    customCursor.init();

    // Project Cards
    const projectCards = new ProjectCards();
    projectCards.init();

    // Contact Form
    const contactForm = new ContactForm();
    contactForm.init();

    // Performance Optimizer
    const performanceOptimizer = new PerformanceOptimizer();
    performanceOptimizer.init();
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Smooth scroll to anchor
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Prevent FOUC (Flash of Unstyled Content)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
