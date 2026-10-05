import { createIcons, icons } from 'lucide';
import confetti from 'canvas-confetti';

/* ==========================================================
   INITIALIZE LUCIDE ICONS
   ========================================================== */
function initIcons() {
  createIcons({ icons });
}

/* ==========================================================
   WEB AUDIO API: ROYAL HARMONIC CHIME SYNTHESIZER
   ========================================================== */
function playRoyalChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Pentatonic chord frequencies (C5, E5, G5, B5, C6) - Regal & Harmonic
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.07 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 2.0);
    });
  } catch {
    // Graceful fallback if audio is restricted
  }
}

/* ==========================================================
   JAW-DROPPING ROYAL INTRO EXPERIENCE
   ========================================================== */
function initRoyalIntro() {
  const introOverlay = document.getElementById('royal-intro-overlay');
  const btnEnter = document.getElementById('btn-enter-realm');
  const btnSkip = document.getElementById('btn-skip-intro');
  const btnReplay = document.getElementById('btn-replay-intro');
  const timerBar = document.getElementById('intro-timer-bar');
  const timerSecs = document.getElementById('intro-timer-seconds');
  const canvas = document.getElementById('intro-particles');

  if (!introOverlay) return;

  // Particle Canvas Setup
  let animId;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    if (!introOverlay.classList.contains('unveiled')) {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
  });

  // Particle System
  const particles = [];
  const particleCount = 75;
  const goldColors = ['#FCF6BA', '#BF953F', '#B38728', '#FBF5B7', '#AA771C', '#FFFFFF'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      color: goldColors[Math.floor(Math.random() * goldColors.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.7 - 0.2, // Float upwards gracefully
      alpha: Math.random() * 0.7 + 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      twinkle: Math.random() * Math.PI,
    });
  }

  function renderParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.twinkle += p.pulseSpeed;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));
      ctx.save();
      ctx.globalAlpha = Math.max(0.1, currentAlpha);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#D4AF37';

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (!introOverlay.classList.contains('unveiled')) {
      animId = requestAnimationFrame(renderParticles);
    }
  }

  animId = requestAnimationFrame(renderParticles);

  // Auto-countdown (3.2 seconds)
  const totalDuration = 3200;
  const startTime = Date.now();
  let timerInterval;

  function updateTimer() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(100, (elapsed / totalDuration) * 100);
    if (timerBar) timerBar.style.width = `${progress}%`;

    const remainingSecs = Math.max(1, Math.ceil((totalDuration - elapsed) / 1000));
    if (timerSecs) timerSecs.textContent = remainingSecs;

    if (elapsed >= totalDuration) {
      clearInterval(timerInterval);
      unveilShowroom();
    }
  }

  timerInterval = setInterval(updateTimer, 50);

  function unveilShowroom() {
    clearInterval(timerInterval);
    if (introOverlay.classList.contains('unveiled')) return;

    // Trigger royal chime
    playRoyalChime();

    // Trigger gold burst confetti
    try {
      confetti({
        particleCount: 50,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#FCF6BA', '#AA771C', '#C41E3A', '#FFFFFF'],
        disableForReducedMotion: true
      });
    } catch {
      // Confetti fallback
    }

    introOverlay.classList.add('unveiled');
    setTimeout(() => {
      introOverlay.style.display = 'none';
      if (animId) cancelAnimationFrame(animId);
    }, 1200);
  }

  if (btnEnter) btnEnter.addEventListener('click', unveilShowroom);
  if (btnSkip) btnSkip.addEventListener('click', unveilShowroom);

  // Allow clicking anywhere on intro to enter
  introOverlay.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
      unveilShowroom();
    }
  });

  // Replay intro feature
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      introOverlay.style.display = 'flex';
      // Force repaint
      void introOverlay.offsetWidth;
      introOverlay.classList.remove('unveiled');
      animId = requestAnimationFrame(renderParticles);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}


