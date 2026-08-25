(function () {
    document.documentElement.classList.add('js');

    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    function reduceOn() {
        return motionQuery.matches;
    }

    var nodes = document.querySelectorAll('[data-reveal]');
    var tiles = document.querySelectorAll('.bento-tile');
    var rows = document.querySelectorAll('.why-row');
    var bar = document.querySelector('.hud-bar');

    function showAll(list) {
        Array.prototype.forEach.call(list, function (el) { el.classList.add('is-in'); });
    }

    /* Nav settles into a solid black hairline bar once the hero starts to leave. */
    if (bar) {
        var settled = null;
        var ticking = false;

        function syncBar() {
            var next = window.scrollY > 28;
            if (next !== settled) {
                settled = next;
                bar.classList.toggle('is-solid', next);
            }
            ticking = false;
        }

        syncBar();
        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(syncBar);
        }, { passive: true });
    }

    /* Band entrances. Long fade-up, one idea at a time. */
    function observeReveal() {
        if (reduceOn() || !('IntersectionObserver' in window)) {
            showAll(nodes);
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        Array.prototype.forEach.call(nodes, function (el) { io.observe(el); });
    }

    /* Floor bento. Staggered arrival, 90ms apart. */
    function observeTiles() {
        if (!tiles.length) return;

        if (reduceOn() || !('IntersectionObserver' in window)) {
            showAll(tiles);
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var tile = entry.target;
                var step = Number(tile.getAttribute('data-stagger') || 0);
                window.setTimeout(function () { tile.classList.add('is-in'); }, step * 90);
                io.unobserve(tile);
            });
        }, { threshold: 0.08 });

        Array.prototype.forEach.call(tiles, function (tile) { io.observe(tile); });
        window.setTimeout(function () { showAll(tiles); }, 2600);
    }

    /* Why rows. The still clips open from its own bottom edge. */
    function observeRows() {
        if (!rows.length) return;

        if (reduceOn() || !('IntersectionObserver' in window)) {
            showAll(rows);
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

        Array.prototype.forEach.call(rows, function (row) { io.observe(row); });
    }

    observeReveal();
    observeTiles();
    observeRows();

    if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', function () {
            if (!reduceOn()) return;
            showAll(nodes);
            showAll(tiles);
            showAll(rows);
        });
    }

    /* Hero mark: one slow even nod per invitation, then it settles back flat.
       A nod already under way is never restarted or cut short. */
    var cube = document.querySelector('.hero-cube');
    var hero = document.querySelector('.hero');

    if (cube && hero) {
        var nodding = false;

        function nodCube() {
            if (nodding || reduceOn()) return;
            nodding = true;
            cube.classList.add('is-nodding');
        }

        cube.addEventListener('animationend', function (ev) {
            if (ev.animationName !== 'crate-nod') return;
            cube.classList.remove('is-nodding');
            nodding = false;
        });

        cube.addEventListener('pointerenter', nodCube);
        hero.addEventListener('focusin', nodCube);
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
            var t = Math.min(1, (now - t0) / 480);
            var eased = 1 - Math.pow(1 - t, 3);
            window.scrollTo(0, start + (end - start) * eased);
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

    /* Soft key light follows the pointer across a tile. No tilt, no sweep. */
    if (!tiles.length || reduceOn() || !finePointer.matches) return;

    Array.prototype.forEach.call(tiles, function (tile) {
        tile.addEventListener('pointermove', function (ev) {
            if (ev.pointerType !== 'mouse') return;
            var box = tile.getBoundingClientRect();
            if (!box.width || !box.height) return;
            tile.style.setProperty('--mx', (((ev.clientX - box.left) / box.width) * 100).toFixed(1) + '%');
            tile.style.setProperty('--my', (((ev.clientY - box.top) / box.height) * 100).toFixed(1) + '%');
        });
        tile.addEventListener('pointerleave', function () {
            tile.style.setProperty('--mx', '50%');
            tile.style.setProperty('--my', '50%');
        });
    });
}());
