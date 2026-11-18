# NEXT_ACTIONS — markdown-bookmarks-converter

**Amaç:** Bu dosya denetim dönüş çapasıdır. Yeni oturumda "D:\projects\markdown-bookmarks-converter\NEXT_ACTIONS.md oku ve uygula" cümlesiyle kaldığın yerden devam et.

---

## Son Tur

- **Tarih:** 2026-11-18 · **Mod:** 2 haftalık kontrol (R1–R6 icra)
- **Skor:** 59/100 (17.10) → **85/100** (18.11, resmî ölçüm · Ledger APPEND)
- **Hüküm:** R1–R6'nın tamamı kapandı. Repo push edildi, CI regresyon kapısı yeşil, canlı demo gerçek tarayıcıda (CDP) uçtan uca doğrulandı.
- **Repo:** `main @ 9eac30a` · `HEAD==origin/main` · ağaç temiz

## Önceki Tur

- **Tarih:** 2026-11-04 · **Mod:** onarım turu (tam orta)
- **Skor:** 59/100 (17.10.2026) · **Tahmini:** ~80/100
- **Hüküm:** T1–T8'in tamamı kapandı. `npm test` yeşil (exit 0), Python CLI yuvalamalı ve etiket-dengeli çıktı üretiyor.

## Referanslar

- **Ledger bölümü:** `MASTER_PROJECT_LEDGER.md` → `2026-11-18 — 2. tur · markdown-bookmarks-converter`
- **Joplin not:** Teknik Notlar, id `44292c71b48b45f58058e0ab6d5400b5`
- **TickTick task:** `6aead9208f08fc8c028f4a82` (kapandı 18.11.2026) → sonraki kontrol **02.12.2026**
- **Kardeş proje (sinaps):** `bookmark-parser` (ters yön: bookmark HTML → README; **kod/şema paylaşımı YOK**)

## Kapanan Kalemler (18.11.2026)

| # | Sonuç | Kanıt |
|---|-------|-------|
| R1 | ✅ Push | `b6df245..9eac30a`; `rev-list --left-right --count origin/main...HEAD` → `0 0`; pre-commit secret hook temiz |
| R2 | ✅ Pages demo smoke | Edge headless + CDP: `./README.md` fetch 200 → `#log-messages` 4 canlı mesaj → `#result-section` block, konsol hatası yok; `og:image` 200 (214.204 B, yerel ile birebir) |
| R3 | ✅ CI test job | `.github/workflows/ci.yml`: `npm test` + Python CLI kapısı (DOCTYPE, DTD işareti, `DL` dengesi); ilk koşu **success** (run `44301037819`) |
| R4 | ✅ samples yeniden üretildi | Kök neden: Python üretici Netscape DTD yorum bloğunu basmıyordu (JS basıyordu). Üretici hizalandı → validator **uyarı 2 → 0** |
| R5 | ✅ Resmî skor | 59 → **85** (6 eksen, basit ortalama); Ledger'a APPEND |
| R6 | ✅ Emoji notları | "Playwright" → `node:assert`+`npm test` (framework yok); "8 test dosyası" → **11** (5 script + 6 fixture); ağaç `converter.js`/`ci.yml` ile hizalandı |

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

## AÇIK KALEMLER

Yok — R1–R6 (18.11.2026) ve T1–T8 (04.11.2026) tamamı kapandı. Kalan maddeler yalnız ERTELENEN/REDDEDİLEN listesinde.

## ERTELENEN

- XML (Firefox) / YAML export — Efor M, net talep yok, Netscape HTML zaten Firefox uyumlu
- Batch işleme, kategori dahil/hariç filtreleme, dönüşüm öncesi önizleme — Efor M-L
- Gerçek test framework (vitest/jest) + assertion'lı birim testleri ve kapsam ölçümü — Efor M
- `samples/README.md` (290 KB vendored free-for-dev) — arşive taşıma düşünülebilir (Efor S)
- Standart doküman seti (PROJECT_TRACKER / TECHNICAL_NOTES / USER_GUIDE / project_state.json) — Efor M
- Ölçü limit aşımlarının bölünmesi — `create_bookmark_html` 68, `main` 74 (Python), `style.css` 511 satır (Efor S)

## REDDEDİLEN

- Pazarlama/kozmetik süs (PWA, tema switcher, istatistik paneli, import mevcut bookmarks) — gerçek fayda yok
- "Toplu sosyal paylaşım" vb. kapsam dışı özellikler

---

*Bu dosya `.gitignore`'a EKLENMEZ — takip edilen dönüş çapasıdır.*
