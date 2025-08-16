// Tarayıcı uyumluluk testi betiği
const fs = require('fs');
const path = require('path');

console.log('🌐 Tarayıcı Uyumluluk Testi Başlatılıyor...');

// Test senaryoları
const testScenarios = [
    {
        name: 'Chrome Tarayıcı Testi',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        features: ['fetch', 'Promise', 'Arrow Functions', 'Template Literals', 'Destructuring']
    },
    {
        name: 'Firefox Tarayıcı Testi',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        features: ['fetch', 'Promise', 'Arrow Functions', 'Template Literals', 'Destructuring']
    },
    {
        name: 'Safari Tarayıcı Testi',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        features: ['fetch', 'Promise', 'Arrow Functions', 'Template Literals', 'Destructuring']
    },
    {
        name: 'Edge Tarayıcı Testi',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
        features: ['fetch', 'Promise', 'Arrow Functions', 'Template Literals', 'Destructuring']
    },
    {
        name: 'Eski IE Tarayıcı Testi',
        userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
        features: ['fetch', 'Promise', 'Arrow Functions', 'Template Literals', 'Destructuring']
    }
];

// HTML dosyasını oku
const htmlContent = fs.readFileSync('index.html', 'utf8');

// JavaScript dosyasını oku
const jsContent = fs.readFileSync('script.js', 'utf8');

console.log('📁 Dosyalar okundu');

// Temel HTML yapısını kontrol et
function checkHTMLStructure() {
    console.log('\n🔍 HTML Yapısı Kontrolü:');
    
    const checks = [
        { name: 'DOCTYPE varlığı', test: htmlContent.includes('<!DOCTYPE html>') },
        { name: 'HTML etiketi', test: htmlContent.includes('<html') },
        { name: 'Head etiketi', test: htmlContent.includes('<head') },
        { name: 'Body etiketi', test: htmlContent.includes('<body') },
        { name: 'Title etiketi', test: htmlContent.includes('<title>') },
        { name: 'Script etiketi', test: htmlContent.includes('<script') },
        { name: 'CSS dosyası bağlantısı', test: htmlContent.includes('style.css') },
        { name: 'Meta viewport', test: htmlContent.includes('viewport') }
    ];
    
    let passed = 0;
    checks.forEach(check => {
        if (check.test) {
            console.log(`  ✅ ${check.name}`);
            passed++;
        } else {
            console.log(`  ❌ ${check.name}`);
        }
    });
    
    console.log(`\n📊 HTML Yapısı: ${passed}/${checks.length} kontrol başarılı`);
    return passed === checks.length;
}

// JavaScript özelliklerini kontrol et
function checkJavaScriptFeatures() {
    console.log('\n🔍 JavaScript Özellikleri Kontrolü:');
    
    const checks = [
        { name: 'ES6 Class yapısı', test: jsContent.includes('class ') },
        { name: 'Arrow Functions', test: jsContent.includes('=>') },
        { name: 'Template Literals', test: jsContent.includes('`') },
        { name: 'Destructuring', test: jsContent.includes('const {') || jsContent.includes('let {') },
        { name: 'Promise kullanımı', test: jsContent.includes('.then(') || jsContent.includes('await ') },
        { name: 'Fetch API', test: jsContent.includes('fetch(') },
        { name: 'addEventListener', test: jsContent.includes('addEventListener') },
        { name: 'querySelector', test: jsContent.includes('querySelector') },
        { name: 'createElement', test: jsContent.includes('createElement') },
        { name: 'Blob nesnesi', test: jsContent.includes('new Blob') }
    ];
    
    let passed = 0;
    checks.forEach(check => {
        if (check.test) {
            console.log(`  ✅ ${check.name}`);
            passed++;
        } else {
            console.log(`  ❌ ${check.name}`);
        }
    });
    
    console.log(`\n📊 JavaScript Özellikleri: ${passed}/${checks.length} kontrol başarılı`);
    return passed >= checks.length * 0.8; // %80 başarı oranı
}

// CSS özelliklerini kontrol et
function checkCSSFeatures() {
    console.log('\n🔍 CSS Özellikleri Kontrolü:');
    
    try {
        const cssContent = fs.readFileSync('style.css', 'utf8');
        
        const checks = [
            { name: 'Flexbox kullanımı', test: cssContent.includes('display: flex') },
            { name: 'Responsive tasarım', test: cssContent.includes('@media') },
            { name: 'Modern CSS özellikleri', test: cssContent.includes('border-radius') || cssContent.includes('box-shadow') },
            { name: 'Animasyonlar', test: cssContent.includes('transition') || cssContent.includes('animation') },
            { name: 'CSS Grid', test: cssContent.includes('display: grid') }
        ];
        
        let passed = 0;
        checks.forEach(check => {
            if (check.test) {
                console.log(`  ✅ ${check.name}`);
                passed++;
            } else {
                console.log(`  ❌ ${check.name}`);
            }
        });
        
        console.log(`\n📊 CSS Özellikleri: ${passed}/${checks.length} kontrol başarılı`);
        return passed >= checks.length * 0.6; // %60 başarı oranı
        
    } catch (error) {
        console.log('  ⚠️  CSS dosyası okunamadı');
        return false;
    }
}

