/* =========================================================
   PT Tenggara Perkasa Mining — Script
   ---------------------------------------------------------
   BAGIAN 1 (CONFIG) adalah satu-satunya bagian yang perlu
   Anda ubah untuk memperbarui data di website:
   kontak, daftar peralatan, dan pengalaman proyek.
   ========================================================= */

/* ---------- BAGIAN 1: DATA YANG BISA ANDA UBAH ---------- */
const CONFIG = {
  // Nomor WhatsApp: awali kode negara, tanpa tanda + atau spasi.
  whatsapp: "6285222313146",
  // Teks nomor telepon yang tampil di halaman.
  telepon: "0852-2231-3146",
  // Email perusahaan (tampil di bagian Kontak dan footer).
  // Jika dikosongkan, bagian email otomatis disembunyikan.
  email: "info@tpm.com",
  // Alamat website yang ditampilkan sebagai teks di footer.
  // Ini hanya tulisan, bukan pengaturan domain situs.
  website: "www.tenggaraperkasamining.com",

  alamatKantor:
    "Jl. Cendana BTN Sultra Hills Residence 2 Blok F No. 9, Kel. Wundudopi, Kec. Baruga, Kota Kendari, Sulawesi Tenggara 93116",
  lokasiUsaha: "Lalonggombu, Kec. Lainea, Kab. Konawe Selatan, Sulawesi Tenggara",

  // Daftar peralatan. Selama masih kosong ([]), bagian "Peralatan" tidak ditampilkan.
  // Contoh isi (hapus tanda // di depan untuk memakainya):
  // { jenis: "Excavator", merek: "Komatsu PC200", jumlah: "4 unit", kondisi: "Siap operasi" },
  peralatan: [],

  // Pengalaman proyek. Selama masih kosong ([]), bagian ini tidak ditampilkan.
  // Contoh isi:
  // { pekerjaan: "Pembangunan jalan tambang", pemberiKerja: "PT Contoh", lokasi: "Konawe Selatan", periode: "2026" },
  proyek: []
};

/* Dokumen legalitas untuk pratinjau (lightbox). Urutan = urutan halaman. */
const GALLERIES = {
  akta: {
    title: "Akta Pendirian",
    items: [{ src: "assets/akta-pendirian.jpg", alt: "Sampul Akta Pendirian PT Tenggara Perkasa Mining" }]
  },
  sk: {
    title: "SK Pengesahan Badan Hukum",
    items: [
      { src: "assets/sk-kemenkumham.jpg", alt: "SK Menteri Hukum tentang pengesahan pendirian badan hukum" },
      { src: "assets/sk-lampiran.jpg", alt: "Lampiran SK: susunan pemegang saham, komisaris, dan direksi" }
    ]
  },
  iujp: {
    title: "Izin Usaha Jasa Pertambangan",
    items: [
      { src: "assets/iujp-1.jpg", alt: "Izin Usaha Jasa Pertambangan, halaman 1" },
      { src: "assets/iujp-2.jpg", alt: "Lampiran izin, halaman 1" },
      { src: "assets/iujp-3.jpg", alt: "Lampiran izin, halaman 2" },
      { src: "assets/iujp-4.jpg", alt: "Lampiran izin, halaman 3" }
    ]
  },
  npwp: {
    title: "NPWP",
    items: [
      { src: "assets/npwp-depan.jpg", alt: "Kartu NPWP PT Tenggara Perkasa Mining, sisi depan" },
      { src: "assets/npwp-belakang.jpg", alt: "Kartu NPWP, sisi belakang" }
    ]
  }
};

