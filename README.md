# Simulasi-Tata-Surya-Interaktif-untuk-Anak
Jelajah Tata Surya adalah aplikasi web edukasi interaktif yang membantu anak usia 6-12 tahun mengenal Matahari dan delapan planet melalui simulasi orbit yang ceria dan penuh warna. Project ini bertujuan membuat pembelajaran astronomi dasar lebih menyenangkan, mudah dipahami, dan dapat diakses langsung lewat browser tanpa instalasi. Anak dapat mengklik planet untuk melihat kartu informasi berbahasa sederhana, seperti perbandingan ukuran dengan Bumi dan fakta seru, serta mengatur jalannya animasi dengan tombol Play/Pause dan slider kecepatan.
🎯 Latar Belakang

Banyak anak kesulitan memahami konsep tata surya karena materi di buku umumnya berupa teks dan gambar statis. Jarak antarplanet, perbedaan ukuran, dan gerak orbit sulit dibayangkan tanpa visualisasi yang bergerak. Jelajah Tata Surya hadir sebagai media belajar yang visual, sederhana, dan menyenangkan.

✨ Fitur
Matahari dan 8 planet (Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus) yang mengorbit dengan kecepatan berbeda
Tampilan ramah anak: planet berwarna cerah dengan wajah kartun, Saturnus bercincin, dan Bumi ditemani Bulan
Kartu informasi saat planet diklik, berisi nama, ukuran dibandingkan Bumi, kisaran jarak dari Matahari, dan satu fakta seru dalam bahasa sederhana
Kontrol mudah: tombol Play/Pause dan slider kecepatan berukuran besar, nyaman di layar sentuh
Latar luar angkasa dengan bintang-bintang yang berkelap-kelip
Responsif untuk komputer, tablet, dan HP
👥 Target Pengguna
Utama: siswa sekolah dasar (usia 6-12 tahun)
Pendukung: guru dan orang tua yang membutuhkan alat bantu mengajar yang praktis dan aman
🛠️ Teknologi
Teknologi	Kegunaan
HTML5 (semantik)	Struktur halaman
CSS3 (custom properties)	Tampilan dan palet warna
Vanilla JavaScript	Logika animasi dan interaksi
Canvas / SVG	Rendering animasi orbit
requestAnimationFrame	Animasi yang halus
📁 Struktur Project
jelajah-tata-surya/
├── index.html    # Struktur halaman
├── style.css     # Gaya dan tampilan
├── script.js     # Animasi, interaksi, dan data planet
└── README.md
🚀 Cara Menjalankan

Opsi 1: Langsung buka

Download atau clone repository ini.
Buka file index.html di browser (Chrome, Firefox, Edge, atau Safari).

Opsi 2: Clone dengan Git

bash
git clone https://github.com/USERNAME/jelajah-tata-surya.git
cd jelajah-tata-surya

Lalu buka index.html di browser.

Opsi 3: GitHub Pages Buka link demo di bagian atas README ini.

🎮 Cara Menggunakan
Perhatikan planet-planet yang bergerak mengelilingi Matahari.
Klik planet untuk melihat kartu informasinya.
Tekan tombol Play/Pause untuk menghentikan atau melanjutkan animasi.
Geser slider kecepatan untuk mempercepat atau memperlambat orbit.
🧩 Menyunting Data Planet

Seluruh data planet disimpan dalam satu array/objek di script.js, sehingga mudah diubah tanpa menyentuh logika animasi. Contoh struktur:

js
{
  name: "Bumi",
  color: "#4da6ff",
  sizeVsEarth: 1,
  distance: "Dekat",
  fact: "Bumi adalah satu-satunya planet yang kita tahu punya kehidupan!"
}

Sesuaikan nama properti dengan kode yang dihasilkan di script.js.

🔮 Rencana Pengembangan
 Kuis mini dengan bintang atau lencana sebagai hadiah
 Efek suara dan narasi berbahasa Indonesia
 Penambahan Bulan, planet kerdil (Pluto), asteroid, dan komet
 Materi lanjutan: fase Bulan, gerhana, siang-malam, dan pergantian musim
 Mode 3D (WebGL/Three.js) dan Augmented Reality
 Mode offline (PWA)
 Integrasi dengan platform belajar sekolah dan dashboard guru/orang tua
 Asisten AI yang menjawab pertanyaan anak dengan bahasa sederhana
🤖 Proses Pengembangan dengan AI

Project ini dibuat menggunakan prompt berlapis (prompt layering) untuk IBM Bob:

Role & Context: menetapkan peran Bob sebagai Senior Frontend Engineer dan Creative Developer untuk aplikasi edukasi anak
Task & Requirements: merinci fitur yang harus dibangun
Constraints & Output: menetapkan format file, standar visual, dan kualitas kode