/* ==========================================================
   HERO 3D CARD PARALLAX & GEMOLOGICAL HOTSPOTS
   ========================================================== */
function initHeroShowcase() {
  const heroCard = document.getElementById('hero-3d-card');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');
  const hotspots = document.querySelectorAll('.hotspot');

  // Subtle 3D perspective tilt on mouse movement over card
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / rect.height) * 12;
      const rotY = (x / rect.width) * 12;
      heroCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  }

  // Hotspots info mapping
  const hotspotData = {
    1: {
      title: "Natural Burmese Cabochon Ruby",
      desc: "Deep regal pigeon-blood red natural ruby, oval-cabochon cut and bezel-set in pure 22K gold to bestow marital prosperity."
    },
    2: {
      title: "Lustrous Triple-Strand South Sea Pearls",
      desc: "Each pearl is calibrated for flawless iridescence and silken luster, strung by master artisans for a majestic drape."
    },
    3: {
      title: "Imperial 22K BIS 916 Filigree Pendant",
      desc: "A breathtaking royal sunburst medallion featuring openwork jaali carvings and brilliant diamond-cut gold facets."
    },
    4: {
      title: "Zambian Teardrop Emerald Charms",
      desc: "Natural forest-green emerald beads hand-wire wrapped to create a rhythmic, regal contrast against pure yellow gold."
    }
  };

  hotspots.forEach(spot => {
    spot.addEventListener('mouseenter', () => {
      const dotText = spot.querySelector('.hotspot-dot')?.textContent.trim();
      const data = hotspotData[dotText];
      if (data && toastTitle && toastDesc) {
        toastTitle.textContent = data.title;
        toastDesc.textContent = data.desc;
        toastTitle.style.color = '#F3DE7C';
      }
    });

    spot.addEventListener('click', (e) => {
      e.stopPropagation();
      const dotText = spot.querySelector('.hotspot-dot')?.textContent.trim();
      const data = hotspotData[dotText];
      if (data && toastTitle && toastDesc) {
        toastTitle.textContent = data.title;
        toastDesc.textContent = data.desc;
      }
    });
  });
}

/* ==========================================================
   LIVE RATE & GOLD VALUE CALCULATOR ("ROYAL ATELIER")
   ========================================================== */
