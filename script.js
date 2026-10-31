/* =========================================
   TATA SURYA KITA! — script.js
   Simulasi Tata Surya Interaktif untuk Anak
   Vanilla JS + Canvas API, tanpa library
   ========================================= */

'use strict';

// ─────────────────────────────────────────
// 1. DATA PLANET
//    Semua informasi planet disimpan di sini
// ─────────────────────────────────────────
const PLANET_DATA = [
  {
    name:        'Merkurius',
    emoji:       '⚫',
    color:       '#b5b5b5',    // Abu-abu gelap
    faceColor:   '#d4d4d4',
    radius:      10,           // Ukuran di canvas (px, akan diskalakan)
    orbitRadius: 0.16,         // Proporsi dari radius canvas (0–1)
    speed:       4.15,         // Kecepatan orbit relatif (Bumi = 1)
    size:        'Hampir sama besar dengan Bulan kita!',
    fact:        'Merkurius adalah planet terkecil dan paling dekat dengan Matahari. Sehari di Merkurius = 59 hari di Bumi!',
    distance:    '📍 Dekat sekali dengan Matahari — hanya ~57 juta km!'
  },
  {
    name:        'Venus',
    emoji:       '🟡',
    color:       '#f5c842',    // Kuning emas
    faceColor:   '#ffe083',
    radius:      16,
    orbitRadius: 0.26,
    speed:       1.62,
    size:        'Hampir sama besar dengan Bumi — kembarannya!',
    fact:        'Venus adalah planet terpanas di tata surya. Suhu permukaannya bisa mencapai 465°C — lebih panas dari oven!',
    distance:    '📍 Dekat — sekitar 108 juta km dari Matahari.'
  },
  {
    name:        'Bumi',
    emoji:       '🌍',
    color:       '#3ea6ff',    // Biru laut
    faceColor:   '#74c7ff',
    radius:      18,
    orbitRadius: 0.37,
    speed:       1.00,
    size:        'Ini rumah kita! Bumi adalah patokan ukurannya.',
    fact:        'Bumi adalah satu-satunya planet yang diketahui punya kehidupan. 71% permukaannya ditutupi air!',
    distance:    '📍 Sedang — sekitar 150 juta km dari Matahari.',
    hasMoon:     true           // Bendera untuk menggambar Bulan
  },
  {
    name:        'Mars',
    emoji:       '🔴',
    color:       '#f05030',    // Merah Mars
    faceColor:   '#ff7c5c',
    radius:      13,
    orbitRadius: 0.48,
    speed:       0.53,
    size:        'Setengah ukuran Bumi.',
    fact:        'Mars punya gunung tertinggi di tata surya: Olympus Mons, 3x lebih tinggi dari Gunung Everest!',
    distance:    '📍 Sedang-jauh — sekitar 228 juta km dari Matahari.'
  },
  {
    name:        'Jupiter',
    emoji:       '🟠',
    color:       '#e8944a',    // Oranye kecokelatan
    faceColor:   '#f5b97a',
    radius:      30,
    orbitRadius: 0.54,
    speed:       0.084,
    size:        '11 kali lebih besar dari Bumi — raksasa sejati!',
    fact:        'Jupiter adalah planet terbesar. Badai Merah Besar-nya sudah berlangsung lebih dari 350 tahun!',
    distance:    '📍 Jauh — sekitar 778 juta km dari Matahari.'
  },
  {
    name:        'Saturnus',
    emoji:       '🪐',
    color:       '#f0d060',    // Kuning pasir
    faceColor:   '#f7e498',
    radius:      26,
    orbitRadius: 0.65,
    speed:       0.034,
    size:        '9 kali lebih besar dari Bumi.',
    fact:        'Saturnus punya cincin indah dari es dan batu! Ia juga sangat ringan — bisa mengapung di air kalau ada lautan yang cukup besar!',
    distance:    '📍 Sangat jauh — sekitar 1,4 miliar km dari Matahari.',
    hasRing:     true           // Bendera untuk menggambar cincin
  },
  {
    name:        'Uranus',
    emoji:       '🩵',
    color:       '#6de8e8',    // Biru-hijau
    faceColor:   '#a0f5f5',
    radius:      21,
    orbitRadius: 0.76,
    speed:       0.012,
    size:        '4 kali lebih besar dari Bumi.',
    fact:        'Uranus berputar miring seperti bola yang menggelinding! Musim di Uranus berlangsung selama 21 tahun Bumi.',
    distance:    '📍 Sangat jauh — sekitar 2,9 miliar km dari Matahari.'
  },
  {
    name:        'Neptunus',
    emoji:       '💙',
    color:       '#4169e1',    // Biru tua
    faceColor:   '#6a8ff5',
    radius:      20,
    orbitRadius: 0.87,
    speed:       0.006,
    size:        'Hampir 4 kali lebih besar dari Bumi.',
    fact:        'Neptunus punya angin terkencang di tata surya — mencapai 2.100 km/jam! Lebih kencang dari jet tempur!',
    distance:    '📍 Paling jauh — sekitar 4,5 miliar km dari Matahari.'
  }
];

// ─────────────────────────────────────────
// 2. STATE APLIKASI
// ─────────────────────────────────────────
const state = {
  isPlaying:    true,     // Apakah animasi berjalan
  speedMult:    1.0,      // Pengali kecepatan dari slider
  angles:       [],       // Sudut orbit masing-masing planet (radian)
  moonAngle:    0,        // Sudut orbit Bulan
  jiggling:     null,     // Index planet yang sedang goyang {idx, t}
  sunJiggle:    0,        // Timer goyang matahari (detik, 0 = diam)
  moonJiggle:   0,        // Timer goyang bulan (detik, 0 = diam)
  stars:        [],       // Data bintang-bintang di background
  comets:       [],       // Data komet yang melintasi layar
  asteroids:    [],       // Data sabuk asteroid (posisi statis, berputar perlahan)
  satellites:   [],       // Data satelit buatan yang mengorbit
  lastTime:     0,        // Timestamp frame sebelumnya (untuk deltaTime)
  clickedPlanet:null,     // Index planet yang sedang menampilkan kartu
  // Posisi & radius matahari & bulan disimpan tiap frame untuk deteksi klik
  sun:          { x: 0, y: 0, r: 0 },
  moon:         { x: 0, y: 0, r: 0 },
};

