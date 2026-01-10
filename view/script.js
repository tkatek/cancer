document.addEventListener('DOMContentLoaded', () => {
        const cards = document.querySelectorAll('.process-card');
        const path = document.querySelector('#dashed-path');
        const footerNote = document.querySelector('.footer-note');

        // Initialize dashed path safely based on its actual length
        let pathAnimated = false;
        if (path && typeof path.getTotalLength === 'function') {
            const len = path.getTotalLength();
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;
            path.style.transition = 'stroke-dashoffset 4s ease-out';
            path.style.pointerEvents = 'none';
        }

        const observerOptions = {
            threshold: 0.35,
            rootMargin: '0px 0px -20% 0px' // trigger slightly earlier below the fold
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('is-visible')) {
                    // Use requestAnimationFrame to batch DOM changes and avoid layout thrash
                    window.requestAnimationFrame(() => {
                        entry.target.classList.add('is-visible');

                        // draw the path once when first card becomes visible
                        if (!pathAnimated && entry.target.classList.contains('card-1') && path) {
                            path.style.strokeDashoffset = '0';
                            pathAnimated = true;
                        }

                        // show footer note when last card visible
                        if (entry.target.classList.contains('card-4') && footerNote) {
                            footerNote.classList.add('is-visible');
                        }
                    });
                }
            });

            // disconnect observer once all cards are visible to reduce work
            const allVisible = Array.from(cards).every(c => c.classList.contains('is-visible'));
            if (allVisible) {
                obs.disconnect();
            }
        }, observerOptions);

        cards.forEach(card => observer.observe(card));

        // Counting animation for statistics numbers
        const numsSection = document.querySelector('.nums');
        let statsAnimated = false;
        
        if (numsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !statsAnimated) {
                        statsAnimated = true;
                        const statNumbers = [
                            { element: document.querySelector('.num1 h1'), target: 50000, suffix: '+', unit: 'k' },
                            { element: document.querySelector('.num2 h1'), target: 220, suffix: '', unit: '' },
                            { element: document.querySelector('.num3 h1'), target: 5600, suffix: '', unit: 'k' },
                            { element: document.querySelector('.num4 h1'), target: 215, suffix: '', unit: '' },
                            { element: document.querySelector('.num5 h1'), target: 20000, suffix: '+', unit: 'k' }
                        ];

                        statNumbers.forEach((stat, index) => {
                            if (!stat.element) return;
                            
                            setTimeout(() => {
                                animateNumber(stat.element, stat.target, stat.suffix, stat.unit);
                            }, index * 150);
                        });
                    }
                });
            }, { threshold: 0.5 });
            
            statsObserver.observe(numsSection);
        }

        // Function to animate number counting
        function animateNumber(element, target, suffix = '', unit = '') {
            const duration = 1500; // 1.5 seconds animation
            const startTime = Date.now();
            const originalTarget = target;
            
            function updateNumber() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuad = 1 - Math.pow(1 - progress, 2);
                const current = Math.floor(originalTarget * easeOutQuad);
                
                // Format number with k suffix if needed
                let displayNumber = current;
                if (unit === 'k') {
                    displayNumber = current / 1000;
                }
                
                element.textContent = suffix + displayNumber + unit;
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    // Set final value
                    element.textContent = suffix + (originalTarget / (unit === 'k' ? 1000 : 1)) + unit;
                }
            }
            
            updateNumber();
        }

        // Simple newsletter form handler for footer
        const footerForm = document.getElementById('footer-newsletter');
        if (footerForm) {
            const success = footerForm.querySelector('.newsletter-success');
            footerForm.addEventListener('submit', e => {
                e.preventDefault();
                const email = footerForm.querySelector('input[name="email"]') || footerForm.querySelector('input[type="email"]');
                if (!email || !email.value) {
                    email && email.focus();
                    return;
                }
                footerForm.querySelector('button').disabled = true;
                // Minimal client-side validation
                const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
                if (!validEmail) {
                    email.focus();
                    footerForm.querySelector('button').disabled = false;
                    return;
                }
                setTimeout(() => {
                    footerForm.reset();
                    if (success) { success.hidden = false; }
                    footerForm.querySelector('button').disabled = false;
                }, 700);
            });
        }

        // Mobile bottom navigation (navphone) interactions — smooth viewport-center scroll-spy
        (function(){
            const nav = document.querySelector('.navphone');
            const navItems = nav ? Array.from(nav.querySelectorAll('.nav-item')) : [];
            if (!nav || !navItems.length) return;

            // Ensure contact section has id for scrolling
            const contactSection = document.querySelector('.contact');
            if (contactSection && !contactSection.id) contactSection.id = 'contact';

            // Map nav items to their target sections
            const itemMap = navItems.map(item => {
                const selector = item.dataset.target;
                const el = selector ? document.querySelector(selector) : null;
                return { item, el };
            }).filter(x => x.el);

            // Helper to activate a nav item
            function activate(item, opts = {}){
                if (!item) return;
                navItems.forEach(i => { i.classList.remove('active'); i.removeAttribute('aria-current'); });
                item.classList.add('active');
                item.setAttribute('aria-current','page');

                if (opts.scroll !== false) {
                    const target = item.dataset.target;
                    if (target) {
                        try{
                            const el = document.querySelector(target);
                            if (el) el.scrollIntoView({behavior:'smooth', block:'center'});
                        }catch(e){ /* ignore */ }
                    }
                }
            }

            // Click / keyboard activation
            navItems.forEach(item => {
                item.addEventListener('click', () => activate(item));
                item.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(item); }
                });
            });

            // Activate the first item by default without scrolling
            activate(navItems[0], { scroll: false });

            // Viewport-center scroll handler — uses rAF for smoothness and stability
            let ticking = false;
            let currentActive = nav.querySelector('.nav-item.active') || navItems[0];

            function onScroll() {
                ticking = false;

                const viewportCenter = window.scrollY + window.innerHeight / 2;

                // Find section whose center is closest to viewport center
                let best = null;
                let bestDist = Infinity;
                for (const {item, el} of itemMap) {
                    const rect = el.getBoundingClientRect();
                    const elCenter = window.scrollY + rect.top + rect.height/2;
                    const dist = Math.abs(elCenter - viewportCenter);
                    if (dist < bestDist) {
                        bestDist = dist;
                        best = { item, el, dist, rect };
                    }
                }

                if (!best) return;

                // Only switch when the viewport center is reasonably inside the section (hysteresis)
                const sectionHalfHeight = best.rect.height / 2;
                const MAX_ACCEPT_DISTANCE = Math.min(window.innerHeight * 0.45, sectionHalfHeight);

                if (best.dist <= MAX_ACCEPT_DISTANCE && best.item !== currentActive) {
                    activate(best.item, { scroll: false });
                    currentActive = best.item;
                }
            }

            function requestTick() {
                if (!ticking) {
                    ticking = true;
                    requestAnimationFrame(onScroll);
                }
            }

            window.addEventListener('scroll', requestTick, { passive: true });
            window.addEventListener('resize', requestTick);

            // Run once on load to set correct active state
            requestTick();
        })();
    });