// Tarayıcı uyumluluk senaryolarını test et
function testBrowserScenarios() {
    console.log('\n🌐 Tarayıcı Uyumluluk Senaryoları:');
    
    testScenarios.forEach(scenario => {
        console.log(`\n📱 ${scenario.name}:`);
        
        // Temel özellikleri kontrol et
        const compatibleFeatures = scenario.features.filter(feature => {
            switch (feature) {
                case 'fetch':
                    return jsContent.includes('fetch(');
                case 'Promise':
                    return jsContent.includes('.then(') || jsContent.includes('await ');
                case 'Arrow Functions':
                    return jsContent.includes('=>');
                case 'Template Literals':
                    return jsContent.includes('`');
                case 'Destructuring':
                    return jsContent.includes('const {') || jsContent.includes('let {');
                default:
                    return false;
            }
        });
        
        const compatibilityScore = (compatibleFeatures.length / scenario.features.length) * 100;
        
        if (scenario.name.includes('Eski IE')) {
            // Eski IE için daha düşük beklenti
            if (compatibilityScore >= 40) {
                console.log(`  ✅ Uyumlu (${compatibilityScore.toFixed(1)}%)`);
            } else {
                console.log(`  ❌ Uyumsuz (${compatibilityScore.toFixed(1)}%)`);
            }
        } else {
            // Modern tarayıcılar için yüksek beklenti
            if (compatibilityScore >= 80) {
                console.log(`  ✅ Uyumlu (${compatibilityScore.toFixed(1)}%)`);
            } else {
                console.log(`  ❌ Uyumsuz (${compatibilityScore.toFixed(1)}%)`);
            }
        }
    });
}

// Performans testi
function testPerformance() {
    console.log('\n⚡ Performans Testi:');
    
    // Dosya boyutlarını kontrol et
    const htmlSize = fs.statSync('index.html').size;
    const jsSize = fs.statSync('script.js').size;
    const cssSize = fs.existsSync('style.css') ? fs.statSync('style.css').size : 0;
    
    console.log(`  📄 index.html: ${(htmlSize / 1024).toFixed(2)} KB`);
    console.log(`  📄 script.js: ${(jsSize / 1024).toFixed(2)} KB`);
    console.log(`  📄 style.css: ${(cssSize / 1024).toFixed(2)} KB`);
    
    const totalSize = htmlSize + jsSize + cssSize;
    console.log(`  📊 Toplam boyut: ${(totalSize / 1024).toFixed(2)} KB`);
    
    // Performans değerlendirmesi
    if (totalSize < 200 * 1024) { // 200KB
        console.log('  ✅ Hafif ve performanslı');
    } else if (totalSize < 500 * 1024) { // 500KB
        console.log('  ⚠️  Orta boyutlu');
    } else {
        console.log('  ❌ Büyük boyutlu (optimizasyon önerilir)');
    }
    
    return totalSize < 500 * 1024; // 500KB altı kabul edilebilir
}

// Testleri çalıştır
function runTests() {
    console.log('='.repeat(50));
    
    const htmlOk = checkHTMLStructure();
    const jsOk = checkJavaScriptFeatures();
    const cssOk = checkCSSFeatures();
    const performanceOk = testPerformance();
    
    testBrowserScenarios();
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 TOPLAM SONUÇLAR');
    console.log('='.repeat(50));
    
    const results = [
        { name: 'HTML Yapısı', status: htmlOk },
        { name: 'JavaScript Özellikleri', status: jsOk },
        { name: 'CSS Özellikleri', status: cssOk },
        { name: 'Performans', status: performanceOk }
    ];
    
    const passedTests = results.filter(r => r.status).length;
    const totalTests = results.length;
    
    results.forEach(result => {
        console.log(`${result.status ? '✅' : '❌'} ${result.name}`);
    });
    
    console.log(`\n🎯 Genel Başarı Oranı: ${passedTests}/${totalTests} (${(passedTests/totalTests*100).toFixed(1)}%)`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 Tüm testler başarılı! Uygulama tarayıcı uyumluluğu açısından hazır.');
        process.exit(0);
    } else if (passedTests >= totalTests * 0.75) {
        console.log('\n⚠️  Çoğunlukla uyumlu. Bazı iyileştirmeler yapılabilir.');
        process.exit(1);
    } else {
        console.log('\n❌ Ciddi uyumsuzluklar var. Düzeltmeler gerekiyor.');
        process.exit(2);
    }
}

// Testleri çalıştır
runTests();