function initCalculator() {
  const purityBtns = document.querySelectorAll('#purity-selector .pill-btn');
  const weightRange = document.getElementById('weight-range');
  const weightInput = document.getElementById('weight-input');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const makingSelect = document.getElementById('making-tier');

  const karatLabel = document.getElementById('selected-karat-label');
  const rateDisplay = document.getElementById('calc-rate-display');
  const makingDisplay = document.getElementById('calc-making-display');
  const valBase = document.getElementById('val-base');
  const valMaking = document.getElementById('val-making');
  const valGst = document.getElementById('val-gst');
  const valTotal = document.getElementById('val-total');
  const whatsappBtn = document.getElementById('calc-whatsapp-btn');

  let currentRate = 7850;
  let currentKaratName = '22K Gold (BIS 916)';
  let currentWeight = 25;
  let currentMakingPercent = 12;

  function formatINR(val) {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  }

  function calculate() {
    const basePrice = currentWeight * currentRate;
    const makingPrice = basePrice * (currentMakingPercent / 100);
    const subtotal = basePrice + makingPrice;
    const gst = subtotal * 0.03;
    const total = subtotal + gst;

    if (valBase) valBase.textContent = formatINR(basePrice);
    if (valMaking) valMaking.textContent = formatINR(makingPrice);
    if (valGst) valGst.textContent = formatINR(gst);
    if (valTotal) valTotal.textContent = formatINR(total);
    if (rateDisplay) rateDisplay.textContent = formatINR(currentRate);
    if (makingDisplay) makingDisplay.textContent = `${currentMakingPercent}%`;
    if (karatLabel) karatLabel.textContent = currentKaratName;

    // Update WhatsApp Inquiry Link with calculated details
    if (whatsappBtn) {
      const msg = encodeURIComponent(
        `Namaste Swarna Jewellers,\n\nI used your Royal Karat Calculator and would like to enquire about:\n- Purity: ${currentKaratName}\n- Weight: ${currentWeight} grams\n- Rate: ₹${currentRate}/g\n- Estimated Total: ${formatINR(total)}\n\nPlease assist me with booking or visiting the Gopalapatnam showroom.`
      );
      whatsappBtn.href = `https://wa.me/918801535666?text=${msg}`;
    }
  }

  // Purity Buttons
  purityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      purityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRate = parseFloat(btn.dataset.rate || 7850);
      currentKaratName = btn.dataset.karat || '22K Gold';
      calculate();
    });
  });

  // Weight Slider & Input Sync
  if (weightRange && weightInput) {
    weightRange.addEventListener('input', (e) => {
      currentWeight = parseFloat(e.target.value);
      weightInput.value = currentWeight;
      calculate();
    });

    weightInput.addEventListener('input', (e) => {
      let val = parseFloat(e.target.value) || 1;
      if (val < 0.5) val = 0.5;
      currentWeight = val;
      weightRange.value = Math.min(100, val);
      calculate();
    });
  }

  // Weight Presets
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.dataset.val || 25);
      currentWeight = val;
      if (weightInput) weightInput.value = val;
      if (weightRange) weightRange.value = Math.min(100, val);
      calculate();
    });
  });

  // Making Select
  if (makingSelect) {
    makingSelect.addEventListener('change', (e) => {
      currentMakingPercent = parseFloat(e.target.value) || 0;
      calculate();
    });
  }

  // Open and close calculator modal
  const calcModal = document.getElementById('calculator-modal');
  const calcCloseBtn = document.getElementById('calc-modal-close-btn');
  const calcBackdrop = document.getElementById('calc-modal-backdrop');
  const openCalcTriggers = document.querySelectorAll('[data-open-calc]');

  function openCalcModal() {
    if (!calcModal) return;
    calcModal.classList.add('active');
    calcModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    calculate();
  }

  function closeCalcModal() {
    if (!calcModal) return;
    calcModal.classList.remove('active');
    calcModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openCalcTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCalcModal();
    });
  });

  if (calcCloseBtn) calcCloseBtn.addEventListener('click', closeCalcModal);
  if (calcBackdrop) calcBackdrop.addEventListener('click', closeCalcModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && calcModal?.classList.contains('active')) {
      closeCalcModal();
    }
  });

  calculate();
}

/* ==========================================================
   COLLECTIONS FILTERING
   ========================================================== */
