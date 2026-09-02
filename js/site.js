(function () {
    document.documentElement.classList.add('js');

    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function reduceOn() {
        return motionQuery.matches;
    }

    function clamp01(n) {
        return n < 0 ? 0 : n > 1 ? 1 : n;
    }

    /* ---- Spring ----------------------------------------------------------
       One critically damped spring, described the way Apple describes them:
       a response time and a damping ratio. Damping 1.0 means bounce 0, so a
       value settles without ever crossing its target.

       Every spring is interruptible. Retargeting keeps the live value and the
       live velocity, so a new gesture picks up exactly where the last one was
       rather than snapping back to a start pose.

       Rest is judged against an epsilon in the spring's own units, so a spring
       measured in pixels is not held awake chasing a thousandth of one. */
    function Spring(response, damping, onFrame, epsilon) {
        this.response = response;
        this.damping = damping;
        this.onFrame = onFrame;
        this.epsilon = epsilon || 0.0004;
        this.onRest = null;
        this.value = 0;
        this.velocity = 0;
        this.target = 0;
        this.raf = 0;
        this.last = 0;
    }

    Spring.prototype.set = function (value) {
        this.stop();
        this.value = value;
        this.velocity = 0;
        this.onFrame(this.value);
    };

    Spring.prototype.stop = function () {
        if (!this.raf) return;
        cancelAnimationFrame(this.raf);
        this.raf = 0;
    };

    Spring.prototype.to = function (target, response, velocity) {
        this.target = target;
        if (typeof response === 'number') this.response = response;
        if (typeof velocity === 'number') this.velocity = velocity;
        this.start();
    };

    /* Semi implicit Euler on a fixed 1/240s substep. The substep keeps the
       integration stable no matter how long a dropped frame ran. */
    Spring.prototype.advance = function (dt) {
        var w = (2 * Math.PI) / this.response;
        var k = w * w;
        var c = 2 * this.damping * w;
        var step = 1 / 240;

        while (dt > 0) {
            var h = dt > step ? step : dt;
            var a = -k * (this.value - this.target) - c * this.velocity;
            this.velocity += a * h;
            this.value += this.velocity * h;
            dt -= h;
        }
    };

    Spring.prototype.start = function () {
        if (this.raf) return;
        var self = this;
        this.last = performance.now();

        this.raf = requestAnimationFrame(function step(now) {
            var dt = (now - self.last) / 1000;
            self.last = now;
            if (dt > 0.1) dt = 0.1;

            self.advance(dt);

            var near = Math.abs(self.value - self.target) < self.epsilon;
            var slow = Math.abs(self.velocity) < self.epsilon * 10;

            if (near && slow) {
                self.value = self.target;
                self.velocity = 0;
                self.raf = 0;
                self.onFrame(self.value);
                if (self.onRest) self.onRest();
                return;
            }

            self.onFrame(self.value);
            self.raf = requestAnimationFrame(step);
        });
    };

    /* ---- Press -----------------------------------------------------------
       Feedback lands on pointer down, not on click. Down runs to 0.97 in about
       100ms. Release hands the live velocity to a critically damped settle at
       a 0.34s response, so the control never overshoots and never locks the
       pointer: the click still goes through underneath. */
    var PRESS_DOWN = 0.1;
    var PRESS_UP = 0.34;

    function armPress(el, prop) {
        var spring = new Spring(PRESS_UP, 1, function (v) {
            el.style.setProperty(prop, v.toFixed(4));
        });

        spring.value = 1;
        spring.target = 1;

        spring.onRest = function () {
            el.classList.remove('is-springing');
            if (spring.target === 1) el.style.removeProperty(prop);
        };

        function down() {
            if (reduceOn()) return;
            el.classList.add('is-springing');
            spring.to(0.97, PRESS_DOWN);
        }

        function up() {
            if (reduceOn()) return;
            if (spring.target === 1 && !spring.raf) return;
            spring.to(1, PRESS_UP);
        }

        el.addEventListener('pointerdown', down);
        el.addEventListener('pointerleave', up);
        el.addEventListener('pointercancel', up);
        window.addEventListener('pointerup', up);
        el.addEventListener('blur', up);
    }

    Array.prototype.forEach.call(document.querySelectorAll('.cta-pill, .why-cta, .sheet-dismiss'), function (el) {
        armPress(el, '--btn-z');
    });

    Array.prototype.forEach.call(document.querySelectorAll('.tile--cut'), function (el) {
        armPress(el, '--zoom');
    });

    /* ---- Camera ----------------------------------------------------------
       One scroll loop drives the whole page: the bar settles, the reading
       hairline grows, the dock rises, and section heads drift out of frame.
       Transform and opacity only, one write per frame. */
    var nodes = document.querySelectorAll('[data-reveal]');
    var tiles = document.querySelectorAll('.tile');
    var rows = document.querySelectorAll('.why-row');
    var heads = document.querySelectorAll('[data-scrub]');
    var bar = document.querySelector('.hud-bar');
    var dock = document.querySelector('.dock-bar');

    function showAll(list) {
        Array.prototype.forEach.call(list, function (el) { el.classList.add('is-in'); });
    }

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

    /* Band entrances. Long fade up, one idea at a time. */
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

    /* Floor catalog. The cuts arrive 130ms apart, 22px up, 0.98 to 1. */
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

    /* ---- Spring scroll ---------------------------------------------------
       The jump to the Why band rides the same critically damped spring as the
       sheet. Any wheel, touch, or key from the reader cancels it on the spot,
       so scrolling is never taken away mid flight. */
    function headerOffset() {
        var header = document.querySelector('header');
        return header ? header.offsetHeight : 0;
    }

    var scrollSpring = new Spring(0.4, 1, function (v) {
        window.scrollTo(0, v);
    }, 0.5);

    function releaseScroll() {
        scrollSpring.stop();
    }

    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (name) {
        window.addEventListener(name, releaseScroll, { passive: true });
    });

    function scrollToWhy() {
        var el = document.getElementById('why');
        if (!el) return;

        var end = el.getBoundingClientRect().top + window.scrollY - headerOffset();
        if (end < 0) end = 0;

        if (reduceOn()) {
            scrollSpring.stop();
            window.scrollTo(0, end);
            return;
        }

        scrollSpring.value = window.scrollY;
        scrollSpring.to(end, 0.4);
    }

    Array.prototype.forEach.call(document.querySelectorAll('a[href="#why"], a[href$="#why"]'), function (link) {
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

    /* ---- Quote form ------------------------------------------------------
       Native POST to Formsubmit. After _next lands on ?thanks=1, swap the
       form for the on-page thanks state. Do not preventDefault. */
    var quoteForm = document.getElementById('quoteForm');
    var quoteThanks = document.getElementById('quote-thanks');
    if (quoteForm && quoteThanks && /(?:^|[?&])thanks=1(?:&|$)/.test(window.location.search)) {
        quoteForm.hidden = true;
        quoteThanks.hidden = false;
        var quoteHint = document.getElementById('quote-hint');
        if (quoteHint) {
            quoteHint.textContent = 'A person at Shipfront replies.';
        }
        quoteThanks.focus({ preventScroll: true });
    }

    /* ---- Sheet -----------------------------------------------------------
       One surface, one path. It enters and leaves along the same axis on the
       same critically damped spring, so a dismiss that starts halfway through
       an entrance simply reverses from wherever the sheet actually is.

       Drag is tracked live, rubber banded past the open edge, and released
       with the gesture velocity handed straight to the spring. Nothing is
       ever disabled while the sheet is moving. */
    var sheet = document.querySelector('[data-sheet]');

    if (!sheet) return;

    var scrim = document.querySelector('[data-sheet-scrim]');
    var height = 0;
    var opened = false;
    var invoker = null;

    function paintSheet(y) {
        sheet.style.transform = 'translate3d(0,' + y.toFixed(2) + 'px,0)';
        if (!scrim) return;
        var shown = height > 0 ? clamp01(1 - y / height) : 0;
        scrim.style.opacity = (shown * 0.72).toFixed(3);
    }

    var sheetSpring = new Spring(0.34, 1, paintSheet, 0.2);

    sheetSpring.onRest = function () {
        if (opened) return;
        sheet.hidden = true;
        if (scrim) {
            scrim.hidden = true;
            scrim.classList.remove('is-live');
        }
    };

    function measure() {
        height = sheet.offsetHeight || 1;
    }

    /* Reduced motion drops the travel and the overshoot and keeps a plain
       cross fade. The sheet stays where it is and simply appears. */
    var fadeOut = 0;

    function crossFade(open) {
        sheet.style.transform = 'translate3d(0,0,0)';
        sheetSpring.stop();
        sheetSpring.value = 0;
        sheetSpring.target = 0;
        sheetSpring.velocity = 0;
        if (scrim) scrim.style.opacity = open ? '0.72' : '0';
    }

    function openSheet(from) {
        invoker = from || null;
        var wasHidden = sheet.hidden;

        window.clearTimeout(fadeOut);
        sheet.hidden = false;
        if (scrim) {
            scrim.hidden = false;
            scrim.classList.add('is-live');
        }

        measure();
        opened = true;

        if (reduceOn()) {
            crossFade(true);
            /* One frame on the closed pose so the fade has something to run from. */
            requestAnimationFrame(function () { sheet.classList.add('is-open'); });
        } else {
            /* A fresh open starts off screen. A reopen keeps the live value so
               an in flight dismissal reverses instead of jumping. */
            if (wasHidden) {
                sheetSpring.value = height;
                sheetSpring.velocity = 0;
                paintSheet(height);
            }
            sheet.classList.add('is-open');
            sheetSpring.to(0, 0.34);
        }

        sheet.focus({ preventScroll: true });
    }

    function closeSheet(velocity) {
        if (!opened) return;
        opened = false;
        measure();
        sheet.classList.remove('is-open');

        if (reduceOn()) {
            crossFade(false);
            fadeOut = window.setTimeout(function () {
                if (!opened) sheetSpring.onRest();
            }, 210);
        } else {
            sheetSpring.to(height, 0.34, velocity);
        }

        if (invoker && typeof invoker.focus === 'function') invoker.focus();
    }

    /* Rubber band past the open edge. Resistance grows with distance, so the
       sheet can be pulled up but never leaves its own track. */
    function band(distance) {
        return (distance * 0.55) / (1 + distance / 220);
    }

    var dragging = false;
    var dragId = -1;
    var dragFrom = 0;
    var dragBase = 0;
    var lastY = 0;
    var lastT = 0;
    var dragVelocity = 0;

    sheet.addEventListener('pointerdown', function (ev) {
        if (!opened || reduceOn()) return;
        if (ev.target.closest('a, button')) return;

        dragging = true;
        dragId = ev.pointerId;
        dragFrom = ev.clientY;
        dragBase = sheetSpring.value;
        lastY = ev.clientY;
        lastT = performance.now();
        dragVelocity = 0;

        sheetSpring.stop();
        sheet.setPointerCapture(dragId);
    });

    sheet.addEventListener('pointermove', function (ev) {
        if (!dragging || ev.pointerId !== dragId) return;

        var delta = ev.clientY - dragFrom;
        var y = dragBase + delta;
        if (y < 0) y = -band(-y);

        /* Blend the last two samples. A single jittery frame should not read
           as a fling, and a real fling still reaches the threshold. */
        var now = performance.now();
        var dt = (now - lastT) / 1000;
        if (dt > 0) {
            var instant = (ev.clientY - lastY) / dt;
            dragVelocity = dragVelocity * 0.4 + instant * 0.6;
        }
        lastY = ev.clientY;
        lastT = now;

        sheetSpring.value = y;
        paintSheet(y);
    });

    function endDrag(ev) {
        if (!dragging || (ev && ev.pointerId !== dragId)) return;
        dragging = false;
        if (sheet.hasPointerCapture && sheet.hasPointerCapture(dragId)) {
            sheet.releasePointerCapture(dragId);
        }

        var past = sheetSpring.value > height * 0.3;
        var flung = dragVelocity > 700;

        if (past || flung) {
            closeSheet(dragVelocity);
        } else {
            sheetSpring.to(0, 0.34, dragVelocity);
        }
    }

    sheet.addEventListener('pointerup', endDrag);
    sheet.addEventListener('pointercancel', endDrag);

    Array.prototype.forEach.call(document.querySelectorAll('[data-sheet-close]'), function (btn) {
        btn.addEventListener('click', function () { closeSheet(0); });
    });

    if (scrim) {
        scrim.addEventListener('click', function () { closeSheet(0); });
    }

    document.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Escape' || !opened) return;
        closeSheet(0);
    });

    window.addEventListener('resize', function () {
        if (!opened) return;
        measure();
    }, { passive: true });

}());