/* ---------- BAGIAN 2: LOGIKA WEBSITE (tidak perlu diubah) ---------- */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ----- Header: bayangan saat scroll ----- */
  var header = $("#header");
  var progressBar = $("#scrollProgress");
  var toTop = $("#toTop");
  var heroArt = $(".hero-art");
  var heroSection = $("#beranda");
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var ticking = false;

  // Satu fungsi untuk semua efek scroll: bayangan header, progress bar,
  // tombol ke atas, dan parallax ringan pada hero.
  function updateOnScroll() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    header.classList.toggle("scrolled", y > 8);
    progressBar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0).toFixed(4) + ")";

    var showTop = y > 600;
    toTop.classList.toggle("show", showTop);
    toTop.tabIndex = showTop ? 0 : -1;

    if (!reduceMotion && heroArt && y < heroSection.offsetHeight) {
      heroArt.style.setProperty("--py", (y * 0.18).toFixed(1) + "px");
    }
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateOnScroll);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateOnScroll();

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ----- Menu mobile ----- */
  var navToggle = $("#navToggle");
  var siteNav = $("#siteNav");

  function setNav(open) {
    siteNav.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  }
  navToggle.addEventListener("click", function () {
    setNav(!siteNav.classList.contains("open"));
  });
  $$("a", siteNav).forEach(function (a) {
    a.addEventListener("click", function () { setNav(false); });
  });
  document.addEventListener("click", function (e) {
    if (siteNav.classList.contains("open") && !header.contains(e.target)) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && siteNav.classList.contains("open")) {
      setNav(false);
      navToggle.focus();
    }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1020) setNav(false);
  });

  /* ----- Isi data dari CONFIG ----- */
  var waDigits = String(CONFIG.whatsapp || "").replace(/\D/g, "");

  $("#kontakAlamat").textContent = CONFIG.alamatKantor;
  $("#kontakLokasi").textContent = CONFIG.lokasiUsaha;
  $("#footerAlamat").textContent = CONFIG.alamatKantor;

  var telpLink = $("#kontakTelp");
  if (CONFIG.telepon) {
    telpLink.textContent = CONFIG.telepon;
    telpLink.href = waDigits ? "tel:+" + waDigits : "tel:" + CONFIG.telepon.replace(/[^\d+]/g, "");
  } else {
    $("#kontakTelpItem").hidden = true;
  }

  if (CONFIG.email) {
    var emailLink = $("#kontakEmail");
    emailLink.textContent = CONFIG.email;
    emailLink.href = "mailto:" + CONFIG.email;
    $("#kontakEmailItem").hidden = false;
  }

  // Footer: website (teks biasa, bukan tautan), email, dan telepon
  if (CONFIG.website) {
    $("#footerWebsite").textContent = CONFIG.website;
  } else {
    $("#footerWebsiteItem").hidden = true;
  }
  if (CONFIG.email) {
    var footerEmail = $("#footerEmail");
    footerEmail.textContent = CONFIG.email;
    footerEmail.href = "mailto:" + CONFIG.email;
  } else {
    $("#footerEmailItem").hidden = true;
  }
  if (CONFIG.telepon) {
    var footerTelp = $("#footerTelp");
    footerTelp.textContent = CONFIG.telepon;
    footerTelp.href = telpLink.href;
  } else {
    $("#footerTelpItem").hidden = true;
  }

  $("#year").textContent = new Date().getFullYear();

  /* ----- Tabel peralatan & proyek (muncul hanya jika ada data) ----- */
  function fillTable(tbodyId, rows, keys) {
    var tbody = $(tbodyId);
    rows.forEach(function (row) {
      var tr = document.createElement("tr");
      keys.forEach(function (k) {
        var td = document.createElement("td");
        td.textContent = row[k] || "-";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  var hasEquipment = Array.isArray(CONFIG.peralatan) && CONFIG.peralatan.length > 0;
  var hasProjects = Array.isArray(CONFIG.proyek) && CONFIG.proyek.length > 0;

  if (hasEquipment) {
    fillTable("#equipmentBody", CONFIG.peralatan, ["jenis", "merek", "jumlah", "kondisi"]);
    $("#equipmentBlock").hidden = false;
  }
  if (hasProjects) {
    fillTable("#projectsBody", CONFIG.proyek, ["pekerjaan", "pemberiKerja", "lokasi", "periode"]);
    $("#projectsBlock").hidden = false;
  }
  if (hasEquipment || hasProjects) {
    $("#peralatan").hidden = false;
    $("#navPeralatan").hidden = false;
  }

  /* ----- Menu aktif sesuai posisi scroll ----- */
  var navLinks = $$(".site-nav li a");
  var sections = $$("main section[id]").filter(function (s) { return !s.hidden; });

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + id;
          a.classList.toggle("active", on);
          if (on) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ----- Animasi muncul saat scroll ----- */
  var reveals = $$(".reveal");
  reveals.forEach(function (el) {
    var siblings = $$(".reveal", el.parentElement).filter(function (s) { return s.parentElement === el.parentElement; });
    var idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = Math.min(idx, 4) * 70 + "ms";
  });

  // Setelah animasi muncul selesai, kelas "reveal" dilepas supaya efek hover
  // pada kartu tidak tertimpa. Kelas "in" tetap dipertahankan.
  function releaseReveal(el) {
    var done = function (e) {
      if (e.target !== el || e.propertyName !== "transform") return;
      el.removeEventListener("transitionend", done);
      el.classList.remove("reveal");
      el.style.transitionDelay = "";
    };
    el.addEventListener("transitionend", done);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add("in");
          io.unobserve(el);
          releaseReveal(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ----- Lightbox dokumen ----- */
  var lb = $("#lightbox");
  var lbImg = $("#lbImg");
  var lbCaption = $("#lbCaption");
  var lbCount = $("#lbCount");
  var lbPrev = $("#lbPrev");
  var lbNext = $("#lbNext");
  var lbClose = $("#lbClose");
  var lbState = { gallery: null, index: 0, opener: null };

  function renderLightbox() {
    var g = lbState.gallery;
    var item = g.items[lbState.index];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    // ulangi animasi masuk setiap halaman berganti
    lbImg.classList.remove("swap");
    void lbImg.offsetWidth;
    lbImg.classList.add("swap");
    lbCaption.textContent = g.title;
    var many = g.items.length > 1;
    lbPrev.hidden = !many;
    lbNext.hidden = !many;
    lbCount.textContent = many ? "Halaman " + (lbState.index + 1) + " dari " + g.items.length : "";
  }

  function openLightbox(key, opener) {
    var g = GALLERIES[key];
    if (!g) return;
    lbState.gallery = g;
    lbState.index = 0;
    lbState.opener = opener || null;
    renderLightbox();
    lb.hidden = false;
    document.body.classList.add("lb-open");
    lbClose.focus();
  }

  function closeLightbox() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.body.classList.remove("lb-open");
    if (lbState.opener) lbState.opener.focus();
  }

  function stepLightbox(dir) {
    var n = lbState.gallery.items.length;
    if (n < 2) return;
    lbState.index = (lbState.index + dir + n) % n;
    renderLightbox();
  }

  $$("[data-gallery]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openLightbox(btn.getAttribute("data-gallery"), btn);
    });
  });
  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", function () { stepLightbox(-1); });
  lbNext.addEventListener("click", function () { stepLightbox(1); });

  lb.addEventListener("click", function (e) {
    if (e.target.classList.contains("lb-stage") || e.target === lb) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") stepLightbox(-1);
    else if (e.key === "ArrowRight") stepLightbox(1);
    else if (e.key === "Tab") {
      var focusable = [lbClose, lbPrev, lbNext].filter(function (b) { return !b.hidden; });
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Geser jari untuk berpindah halaman (HP)
  var touchStartX = null;
  lb.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ----- Formulir kontak -> WhatsApp ----- */
  var form = $("#contactForm");
  var statusEl = $("#formStatus");

  function setError(inputId, message) {
    var input = document.getElementById(inputId);
    var field = input.closest(".field");
    var err = $('.field-error[data-for="' + inputId + '"]', field);
    field.classList.toggle("invalid", !!message);
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (err) err.textContent = message || "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.classList.remove("error");

    var nama = form.nama.value.trim();
    var instansi = form.instansi.value.trim();
    var layanan = form.layanan.value;
    var pesan = form.pesan.value.trim();

    setError("fNama", nama ? "" : "Mohon isi nama Anda.");
    setError("fPesan", pesan ? "" : "Mohon tuliskan pesan Anda.");
    if (!nama || !pesan) {
      (nama ? form.pesan : form.nama).focus();
      return;
    }

    var text =
      "Halo PT Tenggara Perkasa Mining, saya " + nama +
      (instansi ? " dari " + instansi : "") +
      ". Saya tertarik dengan layanan: " + layanan + ".\n\n" + pesan;

    if (waDigits) {
      var url = "https://wa.me/" + waDigits + "?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");
      statusEl.textContent = "Membuka WhatsApp. Jika tidak terbuka, ketuk nomor telepon di atas.";
    } else if (CONFIG.email) {
      window.location.href =
        "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Permintaan layanan: " + layanan) +
        "&body=" + encodeURIComponent(text);
      statusEl.textContent = "Membuka aplikasi email Anda.";
    } else {
      statusEl.textContent = "Kontak belum diatur. Mohon isi nomor WhatsApp atau email di script.js.";
      statusEl.classList.add("error");
    }
  });

  ["fNama", "fPesan"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      if (this.value.trim()) setError(id, "");
    });
  });
})();
