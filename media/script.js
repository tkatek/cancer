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
    });