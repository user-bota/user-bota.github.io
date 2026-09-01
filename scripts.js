// ============ About tabs ============
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(evt, tabname) {
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active-link");
    }
    for (var j = 0; j < tabcontents.length; j++) {
        tabcontents[j].classList.remove("active-tab");
    }
    evt.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}

// ============ Mobile nav ============
(function () {
    var menuBtn = document.getElementById("menuBtn");
    var siteNav = document.getElementById("siteNav");
    if (!menuBtn || !siteNav) return;

    function closeMenu() {
        siteNav.classList.remove("is-open");
        menuBtn.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
    }

    function toggleMenu() {
        var isOpen = siteNav.classList.toggle("is-open");
        menuBtn.classList.toggle("is-open", isOpen);
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    }

    menuBtn.addEventListener("click", toggleMenu);

    siteNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 700) closeMenu();
    });
})();

// ============ Sticky header scroll state ============
(function () {
    var header = document.getElementById("siteHeader");
    if (!header) return;

    function onScroll() {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
})();

// ============ Reveal-on-scroll ============
(function () {
    var revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("is-visible"); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms";
        observer.observe(el);
    });
})();

// ============ Work: filter projects by domain ============
(function () {
    var filterBtns = document.querySelectorAll(".work-filter");
    var items = document.querySelectorAll(".work-list .work");
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
            btn.classList.add("is-active");

            var filter = btn.getAttribute("data-filter");
            items.forEach(function (item) {
                var category = item.getAttribute("data-category");
                var show = filter === "all" || category === filter;
                item.classList.toggle("is-hidden", !show);
            });
        });
    });
})();

// ============ Facts: click a photo to flip it ============
(function () {
    var cards = document.querySelectorAll(".fact-card");
    if (!cards.length) return;

    var mainCards = document.querySelectorAll(".facts-grid:not(.facts-grid-solo) .fact-card");
    var wildcardWrap = document.getElementById("wildcardWrap");

    function checkWildcard() {
        if (!wildcardWrap || wildcardWrap.hasAttribute("data-unlocked")) return;
        var allFlipped = Array.prototype.every.call(mainCards, function (c) {
            return c.classList.contains("is-flipped");
        });
        if (!allFlipped) return;

        wildcardWrap.setAttribute("data-unlocked", "true");
        wildcardWrap.hidden = false;
        requestAnimationFrame(function () {
            wildcardWrap.classList.add("is-visible");
        });
    }

    cards.forEach(function (card) {
        card.addEventListener("click", function () {
            var isFlipped = card.classList.toggle("is-flipped");
            card.setAttribute("aria-pressed", String(isFlipped));
            checkWildcard();
        });
    });
})();

// ============ Contact form -> Google Sheet ============
(function () {
    var scriptURL = "https://script.google.com/macros/s/AKfycbybNEGA92wT9IxJQyThBd-mUGDo_0FVSarqYy1R2VRXnuh5E5XbZyJ3gGLpqWaLz9mL/exec";
    var form = document.forms["submit-to-google-sheet"];
    var msg = document.getElementById("msg");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        fetch(scriptURL, { method: "POST", body: new FormData(form) })
            .then(function () {
                msg.innerHTML = "Message sent successfully!";
                setTimeout(function () { msg.innerHTML = ""; }, 5000);
                form.reset();
            })
            .catch(function (error) { console.error("Error!", error.message); });
    });
})();