function initCollections() {
  const tabs = document.querySelectorAll('#collection-tabs .tab-btn');
  const cards = document.querySelectorAll('#collections-grid .jewel-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.category;

      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
          // trigger subtle fade in
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================
   ROYAL QUICK VIEW MODAL
   ========================================================== */
function initQuickView() {
  const modal = document.getElementById('quick-view-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close-btn');
  const viewBtns = document.querySelectorAll('.btn-quick-view, .btn-card-quick');

  const items = {
    1: {
      title: "The Maharani Royal Pearl & Ruby Choker",
      category: "Signature Bridal Masterpiece",
      image: "/assets/bridal-necklace.png",
      purity: "22K BIS 916 Hallmarked Gold",
      weight: "Approx. 65 - 85 Grams (Customizable)",
      stones: "Natural Burmese Ruby, Zambian Emerald Drops & South Sea Pearls",
      craft: "Handcrafted filigree openwork medallion with triple-strand lustrous pearls",
      desc: "Worn by royalty and treasured as an auspicious wedding heirloom. Every pearl is individually knotted on pure silk thread and finished with an adjustable ornate golden dori."
    },
    2: {
      title: "Imperial Temple Gold Haram & Choker",
      category: "Necklaces & Harams",
      image: "/assets/products/cat-necklaces.png",
      purity: "22K BIS 916 Hallmarked Gold",
      weight: "Approx. 40 - 60 Grams",
      stones: "Uncut Polki & Kundan Stones with Antique Patina",
      craft: "Nakshi temple repoussé technique depicting divine blessings",
      desc: "Designed for grand South Indian wedding muhurthams. The antique gold finish complements rich Kanjeevaram silks."
    },
    3: {
      title: "Royal Chandbali & Jhumka Drops",
      category: "Designer Earrings",
      image: "/assets/products/cat-earrings.png",
      purity: "22K BIS 916 Hallmarked Gold",
      weight: "Approx. 18 - 28 Grams",
      stones: "Micro seed pearls, high-refraction rubies",
      craft: "Multi-tiered crescent chandbali with resonant bell jhumka",
      desc: "Graceful chandeliers that move with regal charm, featuring delicate pearl hangings and sturdy screw-back closures."
    },
    4: {
      title: "Heritage Filigree Kadas & Bangles",
      category: "Traditional Bangles",
      image: "/assets/products/cat-bangles.png",
      purity: "22K BIS 916 Hallmarked Gold",
      weight: "Approx. 35 - 55 Grams (Pair)",
      stones: "Pure Solid Gold / Optional Ruby Accents",
      craft: "Generational wire-filigree with reinforced comfort screw",
      desc: "Robust solid 22K gold kadas that can be worn for daily auspiciousness or paired with bridal sets."
    },
    5: {
      title: "Celebration Solitaire & Cocktail Bands",
      category: "Rings & Solitaires",
      image: "/assets/products/cat-rings.png",
      purity: "18K / 22K Gold + IGI Certified Diamonds",
      weight: "Approx. 4 - 8 Grams",
      stones: "VVS-VS Clarity, E-F Color Natural Solitaires",
      craft: "Four-prong elevated royal crown setting",
      desc: "Timeless engagement rings and cocktail bands crafted to mark life's most unforgettable romantic milestones."
    },
    6: {
      title: "Imperial Sovereign Gold Bracelets",
      category: "Royal Bracelets",
      image: "/assets/products/cat-bracelets.png",
      purity: "22K BIS 916 Hallmarked Gold",
      weight: "Approx. 15 - 30 Grams",
      stones: "High-polish diamond-cut solid gold facets",
      craft: "Interlocking curb and Byzantine royal weave",
      desc: "Understated nobility. Beautifully tactile, flexible on the wrist, and secured with double safety clasps."
    }
  };

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.item;
      const data = items[id];
      if (!data || !modalContent) return;

      const waMsg = encodeURIComponent(`Namaste Swarna Jewellers, I would like to know pricing and showroom availability for ${data.title} (${data.category}).`);

      modalContent.innerHTML = `
        <div class="modal-detail-grid">
          <div class="modal-media-wrap">
            <img src="${data.image}" alt="${data.title}">
          </div>
          <div class="modal-text-wrap">
            <span class="modal-badge">${data.category}</span>
            <h3 class="modal-title">${data.title}</h3>
            <p class="modal-desc">${data.desc}</p>
            
            <div class="modal-specs-list">
              <div class="spec-line"><span>Purity Guarantee:</span> <span>${data.purity}</span></div>
              <div class="spec-line"><span>Estimated Weight:</span> <span>${data.weight}</span></div>
              <div class="spec-line"><span>Gemological Inlay:</span> <span>${data.stones}</span></div>
              <div class="spec-line"><span>Craftsmanship:</span> <span>${data.craft}</span></div>
            </div>

            <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:auto;">
              <a href="https://wa.me/918801535666?text=${waMsg}" target="_blank" class="btn-royal-primary">
                <i data-lucide="message-circle" class="icon-sm"></i>
                <span>Enquire On WhatsApp</span>
              </a>
              <a href="tel:8801535666" class="btn-royal-outline">
                <i data-lucide="phone" class="icon-sm"></i>
                <span>Call Showroom</span>
              </a>
            </div>
          </div>
        </div>
      `;

      initIcons();
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================
   VIP APPOINTMENT FORM DISPATCH TO WHATSAPP
   ========================================================== */
function initAppointmentForm() {
  const form = document.getElementById('appointment-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  // Set default minimum date to today
  const dateInput = document.getElementById('app-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('app-name').value.trim();
    const phone = document.getElementById('app-phone').value.trim();
    const category = document.getElementById('app-category').value;
    const date = document.getElementById('app-date').value;
    const notes = document.getElementById('app-notes').value.trim();

    if (!name || !phone) {
      if (feedback) {
        feedback.textContent = 'Please fill out your name and contact number.';
        feedback.style.color = '#ef4444';
      }
      return;
    }

    const waText = encodeURIComponent(
      `👑 ROYAL VIP APPOINTMENT REQUEST - SWARNA JEWELLERS\n\n` +
      `• Guest Name: ${name}\n` +
      `• Mobile: ${phone}\n` +
      `• Preferred Date: ${date}\n` +
      `• Category of Interest: ${category}\n` +
      (notes ? `• Special Notes: ${notes}\n` : '') +
      `\nPlease confirm the private lounge slot at your Gopalapatnam showroom.`
    );

    // Confetti celebration
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#FCF6BA', '#AA771C']
      });
    } catch {}

    if (feedback) {
      feedback.textContent = 'Opening WhatsApp with your appointment request...';
      feedback.style.color = '#22c55e';
    }

    setTimeout(() => {
      window.open(`https://wa.me/918801535666?text=${waText}`, '_blank');
      form.reset();
      if (feedback) feedback.textContent = 'Appointment request sent! Our concierge will assist you promptly.';
    }, 600);
  });
}

