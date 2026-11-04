# NEXT_ACTIONS — markdown-bookmarks-converter

**Amaç:** Bu dosya denetim dönüş çapasıdır. Yeni oturumda "D:\projects\markdown-bookmarks-converter\NEXT_ACTIONS.md oku ve uygula" cümlesiyle kaldığın yerden devam et.

---

## Son Tur

- **Tarih:** 2026-11-04 · **Mod:** onarım turu (tam orta)
- **Önceki skor:** 59/100 (17.10.2026) · **Tahmini yeni skor:** ~80/100 (resmî ölçüm bekliyor)
- **Hüküm:** T1–T8'in tamamı kapandı. `npm test` yeşil (exit 0), Python CLI yuvalamalı ve etiket-dengeli çıktı üretiyor.

## Referanslar

- **Ledger bölümü:** `MASTER_PROJECT_LEDGER.md` → `### markdown-bookmarks-converter` (04.11.2026 onarım turu APPEND)
- **Joplin not:** Teknik Notlar, id `44292c71b48b45f58058e0ab6d5400b5`
- **TickTick task:** 👨‍💻Teknik İşler — 04.11.2026 kontrolü kapatıldı, 18.11.2026 yeni kontrol açıldı
- **Kardeş proje (sinaps):** `bookmark-parser` (ters yön: bookmark HTML → README; **kod/şema paylaşımı YOK**)

## Kapanan Kalemler (04.11.2026)

| # | Sonuç | Kanıt |
|---|-------|-------|
| T1 | ✅ HTML escape | `converter.js` `escapeHtml()`; title/kategori/link metni/URL kaçışlı; `showError` DOM API ile kuruluyor |
| T2 | ✅ Log paneli canlı | `script.js` `addLog()` → `className` + `textContent` + `appendChild` + otomatik kaydırma |
| T3 | ✅ `image.png` takipli | `.gitignore`'dan çıkarıldı, `git add image.png` (214.204 B) → README + og:image yolu artık geçerli |
| T4 | ✅ `#` orphan + nesting | Python ve JS ortak yığın algoritması: 1–3 seviye başlıklar iç içe `<DL>`, açılış/kapanış dengeli (probe: 5/5) |
| T5 | ✅ Demo README yolu | `fetch('./README.md')` — Pages alt-yolu ile uyumlu |
| T6 | ✅ `.gitattributes` | `* text=auto eol=lf` + `*.png binary`; `git add --renormalize .` ile 30 dosyadaki CRLF gürültüsü sıfırlandı |
| T7 | ✅ Ölü kod | `index.html` Node shim kaldırıldı; `script.js` erişilemeyen test dalları silindi; `fetch_readme.py` ölü `os/re/datetime` importları; `test_web_interface.js` kopya mantık yerine `converter.js` kullanıyor |
| T8 | ✅ `package.json` + `npm test` | 5 smoke script tek zincirde bağlı; bağımlılık yok; `npm test` → exit 0 |

## Doğrulama Komutları

```powershell
cd D:\projects\markdown-bookmarks-converter
npm test
python tools/convert_to_bookmarks.py -i tests/test_readme.md -o bookmarks.html
```

## AÇIK KALEMLER (yeni tur — 18.11.2026)

| # | Kalem | Efor | Neden |
|---|-------|------|-------|
| R1 | **Commit + push** (yerel commit atıldıysa yalnız push) | XS | T3/T6 etkisi ancak push sonrası canlı demoda görünür |
| R2 | Pages demo duman testi | S | `./README.md` ve `og:image` gerçek tarayıcıda doğrulanmadı (bu ortamda tarayıcı yok) |
| R3 | CI'ya `npm test` job'u ekle | S | Mevcut `deploy-pages.yml` yalnız deploy ediyor; regresyon kapısı yok |
| R4 | `samples/*.html` yeniden üret | S | İki örnek dosyada üretim işareti (DTD yorumu) yok; validator uyarı veriyor |
| R5 | Resmî skor ölçümü | S | `/proje-denetim D:\projects\markdown-bookmarks-converter tam orta` → Ledger'a yeni sayı |
| R6 | Emoji notları güncelle | XS | Notlar hâlâ "Playwright" ve "8 test dosyası" diyor; gerçek: 11 dosya, framework yok |

## ERTELENEN

- XML (Firefox) / YAML export — Efor M, net talep yok, Netscape HTML zaten Firefox uyumlu
- Batch işleme, kategori dahil/hariç filtreleme, dönüşüm öncesi önizleme — Efor M-L
- Gerçek test framework (vitest/jest) + assertion'lı birim testleri — Efor M
- `samples/README.md` (290 KB vendored free-for-dev) — arşive taşıma düşünülebilir (Efor S)
- Standart doküman seti (PROJECT_TRACKER / TECHNICAL_NOTES / USER_GUIDE / project_state.json) — Efor M

## REDDEDİLEN

- Pazarlama/kozmetik süs (PWA, tema switcher, istatistik paneli, import mevcut bookmarks) — gerçek fayda yok
- "Toplu sosyal paylaşım" vb. kapsam dışı özellikler

---

*Bu dosya `.gitignore`'a EKLENMEZ — takip edilen dönüş çapasıdır.*
