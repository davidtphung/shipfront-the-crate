(function () {
    document.documentElement.classList.add('js');

    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    function reduceOn() {
        return motionQuery.matches;
    }

    var nodes = document.querySelectorAll('[data-reveal]');
    var tiles = document.querySelectorAll('.bento-tile');
    var revealIo = null;
    var bentoIo = null;

    function showReveal() {
        nodes.forEach(function (el) { el.classList.add('is-in'); });
    }

    function showTiles() {
        tiles.forEach(function (tile) { tile.classList.add('is-in'); });
    }

    function observeReveal() {
        if (reduceOn() || !('IntersectionObserver' in window)) {
            showReveal();
            return;
        }

        revealIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    revealIo.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

        nodes.forEach(function (el) { revealIo.observe(el); });
    }

    function observeBento() {
        if (!tiles.length) return;

        if (reduceOn() || !('IntersectionObserver' in window)) {
            showTiles();
            return;
        }

        bentoIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var tile = entry.target;
                var i = Number(tile.getAttribute('data-stagger') || 0);
                window.setTimeout(function () { tile.classList.add('is-in'); }, i * 70);
                bentoIo.unobserve(tile);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px 0px 0px' });

        tiles.forEach(function (tile) { bentoIo.observe(tile); });

        window.setTimeout(showTiles, 1600);
    }

    observeReveal();
    observeBento();

    if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', function () {
            if (reduceOn()) {
                showReveal();
                showTiles();
            }
        });
    }

    function headerOffset() {
        var header = document.querySelector('header');
        return header ? header.offsetHeight : 0;
    }

    function scrollToWhy() {
        var el = document.getElementById('why');
        if (!el) return false;
        var end = el.getBoundingClientRect().top + window.scrollY - headerOffset();
        if (end < 0) end = 0;

        if (reduceOn()) {
            window.scrollTo(0, end);
            return true;
        }

        var start = window.scrollY;
        var t0 = performance.now();
        function tick(now) {
            var t = Math.min(1, (now - t0) / 200);
            window.scrollTo(0, start + (end - start) * t);
            if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        return true;
    }

    document.querySelectorAll('a[href="#why"], a[href$="#why"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var dest = document.getElementById('why');
            if (!dest) return;
            e.preventDefault();
            scrollToWhy();
            dest.setAttribute('tabindex', '-1');
            dest.focus({ preventScroll: true });
            if (history.replaceState) history.replaceState(null, '', '#why');
        });
    });

    if (window.location.hash === '#why') {
        window.addEventListener('load', function () { scrollToWhy(); });
    }

    if (!tiles.length || reduceOn() || !finePointer.matches) return;

    tiles.forEach(function (tile) {
        tile.addEventListener('pointermove', function (ev) {
            if (ev.pointerType !== 'mouse') return;
            var box = tile.getBoundingClientRect();
            if (!box.width || !box.height) return;
            var px = (ev.clientX - box.left) / box.width - 0.5;
            var py = (ev.clientY - box.top) / box.height - 0.5;
            tile.style.setProperty('--rx', (-py * 8).toFixed(2) + 'deg');
            tile.style.setProperty('--ry', (px * 8).toFixed(2) + 'deg');
        });
        tile.addEventListener('pointerleave', function () {
            tile.style.setProperty('--rx', '0deg');
            tile.style.setProperty('--ry', '0deg');
        });
    });
}());
