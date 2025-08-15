# Katkıda Bulunma Rehberi

Teşekkürler! Free for Dev Bookmarks Converter projesine katkıda bulunmak için bu rehberi takip edebilirsiniz.

## 🤝 Katkıda Bulunma Süreci

### 1. Depoyu Forklayın

GitHub üzerinde bu depoyu forklayarak kendi hesabınıza kopyalayın.

### 2. Yeni Dal Oluşturun

Özellikler veya düzeltmeler için yeni bir dal oluşturun:

```bash
git clone https://github.com/kullanici-adi/free-for-dev-bookmarks-converter.git
cd free-for-dev-bookmarks-converter
git checkout -b feature/yeni-ozellik
```

### 3. Değişiklikleri Yapın

- Kod stilini ve standartlarını takip edin
- Mevcut kod yapısını bozmayın
- Test dosyalarını güncellemeyi unutmayın
- Türkçe karakter ve dil desteğini koruyun

### 4. Değişiklikleri Commit Edin

Açıklayıcı commit mesajları kullanın:

```bash
git add .
git commit -m "feat: Yeni özellik eklendi - web arayüzünde dosya yükleme desteği"
```

### 5. Dalı İtin

```bash
git push origin feature/yeni-ozellik
```

### 6. Pull Request Oluşturun

GitHub üzerinde "New Pull Request" butonuna tıklayın ve:
- Değişikliklerinizi açıklayın
- İlgili issue'ları bağlayın
- Test sonuçlarını ekleyin

## 📋 Katkı Kuralları

### Kod Kalitesi

- **Python Kodu**:
  - PEP 8 standartlarına uygun olmalı
  - Type hint kullanılmalı
  - Docstring eklenmeli
  - Hata yönetimi olmalı

- **JavaScript Kodu**:
  - Modern JavaScript kullanılmalı (ES6+)
  - Responsive tasarım korunmalı
  - Tarayıcı uyumluluğu kontrol edilmeli

- **CSS Kodu**:
  - CSS standartlarına uygun olmalı
  - Mobil uyumluluk sağlanmalı
  - Performans optimize edilmeli

### Test Etme

- Yeni özellikler test edilmeli
- Mevcut işlevler bozulmamalı
- Tarayıcı uyumluluk testleri yapılmalı
- Mobil cihazlarda test edilmeli

### Dokümantasyon

- Yeni özellikler README.md'de açıklanmalı
- Kullanım örnekleri eklenmeli
- Parametreler ve seçenekler belirlenmeli

## 🐛 Hata Bildirimi

Hata bildirirken lütfen şunları sağlayın:

- Hata adımı adım açıklaması
- Beklenen ve gerçek davranış
- Ortam bilgileri (işletim sistemi, tarayıcı, Python sürümü)
- Hata mesajları ve loglar
- Gerekirse ekran görüntüsü

## ✨ Yeni Özellik İsteği

Yeni özellik isteklerinde:

- Özelliğin amacı ve kullanım senaryosu
- Beklenen çıktı ve davranış
- Potansiyel kullanım alanları
- Öncelik seviyesi (varsa)

## 📝 Commit Mesaj Formatı

Commit mesajları şu formatta olmalı:

```
<tip>: <açıklama>

[isteğe bağlı detaylar]
```

**Tip'ler:**
- `feat`: Yeni özellik
- `fix`: Hata düzeltmesi
- `docs`: Dokümantasyon değişikliği
- `style`: Kod formatı değişikliği
- `refactor`: Kod yeniden düzenleme
- `test`: Test ekleme/değiştirme
- `chore`: Diğer değişiklikler

**Örnekler:**
```
feat: Web arayüzünde dosya yükleme desteği eklendi

- Dosya seçme ve yükleme işlevi eklendi
- Progress bar ve log sistemi geliştirildi
- Mobil uyumluluk sağlandı
```

```
fix: Python betiğinde Türkçe karakter sorunu düzeltildi

- UTF-8 encoding sorunları giderildi
- Özel karakterler için escape fonksiyonu eklendi
```

## 🔍 Kod İncelemesi

Pull Request oluşturduğunuzda:

- Kodunuzu kendiniz kontrol edin
- Testleri çalıştırın
- Dokümantasyonu güncelleyin
- Açıklamaları net tutun

İnceleme taleplerine zamanında yanıt verin ve geri bildirimleri dikkate alın.

## 📞 İletişim

Sorularınız için:
- GitHub Issues üzerinden iletişime geçin
- Discussions bölümünü kullanın
- E-posta: [proje@example.com](mailto:proje@example.com)

## 📄 Lisans

Katkılarınız MIT Lisansı altında yayınlanacaktır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

Teşekkür ederiz! Katkılarınız bu projenin gelişmesine yardımcı olacaktır.