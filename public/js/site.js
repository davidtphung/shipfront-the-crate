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
    var heads = document.querySelectorAll('[data-scrub]');
    var bar = document.querySelector('.hud-bar');
    var dock = document.querySelector('.dock-bar');

    function showAll(list) {
        Array.prototype.forEach.call(list, function (el) { el.classList.add('is-in'); });
    }

    function clamp01(n) {
        return n < 0 ? 0 : n > 1 ? 1 : n;
    }

    /* One scroll loop drives the whole camera: the bar settles, the reading
       hairline grows, the dock rises, and section heads drift out of frame.
       Transform and opacity only, one write per frame. */
    var SETTLE_BAND = 132;
    var lastSettle = -1;
    var lastRead = -1;
    var docked = null;
    var ticking = false;

    function paintBar(y) {
        if (!bar) return;

        if (reduceOn()) {
            bar.classList.toggle('is-solid', y > 28);
            return;
        }

        var settle = clamp01(y / SETTLE_BAND);
        if (Math.abs(settle - lastSettle) > 0.004) {
            lastSettle = settle;
            bar.style.setProperty('--settle', settle.toFixed(3));
        }

        var span = document.documentElement.scrollHeight - window.innerHeight;
        var read = span > 0 ? clamp01(y / span) : 0;
        if (Math.abs(read - lastRead) > 0.003) {
            lastRead = read;
            bar.style.setProperty('--read', read.toFixed(3));
        }
    }

    /* The dock only waits below the fold where the hero already carries a CTA.
       On the quote and contact pages it is up from the start. */
    var dockHolds = !!document.querySelector('.hero');

    function paintDock(y) {
        if (!dock) return;
        var up = !dockHolds || reduceOn() || y > window.innerHeight * 0.55;
        if (up === docked) return;
        docked = up;
        dock.classList.toggle('is-up', up);
    }

    function paintHeads() {
        if (!heads.length || reduceOn()) return;
        var vh = window.innerHeight;

        Array.prototype.forEach.call(heads, function (head) {
            var box = head.getBoundingClientRect();
            if (box.bottom < -240 || box.top > vh + 240) return;
            var exit = clamp01((vh * 0.3 - box.top) / (vh * 0.66));
            var prev = Number(head.getAttribute('data-exit') || 0);
            if (Math.abs(exit - prev) < 0.005) return;
            head.setAttribute('data-exit', exit.toFixed(3));
            head.style.setProperty('--exit', exit.toFixed(3));
        });
    }

    function frame() {
        var y = window.scrollY || window.pageYOffset || 0;
        paintBar(y);
        paintDock(y);
        paintHeads();
        ticking = false;
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(frame);
    }

    frame();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

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
        }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

        Array.prototype.forEach.call(nodes, function (el) { io.observe(el); });
    }

    /* Floor bento. Seven tiles arrive across 0.8s, 130ms apart. */
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
                window.setTimeout(function () { tile.classList.add('is-in'); }, step * 130);
                io.unobserve(tile);
            });
        }, { threshold: 0.06 });

        Array.prototype.forEach.call(tiles, function (tile) { io.observe(tile); });
        window.setTimeout(function () { showAll(tiles); }, 3200);
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
            Array.prototype.forEach.call(heads, function (head) {
                head.style.removeProperty('--exit');
                head.removeAttribute('data-exit');
            });
            if (bar) {
                bar.style.removeProperty('--settle');
                bar.style.removeProperty('--read');
            }
            docked = null;
            lastSettle = -1;
            lastRead = -1;
            frame();
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
            var t = Math.min(1, (now - t0) / 620);
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