// Inisialisasi sudut awal planet (acak agar terlihat lebih natural)
PLANET_DATA.forEach((_, i) => {
  state.angles[i] = Math.random() * Math.PI * 2;
});

// ─────────────────────────────────────────
// 3. SETUP CANVAS & ELEMEN DOM
// ─────────────────────────────────────────
const canvas    = document.getElementById('solarCanvas');
const ctx       = canvas.getContext('2d');
const infoCard  = document.getElementById('infoCard');
const overlay   = document.getElementById('overlay');
const btnPlay   = document.getElementById('btnPlayPause');
const btnReset  = document.getElementById('btnReset');
const speedSldr = document.getElementById('speedSlider');

// Dimensi canvas yang dipakai secara internal (pixel fisik)
let W = 0, H = 0;

/** Sesuaikan ukuran canvas dengan ukuran layar, lalu gambar ulang */
function resizeCanvas() {
  const wrapper = canvas.parentElement;
  const dpr     = window.devicePixelRatio || 1;

  // Canvas mengisi seluruh area wrapper (full screen)
  const cssW = wrapper.clientWidth;
  const cssH = wrapper.clientHeight;

  // Set ukuran buffer fisik (piksel layar) untuk ketajaman HiDPI
  W = canvas.width  = Math.round(cssW * dpr);
  H = canvas.height = Math.round(cssH * dpr);

  // Ukuran CSS (piksel logis)
  canvas.style.width  = cssW + 'px';
  canvas.style.height = cssH + 'px';

  // Reset transform lalu terapkan DPR
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Buat ulang bintang berdasarkan diagonal terpanjang
  generateStars(Math.max(cssW, cssH));
  // Buat ulang asteroid & satelit saat resize (komet tetap lanjut)
  generateAsteroids();
  generateSatellites();
}

// ─────────────────────────────────────────
// 4. BINTANG LATAR BELAKANG
// ─────────────────────────────────────────

/**
 * Generate posisi dan ukuran bintang secara acak
 * @param {number} maxSide - Sisi terpanjang canvas (px logis) untuk menentukan jumlah bintang
 */
function generateStars(maxSide) {
  const { w, h } = getCanvasDims();
  state.stars = [];
  const count = Math.floor(maxSide * 0.28); // ~200 bintang untuk canvas 720px
  for (let i = 0; i < count; i++) {
    state.stars.push({
      x:          Math.random() * w,               // Tersebar di lebar penuh
      y:          Math.random() * h,               // Tersebar di tinggi penuh
      r:          Math.random() * 1.5 + 0.3,       // Radius 0.3–1.8
      alpha:      Math.random() * 0.6 + 0.2,       // Kecerahan dasar
      twinkleSpd: Math.random() * 2 + 0.5,         // Kecepatan kelap-kelip
      phase:      Math.random() * Math.PI * 2      // Fase awal beda-beda
    });
  }
}

