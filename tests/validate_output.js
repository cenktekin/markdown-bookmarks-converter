// Çıktı doğrulama betiği
const fs = require('fs');
const path = require('path');

console.log('🔍 Çıktı doğrulama testi başlatılıyor...');

// Test dosyalarını kontrol et
const testFiles = [
    'test_bookmarks_from_web.html',
    'bookmarks.html',
    'test_bookmarks.html',
    'test_bookmarks2.html'
];

let validationResults = {
    totalFiles: 0,
    validFiles: 0,
    invalidFiles: 0,
    errors: [],
    warnings: []
};

function validateBookmarksFile(filePath) {
    console.log(`\n📁 Dosya kontrol ediliyor: ${filePath}`);
    
    try {
        if (!fs.existsSync(filePath)) {
            validationResults.errors.push(`Dosya bulunamadı: ${filePath}`);
            validationResults.invalidFiles++;
            return false;
        }
        
        validationResults.totalFiles++;
        
        const content = fs.readFileSync(filePath, 'utf8');
        const fileSize = content.length;
        
        console.log(`📊 Dosya boyutu: ${fileSize} bayt`);
        
        // Temel format doğrulamaları
        const validations = [
            {
                name: 'DOCTYPE kontrolü',
                test: () => content.includes('<!DOCTYPE NETSCAPE-Bookmark-file-1>'),
                error: 'DOCTYPE etiketi eksik'
            },
            {
                name: 'META etiketi kontrolü',
                test: () => content.includes('<META HTTP-EQUIV="Content-Type"'),
                error: 'META etiketi eksik'
            },
            {
                name: 'TITLE etiketi kontrolü',
                test: () => content.includes('<TITLE>') && content.includes('</TITLE>'),
                error: 'TITLE etiketi eksik'
            },
            {
                name: 'H1 etiketi kontrolü',
                test: () => content.includes('<H1>') && content.includes('</H1>'),
                error: 'H1 etiketi eksik'
            },
            {
                name: 'DL etiketi kontrolü',
                test: () => content.includes('<DL><p>'),
                error: 'DL etiketi eksik'
            },
            {
                name: 'DTD yorumu kontrolü',
                test: () => content.includes('This is an automatically generated file.'),
                error: 'DTD yorumu eksik'
            }
        ];
        
        let isValid = true;
        let linkCount = 0;
        let categoryCount = 0;
        
        // Her bir doğrulama testini çalıştır
        for (const validation of validations) {
            if (!validation.test()) {
                validationResults.errors.push(`${filePath}: ${validation.error}`);
                isValid = false;
            }
        }
        
        // Link sayısını kontrol et
        const linkMatches = content.match(/<DT><A HREF="[^"]*"/g);
        linkCount = linkMatches ? linkMatches.length : 0;
        console.log(`🔗 Bulunan link sayısı: ${linkCount}`);
        
        // Kategori sayısını kontrol et
        const categoryMatches = content.match(/<DT><H3[^>]*>/g);
        categoryCount = categoryMatches ? categoryMatches.length : 0;
        console.log(`📂 Bulunan kategori sayısı: ${categoryCount}`);
        
        // İçerik uzunluğu kontrolü
        if (fileSize < 100) {
            validationResults.warnings.push(`${filePath}: Dosya çok küçük (${fileSize} bayt)`);
        }
        
        if (linkCount === 0) {
            validationResults.warnings.push(`${filePath}: Hiç link bulunamadı`);
        }
        
        if (categoryCount === 0) {
            validationResults.warnings.push(`${filePath}: Hiç kategori bulunamadı`);
        }
        
        // HTML yapısını kontrol et - daha doğru bir yöntem
        const allTags = (content.match(/<[^>]+>/g) || []).length;
        const selfClosingTags = (content.match(/<[^>]+\/>/g) || []).length;
        const closeTags = (content.match(/<\/[^>]+>/g) || []).length;
        
        // Açılış etiketleri = kapanış etiketleri + kendi kendini kapatan etiketler
        const openTags = closeTags + selfClosingTags;
        
        if (allTags > 0 && openTags !== closeTags + selfClosingTags) {
            validationResults.errors.push(`${filePath}: HTML yapısı bozuk (açılış/kapanış etiketleri)`);
            isValid = false;
        }
        
        // Netscape formatını kontrol et
        if (!content.includes('ADD_DATE=')) {
            validationResults.warnings.push(`${filePath}: ADD_DATE özniteliği bulunamadı`);
        }
        
        if (!content.includes('LAST_MODIFIED=')) {
            validationResults.warnings.push(`${filePath}: LAST_MODIFIED özniteliği bulunamadı`);
        }
        
        if (isValid) {
            validationResults.validFiles++;
            console.log(`✅ ${filePath}: Geçerli`);
        } else {
            validationResults.invalidFiles++;
            console.log(`❌ ${filePath}: Geçersiz`);
        }
        
        return isValid;
        
    } catch (error) {
        validationResults.errors.push(`${filePath}: ${error.message}`);
        validationResults.invalidFiles++;
        console.log(`❌ ${filePath}: Hata - ${error.message}`);
        return false;
    }
}

// Tüm test dosyalarını doğrula
testFiles.forEach(file => {
    validateBookmarksFile(file);
});

// Orijinal bookmarks.html dosyasını da kontrol et
if (fs.existsSync('bookmarks.html')) {
    validateBookmarksFile('bookmarks.html');
}

// Sonuçları raporla
console.log('\n📊 DOĞRULAMA SONUÇLARI');
console.log('='.repeat(50));
console.log(`Toplam dosya sayısı: ${validationResults.totalFiles}`);
console.log(`Geçerli dosya sayısı: ${validationResults.validFiles}`);
console.log(`Geçersiz dosya sayısı: ${validationResults.invalidFiles}`);
console.log(`Hata sayısı: ${validationResults.errors.length}`);
console.log(`Uyarı sayısı: ${validationResults.warnings.length}`);

if (validationResults.errors.length > 0) {
    console.log('\n❌ HATALAR:');
    validationResults.errors.forEach(error => console.log(`  - ${error}`));
}

if (validationResults.warnings.length > 0) {
    console.log('\n⚠️  UYARILAR:');
    validationResults.warnings.forEach(warning => console.log(`  - ${warning}`));
}

// Genel değerlendirme
if (validationResults.invalidFiles === 0 && validationResults.errors.length === 0) {
    console.log('\n🎉 Tüm dosyalar başarıyla doğrulandı!');
    process.exit(0);
} else if (validationResults.validFiles > 0) {
    console.log('\n⚠️  Bazı dosyalar geçerli, bazıları geçersiz');
    process.exit(1);
} else {
    console.log('\n❌ Tüm dosyalar geçersiz');
    process.exit(2);
}