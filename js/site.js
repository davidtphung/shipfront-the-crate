(function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var nodes = document.querySelectorAll('[data-reveal]');

    if (reduce || !('IntersectionObserver' in window)) {
        nodes.forEach(function (el) { el.classList.add('is-in'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    nodes.forEach(function (el) { io.observe(el); });
}());
