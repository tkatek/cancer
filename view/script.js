document.addEventListener('DOMContentLoaded', () => {
        const cards = document.querySelectorAll('.process-card');
        const path = document.querySelector('#dashed-path');
        const footerNote = document.querySelector('.footer-note');

        const observerOptions = {
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // تفعيل رسم الخط عند ظهور أول بطاقة
                    if (entry.target.classList.contains('card-1')) {
                        path.style.strokeDashoffset = '0';
                    }
                    
                    // إظهار نص التذييل في النهاية
                    if (entry.target.classList.contains('card-4')) {
                        footerNote.classList.add('is-visible');
                    }
                }
            });
        }, observerOptions);

        cards.forEach(card => observer.observe(card));
    });