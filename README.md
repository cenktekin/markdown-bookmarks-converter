# Free for Dev Bookmarks Converter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.6+-blue.svg)](https://www.python.org/)
[![HTML/CSS/JS](https://img.shields.io/badge/HTML/CSS/JS-orange.svg)](https://developer.mozilla.org/)

Bu araç, [ripienaar/free-for-dev](https://github.com/ripienaar/free-for-dev) projesindeki gibi büyük README dosyalarını tarayıcı yer imleri (bookmarks) formatına dönüştürür.

## 🎯 Proje Amacı

Markdown formatındaki büyük README dosyalarını, özellikle ücretsiz geliştirici kaynakları listelerini, tarayıcılarda kolayca kullanılabilir yer imleri formatına dönüştürür. Bu sayede yüzlerce linki düzenli bir şekilde yer imlerinize ekleyebilirsiniz.

## ✨ Özellikler

- **Python Betiği**: Komut satırından veya betikle dönüştürme yapma
- **Web Arayüzü**: Tarayıcı üzerinden kolayca kullanım
- **Otomatik Ayrıştırma**: Markdown başlıklarını kategori olarak işler
- **Link Çıkarma**: Markdown linklerini otomatik olarak yer imlerine dönüştürür
- **Netscape Formatı**: Standart tarayıcı yer imleri formatı (HTML)
- **Responsive Tasarım**: Mobil uyumlu web arayüzü
- **Türkçe Desteği**: Türkçe karakter ve dil desteği

## 🚀 Kurulum ve Kullanım

### Python Betiği ile Kullanım

1. Gerekli bağımlılıkları yükleyin:
```bash
pip install -r requirements.txt  # Eğer varsa
```

2. Betiği çalıştırın:
```bash
python convert_to_bookmarks.py -i README.md -o bookmarks.html -t "Bookmarks" -r "Free for Dev"
```

**Parametreler:**
- `-i, --input`: Girdi markdown dosyası yolu (varsayılan: README.md)
- `-o, --output`: Çıktı HTML dosyası yolu (varsayılan: bookmarks.html)
- `-t, --title`: Yer imleri dosyası başlığı (varsayılan: Bookmarks)
- `-r, --root-category`: Ana kategori adı (varsayılan: Free for Dev)
- `-v, --verbose`: Detaylı çıktı modu
- `-h, --help`: Yardım mesajı

### Web Arayüzü ile Kullanım

1. Proje dosyalarını sunucuya veya yerel makinenize kopyalayın
2. `index.html` dosyasını tarayıcınızda açın
3. Kullanıcı arayüzünden dosya seçin ve dönüştürmeyi başlatın

## 📁 Dosya Yapısı

```
free-for-dev-bookmarks-converter/
├── README.md                    # Proje dokümantasyonu
├── convert_to_bookmarks.py      # Python dönüştürme betiği
├── index.html                   # Web arayüzü ana sayfası
├── script.js                    # Web arayüzü JavaScript kodu
├── style.css                    # Web arayüzü stilleri
├── bookmarks.html               # Örnek çıktı dosyası
├── test_*.md                    # Test dosyaları
├── test_*.html                  # Test HTML dosyaları
├── browser_compatibility_test.js # Tarayıcı uyumluluk testi
├── mobile_compatibility_test.js # Mobil uyumluluk testi
├── validate_output.js           # Çıktı doğrulama betiği
├── generate_large_test.js       # Büyük test verisi oluşturma
├── fetch_readme.py              # README dosyası indirme betiği
├── fetch_readme.log             # Log dosyası
└── logo.webp                    # Proje logosu
```

## 🛠️ Teknik Detaylar

### Python Betiği

- **Girdi İşleme**: UTF-8 destekli markdown dosyası okuma
- **Ayrıştırma**: Regex ile başlık ve link çıkarma
- **Çıktı Formatı**: Netscape bookmarks standardı
- **Hata Yönetimi**: Kapsamlı hata yakalama ve loglama

### Web Arayüzü

- **Frontend**: Saf HTML, CSS ve JavaScript
- **Responsive**: Mobil, tablet ve masaüstü uyumlu
- **Progress Bar**: İşlem ilerlemesi göstergesi
- **Log Sistemi**: Gerçek zamanlı işlem logları
- **Dosya İndirme**: Oluşturulan HTML dosyasını indirme

### Test Dosyaları

- `test_readme.md`: Standart test verisi
- `test_bookmarks.html`: Çıktı formatı testi
- `test_invalid_format.txt`: Geçersiz format testi
- `test_empty.md`: Boş dosya testi
- `test_special_chars.md`: Özel karakter testi
- `test_large.md`: Büyük dosya performans testi

## 📋 Sistem Gereksinimleri

### Python Betiği
- Python 3.6+
- Standart kütüphaneler (argparse, logging, re, sys, datetime, html, pathlib, typing)

### Web Arayüzü
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- JavaScript etkin olmalı
- UTF-8 karakter desteği

## 🔧 Örnek Kullanım Senaryoları

### 1. Free for Dev Projesi
```bash
python convert_to_bookmarks.py -i free-for-dev/README.md -t "Free for Dev Bookmarks"
```

### 2. Özel README Dosyaları
```bash
python convert_to_bookmarks.py -i projem/README.md -o projem-bookmarks.html -r "Projem Linkleri"
```

### 3. Web Arayüzü ile
1. `index.html` dosyasını açın
2. "README Dosyası Seçin" menüsünden dosyayı seçin
3. Çıktı dosya adını ve başlığı belirleyin
4. "Bookmarks Oluştur" butonuna tıklayın
5. Oluşturulan dosyayı indirin

## 📊 Çıktı Örneği

Oluşturulan HTML dosyası şu şekilde bir yapı içerir:

```html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<DL><p>
<DT><H3 ADD_DATE="..." LAST_MODIFIED="..." PERSONAL_TOOLBAR_FOLDER="true">Free for Dev</H3>
<DL><p>
    <DT><H3 ADD_DATE="..." LAST_MODIFIED="...">Major Cloud Providers</H3>
    <DL><p>
        <DT><A HREF="https://aws.amazon.com" ADD_DATE="...">Amazon Web Services</A>
        <DT><A HREF="https://azure.microsoft.com" ADD_DATE="...">Microsoft Azure</A>
        <!-- Diğer linkler -->
    </DL><p>
    <!-- Diğer kategoriler -->
</DL><p>
</DL><p>
```

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Lütfen aşağıdaki adımları izleyin:

1. Bu depoyu "fork"layın
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi yapın ve commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Dalı itin (`git push origin feature/yeni-ozellik`)
5. Bir "Pull Request" oluşturun

## 📝 Lisans

Bu proje [MIT Lisansı](LICENSE) altında açık kaynaklıdır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🔗 İlgili Linkler

- [ripienaar/free-for-dev](https://github.com/ripienaar/free-for-dev) - Orijinal kaynak
- [Netscape Bookmark Format](https://msdn.microsoft.com/en-us/library/ms775124(v=vs.85).aspx) - Bookmark formatı belgeleri
- [Markdown Syntax](https://www.markdownguide.org/basic-syntax/) - Markdown sözdizimi

## 📞 İletişim

Sorularınız, önerileriniz veya hata bildirimleri için:
- GitHub Issues üzerinden iletişime geçin
- E-posta: [proje@example.com](mailto:proje@example.com)

---

**Not**: Bu araç, [ripienaar/free-for-dev](https://github.com/ripienaar/free-for-dev) projesindeki gibi büyük kaynak listelerini yönetmek için geliştirilmiştir. Orijinal projeye saygı duyarak ve onun faydalı yapısını kullanarak bağımsız bir araç olarak sunulmuştur.