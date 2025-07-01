import { db, collection, addDoc, onSnapshot } from './firebase-config.js';

let gunlukHedef = localStorage.getItem("gunlukSuHedefi") ? parseInt(localStorage.getItem("gunlukSuHedefi")) : 2000;

window.yemekEkle = function yemekEkle() {
  const yemekAdi = document.getElementById('yemekAdi').value.trim();
  if (!yemekAdi) return alert("Lütfen yemek adını girin.");
  addDoc(collection(db, "kayitlar"), {
    tur: "yemek",
    ad: yemekAdi,
    tarih: new Date()
  });
  document.getElementById('yemekAdi').value = "";
}

window.suEkle = function suEkle() {
  const suMiktari = document.getElementById('suMiktari').value.trim();
  if (!suMiktari || suMiktari <= 0) return alert("Geçerli bir miktar girin.");
  addDoc(collection(db, "kayitlar"), {
    tur: "su",
    miktar: parseInt(suMiktari),
    tarih: new Date()
  });
  document.getElementById('suMiktari').value = "";
}

window.suHedefiniKaydet = function suHedefiniKaydet() {
  const yeniHedef = document.getElementById('suHedefi').value.trim();
  if (!yeniHedef || yeniHedef <= 0) return alert("Geçerli bir miktar girin.");
  gunlukHedef = parseInt(yeniHedef);
  localStorage.setItem("gunlukSuHedefi", gunlukHedef);
  updateHedefBar();
}

function updateHedefBar() {
  const progressEl = document.getElementById("progress");
  const durumEl = document.getElementById("hedefDurumu");

  if (!progressEl || !durumEl) return;

  const yuzde = Math.min((toplamSu / gunlukHedef) * 100, 100);
  progressEl.style.width = `${yuzde}%`;
  durumEl.innerText = `${toplamSu} / ${gunlukHedef} ml`;

  if (yuzde >= 100) {
    durumEl.innerText += " - 🎉 Hedefe ulaştın!";
  }
}

const iltifatlar = [
  "Sen benim tek ve en özelimsin!",
  "Seninle her şey daha güzel.",
  "Bugün de senin gibi ışıl ışıl bir gün olacak!",
  "Sen her şeye değersin, unutma.",
  "Gülüşün bile bir gülü tebessüm ettiriyor.",
  "Her şeyi yapabilirsin, çünkü sen güçlüsün 💪",
  "Kendine iyi bak, çünkü sen çok kıymetlisin ❤️"
];

function gunlukIltifatGoster() {
  const rastgele = Math.floor(Math.random() * iltifatlar.length);
  const iltifatEl = document.getElementById("iltifat");
  if (iltifatEl) iltifatEl.innerText = iltifatlar[rastgele];
}

function sabahHatirlatmasi() {
  const saat = new Date().getHours();
  if (saat >= 7 && saat < 9) {
    alert("🌅 Günaydın! Bugün başlamadan önce bir bardak su içmeni istedim 💧");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  gunlukIltifatGoster();
  sabahHatirlatmasi();
  updateHedefBar();
  updateMesaj(); 

  // Hedef inputuna mevcut hedefi yaz
  const input = document.getElementById("suHedefi");
  if (input) input.value = gunlukHedef;
});
function kalpOlustur() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.innerText = '❤️';
  heart.style.left = Math.random() * window.innerWidth + "px";
  document.getElementById("heart-container").appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 5000);
}

// Her 10 saniyede bir kalp düşsün
setInterval(kalpOlustur, 1);

let toplamSu = 0;

onSnapshot(collection(db, "kayitlar"), (snapshot) => {
  const liste = document.getElementById('kayitListesi');
  const toplamSuEl = document.getElementById("toplam-su");
  const haftalikRaporEl = document.getElementById("haftalik-rapor");

  if (!liste || !toplamSuEl || !haftalikRaporEl) return;

  liste.innerHTML = "";
  toplamSu = 0;
  let tumKayitlar = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    tumKayitlar.push(data);

    let itemText = "";

    if (data.tur === "yemek") {
      itemText = `🍽️ ${data.ad} - ${new Date(data.tarih.seconds * 1000).toLocaleTimeString()}`;
    } else if (data.tur === "su") {
      itemText = `💧 ${data.miktar} ml - ${new Date(data.tarih.seconds * 1000).toLocaleTimeString()}`;
      toplamSu += data.miktar;
    }

    const li = document.createElement("li");
    li.textContent = itemText;
    li.classList.add("fade-in");
    liste.appendChild(li);
  });

  toplamSuEl.innerText = `${toplamSu} ml`;
  haftalikRaporEl.innerText = `${haftalikSuHesapla(tumKayitlar)} L`;
  updateHedefBar();
}, (error) => {
  console.error("Firestore verisi alınırken hata:", error);
  document.getElementById("toplam-su").innerText = "Veri alınamadı";
  document.getElementById("haftalik-rapor").innerText = "Veri alınamadı";
});

let mesajDB = "";

function mesajKaydet() {
  const mesaj = document.getElementById('sevgiliMesaji').value.trim();
  if (!mesaj) return alert("Lütfen bir mesaj girin.");
  mesajDB = mesaj;
  localStorage.setItem("sevgiliMesaj", mesaj);
  updateMesaj();
}

function updateMesaj() {
  const mesajEl = document.getElementById("kayitliMesaj");
  if (!mesajEl) return;
  const mesaj = localStorage.getItem("sevgiliMesaj") || "Henüz mesaj yok 💗";
  mesajEl.innerText = mesaj;
}

function haftalikSuHesapla(kayitlar) {
  let toplam = 0;
  const birHaftaOnce = Date.now() - 7 * 24 * 60 * 60 * 1000;

  for (const data of kayitlar) {
    if (data.tur === "su" && data.tarih?.seconds) {
      const zaman = data.tarih.seconds * 1000;
      if (zaman > birHaftaOnce) {
        toplam += data.miktar || 0;
      }
    }
  }

  return (toplam / 1000).toFixed(1);
}
