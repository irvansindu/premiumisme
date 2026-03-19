import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://preygsixwsyjgepekumc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZXlnc2l4d3N5amdlcGVrdW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MDYxNjIsImV4cCI6MjA4OTQ4MjE2Mn0.jXg3PFYoNqXh20HvZ-8XCevWvBUW7xyvo8NJpohXvPU';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const INITIAL_DATA = {
// ... keep same INITIAL_DATA content ...
// I will include the full object in the final replacement to match the file structure.
  config: {
    botUrl: "https://t.me/premiumisme_bot",
    whatsappNumber: "6289633011300",
    email: "info@premiumisme.co"
  },
  landing: {
    logo: "",
    avatarText: "P",
    brandName: "Premiumisme",
    tagline: "✨ Solusi Produk Digital Terbaik ✨",
    links: [
      { id: "order", text: "Order Sekarang", icon: "🛒", url: "/order.html", internal: true },
      { id: "whatsapp", text: "WhatsApp", icon: "💬", url: "https://wa.me/6289633011300", internal: false },
      { id: "email", text: "Akses Email", icon: "📧", url: "mailto:info@premiumisme.co", internal: false },
      { id: "garansi", text: "Ketentuan Garansi", icon: "🛡️", url: "/warranty.html", internal: true },
      { id: "faq", text: "FAQ", icon: "❓", url: "/faq.html", internal: true },
      { id: "reseller", text: "Gabung Jadi Reseller", icon: "🤝", url: "/reseller.html", internal: true }
    ],
    socials: [
      { id: "instagram", title: "Instagram", url: "#", iconType: "instagram" },
      { id: "telegram", title: "Telegram", url: "#", iconType: "telegram" },
      { id: "youtube", title: "YouTube", url: "#", iconType: "youtube" }
    ]
  },
  store: {
    categories: [
      { id: "all", name: "Semua" },
      { id: "desain", name: "Desain" },
      { id: "musik-video", name: "Musik & Video" },
      { id: "productivity", name: "Productivity" },
      { id: "vpn", name: "VPN" },
      { id: "cloud", name: "Cloud Storage" }
    ],
    banners: [
      { id: 1, title: "🎨 Canva Pro - Mulai Rp 2.000", subtitle: "Akses jutaan foto, video, & elemen premium untuk desainmu", bg: "linear-gradient(135deg, #6366f1, #a855f7)" },
      { id: 2, title: "🤖 ChatGPT Plus - GPT-4 Unlimited", subtitle: "Tingkatkan produktivitasmu dengan AI terdepan", bg: "linear-gradient(135deg, #059669, #34d399)" },
      { id: 3, title: "✂️ CapCut Pro - Edit Video Profesional", subtitle: "Efek premium, template eksklusif, tanpa watermark", bg: "linear-gradient(135deg, #2563eb, #818cf8)" }
    ],
    products: [
      { 
        id: "canva", 
        name: "Canva Pro", 
        category: "desain", 
        icon: "C", 
        bg: "linear-gradient(135deg, #7c3aed, #06b6d4)", 
        badge: "PROSES MANUAL", 
        badgeType: "manual",
        description: "<p><strong>Canva Pro</strong> adalah versi premium dari platform desain populer yang cocok untuk kamu yang ingin membuat desain lebih cepat, kreatif, dan profesional.</p><br/><p>💡 <strong>Fitur Canva Pro</strong></p><ul class='detail-features'><li>Akses jutaan foto, video, & elemen premium</li><li>Background Remover instan</li><li>Magic Resize untuk berbagai ukuran desain</li></ul>",
        features: ["Brand Kit untuk konsistensi desain", "Content Planner untuk jadwal posting", "100GB Cloud Storage", "Template eksklusif premium", "Kolaborasi tim tanpa batas"],
        stats: { views: 4661, downloads: 420 },
        variants: [
          { name: "Canva Pro - Member 30 Hari", status: "available", price: "2.000", originalPrice: "5.000", discount: "60%" },
          { name: "Canva Lifetime - Member", status: "available", price: "10.000", originalPrice: "25.000", discount: "60%" },
          { name: "Canva Lifetime - Famhead", status: "out-of-stock", price: "25.000", originalPrice: "500.000", discount: "95%" },
          { name: "Canva Pro - Team 30 Hari", status: "available", price: "5.000", originalPrice: "15.000", discount: "67%" }
        ],
        reviews: [
          { user: "Ahmad R.", stars: 5, text: "Mantap! Prosesnya cepat dan langsung bisa dipakai. Recommended banget!", date: "2 hari yang lalu" },
          { user: "Siti N.", stars: 5, text: "Harga murah tapi kualitas juara. Sudah beli berkali-kali di sini, selalu puas!", date: "5 hari yang lalu" }
        ]
      },
      { 
        id: "capcut", 
        name: "CapCut Pro", 
        category: "desain", 
        icon: "✂", 
        bg: "linear-gradient(135deg, #1e293b, #475569)", 
        badge: "STOK HABIS", 
        badgeType: "habis",
        description: "<p>Edit video layaknya profesional dengan <strong>CapCut Pro</strong>. Nikmati fitur eksklusif tanpa watermark.</p>",
        features: ["Tanpa Watermark", "Efek & Transisi Premium", "Cloud Storage 10GB", "Ekspor 4K"],
        stats: { views: 2100, downloads: 150 },
        variants: [
          { name: "CapCut Pro 30 Hari", status: "out-of-stock", price: "15.000", originalPrice: "30.000", discount: "50%" }
        ],
        reviews: []
      },
      { 
        id: "chatgpt", 
        name: "ChatGPT Plus", 
        category: "productivity", 
        icon: "G", 
        bg: "linear-gradient(135deg, #059669, #34d399)", 
        badge: "PROSES MANUAL", 
        badgeType: "manual",
        description: "<p>Akses <strong>GPT-4</strong> dan fitur AI tercanggih dengan ChatGPT Plus.</p>",
        features: ["Akses GPT-4", "DALL-E 3 Image Generation", "Advanced Data Analysis", "Custom GPTs"],
        stats: { views: 5600, downloads: 890 },
        variants: [
          { name: "ChatGPT Plus Sharing", status: "available", price: "50.000", originalPrice: "300.000", discount: "83%" }
        ],
        reviews: []
      },
      { id: "youtube", name: "YouTube Premium", category: "musik-video", icon: "▶", bg: "linear-gradient(135deg, #dc2626, #ef4444)", badge: "STOK HABIS", badgeType: "habis", description: "Nonton YouTube tanpa iklan.", variants: [], reviews: [] },
      { id: "spotify", name: "Spotify Premium", category: "musik-video", icon: "♫", bg: "linear-gradient(135deg, #16a34a, #22c55e)", badge: "PROSES MANUAL", badgeType: "manual", description: "Mendengarkan musik tanpa iklan.", variants: [], reviews: [] },
      { id: "netflix", name: "Netflix Premium", category: "musik-video", icon: "N", bg: "linear-gradient(135deg, #b91c1c, #dc2626)", badge: "PROSES MANUAL", badgeType: "manual", description: "Nonton film kualitas 4K.", variants: [], reviews: [] },
      { id: "gdrive", name: "Google Drive", category: "cloud", icon: "📁", bg: "linear-gradient(135deg, #eab308, #f59e0b)", badge: "PROSES MANUAL", badgeType: "manual", description: "Penyimpanan awan kapasitas besar.", variants: [], reviews: [] },
      { id: "nordvpn", name: "NordVPN", category: "vpn", icon: "🔒", bg: "linear-gradient(135deg, #1d4ed8, #3b82f6)", badge: "PROSES MANUAL", badgeType: "manual", description: "VPN aman dan cepat.", variants: [], reviews: [] }
    ],
    articles: [
      { id: 1, title: "Satu Tools untuk Semua Kebutuhan hanya di Premiumisme Tools!", bg: "linear-gradient(135deg, #312e81, #6366f1)", url: "#" },
      { id: 2, title: "Cara Order Produk Digital Premium di Website Premiumisme", bg: "linear-gradient(135deg, #1e1b4b, #4338ca)", url: "#" },
      { id: 3, title: "Fitur-Fitur yang bisa kamu lakuin di Website Premiumisme!", bg: "linear-gradient(135deg, #312e81, #7c3aed)", url: "#" }
    ]
  },
  faq: [
    { id: 1, question: "Apa itu Premiumisme?", answer: "Premiumisme adalah platform penyedia layanan produk digital premium seperti Canva Pro, ChatGPT Plus, CapCut Pro, YouTube Premium, Spotify Premium, dan lainnya dengan harga yang sangat terjangkau. Kami menawarkan akses resmi ke berbagai tools premium yang bisa membantu produktivitas dan kreativitas kamu." },
    { id: 2, question: "Bagaimana cara order produk?", answer: "Kunjungi premiumisme.store, pilih produk yang kamu inginkan, pilih varian / durasi langganan, klik 'Order Sekarang', lakukan pembayaran sesuai instruksi, dan tunggu konfirmasi dari admin (untuk proses manual)." },
    { id: 3, question: "Apa bedanya Proses Manual dan Otomatis?", answer: "<strong>Proses Otomatis:</strong> Akun akan langsung dikirimkan secara otomatis setelah pembayaran berhasil.<br/><br/><strong>Proses Manual:</strong> Admin akan memproses pesanan kamu secara manual. Biasanya memakan waktu 1-24 jam tergantung ketersediaan." },
    { id: 4, question: "Apakah produknya legal dan aman?", answer: "Ya! Premiumisme sudah terdaftar sebagai penyedia media elektronik di Komdigi (Kominfo). Semua produk yang kami jual adalah layanan berlangganan resmi." },
    { id: 5, question: "Metode pembayaran apa saja yang tersedia?", answer: "Kami menerima berbagai metode pembayaran: QRIS (Semua e-wallet & m-banking), Transfer Bank (BCA, BNI, BRI, Mandiri, dll), E-Wallet (GoPay, OVO, DANA, ShopeePay), dan Pulsa." }
  ],
  warranty: [
    { id: "alight-motion", name: "Alight Motion", content: "<ul><li>Produk: <strong>Alight Motion Pro</strong></li><li>Paket: Premium User</li><li>Masa Aktif: <strong>1 Bulan / 1 Tahun</strong></li><li>Aktivasi menggunakan email pembeli</li><li>Akses semua fitur pro (Tanpa Watermark, Efek Premium)</li><li>100% Legal & Resmi</li><li>Garansi full sesuai masa berlangganan</li></ul>" },
    { id: "apple-music", name: "Apple Music", content: "<ul><li>Produk: <strong>Apple Music</strong></li><li>Paket: Individual Premium</li><li>Masa Aktif: <strong>1 Bulan</strong></li><li>Invite via family sharing atau aktivasi langsung</li><li>Download lagu untuk didengarkan offline</li><li>Kualitas Audio Lossless</li><li>Garansi jika akun bermasalah sebelum masa aktif habis</li></ul>" },
    { id: "canva-lifetime", name: "Canva Pro Lifetime", content: "<ul><li>Produk: <strong>Canva</strong></li><li>Paket: <strong>Lifetime - Member</strong></li><li>Masa Aktif: <strong>Selamanya</strong> (selama tim aktif)</li><li>Bergabung dengan tim Premiumisme</li><li>Akses ke jutaan template, grafis, dan foto premium</li><li>Garansi hingga 6 bulan jika terjadi masalah tim</li></ul>" },
    { id: "canva-pro", name: "Canva Pro", content: "<ul><li>Produk: <strong>Canva Pro</strong></li><li>Paket: <strong>Business (Family Head)</strong></li><li>Masa Aktif: <strong>1 Bulan</strong></li><li>Aktivasi melalui website atau aplikasi resmi</li><li>Family Head bersifat private dan dapat mengundang hingga 100 pengguna</li><li>Tidak tersedia refund setelah aktivasi berhasil</li></ul>" },
    { id: "capcut-basic", name: "CapCut Pro Basic", content: "<ul><li>Produk: <strong>CapCut Pro</strong></li><li>Paket: Basic Member</li><li>Masa Aktif: <strong>1 Bulan</strong></li><li>Akses semua efek dan transisi premium</li><li>Ekspor tanpa batas resolusi 4K</li><li>Tidak diperkenankan mengubah password/data akun</li><li>Garansi full 30 hari</li></ul>" },
    { id: "capcut-famhead", name: "CapCut Pro Famhead", content: "<ul><li>Produk: <strong>CapCut Pro</strong></li><li>Paket: <strong>Family Head</strong></li><li>Masa Aktif: <strong>1 Bulan</strong></li><li>Akun private 100% milik pengguna</li><li>Bisa digunakan untuk mengundang anggota lain ke dalam Family</li><li>Segala bentuk penyalahgunaan adalah tanggung jawab pembeli</li><li>Garansi full 1 bulan</li></ul>" },
    { id: "capcut-pro", name: "CapCut Pro", content: "<ul><li>Produk: <strong>CapCut Pro</strong></li><li>Paket: Personal Account</li><li>Aktivasi resmi untuk 1 device (PC/Mobile)</li><li>Garansi ganti akun / invite ulang jika bermasalah</li></ul>" },
    { id: "chatgpt-private", name: "ChatGPT Private", content: "<ul><li>Produk: <strong>ChatGPT Plus</strong></li><li>Paket: <strong>Private Account</strong></li><li>Masa Aktif: <strong>1 Bulan</strong></li><li>Akses penuh ke model GPT-4 dan fitur premium lainnya</li><li>1 akun = 1 pembeli (tanpa dibagi dengan orang lain)</li><li>Garansi full 1 bulan jika terblokir tanpa alasan pelanggaran</li><li>Dilarang keras melanggar TOS OpenAI (NSFW, hate speech, dll)</li></ul>" },
    { id: "chatgpt-sharing", name: "ChatGPT Sharing", content: "<ul><li>Produk: <strong>ChatGPT Plus</strong></li><li>Paket: <strong>Sharing (Maks 3-4 Orang)</strong></li><li>Masa Aktif: <strong>1 Bulan</strong></li><li>Akun bersama dengan slot terbatas</li><li>Sistem limit prompts (40 pesan / 3 jam) dibagi bersama, mohon kebijaksanaannya</li><li>Dilarang mengubah password atau menghapus chat pengguna lain</li><li>Garansi 30 hari jika akun error</li></ul>" },
    { id: "netflix", name: "Netflix Premium", content: "<ul><li>Produk: <strong>Netflix Premium</strong></li><li>Paket: <strong>Sharing (1 Profil 1 User)</strong></li><li>Masa Aktif: <strong>1 Bulan</strong></li><li>Akses film & series format 4K Ultra HD</li><li>DILARANG mengubah nama profil, PIN, atau password utama</li><li>Login hanya dibatasi untuk 1 perangkat pada waktu yang bersamaan</li><li>Garansi anti screenlimit jika mengikuti rules</li></ul>" },
    { id: "spotify", name: "Spotify Premium", content: "<ul><li>Produk: <strong>Spotify Premium</strong></li><li>Paket: Individual / Family Invite</li><li>Masa Aktif: <strong>1 Bulan / 3 Bulan</strong></li><li>Tanpa iklan, bisa skip lagu, bisa download untuk offline</li><li>Aktivasi invite link (wajib alamat sesuai) atau input ke akun baru</li><li>Garansi full selama masa aktif</li></ul>" },
    { id: "youtube", name: "YouTube Premium", content: "<ul><li>Produk: <strong>YouTube Premium</strong></li><li>Paket: Invite Fam</li><li>Masa Aktif: <strong>1 Bulan</strong></li><li>Aktivasi menggunakan email pembeli</li><li>Tanpa iklan, YouTube Music Premium, putar di latar belakang</li><li>Syarat: Akun belum pernah join family premium dalam 12 bulan terakhir</li></ul>" }
  ],
  reseller: {
    hero: { title: "Mulai perjalananmu bersama Premiumisme", subtitle: "Cara termudah mulai bisnis produk digital tanpa modal besar, tanpa stok, dan serba otomatis bia BOT." },
    steps: [
      { id: 1, title: "Siap Jadi Reseller?", desc: "Tanpa perlu daftar, langsung mulai!", iconType: "store" },
      { id: 2, title: "Gunakan BOT Otomatis", desc: "Akses & pesan produk via BOT canggih.", iconType: "bot" },
      { id: 3, title: "Order Produk Mudah", desc: "Pilih & pesan produk digital 24/7.", iconType: "cart" },
      { id: 4, title: "Jual & Atur Harga", desc: "Kamu tentukan sendiri margin profit.", iconType: "tag" },
      { id: 5, title: "Nikmati Profitnya!", desc: "Keuntungan instan masuk ke kamu.", iconType: "money", highlight: true }
    ],
    profit: { buyPrice: "10.000", sellPrice: "20.000", result: "10.000" },
    advantages: [
      "100% tanpa stok barang",
      "Order tanpa nunggu admin",
      "Semua proses serba otomatis",
      "Fokus hanya promosi & jualan",
      "Fleksibel, jualan kapan & di mana saja",
      "Mulai jualan instan, tanpa registrasi"
    ]
  }
};

