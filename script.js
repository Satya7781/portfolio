(() => {
    'use strict';

    const content = window.PORTFOLIO_CONTENT || {};
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function safeUrl(url) {
        return typeof url === 'string' && /^https?:\/\//i.test(url) ? url : '';
    }

    function setContent() {
        $$('[data-content]').forEach((element) => {
            const value = content[element.dataset.content];
            if (value) element.textContent = value;
        });
        $$('[data-booking]').forEach((link) => {
            const url = safeUrl(content.bookingUrl);
            if (url) {
                link.href = url;
                link.target = '_blank';
                link.rel = 'noopener';
            } else {
                link.href = '#contact';
                link.removeAttribute('target');
                link.addEventListener('click', () => {
                    $('#contact')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
                });
            }
        });
        const email = $('.contact-email');
        if (email && content.professionalEmail) {
            email.href = `mailto:${content.professionalEmail}`;
        }
        const form = $('#contact-form');
        if (form && content.formEndpoint) form.action = content.formEndpoint;
        const capability = $('[data-capability]');
        if (capability && safeUrl(content.capabilitySheetUrl)) {
            capability.href = content.capabilitySheetUrl;
            capability.target = '_blank';
            capability.rel = 'noopener';
        } else if (capability) {
            capability.href = '#contact';
            capability.addEventListener('click', () => {
                $('#form-status').textContent = 'The PDF overview is being prepared. Please request it by email.';
            });
        }
    }

    function renderContent() {
        const projects = $('#project-grid');
        if (projects) {
            projects.innerHTML = content.projects.map((project, index) => `
                <article class="project-card reveal" tabindex="0" role="button" aria-label="Open case study: ${project.title}" data-project="${index}">
                    <div class="project-preview" aria-hidden="true">
                        <div class="preview-browser"><span></span><span></span><span></span><b>${project.previewLabel}</b></div>
                        <div class="preview-hero"><i></i><strong>${project.title}</strong><small>${project.category}</small></div>
                        <span class="preview-shade"></span>
                        <span class="preview-label">${project.live || project.livePreview ? 'Open project ↗' : 'Case study ↗'}</span>
                    </div>
                    <span class="project-number">${String(index + 1).padStart(2, '0')}</span>
                    <div class="project-content"><span class="project-category">${project.category}</span><h3>${project.title}</h3><p>${project.description}</p><span class="project-open">Open case study ↗</span></div>
                </article>`).join('');
        }

        const engagements = $('#engagement-list');
        if (engagements) engagements.innerHTML = content.engagements.map((item) => `
            <article class="engagement-item"><div><h4>${item.name}</h4><p>${item.detail}</p></div><span class="engagement-price">${item.price}</span></article>`).join('');

        const testimonials = $('#testimonial-grid');
        if (testimonials) testimonials.innerHTML = content.testimonials.map((item) => `
            <article class="testimonial-card"><blockquote>“${item.quote}”</blockquote><cite><strong>${item.name}</strong>${item.role}</cite></article>`).join('');

        const groups = $('#stack-groups');
        if (groups) groups.innerHTML = content.stack.map((group) => `
            <article class="stack-group"><h3>${group.title}<span>${group.items.length} tools</span></h3><div class="stack-items">${group.items.map((item) => `<span class="stack-item">${item}</span>`).join('')}</div><p class="stack-projects">${group.projects}</p></article>`).join('');

        const orbit = $('#stack-orbit');
        if (orbit) {
            content.stack.flatMap((group) => group.items).slice(0, 8).forEach((item, index, list) => {
                const node = document.createElement('span');
                node.className = 'orbit-label';
                node.textContent = item;
                node.style.cssText = `position:absolute; left:${50 + Math.cos(index / list.length * Math.PI * 2) * 47}%; top:${50 + Math.sin(index / list.length * Math.PI * 2) * 47}%; transform:translate(-50%,-50%); color:var(--soft); font:10px var(--display); white-space:nowrap;`;
                orbit.appendChild(node);
            });
        }

        const faqs = $('#faq-list');
        if (faqs) faqs.innerHTML = content.faqs.map((faq, index) => `
            <article class="faq-item"><button class="faq-question" type="button" aria-expanded="false">${faq[0]}<span>+</span></button><div class="faq-answer"><p>${faq[1]}</p></div></article>`).join('');
    }

    function setupLoader() {
        const loader = $('#loader');
        const track = $('.loader-track span');
        const value = $('.loader-value');
        if (!loader) return;
        let progress = 0;
        const started = performance.now();
        const tick = (now) => {
            progress = Math.min(100, Math.round(((now - started) / 650) * 100));
            if (track) track.style.width = `${progress}%`;
            if (value) value.textContent = `${progress}%`;
            if (progress < 100) requestAnimationFrame(tick);
            else setTimeout(() => loader.classList.add('done'), 120);
        };
        requestAnimationFrame(tick);
    }

    function setupNavigation() {
        const header = $('.site-header');
        const menu = $('.menu-toggle');
        const panel = $('.nav-panel');
        const links = $$('.nav-link');
        menu?.addEventListener('click', () => {
            const open = panel.classList.toggle('open');
            menu.setAttribute('aria-expanded', String(open));
            document.body.classList.toggle('modal-open', open);
        });
        links.forEach((link) => link.addEventListener('click', () => {
            panel.classList.remove('open');
            menu?.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('modal-open');
        }));
        window.addEventListener('scroll', () => {
            header?.classList.toggle('scrolled', window.scrollY > 30);
            const max = document.documentElement.scrollHeight - window.innerHeight;
            $('.progress').style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
        }, { passive: true });
        const sections = $$('main section[id]');
        const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
            if (entry.isIntersecting) links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }), { rootMargin: '-35% 0px -55% 0px' });
        sections.forEach((section) => observer.observe(section));
    }

    function setupReveal() {
        const reveal = $$('.reveal');
        if (reducedMotion) return reveal.forEach((element) => element.classList.add('is-visible'));
        const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        }), { threshold: .12 });
        reveal.forEach((element) => observer.observe(element));
    }

    function setupFaq() {
        $$('.faq-question').forEach((button) => button.addEventListener('click', () => {
            const item = button.closest('.faq-item');
            const open = item.classList.toggle('open');
            button.setAttribute('aria-expanded', String(open));
        }));
    }

    function setupCaseStudies() {
        const dialog = $('#case-modal');
        const output = $('#case-modal-content');
        const close = $('.modal-close');
        const open = (card) => {
            const project = content.projects[Number(card.dataset.project)];
            trackEvent('case_study_open', { project: project?.title || 'unknown' });
            if (!project || !dialog || !output) return;
            const live = safeUrl(project.live);
            const code = safeUrl(project.code);
            output.innerHTML = `<span class="modal-category">${project.category}</span><h2>${project.title}</h2><div class="case-meta"><span><b>Role</b>${project.role}</span><span><b>Timeline</b>${project.timeline}</span></div><h3>Problem</h3><p>${project.problem}</p><h3>My approach</h3><p>${project.approach}</p><h3>What I built</h3><p>${project.built}</p><h3>Challenges and decisions</h3><p>${project.challenges}</p><h3>Tech stack</h3><p>${project.stack}</p><h3>Outcome / impact</h3><p>${project.result}</p><div class="modal-links">${live ? `<a class="button button-accent" href="${live}" target="_blank" rel="noopener">Live link ↗</a>` : ''}${code ? `<a class="button button-ghost" href="${code}" target="_blank" rel="noopener">View code ↗</a>` : ''}${project.caseStudy ? `<a class="button button-ghost" href="${project.caseStudy}">Full case study ↗</a>` : ''}</div>`;
            dialog.showModal();
            document.body.classList.add('modal-open');
        };
        $$('.project-card').forEach((card) => {
            card.addEventListener('click', () => open(card));
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(card); }
            });
        });
        const closeDialog = () => { dialog?.close(); document.body.classList.remove('modal-open'); };
        close?.addEventListener('click', closeDialog);
        dialog?.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });
    }

    function setupForm() {
        const form = $('#contact-form');
        const status = $('#form-status');
        form?.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const button = $('button[type="submit"]', form);
            const original = button.innerHTML;
            button.disabled = true;
            button.textContent = 'Sending…';
            status.textContent = '';
            trackEvent('form_submit_start');
            try {
                const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
                if (!response.ok) throw new Error('Your message could not be sent. Please email me directly instead.');
                form.reset();
                status.textContent = 'Thanks — your message is on its way. I will reply within 24 hours.';
                trackEvent('form_submit_success');
            } catch (error) {
                status.textContent = error.message;
                status.classList.add('error');
                trackEvent('form_submit_error');
            } finally {
                button.disabled = false;
                button.innerHTML = original;
            }
        });
    }

    function trackEvent(name, props = {}) {
        const event = { name, props, timestamp: new Date().toISOString() };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(event);
        if (typeof window.plausible === 'function') window.plausible(name, { props });
        if (typeof window.umami?.track === 'function') window.umami.track(name, props);
    }

    function setupTracking() {
        $$('[data-booking]').forEach((link) => link.addEventListener('click', () => trackEvent('book_call_click')));
    }

    function setupClock() {
        const clock = $('#india-time');
        if (!clock) return;
        const update = () => {
            clock.textContent = new Intl.DateTimeFormat('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).format(new Date());
        };
        update();
        setInterval(update, 30000);
    }

    function setupCookieNotice() {
        const notice = $('#cookie-notice');
        const dismiss = $('#cookie-dismiss');
        if (!notice || !dismiss) return;
        if (localStorage.getItem('privacy-notice-dismissed') === 'true') notice.classList.add('hidden');
        dismiss.addEventListener('click', () => {
            localStorage.setItem('privacy-notice-dismissed', 'true');
            notice.classList.add('hidden');
        });
    }

    function setupTurnstile() {
        const slot = $('#turnstile-slot');
        if (!slot || !content.turnstileSiteKey) return;
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.onload = () => {
            if (window.turnstile) window.turnstile.render(slot, { sitekey: content.turnstileSiteKey });
        };
        document.head.appendChild(script);
    }

    function setupInteractions() {
        if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
        const cursor = $('.cursor');
        document.addEventListener('pointermove', (event) => {
            cursor?.style.setProperty('--x', `${event.clientX}px`);
            cursor?.style.setProperty('--y', `${event.clientY}px`);
        });
        $$('.tilt-card, .project-card, .button').forEach((element) => {
            element.addEventListener('pointermove', (event) => {
                const rect = element.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - .5;
                const y = (event.clientY - rect.top) / rect.height - .5;
                if (element.classList.contains('tilt-card')) element.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
                if (element.classList.contains('button')) element.style.setProperty('--mag-x', `${x * 4}px`);
            });
            element.addEventListener('pointerleave', () => { element.style.transform = ''; element.style.removeProperty('--mag-x'); });
        });
    }

    function setupThreeScene() {
        const canvas = $('#hero-canvas');
        if (!canvas || !window.THREE || reducedMotion) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 100);
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(innerWidth, innerHeight);
        const group = new THREE.Group();
        const coreGeometry = new THREE.IcosahedronGeometry(1.08, 2);
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0x6f6bff,
            metalness: .7,
            roughness: .2,
            emissive: 0x17142e,
            emissiveIntensity: 1.1,
            transparent: true,
            opacity: .9
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        const wireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.22, 2)),
            new THREE.LineBasicMaterial({ color: 0x9fe5ff, transparent: true, opacity: .55 })
        );
        group.add(core, wireframe);

        const orbitMaterials = [
            new THREE.MeshBasicMaterial({ color: 0x9fe5ff, transparent: true, opacity: .75 }),
            new THREE.MeshBasicMaterial({ color: 0x9d7dff, transparent: true, opacity: .68 }),
            new THREE.MeshBasicMaterial({ color: 0x75e7d0, transparent: true, opacity: .55 })
        ];
        const orbitRings = [
            { rotation: [Math.PI / 2.4, .2, 0], scale: [1.65, 1, 1] },
            { rotation: [.35, Math.PI / 2.1, .2], scale: [1.48, 1, 1] },
            { rotation: [.9, .4, Math.PI / 2.8], scale: [1.78, 1, 1] }
        ];
        const rings = [];
        orbitRings.forEach((config, index) => {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(1.55, .012, 8, 96), orbitMaterials[index]);
            ring.rotation.set(...config.rotation);
            ring.scale.set(...config.scale);
            group.add(ring);
            rings.push(ring);
        });

        const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xb5f2ff });
        const nodeGeometry = new THREE.SphereGeometry(.055, 12, 12);
        orbitRings.forEach((config, ringIndex) => {
            for (let nodeIndex = 0; nodeIndex < 4; nodeIndex += 1) {
                const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
                const angle = (nodeIndex / 4) * Math.PI * 2 + ringIndex * .7;
                node.position.set(Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, 0);
                rings[ringIndex].add(node);
            }
        });
        const particles = new THREE.BufferGeometry();
        const points = new Float32Array(420 * 3);
        for (let i = 0; i < points.length; i += 3) {
            points[i] = (Math.random() - .5) * 8;
            points[i + 1] = (Math.random() - .5) * 6;
            points[i + 2] = (Math.random() - .5) * 5;
        }
        particles.setAttribute('position', new THREE.BufferAttribute(points, 3));
        const particleMesh = new THREE.Points(particles, new THREE.PointsMaterial({ color: 0x9fe5ff, size: .018, transparent: true, opacity: .7 }));
        scene.add(group, particleMesh);
        scene.add(new THREE.AmbientLight(0x8990ff, 1.4));
        const light = new THREE.PointLight(0x94eaff, 4, 8);
        light.position.set(2, 2, 3);
        scene.add(light);
        let targetX = 0; let targetY = 0; let active = true;
        window.addEventListener('pointermove', (event) => { targetX = (event.clientX / innerWidth - .5) * .35; targetY = (event.clientY / innerHeight - .5) * .25; }, { passive: true });
        const visibility = new IntersectionObserver(([entry]) => { active = entry.isIntersecting && !document.hidden; }, { threshold: 0 });
        visibility.observe(canvas);
        document.addEventListener('visibilitychange', () => { active = !document.hidden; });
        const render = () => {
            requestAnimationFrame(render);
            if (!active) return;
            group.rotation.y += .0028;
            group.rotation.x += (targetY - group.rotation.x) * .025;
            group.rotation.z += (targetX - group.rotation.z) * .025;
            wireframe.rotation.y -= .0016;
            core.scale.setScalar(1 + Math.sin(performance.now() * .0014) * .025);
            rings[0].rotation.z += .004;
            rings[1].rotation.x -= .003;
            rings[2].rotation.y += .002;
            particleMesh.rotation.y -= .0004;
            renderer.render(scene, camera);
        };
        addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
        render();
    }

    function setupScrollScene() {
        if (!window.gsap || !window.ScrollTrigger || reducedMotion) return;
        gsap.registerPlugin(ScrollTrigger);
        gsap.to('#hero-canvas', { yPercent: 18, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setContent();
        renderContent();
        setupLoader();
        setupNavigation();
        setupReveal();
        setupFaq();
        setupCaseStudies();
        setupForm();
        setupTracking();
        setupClock();
        setupCookieNotice();
        setupTurnstile();
        setupInteractions();
        setupThreeScene();
        setupScrollScene();
        $('#current-year').textContent = new Date().getFullYear();
    });
})();
