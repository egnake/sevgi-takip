import { db, collection, addDoc, onSnapshot, query, where } from './firebase-config.js';

let gunlukHedef = localStorage.getItem("gunlukSuHedefi") ? parseInt(localStorage.getItem("gunlukSuHedefi")) : 2000;

function yemekEkle() {
  const yemekAdi = document.getElementById('yemekAdi').value.trim();
  if (!yemekAdi) return alert("Lütfen yemek adını girin.");
  addDoc(collection(db, "kayitlar"), {
    tur: "yemek",
    ad: yemekAdi,
    tarih: new Date()
  });
  document.getElementById('yemekAdi').value = "";
}

function suEkle() {
  const suMiktari = document.getElementById('suMiktari').value.trim();
  if (!suMiktari || suMiktari <= 0) return alert("Geçerli bir miktar girin.");
  addDoc(collection(db, "kayitlar"), {
    tur: "su",
    miktar: parseInt(suMiktari),
    tarih: new Date()
  });
  document.getElementById('suMiktari').value = "";
}

function suToplaminiHesapla(snapshot) {
  let toplam = 0;
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.tur === "su") {
      toplam += data.miktar || 0;
    }
  });
  return toplam;
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

function suHedefiniKaydet() {
  const yeniHedef = document.getElementById('suHedefi').value.trim();
  if (!yeniHedef || yeniHedef <= 0) return alert("Geçerli bir miktar girin.");
  gunlukHedef = parseInt(yeniHedef);
  localStorage.setItem("gunlukSuHedefi", gunlukHedef);
  updateHedefBar();
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