class DataStore {
  constructor() {
    this.key = 'premiumisme_data_v2';
    this.data = this._loadLocal();
    this.initialized = false;
    // Auto-init for quick access if possible, 
    // but better called explicitly in main.js
  }

  _loadLocal() {
    const saved = localStorage.getItem(this.key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    return INITIAL_DATA;
  }

  async init() {
    if (this.initialized) return this.data;
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('data')
        .eq('id', 1)
        .single();

      if (data) {
        this.data = data.data;
        localStorage.setItem(this.key, JSON.stringify(this.data));
      } else {
        // First time initialization in DB
        await supabase.from('settings').upsert({ id: 1, data: INITIAL_DATA });
        this.data = INITIAL_DATA;
      }
      this.initialized = true;
      window.dispatchEvent(new CustomEvent('premiumisme-data-ready', { detail: this.data }));
      return this.data;
    } catch (err) {
      console.warn("Supabase fetch failed, using local/initial data", err);
      return this.data;
    }
  }

  async save(newData) {
    this.data = { ...this.data, ...newData };
    localStorage.setItem(this.key, JSON.stringify(this.data));
    
    // Remote save to Supabase
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 1, data: this.data });
      
      if (error) throw error;
      console.log("Data saved globally to Supabase");
    } catch (err) {
      console.error("Supabase Global Save Error:", err);
      alert("Gagal simpan ke Cloud! Tapi data tetap tersimpan di browser ini.");
    }

    window.dispatchEvent(new CustomEvent('premiumisme-data-updated', { detail: this.data }));
  }

  reset() {
    this.data = INITIAL_DATA;
    localStorage.removeItem(this.key);
    // Note: This doesn't reset Supabase to prevent accidental global data loss
    window.location.reload();
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], this.data);
  }
}

export const store = new DataStore();
export default store;
