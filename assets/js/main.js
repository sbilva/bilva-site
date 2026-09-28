/* Bilva site — shared behaviour: header/footer injection, icons, theme switcher,
   mega menu, mobile nav, scroll reveal, tabs, demo form. No dependencies. */
(function () {
  'use strict';

  /* ---------------- Theme ---------------- */
  var THEME_KEY = 'bilva-theme';
  var THEMES = ['gold', 'blue', 'multi'];
  var root = document.documentElement;

  function setTheme(t, persist) {
    if (THEMES.indexOf(t) === -1) t = 'gold';
    root.setAttribute('data-theme', t);
    if (persist !== false) { try { localStorage.setItem(THEME_KEY, t); } catch (e) {} }
    var btns = document.querySelectorAll('.theme-switch button');
    for (var i = 0; i < btns.length; i++) btns[i].classList.toggle('active', btns[i].getAttribute('data-set') === t);
  }
  function initialTheme() {
    var q = new URLSearchParams(location.search).get('theme');
    if (q) return q;
    try { return localStorage.getItem(THEME_KEY) || 'gold'; } catch (e) { return 'gold'; }
  }

  /* ---------------- Icons (inline SVG, lucide-style) ---------------- */
  var ICONS = {
    sparkles: '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z"/>',
    cloud: '<path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8.5a4 4 0 0 1-.5 9.5H7z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    smartphone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18h2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4.5-6.2"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5M3 17.5l9 5 9-5"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18"/>',
    shield: '<path d="M12 2.5l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-6z"/><path d="M9 12l2 2 4-4"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/>',
    trending: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    pin: '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    star: '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/>',
    zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    database: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    heart: '<path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z"/>',
    dollar: '<circle cx="12" cy="12" r="9"/><path d="M12 6v12M15 9.5c0-1.4-1.3-2-3-2s-3 .6-3 2 1.3 2 3 2 3 .6 3 2-1.3 2-3 2-3-.6-3-2"/>',
    bag: '<path d="M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
    truck: '<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    package: '<path d="M12 3l9 4.5v9L12 21l-9-4.5v-9z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/>',
    factory: '<path d="M3 21V10l6 4v-4l6 4v-4l6 4v7z"/><path d="M8 21v-4M13 21v-4M18 21v-4"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>',
    rocket: '<path d="M5 15l-2 6 6-2M14 4c3-1 5 1 6 4l-3 3-6 6-3 1-1-3 1-3 6-6z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    quote: '<path d="M7 7h5v5H9v3H6v-5a3 3 0 0 1 1-3zM15 7h5v5h-3v3h-3v-5a3 3 0 0 1 1-3z"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    linkedin: '<path d="M6.5 9.5V19M6.5 5.5v.2M11 19v-5.5a3 3 0 0 1 6 0V19M11 9.5V19"/>',
    x: '<path d="M4 4l16 16M20 4L4 20"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
    youtube: '<rect x="2.5" y="6" width="19" height="12" rx="4"/><path d="M10 9.5v5l4.5-2.5z"/>',
    handshake: '<path d="M11 6L7 9.5a2 2 0 0 0 2.8 2.8L12 10l4 3.5a2 2 0 0 1 0 3l-2 2M3 8l4-3 4 1 4-1 4 3-3 2.5"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'
  };
  var FILLED = { star: 1, quote: 1 };
  function iconSvg(name, cls) {
    var body = ICONS[name] || ICONS.sparkles;
    var fill = FILLED[name] ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    return '<svg class="' + (cls || 'ico') + '" viewBox="0 0 24 24" ' + fill + ' aria-hidden="true">' + body + '</svg>';
  }
  function renderIcons(scope) {
    var els = (scope || document).querySelectorAll('[data-icon]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var tmp = document.createElement('span');
      tmp.innerHTML = iconSvg(el.getAttribute('data-icon'), el.className || 'ico');
      var svg = tmp.firstChild;
      if (el.getAttribute('style')) svg.setAttribute('style', el.getAttribute('style'));
      el.parentNode.replaceChild(svg, el);
    }
  }
  window.bilvaIcon = iconSvg;

  /* ---------------- Navigation data ---------------- */
  var PILLARS = [
    { title: 'AI, Data & Intelligence', items: [
      ['Artificial Intelligence', 'service-artificial-intelligence.html'],
      ['Generative AI', 'service-artificial-intelligence.html#generative-ai'],
      ['Data & Analytics Engineering', 'service-artificial-intelligence.html#data-engineering'],
      ['DataOps & MLOps', 'service-artificial-intelligence.html#mlops']
    ]},
    { title: 'Cloud & Engineering', items: [
      ['Cloud & Hybrid', 'services.html#cloud-and-hybrid'],
      ['Web Development & eCommerce', 'services.html#web-development-and-ecommerce'],
      ['Mobile App Development', 'services.html#mobile-app-development'],
      ['Embedded Systems & IoT', 'services.html#embedded-systems-and-iot']
    ]},
    { title: 'Enterprise Business Systems', items: [
      ['CRM Development · Salesforce', 'services.html#crm-development'],
      ['ERP Development · SAP', 'services.html#erp-development'],
      ['ServiceNow', 'services.html#servicenow'],
      ['Sales Enablement', 'services.html#sales']
    ]},
    { title: 'Run, Secure & Grow', items: [
      ['Security', 'services.html#security'],
      ['Mergers & Acquisitions', 'services.html#mergers-and-acquisitions'],
      ['Industry Solutions', 'industries.html'],
      ['Managed Services', 'services.html#cloud-and-hybrid']
    ]}
  ];
  var PARTNERS = ['Salesforce', 'SAP', 'ServiceNow', 'AWS', 'Azure', 'Google Cloud', 'Snowflake', 'Databricks'];

  function pageFile() {
    var p = location.pathname.split('/').pop();
    return p || 'index.html';
  }

  function headerHTML() {
    var cols = PILLARS.map(function (p) {
      return '<div><h5>' + p.title + '</h5>' + p.items.map(function (it) {
        return '<a href="' + it[1] + '">' + it[0] + '</a>';
      }).join('') + '</div>';
    }).join('');
    var partners = PARTNERS.map(function (n) { return '<span class="chip outline">' + n + '</span>'; }).join('');
    var mobileSubs = PILLARS.map(function (p) {
      return '<div class="sub"><a class="muted small" style="border:0;padding-top:12px">' + p.title + '</a>' + p.items.map(function (it) {
        return '<a href="' + it[1] + '">' + it[0] + '</a>';
      }).join('') + '</div>';
    }).join('');

    return '' +
      '<header class="site-header">' +
        '<div class="container nav">' +
          '<a class="brand" href="index.html" aria-label="Bilva home"><img src="assets/img/logo.png" alt="Bilva logo"><span class="wordmark">Bilva</span></a>' +
          '<ul class="nav-links">' +
            '<li><a href="about.html">Who We Are</a></li>' +
            '<li class="has-mega"><button type="button" aria-haspopup="true" aria-expanded="false">Capabilities ' + iconSvg('chevron') + '</button>' +
              '<div class="mega">' + cols +
                '<div class="mega-foot"><div class="partners">' + partners + '</div><a class="link-arrow" href="services.html">All capabilities ' + iconSvg('arrow') + '</a></div>' +
              '</div></li>' +
            '<li><a href="industries.html">Industries</a></li>' +
            '<li><a href="contact.html">Contact</a></li>' +
          '</ul>' +
          '<div class="nav-cta">' +
            '<a class="btn btn-primary btn-sm" href="contact.html">Schedule a Discovery Call ' + iconSvg('arrow') + '</a>' +
            '<button class="burger" type="button" aria-label="Open menu" aria-expanded="false"><span></span></button>' +
          '</div>' +
        '</div>' +
        '<nav class="mobile-nav" aria-label="Mobile">' +
          '<a href="index.html">Home</a>' +
          '<a href="about.html">Who We Are</a>' +
          '<a href="services.html">Capabilities</a>' + mobileSubs +
          '<a href="industries.html">Industries</a>' +
          '<a href="contact.html">Contact</a>' +
          '<a href="design-template.html">Design Template</a>' +
          '<a class="btn btn-primary" href="contact.html">Schedule a Discovery Call</a>' +
        '</nav>' +
      '</header>';
  }

  function footerHTML() {
    var y = new Date().getFullYear();
    return '' +
      '<footer class="site-footer">' +
        '<div class="container">' +
          '<div class="footer-grid">' +
            '<div class="footer-brand">' +
              '<a class="brand" href="index.html"><img src="assets/img/logo.png" alt="Bilva logo"><span class="wordmark">Bilva</span></a>' +
              '<p style="margin-top:16px">Where innovation meets technology mastery. We build world-class software, AI and cloud solutions for enterprises in healthcare, finance, insurance, retail and beyond.</p>' +
              '<div class="socials">' +
                '<a href="#" aria-label="LinkedIn">' + iconSvg('linkedin') + '</a>' +
                '<a href="#" aria-label="X">' + iconSvg('x') + '</a>' +
                '<a href="#" aria-label="Facebook">' + iconSvg('facebook') + '</a>' +
                '<a href="#" aria-label="YouTube">' + iconSvg('youtube') + '</a>' +
              '</div>' +
            '</div>' +
            '<div><h5>Capabilities</h5><ul>' +
              '<li><a href="service-artificial-intelligence.html">Artificial Intelligence</a></li>' +
              '<li><a href="services.html#cloud-and-hybrid">Cloud &amp; Hybrid</a></li>' +
              '<li><a href="services.html#web-development-and-ecommerce">Web &amp; eCommerce</a></li>' +
              '<li><a href="services.html#mobile-app-development">Mobile Apps</a></li>' +
              '<li><a href="services.html#crm-development">CRM · Salesforce</a></li>' +
              '<li><a href="services.html#erp-development">ERP · SAP</a></li>' +
              '<li><a href="services.html#embedded-systems-and-iot">Embedded &amp; IoT</a></li>' +
              '<li><a href="services.html#security">Security</a></li>' +
            '</ul></div>' +
            '<div><h5>Company</h5><ul>' +
              '<li><a href="about.html">Who We Are</a></li>' +
              '<li><a href="industries.html">Industries</a></li>' +
              '<li><a href="services.html#mergers-and-acquisitions">Mergers &amp; Acquisitions</a></li>' +
              '<li><a href="contact.html">Contact</a></li>' +
              '<li><a href="design-template.html">Design Template</a></li>' +
            '</ul></div>' +
            '<div><h5>Get in touch</h5><ul>' +
              '<li><a href="tel:+17034527459">703-452-7459</a></li>' +
              '<li><a href="mailto:info@bilva.us">info@bilva.us</a></li>' +
              '<li><a href="contact.html">Schedule a discovery call</a></li>' +
              '<li><span class="muted">Mon–Fri, 8am–6pm CT</span></li>' +
            '</ul></div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<span>© ' + y + ' Bilva. All rights reserved.</span>' +
            '<div class="links"><a href="#">Privacy Policy</a><a href="#">Terms</a><a href="#">Accessibility</a></div>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  function themeSwitchHTML() {
    return '<div class="theme-switch" role="group" aria-label="Color theme">' +
      '<span class="lbl">Theme</span>' +
      '<button type="button" data-set="gold" title="Gold" aria-label="Gold theme"><i></i></button>' +
      '<button type="button" data-set="blue" title="Dark blue" aria-label="Dark blue theme"><i></i></button>' +
      '<button type="button" data-set="multi" title="Multi-color" aria-label="Multi-color theme"><i></i></button>' +
    '</div>';
  }

  /* ---------------- Mount ---------------- */
  function mount() {
    var h = document.getElementById('site-header');
    var f = document.getElementById('site-footer');
    if (h) h.outerHTML = headerHTML();
    if (f) f.outerHTML = footerHTML();
    document.body.insertAdjacentHTML('beforeend', themeSwitchHTML());
    renderIcons();
    setTheme(initialTheme(), false);
    if (new URLSearchParams(location.search).get('static') === '1') root.classList.add('no-motion');

    /* active nav */
    var file = pageFile();
    var links = document.querySelectorAll('.nav-links > li > a');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (href.indexOf('#') === -1 && href === file) links[i].classList.add('active');
    }

    /* theme buttons */
    document.querySelector('.theme-switch').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-set]');
      if (b) setTheme(b.getAttribute('data-set'));
    });

    /* mega menu */
    var mega = document.querySelector('.has-mega');
    if (mega) {
      var btn = mega.querySelector('button');
      var open = function (v) { mega.classList.toggle('open', v); btn.setAttribute('aria-expanded', v ? 'true' : 'false'); };
      mega.addEventListener('mouseenter', function () { open(true); });
      mega.addEventListener('mouseleave', function () { open(false); });
      btn.addEventListener('click', function () { open(!mega.classList.contains('open')); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
    }

    /* mobile nav */
    var burger = document.querySelector('.burger');
    var mnav = document.querySelector('.mobile-nav');
    if (burger && mnav) {
      burger.addEventListener('click', function () {
        var v = !mnav.classList.contains('open');
        mnav.classList.toggle('open', v);
        burger.setAttribute('aria-expanded', v ? 'true' : 'false');
        document.body.style.overflow = v ? 'hidden' : '';
      });
      mnav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { mnav.classList.remove('open'); document.body.style.overflow = ''; } });
    }

    /* reveal on scroll */
    var targets = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      for (var t = 0; t < targets.length; t++) io.observe(targets[t]);
    } else {
      for (var u = 0; u < targets.length; u++) targets[u].classList.add('in');
    }

    /* tabs */
    var tabsets = document.querySelectorAll('[data-tabs]');
    for (var k = 0; k < tabsets.length; k++) {
      (function (set) {
        set.addEventListener('click', function (e) {
          var b = e.target.closest('.tab-btn');
          if (!b) return;
          var id = b.getAttribute('data-tab');
          set.querySelectorAll('.tab-btn').forEach(function (x) { x.classList.toggle('active', x === b); });
          set.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-panel') === id); });
        });
      })(tabsets[k]);
    }

    /* demo forms (mockup only) */
    var forms = document.querySelectorAll('form[data-demo]');
    for (var m = 0; m < forms.length; m++) {
      forms[m].addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = this.querySelector('.form-msg');
        if (msg) { msg.textContent = 'Thanks — this is a mockup form. Wire it to your CRM or email service before launch.'; msg.style.display = 'block'; }
      });
    }

    /* marquee: duplicate track content for seamless loop */
    document.querySelectorAll('.marquee .track').forEach(function (tr) { tr.innerHTML += tr.innerHTML; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
