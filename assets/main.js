(function () {
  var JOBS = [
    { title: "AI Agent Engineer", team: "Product & Engineering", location: "San Jose Office (HQ) • San Francisco Office", meta: "Full-time • Hybrid", url: "https://jobs.ashbyhq.com/tessera-labs/0cb577c2-6cdd-4361-b1af-870ccfc9d792" },
    { title: "Software Engineer, Backend", team: "Product & Engineering", location: "San Jose Office (HQ) • New York City Office • Seattle Office", meta: "Full-time • Hybrid", url: "https://jobs.ashbyhq.com/tessera-labs/1fff7515-d5ae-4e89-9cf3-75c8e542f751" },
    { title: "Systems Engineer - SaaS", team: "Center of Excellence", location: "San Jose Office", meta: "Full-time • Hybrid", url: "https://jobs.ashbyhq.com/tessera-labs/7a6a3c7f-5ffc-4134-87f7-743820b41ca5" },
    { title: "Senior Data Engineer – ERP Data Harmonization & Enterprise Data Platform", team: "Center of Excellence", location: "San Francisco Office • New York City Office", meta: "Full-time • Hybrid", url: "https://jobs.ashbyhq.com/tessera-labs/560c1ab4-18c7-4937-add2-87d2c3a6308d" },
    { title: "Cloud Infrastructure/DevOps Engineer", team: "Platform", location: "San Jose Office (HQ) • Remote in the U.S. • San Francisco Office", meta: "Full-time • Hybrid", url: "https://jobs.ashbyhq.com/tessera-labs/3f8e8ada-2727-409a-991d-a31245b314c7" },
    { title: "Sr. Technical Recruiter - Contract", team: "G&A", location: "Remote in the U.S. • New York City Office • San Jose Office (HQ)", meta: "Contract • Remote", url: "https://jobs.ashbyhq.com/tessera-labs/84b9370a-b0e5-447d-9ebc-8e49b3e6a1b8" },
    { title: "SAP Functional Consultant", team: "SAP Functional", location: "New York City Office", meta: "Full-time • Hybrid", url: "https://jobs.ashbyhq.com/tessera-labs/aee82d8e-eaf2-4e06-89dc-ded242e3f81d" },
    { title: "Product Manager", team: "Product Management", location: "San Jose Office (HQ) • New York City Office • San Francisco Office", meta: "Full-time • Hybrid", url: "https://jobs.ashbyhq.com/tessera-labs/ea05dfd6-92d7-4ccc-aa53-2f31a85928c5" },
    { title: "SAP FI/CO Consultant", team: "SAP Functional", location: "Remote in the U.S.", meta: "Full-time • Remote", url: "https://jobs.ashbyhq.com/tessera-labs/2e7f1a59-6523-4049-ab1c-efe3ddc41bba" }
  ];
  var JOBS_PER_PAGE = 4;
  // Kept in sync with the `@media (max-width: 700px)` phone block in styles.css,
  // where .job-grid becomes a snap-scrolling flex strip and the pager arrows
  // are hidden.
  var MOBILE_QUERY = '(max-width: 700px)';

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function jobCardMarkup(job) {
    return (
      '<div class="job-card">' +
        '<h3>' + escapeHtml(job.title) + '</h3>' +
        '<p>' + escapeHtml(job.team) + ' • ' + escapeHtml(job.location) + ' • ' + escapeHtml(job.meta) + '</p>' +
        '<a class="apply" href="' + job.url + '" target="_blank" rel="noopener"><span>Apply</span><span class="arrow">&rarr;</span></a>' +
      '</div>'
    );
  }

  function renderJobsPage(grid, page) {
    if (!grid) return;
    var start = page * JOBS_PER_PAGE;
    grid.innerHTML = JOBS.slice(start, start + JOBS_PER_PAGE).map(jobCardMarkup).join('');
  }

  // On phones the arrows are gone, so paging would strand jobs 5-9 out of
  // reach — the whole list is rendered instead and swiping does the paging.
  function renderAllJobs(grid) {
    if (!grid) return;
    grid.innerHTML = JOBS.map(jobCardMarkup).join('');
  }

  function setHeaderHeight() {
    var header = document.querySelector('.site-header');
    if (header) {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    }
  }

  function smoothScrollToHash(hash) {
    if (!hash) return;
    var el;
    try { el = document.querySelector(hash); } catch (err) { return; }
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
    window.addEventListener('load', setHeaderHeight);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setHeaderHeight);
    }

    var seeAll = document.getElementById('see-all-positions');
    if (seeAll) seeAll.textContent = 'See all ' + JOBS.length + ' positions';

    // Video mute toggle (About). The player runs with controls=0, so this is the
    // only affordance — it drives Vimeo through the postMessage API rather than
    // the SDK, which keeps the page free of an external script dependency.
    var videoFrame = document.getElementById('about-video');
    var muteBtn = document.querySelector('.video-mute');
    if (videoFrame && muteBtn) {
      var sendToPlayer = function (method, value) {
        if (!videoFrame.contentWindow) return;
        try {
          videoFrame.contentWindow.postMessage(
            JSON.stringify({ method: method, value: value }),
            'https://player.vimeo.com'
          );
        } catch (err) {
          /* player not reachable yet — the next click will retry */
        }
      };

      muteBtn.addEventListener('click', function () {
        var nowMuted = muteBtn.dataset.muted === 'true';
        var willMute = !nowMuted;
        // setVolume as well as setMuted: older players honour only the former,
        // and sending both costs nothing.
        sendToPlayer('setMuted', willMute);
        sendToPlayer('setVolume', willMute ? 0 : 1);
        muteBtn.dataset.muted = String(willMute);
        muteBtn.setAttribute('aria-label', willMute ? 'Unmute video' : 'Mute video');
      });
    }

    // Consolidated mobile nav dropdown
    var navToggle = document.querySelector('.nav-toggle');
    var mobileNav = document.getElementById('mobile-nav');
    if (navToggle && mobileNav) {
      var setNavOpen = function (open) {
        mobileNav.classList.toggle('is-open', open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      };

      navToggle.addEventListener('click', function () {
        setNavOpen(navToggle.getAttribute('aria-expanded') !== 'true');
      });

      // Tapping a link navigates (or smooth-scrolls, handled below) — either
      // way the menu should not stay open behind the destination.
      mobileNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setNavOpen(false); });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setNavOpen(false);
      });

      // Tap outside the header to dismiss
      document.addEventListener('click', function (e) {
        if (navToggle.getAttribute('aria-expanded') !== 'true') return;
        if (!e.target.closest('.site-header')) setNavOpen(false);
      });

      // Widening past the breakpoint hides the dropdown via CSS; clear the
      // open state too so the hamburger isn't stuck as an X on the way back.
      window.addEventListener('resize', function () {
        if (window.innerWidth > 900) setNavOpen(false);
      });
    }

    // Same-page anchor links (nav Products/Solutions, Get a preview, footer links)
    // scroll smoothly instead of jumping.
    document.querySelectorAll('a[href*="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var raw = a.getAttribute('href');
        if (!raw || raw === '#') return;
        var url;
        try { url = new URL(raw, window.location.href); } catch (err) { return; }
        var samePage = url.pathname === window.location.pathname;
        if (samePage && url.hash) {
          e.preventDefault();
          smoothScrollToHash(url.hash);
          if (history.pushState) history.pushState(null, '', url.hash);
        }
      });
    });

    // Logo click: if we're already on the page it points to, don't force a
    // full reload (which flashes/reloads the page) — just ease back to top.
    document.querySelectorAll('.brand').forEach(function (brand) {
      brand.addEventListener('click', function (e) {
        var raw = brand.getAttribute('href');
        if (!raw) return;
        var url;
        try { url = new URL(raw, window.location.href); } catch (err) { return; }
        if (url.pathname === window.location.pathname) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (history.pushState) history.pushState(null, '', url.pathname);
        }
      });
    });

    // Landing on a page with a hash (e.g. coming from the other page) is
    // handled by the browser's native anchor-jump, smoothed via the
    // `scroll-behavior: smooth` CSS rule — no JS correction needed here.
    // (A JS-driven correction used to run a beat after load and would visibly
    // re-scroll on top of the native jump, which is what caused the glitch
    // when switching between nav tabs/pages.)

    // Preview inquiry / Customer support radio tabs. "How it works" describes
    // the Preview flow specifically, so it dissolves away while Customer
    // support is selected: opacity first, then out of flow once the fade has
    // finished, so the grid doesn't reflow underneath a still-visible panel.
    var howItWorks = document.querySelector('.howitworks');
    var contactGrid = document.querySelector('.contact-grid');
    var DISSOLVE_MS = 280;
    var dissolveTimer = null;

    function setHowItWorksVisible(visible) {
      if (!howItWorks) return;
      clearTimeout(dissolveTimer);

      if (visible) {
        howItWorks.classList.remove('is-hidden');
        if (contactGrid) contactGrid.classList.remove('is-single');
        // Let the browser register the restored (still transparent) layout
        // before starting the fade, otherwise the transition is skipped.
        void howItWorks.offsetWidth;
        howItWorks.classList.remove('is-fading');
      } else {
        howItWorks.classList.add('is-fading');
        dissolveTimer = setTimeout(function () {
          howItWorks.classList.add('is-hidden');
          if (contactGrid) contactGrid.classList.add('is-single');
        }, DISSOLVE_MS);
      }
    }

    document.querySelectorAll('.tab-row').forEach(function (row) {
      var labels = row.querySelectorAll('.tab');
      labels.forEach(function (label) {
        var input = label.querySelector('input[type="radio"]');
        if (!input) return;
        input.addEventListener('change', function () {
          labels.forEach(function (l) { l.classList.remove('active'); });
          if (input.checked) label.classList.add('active');
          setHowItWorksVisible(input.value === 'preview');
        });
      });
    });

    // Match the panel to whichever tab is checked on load
    var checkedTab = document.querySelector('.tab-row input[type="radio"]:checked');
    if (checkedTab && checkedTab.value !== 'preview') {
      setHowItWorksVisible(false);
      // Skip the fade for the initial state — there's nothing to dissolve from
      howItWorks.classList.add('is-hidden');
      if (contactGrid) contactGrid.classList.add('is-single');
      clearTimeout(dissolveTimer);
    }

    // Come Work With Us carousel: renders real job data 4-at-a-time, with a
    // brief dissolve (fade out/in) whenever the visible set changes.
    // Prev/left starts disabled and only becomes available once the user
    // has paged forward at least once; next/right disables on the last page.
    var jobGrid = document.getElementById('job-grid');
    if (jobGrid) {
      var totalPages = Math.max(1, Math.ceil(JOBS.length / JOBS_PER_PAGE));
      var page = 0;
      var FADE_MS = 220;
      var mobileMq = window.matchMedia(MOBILE_QUERY);
      jobGrid.style.transition = 'opacity ' + FADE_MS + 'ms ease';

      function renderForViewport() {
        if (mobileMq.matches) {
          renderAllJobs(jobGrid);
        } else {
          renderJobsPage(jobGrid, page);
        }
      }

      renderForViewport();

      function goToPage(newPage) {
        if (newPage === page) return;
        page = newPage;
        jobGrid.style.opacity = '0';
        setTimeout(function () {
          renderJobsPage(jobGrid, page);
          // Force layout so the browser registers the opacity:0 state
          // before we transition back to 1 (otherwise it can skip the fade-in).
          void jobGrid.offsetWidth;
          jobGrid.style.opacity = '1';
        }, FADE_MS);
      }

      // Crossing the breakpoint swaps between the paged grid and the full
      // swipeable strip. Paging resets to the first page so the desktop view
      // is never restored scrolled to a page the arrows think is page 0.
      var onBreakpointChange = function () {
        page = 0;
        jobGrid.style.opacity = '1';
        jobGrid.scrollLeft = 0;
        renderForViewport();
        document.querySelectorAll('.jobs-nav').forEach(function (nav) {
          var prevBtn = nav.querySelector('[data-carousel="prev"]');
          var nextBtn = nav.querySelector('[data-carousel="next"]');
          if (prevBtn) prevBtn.disabled = true;
          if (nextBtn) nextBtn.disabled = totalPages <= 1;
        });
      };
      if (mobileMq.addEventListener) {
        mobileMq.addEventListener('change', onBreakpointChange);
      } else if (mobileMq.addListener) {
        mobileMq.addListener(onBreakpointChange);
      }

      document.querySelectorAll('.jobs-nav').forEach(function (nav) {
        var prevBtn = nav.querySelector('[data-carousel="prev"]');
        var nextBtn = nav.querySelector('[data-carousel="next"]');
        if (!prevBtn || !nextBtn) return;
        prevBtn.disabled = true;
        nextBtn.disabled = totalPages <= 1;
        nextBtn.addEventListener('click', function () {
          if (page >= totalPages - 1) return;
          goToPage(page + 1);
          prevBtn.disabled = page === 0;
          nextBtn.disabled = page === totalPages - 1;
        });
        prevBtn.addEventListener('click', function () {
          if (page <= 0) return;
          goToPage(page - 1);
          prevBtn.disabled = page === 0;
          nextBtn.disabled = page === totalPages - 1;
        });
      });
    }
  });
})();