/* ==========================================================
   MOBILE NAVBAR DRAWER & SCROLL LISTENER
   ========================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }
}

/* ==========================================================
   ROYAL THEME CONTROLLER (BRIGHT / DARK THEME TOGGLE)
   ========================================================== */
function initThemeToggle() {
  const btnToggle = document.getElementById('btn-theme-toggle');
  const mobileToggle = document.getElementById('mobile-theme-toggle');
  const mobileStatusText = document.getElementById('mobile-theme-status-text');

  // Read saved theme or default to 'dark'
  let currentTheme = localStorage.getItem('swarna_theme') || 'dark';

  function applyTheme(theme, playSound = false) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('swarna_theme', theme);
    } catch {}

    const isBright = theme === 'bright';

    if (btnToggle) {
      btnToggle.setAttribute('title', isBright ? 'Switch to Dark Royal Theme' : 'Switch to Bright Royal Theme');
      btnToggle.setAttribute('aria-label', isBright ? 'Switch to Dark Royal Theme' : 'Switch to Bright Royal Theme');
    }

    if (mobileStatusText) {
      mobileStatusText.textContent = isBright ? 'Switch to Dark Theme' : 'Switch to Bright Theme';
    }

    if (playSound) {
      playRoyalChime();
    }

    createIcons({ icons });
  }

  // Initial application
  applyTheme(currentTheme, false);

  function handleToggle() {
    const nextTheme = currentTheme === 'bright' ? 'dark' : 'bright';
    applyTheme(nextTheme, true);
  }

  btnToggle?.addEventListener('click', handleToggle);
  mobileToggle?.addEventListener('click', handleToggle);
}

/* ==========================================================
   DOCUMENT READY ENTRY POINT
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initThemeToggle();
  initRoyalIntro();

  initHeroShowcase();
  initCalculator();
  initCollections();
  initQuickView();
  initAppointmentForm();
  initNavigation();
});