/** Gambar semua bintang dengan efek kelap-kelip */
function drawStars(t) {
  for (const s of state.stars) {
    // Sinusoidal untuk kelap-kelip yang halus
    const alpha = s.alpha * (0.5 + 0.5 * Math.sin(t * s.twinkleSpd + s.phase));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = '#ffffff';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ─────────────────────────────────────────
// 4b. KOMET
// ─────────────────────────────────────────

/**
 * Inisialisasi satu komet baru yang muncul dari tepi layar
 * Komet bergerak diagonal melintasi layar lalu hilang di sisi lain
 */
function spawnComet() {
  const { w, h } = getCanvasDims();
  // Pilih sisi kemunculan: 0=atas, 1=kanan, 2=bawah, 3=kiri
  const side = Math.floor(Math.random() * 4);
  let x, y, vx, vy;
  const speed = 80 + Math.random() * 120;       // px/detik
  const angle = (Math.random() * 0.6 + 0.2);    // sudut kemiringan lintasan

  if (side === 0) {        // dari atas
    x = Math.random() * w; y = -20;
    vx = (Math.random() - 0.5) * speed * 0.6;
    vy = speed * Math.cos(angle);
  } else if (side === 1) { // dari kanan
    x = w + 20; y = Math.random() * h;
    vx = -speed * Math.cos(angle);
    vy = (Math.random() - 0.5) * speed * 0.6;
  } else if (side === 2) { // dari bawah
    x = Math.random() * w; y = h + 20;
    vx = (Math.random() - 0.5) * speed * 0.6;
    vy = -speed * Math.cos(angle);
  } else {                 // dari kiri
    x = -20; y = Math.random() * h;
    vx = speed * Math.cos(angle);
    vy = (Math.random() - 0.5) * speed * 0.6;
  }

  return {
    x, y, vx, vy,
    r:        2 + Math.random() * 2.5,           // Radius kepala komet
    tailLen:  60 + Math.random() * 80,           // Panjang ekor
    color:    Math.random() > 0.5 ? '#a0e8ff' : '#ffe8a0', // Biru es atau kuning
    alpha:    0.7 + Math.random() * 0.3,
    angle:    Math.atan2(vy, vx),                // Sudut arah gerak untuk ekor
  };
}

/** Generate daftar komet awal (beberapa langsung aktif, lainnya menunggu) */
function generateComets() {
  state.comets = [];
  // Mulai dengan 2 komet aktif
  for (let i = 0; i < 2; i++) state.comets.push(spawnComet());
}

/** Update posisi komet dan gambar */
function updateAndDrawComets(delta) {
  const { w, h } = getCanvasDims();
  const margin = 150;

  for (let i = state.comets.length - 1; i >= 0; i--) {
    const c = state.comets[i];

    if (state.isPlaying) {
      c.x += c.vx * delta;
      c.y += c.vy * delta;
    }

    // Hapus jika keluar layar, spawn komet baru menggantikannya
    if (c.x < -margin || c.x > w + margin || c.y < -margin || c.y > h + margin) {
      state.comets.splice(i, 1);
      // Tunda spawn acak 2–8 detik (simpan sebagai timer)
      setTimeout(() => state.comets.push(spawnComet()), (2 + Math.random() * 6) * 1000);
      continue;
    }

    // Arah ekor: berlawanan dengan arah gerak
    const tailAngle = Math.atan2(c.vy, c.vx) + Math.PI;

    // Gambar ekor (gradien transparan)
    ctx.save();
    const tx = c.x + Math.cos(tailAngle) * c.tailLen;
    const ty = c.y + Math.sin(tailAngle) * c.tailLen;
    const tail = ctx.createLinearGradient(c.x, c.y, tx, ty);
    tail.addColorStop(0,   c.color);          // warna penuh di kepala
    tail.addColorStop(0.5, c.color);
    tail.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.strokeStyle = tail;
    ctx.lineWidth   = c.r * 1.8;
    ctx.lineCap     = 'round';
    ctx.globalAlpha = c.alpha;
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.restore();

    // Gambar kepala komet (bola bercahaya)
    ctx.save();
    const headGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r * 2.5);
    headGrad.addColorStop(0, '#ffffff');
    headGrad.addColorStop(0.4, c.color);
    headGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle   = headGrad;
    ctx.globalAlpha = c.alpha;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ─────────────────────────────────────────
// 4c. SABUK ASTEROID
// ─────────────────────────────────────────

/**
 * Generate asteroid di sabuk antara Mars dan Jupiter
 * Setiap asteroid punya sudut orbit dan offset acak
 */
function generateAsteroids() {
  state.asteroids = [];
  const count = 55;
  for (let i = 0; i < count; i++) {
    state.asteroids.push({
      angle:      Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() * 0.08 + 0.02) * (Math.random() > 0.5 ? 1 : -1),
      orbitFrac:  0.505 + Math.random() * 0.065,
      r:          1.2 + Math.random() * 2.2,
      shape:      Math.floor(Math.random() * 3),
      rotation:   Math.random() * Math.PI * 2,
      rotSpeed:   (Math.random() - 0.5) * 2,
      color:      `hsl(${25 + Math.random()*20},${20+Math.random()*30}%,${45+Math.random()*20}%)`,
      jiggle:     0,    // Timer efek klik
      _x: 0, _y: 0,    // Posisi terakhir (diisi saat draw)
    });
  }
}

/** Update dan gambar sabuk asteroid */
function updateAndDrawAsteroids(delta, cx, cy) {
  const { w, h } = getCanvasDims();
  const maxR = (Math.min(w, h) / 2) * 0.90;

  for (const a of state.asteroids) {
    if (state.isPlaying) {
      a.angle    += a.angleSpeed * state.speedMult * delta;
      a.rotation += a.rotSpeed * delta;
    }
    if (a.jiggle > 0) a.jiggle = Math.max(0, a.jiggle - delta);

    const orbitR = a.orbitFrac * maxR;
    const ax = cx + Math.cos(a.angle) * orbitR;
    const ay = cy + Math.sin(a.angle) * orbitR;

    // Simpan posisi untuk deteksi klik
    a._x = ax; a._y = ay;

    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(a.rotation);
    ctx.fillStyle   = a.color;
    ctx.globalAlpha = 0.75;

    // Glow saat diklik
    if (a.jiggle > 0) {
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur  = a.r * 4;
    }

    if (a.shape === 0) {
      ctx.beginPath();
      ctx.arc(0, 0, a.r, 0, Math.PI * 2);
      ctx.fill();
    } else if (a.shape === 1) {
      ctx.beginPath();
      ctx.ellipse(0, 0, a.r * 1.6, a.r * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -a.r * 1.4);
      ctx.lineTo( a.r * 1.1,  a.r * 0.9);
      ctx.lineTo(-a.r * 1.2,  a.r * 0.7);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}

// ─────────────────────────────────────────
// 4d. SATELIT BUATAN
// ─────────────────────────────────────────

/**
 * Generate satelit buatan yang mengorbit di luar Neptunus atau di pinggir layar
 */
function generateSatellites() {
  state.satellites = [
    {
      angle:      0,
      speed:      0.35,
      orbitFrac:  0.96,
      size:       5,
      color:      '#c8e8ff',
      label:      'Satelit 🛸',
      emoji:      '🛸',
      name:       'Satelit Penjelajah',
      info:       'Satelit ini mengorbit jauh di luar tata surya untuk memantau luar angkasa dan mengirim data ke Bumi!',
      distance:   '📍 Jauh sekali di luar orbit Neptunus — menjelajahi tepi tata surya!',
      jiggle:     0,
      _x: 0, _y: 0,
    },
    {
      angle:      Math.PI,
      speed:      -0.22,
      orbitFrac:  1.04,
      size:       4,
      color:      '#ffe4a0',
      label:      'Satelit 🛰️',
      emoji:      '🛰️',
      name:       'Satelit Komunikasi',
      info:       'Satelit komunikasi mengorbit Bumi untuk menyiarkan sinyal TV, internet, dan telepon ke seluruh dunia!',
      distance:   '📍 Berputar mengelilingi tata surya di orbit sangat luar!',
      jiggle:     0,
      _x: 0, _y: 0,
    },
  ];
}

/** Update dan gambar satelit buatan */
function updateAndDrawSatellites(delta, cx, cy) {
  const { w, h } = getCanvasDims();
  const maxR = (Math.min(w, h) / 2) * 0.90;

  for (const sat of state.satellites) {
    if (state.isPlaying) {
      sat.angle += sat.speed * state.speedMult * delta;
    }
    if (sat.jiggle > 0) sat.jiggle = Math.max(0, sat.jiggle - delta);

    const orbitR = sat.orbitFrac * maxR;
    const sx = cx + Math.cos(sat.angle) * orbitR;
    const sy = cy + Math.sin(sat.angle) * orbitR;
    const sz = sat.size;

    // Simpan posisi untuk deteksi klik
    sat._x = sx; sat._y = sy;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(sat.angle + Math.PI / 4); // Selalu menghadap ke depan

    // Glow ekstra saat diklik
    if (sat.jiggle > 0) {
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur  = sz * 5;
    }

    // Badan satelit (kotak kecil)
    ctx.fillStyle   = sat.color;
    ctx.shadowColor = sat.color;
    ctx.shadowBlur  = sz * 2;
    ctx.fillRect(-sz * 0.6, -sz * 0.5, sz * 1.2, sz);

    // Panel surya kiri
    ctx.fillStyle = '#4488cc';
    ctx.fillRect(-sz * 2.4, -sz * 0.25, sz * 1.6, sz * 0.5);

    // Panel surya kanan
    ctx.fillRect( sz * 0.8, -sz * 0.25, sz * 1.6, sz * 0.5);

    // Garis di panel surya
    ctx.strokeStyle = 'rgba(180,220,255,0.5)';
    ctx.lineWidth   = 0.8;
    for (let g = 1; g < 3; g++) {
      const gx = -sz * 2.4 + (sz * 1.6 / 3) * g;
      ctx.beginPath();
      ctx.moveTo(gx, -sz * 0.25);
      ctx.lineTo(gx,  sz * 0.25);
      ctx.stroke();
      const gx2 = sz * 0.8 + (sz * 1.6 / 3) * g;
      ctx.beginPath();
      ctx.moveTo(gx2, -sz * 0.25);
      ctx.lineTo(gx2,  sz * 0.25);
      ctx.stroke();
    }

    // Antena kecil di atas
    ctx.strokeStyle = sat.color;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(0, -sz * 0.5);
    ctx.lineTo(0, -sz * 1.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -sz * 1.4, sz * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = sat.color;
    ctx.fill();

    ctx.restore();

    // Label nama (kecil, di bawah satelit)
    ctx.save();
    ctx.fillStyle    = 'rgba(200,230,255,0.7)';
    ctx.font         = `bold ${Math.max(8, sz * 1.4)}px 'Segoe UI', sans-serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.shadowColor  = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur   = 3;
    ctx.fillText(sat.label, sx, sy + sz * 2);
    ctx.restore();
  }
}

// ─────────────────────────────────────────
// 5. FUNGSI GAMBAR WAJAH KARTUN
// ─────────────────────────────────────────

/**
 * Gambar wajah lucu di atas planet
 * @param {number} cx   - Koordinat x pusat
 * @param {number} cy   - Koordinat y pusat
 * @param {number} r    - Radius planet
 * @param {boolean} jigg- Apakah planet sedang goyang (ekspresi beda)
 */
function drawFace(cx, cy, r, jigg = false) {
  const eyeR  = r * 0.13;    // Ukuran bola mata
  const eyeOX = r * 0.28;    // Jarak horizontal mata dari pusat
  const eyeOY = r * 0.18;    // Jarak vertikal mata dari pusat (ke atas)

  // --- Mata kiri ---
  ctx.save();
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(cx - eyeOX, cy - eyeOY, eyeR, 0, Math.PI * 2);
  ctx.fill();
  // Kilap mata
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.arc(cx - eyeOX + eyeR * 0.4, cy - eyeOY - eyeR * 0.4, eyeR * 0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- Mata kanan ---
  ctx.save();
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(cx + eyeOX, cy - eyeOY, eyeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.arc(cx + eyeOX + eyeR * 0.4, cy - eyeOY - eyeR * 0.4, eyeR * 0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- Senyum atau ekspresi terkejut saat goyang ---
  ctx.save();
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth   = Math.max(1.2, r * 0.07);
  ctx.lineCap     = 'round';

  if (jigg) {
    // Mulut bulat (terkejut / senang) saat diklik
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.25, r * 0.18, 0, Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.25, r * 0.18, 0, Math.PI);
    ctx.fill();
  } else {
    // Senyum normal
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.1, r * 0.3, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
  ctx.restore();

  // --- Pipi merah muda (blush) ---
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle   = '#ff9eb5';
  ctx.beginPath();
  ctx.ellipse(cx - eyeOX * 1.5, cy + r * 0.1, r * 0.18, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeOX * 1.5, cy + r * 0.1, r * 0.18, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ─────────────────────────────────────────
// 6. FUNGSI GAMBAR SETIAP OBJEK
// ─────────────────────────────────────────

/** Dapatkan dimensi canvas dalam koordinat CSS pixel */
function getCanvasDims() {
  return {
    w: parseInt(canvas.style.width)  || canvas.width,
    h: parseInt(canvas.style.height) || canvas.height
  };
}

/** Hitung radius orbit dalam pixel — gunakan setengah diagonal agar orbit mengisi full screen */
function orbitPx(planet) {
  const { w, h } = getCanvasDims();
  // Gunakan sisi terpendek agar orbit tidak pernah keluar tepi layar
  // margin 0.90 memberi ruang untuk badan planet terluar
  const maxR = (Math.min(w, h) / 2) * 0.90;
  return planet.orbitRadius * maxR;
}

/** Hitung radius planet diskalakan ke canvas */
function planetR(planet) {
  const { w, h } = getCanvasDims();
  // Skala dasar: planet.radius pada canvas 560px
  return planet.radius * (Math.min(w, h) / 560);
}

/** Gambar garis orbit (lingkaran tipis) */
function drawOrbit(cx, cy, r) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth   = 1;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

/** Gambar Matahari di pusat */
function drawSun(cx, cy) {
  const { w, h } = getCanvasDims();
  const r     = Math.min(w, h) * 0.062;     // ~43px pada canvas 700px
  const time  = performance.now() / 1000;

  // Simpan posisi & radius untuk deteksi klik
  state.sun.x = cx;
  state.sun.y = cy;
  state.sun.r = r;

  // Efek goyang matahari saat diklik
  let jx = 0, jy = 0;
  if (state.sunJiggle > 0) {
    const decay = Math.max(0, state.sunJiggle / 0.7);
    jx = Math.sin(state.sunJiggle * 50) * r * 0.25 * decay;
    jy = Math.cos(state.sunJiggle * 38) * r * 0.15 * decay;
  }
  const sx = cx + jx;
  const sy = cy + jy;

  // Cahaya matahari pulsasi (lebih besar saat baru diklik)
  const glowBoost = state.sunJiggle > 0 ? 1.3 : 1.0;
  const glow = r * (1.6 + 0.1 * Math.sin(time * 2)) * glowBoost;
  const grad = ctx.createRadialGradient(sx, sy, r * 0.1, sx, sy, glow);
  grad.addColorStop(0,   'rgba(255, 240, 100, 0.8)');
  grad.addColorStop(0.4, 'rgba(255, 180, 20,  0.35)');
  grad.addColorStop(1,   'rgba(255, 140, 0,   0)');
  ctx.save();
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(sx, sy, glow, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Badan matahari — gradien kuning ke oranye
  const sunGrad = ctx.createRadialGradient(sx - r * 0.2, sy - r * 0.2, r * 0.1, sx, sy, r);
  sunGrad.addColorStop(0, '#fff5a0');
  sunGrad.addColorStop(0.5, '#ffcc00');
  sunGrad.addColorStop(1, '#ff8800');
  ctx.save();
  ctx.fillStyle   = sunGrad;
  ctx.shadowColor = '#ffcc00';
  ctx.shadowBlur  = r * (state.sunJiggle > 0 ? 1.2 : 0.5);
  ctx.beginPath();
  ctx.arc(sx, sy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Wajah Matahari (ekspresi terkejut saat goyang)
  drawFace(sx, sy, r, state.sunJiggle > 0);
}

/** Gambar Bulan yang mengorbit Bumi */
function drawMoon(earthX, earthY, earthR) {
  const moonR     = earthR * 0.35;
  const moonOrbit = earthR * 2.2;
  const mx = earthX + Math.cos(state.moonAngle) * moonOrbit;
  const my = earthY + Math.sin(state.moonAngle) * moonOrbit;

  // Simpan posisi & radius bulan untuk deteksi klik
  state.moon.x = mx;
  state.moon.y = my;
  state.moon.r = moonR;

  // Efek goyang bulan saat diklik
  let jx = 0, jy = 0;
  if (state.moonJiggle > 0) {
    const decay = Math.max(0, state.moonJiggle / 0.6);
    jx = Math.sin(state.moonJiggle * 48) * moonR * 0.5 * decay;
    jy = Math.cos(state.moonJiggle * 36) * moonR * 0.4 * decay;
  }
  const bx = mx + jx;
  const by = my + jy;

  // Orbit Bulan
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth   = 0.8;
  ctx.beginPath();
  ctx.arc(earthX, earthY, moonOrbit, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Badan Bulan
  const moonGrad = ctx.createRadialGradient(bx - moonR * 0.2, by - moonR * 0.2, moonR * 0.05, bx, by, moonR);
  moonGrad.addColorStop(0, '#e8e8e8');
  moonGrad.addColorStop(1, '#9090a0');
  ctx.save();
  ctx.fillStyle   = moonGrad;
  ctx.shadowColor = state.moonJiggle > 0 ? '#ffffff' : 'transparent';
  ctx.shadowBlur  = state.moonJiggle > 0 ? moonR * 1.5 : 0;
  ctx.beginPath();
  ctx.arc(bx, by, moonR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Kawah kecil
  ctx.save();
  ctx.fillStyle = 'rgba(100,100,120,0.3)';
  ctx.beginPath();
  ctx.arc(bx + moonR * 0.25, by - moonR * 0.1, moonR * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Gambar cincin Saturnus */
function drawRing(cx, cy, r) {
  ctx.save();
  ctx.translate(cx, cy);
  // Miring 20 derajat untuk efek perspektif
  ctx.scale(1, 0.35);

  const inner = r * 1.35;
  const outer = r * 2.1;
  const ringGrad = ctx.createRadialGradient(0, 0, inner, 0, 0, outer);
  ringGrad.addColorStop(0,   'rgba(240,210,80,0.85)');
  ringGrad.addColorStop(0.4, 'rgba(220,180,60,0.6)');
  ringGrad.addColorStop(0.7, 'rgba(200,160,50,0.4)');
  ringGrad.addColorStop(1,   'rgba(180,140,40,0.05)');

  ctx.fillStyle = ringGrad;
  ctx.beginPath();
  ctx.arc(0, 0, outer, 0, Math.PI * 2);
  ctx.arc(0, 0, inner, 0, Math.PI * 2, true); // Lubang di tengah
  ctx.fill();
  ctx.restore();
}

/**
 * Gambar sebuah planet beserta orbitnya
 * @param {number} idx     - Index planet di PLANET_DATA
 * @param {number} cx, cy  - Koordinat pusat tata surya
 */
function drawPlanet(idx, cx, cy) {
  const planet  = PLANET_DATA[idx];
  const angle   = state.angles[idx];
  const orR     = orbitPx(planet);
  const r       = planetR(planet);

  // Koordinat planet
  const px = cx + Math.cos(angle) * orR;
  const py = cy + Math.sin(angle) * orR;

  // Apakah planet ini sedang dalam animasi goyang?
  const isJigg = state.jiggling && state.jiggling.idx === idx;

  // Efek goyang: offset kecil yang berosilasi
  let jX = 0, jY = 0;
  if (isJigg) {
    const t  = state.jiggling.t;
    const decay = Math.max(0, 1 - t / 0.6);   // Memudar setelah 0.6 detik
    jX = Math.sin(t * 45) * r * 0.35 * decay;
    jY = Math.cos(t * 35) * r * 0.2 * decay;
  }
  const dx = px + jX;
  const dy = py + jY;

  // --- Cincin Saturnus (digambar SEBELUM planet agar terlihat melingkupi) ---
  if (planet.hasRing) {
    drawRing(dx, dy, r);
  }

  // --- Badan planet (gradien radial untuk efek 3D) ---
  const grad = ctx.createRadialGradient(
    dx - r * 0.25, dy - r * 0.25, r * 0.05,
    dx, dy, r
  );
  grad.addColorStop(0, planet.faceColor);
  grad.addColorStop(0.6, planet.color);
  grad.addColorStop(1, shadeColor(planet.color, -40));

  ctx.save();
  ctx.fillStyle   = grad;
  ctx.shadowColor = planet.color;
  ctx.shadowBlur  = r * 0.6;
  ctx.beginPath();
  ctx.arc(dx, dy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- Pola strip Jupiter (garis-garis horizontal) ---
  if (planet.name === 'Jupiter') {
    drawJupiterStripes(dx, dy, r);
  }

  // --- Wajah kartun ---
  drawFace(dx, dy, r, isJigg);

  // --- Bulan untuk Bumi ---
  if (planet.hasMoon) {
    drawMoon(dx, dy, r);
  }

  // --- Nama planet (label kecil di bawah) ---
  ctx.save();
  ctx.fillStyle   = 'rgba(255,255,255,0.85)';
  ctx.font        = `bold ${Math.max(9, r * 0.7)}px 'Segoe UI', sans-serif`;
  ctx.textAlign   = 'center';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur  = 4;
  ctx.fillText(planet.name, dx, dy + r + 4);
  ctx.restore();

  // Simpan posisi terakhir planet untuk deteksi klik
  planet._x = dx;
  planet._y = dy;
  planet._r = r;
}

/** Gambar garis-garis strip khas Jupiter */
function drawJupiterStripes(cx, cy, r) {
  const stripes = [
    { yOff: -r * 0.35, w: r * 0.18, color: 'rgba(180,100,50,0.3)' },
    { yOff:  r * 0.1,  w: r * 0.22, color: 'rgba(140,70,30,0.25)' },
    { yOff:  r * 0.4,  w: r * 0.14, color: 'rgba(180,100,50,0.2)' },
  ];
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip(); // Potong strip di dalam lingkaran planet

  for (const s of stripes) {
    ctx.fillStyle = s.color;
    ctx.fillRect(cx - r, cy + s.yOff - s.w / 2, r * 2, s.w);
  }
  ctx.restore();
}

// ─────────────────────────────────────────
// 7. LOOP ANIMASI UTAMA
// ─────────────────────────────────────────

/**
 * Loop animasi menggunakan requestAnimationFrame
 * @param {DOMHighResTimeStamp} timestamp - Waktu frame saat ini
 */
function animate(timestamp) {
  const delta = Math.min((timestamp - state.lastTime) / 1000, 0.05); // detik, max 50ms
  state.lastTime = timestamp;

  const { w, h } = getCanvasDims();
  const cx = w / 2;
  const cy = h / 2;

  // Bersihkan canvas
  ctx.clearRect(0, 0, w, h);

  // Latar belakang luar angkasa
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
  bgGrad.addColorStop(0, '#1a1a3e');
  bgGrad.addColorStop(1, '#080818');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Bintang berkelap-kelip (waktu dalam detik untuk animasi)
  drawStars(timestamp / 1000);

  // Komet melintasi layar (di belakang semua objek tata surya)
  updateAndDrawComets(delta);

  // Sabuk asteroid antara Mars dan Jupiter
  updateAndDrawAsteroids(delta, cx, cy);

  // Satelit buatan di orbit luar
  updateAndDrawSatellites(delta, cx, cy);

  // Update dan gambar orbit setiap planet
  for (let i = 0; i < PLANET_DATA.length; i++) {
    drawOrbit(cx, cy, orbitPx(PLANET_DATA[i]));
  }

  // Update sudut dan gambar planet
  for (let i = 0; i < PLANET_DATA.length; i++) {
    if (state.isPlaying) {
      // Perbarui sudut berdasarkan kecepatan planet dan pengali slider
      // BASE_SPEED dikalibrasi agar Bumi 1 putaran ≈ 10 detik di kecepatan 1x
      const BASE_SPEED = 0.63;
      state.angles[i] += PLANET_DATA[i].speed * BASE_SPEED * state.speedMult * delta;
    }
    drawPlanet(i, cx, cy);
  }

  // Update sudut Bulan
  if (state.isPlaying) {
    state.moonAngle += 2.5 * state.speedMult * delta;
  }

  // Update timer goyang planet
  if (state.jiggling) {
    state.jiggling.t += delta;
    if (state.jiggling.t > 0.7) {
      state.jiggling = null; // Animasi goyang selesai
    }
  }

  // Update timer goyang matahari
  if (state.sunJiggle > 0) {
    state.sunJiggle = Math.max(0, state.sunJiggle - delta);
  }

  // Update timer goyang bulan
  if (state.moonJiggle > 0) {
    state.moonJiggle = Math.max(0, state.moonJiggle - delta);
  }

  // Gambar Matahari (di atas semuanya kecuali label)
  drawSun(cx, cy);

  requestAnimationFrame(animate);
}

// ─────────────────────────────────────────
// 8. AUDIO: NADA SEDERHANA SAAT PLANET DIKLIK
//    Menggunakan Web Audio API — tanpa file eksternal
// ─────────────────────────────────────────

let audioCtx = null;

/** Buat konteks audio saat pertama dibutuhkan (lazy init untuk autoplay policy) */
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

/**
 * Mainkan nada ceria pendek
 * @param {number} freqHz - Frekuensi nada dalam Hz
 */
function playPing(freqHz) {
  try {
    const ac  = getAudioCtx();
    const osc = ac.createOscillator();
    const env = ac.createGain();

    osc.connect(env);
    env.connect(ac.destination);

    osc.type      = 'sine';
    osc.frequency.setValueAtTime(freqHz, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freqHz * 1.5, ac.currentTime + 0.15);

    env.gain.setValueAtTime(0.35, ac.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);

    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.55);
  } catch (e) {
    // Gagal diam-diam — tidak masalah jika browser tidak mendukung
    console.warn('Audio tidak tersedia:', e.message);
  }
}

// Nada berbeda untuk setiap planet (do-re-mi-fa-sol-la-si-do tinggi)
const PLANET_NOTES = [261.6, 293.7, 329.6, 349.2, 392.0, 440.0, 493.9, 523.3];

// Nada matahari — akord hangat yang lebih rendah dan kaya
const SUN_NOTE       = 185.0;
// Nada bulan — lembut dan misterius
const MOON_NOTE      = 220.0;
// Nada asteroid — klik pendek seperti batu ketuk
const ASTEROID_NOTE  = 380.0;
// Nada satelit — nada tinggi elektronik
const SATELLITE_NOTE = 660.0;
// Nada komet — meluncur turun
const COMET_NOTE     = 520.0;

// Data informasi bulan
const MOON_INFO = {
  emoji:    '🌕',
  name:     'Bulan',
  size:     'Sekitar ¼ ukuran Bumi.',
  fact:     'Bulan adalah satu-satunya benda langit yang pernah dikunjungi manusia! Neil Armstrong pertama kali menginjakkan kaki di Bulan pada 1969.',
  distance: '📍 Sangat dekat — hanya ~384.000 km dari Bumi. Paling dekat dengan kita!'
};

// Data informasi matahari
const SUN_INFO = {
  emoji:    '☀️',
  name:     'Matahari',
  size:     '109 kali lebih besar dari Bumi — raksasa bola api!',
  fact:     'Matahari adalah bintang! Cahayanya butuh ~8 menit untuk sampai ke Bumi. Tanpa Matahari, tidak ada kehidupan di Bumi!',
  distance: '📍 Matahari ada di pusat tata surya kita — semua planet mengorbit mengelilinginya!'
};

// ─────────────────────────────────────────
// 9. KARTU INFORMASI PLANET
// ─────────────────────────────────────────

/** Tampilkan kartu informasi planet */
function showInfoCard(idx) {
  const planet = PLANET_DATA[idx];
  state.clickedPlanet = idx;

  document.getElementById('infoPlanetIcon').textContent = planet.emoji;
  document.getElementById('infoName').textContent       = planet.name;
  document.getElementById('infoSize').textContent       = planet.size;
  document.getElementById('infoFact').textContent       = planet.fact;
  document.getElementById('infoDistance').textContent   = planet.distance;

  infoCard.classList.remove('hidden');
  overlay.classList.remove('hidden');

  // Fokus ke tombol tutup untuk aksesibilitas keyboard
  document.getElementById('closeCard').focus();
}

/** Sembunyikan kartu informasi */
function hideInfoCard() {
  infoCard.classList.add('hidden');
  overlay.classList.add('hidden');
  state.clickedPlanet = null;
}

// ─────────────────────────────────────────
// 10. DETEKSI KLIK / SENTUH PLANET
// ─────────────────────────────────────────

/**
 * Dapatkan koordinat klik/sentuh relatif terhadap canvas
 * @param {MouseEvent|TouchEvent} e
 * @returns {{x:number, y:number}}
 */
function getCanvasCoords(e) {
  const rect   = canvas.getBoundingClientRect();
  const { w, h } = getCanvasDims();
  const scaleX = w / rect.width;
  const scaleY = h / rect.height;

  if (e.touches && e.touches.length > 0) {
    return {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top)  * scaleY
    };
  }
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top)  * scaleY
  };
}

/** Periksa apakah titik (x,y) mengenai matahari */
function hitTestSun(x, y) {
  const s = state.sun;
  if (!s.r) return false;
  return Math.hypot(x - s.x, y - s.y) < Math.max(s.r * 1.4, 22);
}

/** Periksa apakah titik (x,y) mengenai bulan */
function hitTestMoon(x, y) {
  const m = state.moon;
  if (!m.r) return false;
  return Math.hypot(x - m.x, y - m.y) < Math.max(m.r * 1.8, 14);
}

/** Cari asteroid terdekat dari titik (x,y) — kembalikan objek asteroid atau null */
function hitTestAsteroid(x, y) {
  for (const a of state.asteroids) {
    // Area sentuh diperbesar: asteroid kecil, perlu toleransi lebih lebar
    if (Math.hypot(x - a._x, y - a._y) < Math.max(a.r * 4, 12)) return a;
  }
  return null;
}

/** Cari satelit terdekat dari titik (x,y) — kembalikan objek satelit atau null */
function hitTestSatellite(x, y) {
  for (const sat of state.satellites) {
    if (Math.hypot(x - sat._x, y - sat._y) < Math.max(sat.size * 5, 18)) return sat;
  }
  return null;
}

/** Cari komet terdekat dari titik (x,y) — kembalikan objek komet atau null */
function hitTestComet(x, y) {
  for (const c of state.comets) {
    if (Math.hypot(x - c.x, y - c.y) < Math.max(c.r * 5, 14)) return c;
  }
  return null;
}

/** Tampilkan kartu info generik dari objek data */
function showGenericCard(emoji, name, size, fact, distance) {
  document.getElementById('infoPlanetIcon').textContent = emoji;
  document.getElementById('infoName').textContent       = name;
  document.getElementById('infoSize').textContent       = size;
  document.getElementById('infoFact').textContent       = fact;
  document.getElementById('infoDistance').textContent   = distance;
  infoCard.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document.getElementById('closeCard').focus();
}

/** Periksa apakah titik (x,y) berada di dalam planet */
function hitTestPlanet(x, y) {
  for (let i = 0; i < PLANET_DATA.length; i++) {
    const p = PLANET_DATA[i];
    // _x/_y/_r belum ada sebelum frame pertama digambar — lewati
    if (p._x === undefined) continue;
    const dist = Math.hypot(x - p._x, y - p._y);
    // Area klik sedikit lebih besar dari visual agar lebih mudah di layar sentuh
    if (dist < Math.max(p._r * 1.5, 18)) return i;
  }
  return -1;
}

/** Tampilkan kartu info matahari */
function showSunCard() {
  document.getElementById('infoPlanetIcon').textContent = SUN_INFO.emoji;
  document.getElementById('infoName').textContent       = SUN_INFO.name;
  document.getElementById('infoSize').textContent       = SUN_INFO.size;
  document.getElementById('infoFact').textContent       = SUN_INFO.fact;
  document.getElementById('infoDistance').textContent   = SUN_INFO.distance;

  infoCard.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document.getElementById('closeCard').focus();
}

/** Tampilkan kartu info bulan */
function showMoonCard() {
  document.getElementById('infoPlanetIcon').textContent = MOON_INFO.emoji;
  document.getElementById('infoName').textContent       = MOON_INFO.name;
  document.getElementById('infoSize').textContent       = MOON_INFO.size;
  document.getElementById('infoFact').textContent       = MOON_INFO.fact;
  document.getElementById('infoDistance').textContent   = MOON_INFO.distance;

  infoCard.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document.getElementById('closeCard').focus();
}

/** Handler klik/sentuh canvas */
function handleCanvasInteraction(e) {
  e.preventDefault();
  const { x, y } = getCanvasCoords(e);

  // Cek matahari dulu (ada di tengah, di atas planet)
  if (hitTestSun(x, y)) {
    state.sunJiggle = 0.7;
    playPing(SUN_NOTE);
    showSunCard();
    return;
  }

  // Cek bulan (kecil, perlu dicek sebelum Bumi agar tidak tertutup)
  if (hitTestMoon(x, y)) {
    state.moonJiggle = 0.6;
    playPing(MOON_NOTE);
    showMoonCard();
    return;
  }

  // Cek satelit
  const sat = hitTestSatellite(x, y);
  if (sat) {
    sat.jiggle = 0.6;
    playPing(SATELLITE_NOTE);
    showGenericCard(
      sat.emoji, sat.name,
      'Lebih kecil dari mobil — tapi sangat canggih!',
      sat.info,
      sat.distance
    );
    return;
  }

  // Cek asteroid (sabuk asteroid)
  const ast = hitTestAsteroid(x, y);
  if (ast) {
    ast.jiggle = 0.5;
    playPing(ASTEROID_NOTE);
    showGenericCard(
      '🪨', 'Asteroid!',
      'Ukurannya sangat kecil — dari sebesar batu hingga beberapa kilometer!',
      'Asteroid adalah batu-batu sisa pembentukan tata surya 4,6 miliar tahun lalu. Sabuk asteroid ada di antara Mars dan Jupiter!',
      '📍 Sabuk Asteroid — antara orbit Mars dan Jupiter.'
    );
    return;
  }

  // Cek komet yang sedang melintas
  const comet = hitTestComet(x, y);
  if (comet) {
    playPing(COMET_NOTE);
    showGenericCard(
      '☄️', 'Komet!',
      'Ukurannya seperti gunung es raksasa — beberapa km lebarnya!',
      'Komet terbuat dari es, debu, dan batu. Saat mendekati Matahari, es-nya menguap dan membentuk ekor yang bercahaya bisa sepanjang jutaan km!',
      '📍 Komet melintasi tata surya dengan kecepatan sangat tinggi!'
    );
    return;
  }

  const idx = hitTestPlanet(x, y);
  if (idx === -1) return;

  // Animasi goyang
  state.jiggling = { idx, t: 0 };

  // Nada ceria
  playPing(PLANET_NOTES[idx]);

  // Tampilkan kartu
  showInfoCard(idx);
}

canvas.addEventListener('click',      handleCanvasInteraction);
canvas.addEventListener('touchstart', handleCanvasInteraction, { passive: false });

// ─────────────────────────────────────────
// 11. KONTROL UI (Play/Pause, Reset, Slider)
// ─────────────────────────────────────────

/** Toggle Play / Pause */
btnPlay.addEventListener('click', () => {
  state.isPlaying = !state.isPlaying;
  const icon  = btnPlay.querySelector('.btn-icon');
  const label = btnPlay.querySelector('.btn-label');
  if (state.isPlaying) {
    icon.textContent  = '⏸️';
    label.textContent = 'Pause';
  } else {
    icon.textContent  = '▶️';
    label.textContent = 'Play';
  }
});

/** Reset posisi semua planet */
btnReset.addEventListener('click', () => {
  for (let i = 0; i < PLANET_DATA.length; i++) {
    state.angles[i] = Math.random() * Math.PI * 2;
  }
  state.moonAngle = 0;
});

/** Update pengali kecepatan dari slider */
speedSldr.addEventListener('input', () => {
  state.speedMult = parseFloat(speedSldr.value);
});

/** Tutup kartu saat klik overlay atau tombol tutup */
document.getElementById('closeCard').addEventListener('click', hideInfoCard);
overlay.addEventListener('click', hideInfoCard);

/** Tutup kartu dengan tombol Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideInfoCard();
});

// ─────────────────────────────────────────
// 12. UTILITAS
// ─────────────────────────────────────────

/**
 * Gelapkan atau terangkan warna hex
 * @param {string} hex   - Warna hex (contoh: '#ff8800')
 * @param {number} amount- Nilai tambah/kurang per channel (-255..255)
 * @returns {string} Warna hex baru
 */
function shadeColor(hex, amount) {
  let col = hex.replace('#', '');
  if (col.length === 3) col = col.split('').map(c => c + c).join('');
  const num = parseInt(col, 16);
  const r   = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g   = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b   = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ─────────────────────────────────────────
// 13. INISIALISASI & MULAI
// ─────────────────────────────────────────

/** Inisialisasi awal: resize canvas, lalu mulai loop animasi */
function init() {
  resizeCanvas();                 // generateAsteroids & generateSatellites dipanggil di sini
  generateComets();               // Komet diinisialisasi terpisah (tidak perlu reset saat resize)
  state.lastTime = performance.now();
  requestAnimationFrame(animate);
}

// Resize canvas saat jendela berubah ukuran
window.addEventListener('resize', resizeCanvas);

// Mulai!
init();
