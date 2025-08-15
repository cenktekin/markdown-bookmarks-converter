// Mobil uyumluluk testi betiği
const fs = require('fs');

console.log('📱 Mobil Uyumluluk Testi Başlatılıyor...');

// Mobil cihaz senaryoları
const mobileScenarios = [
    {
        name: 'iPhone 12 Pro',
        width: 390,
        height: 844,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        devicePixelRatio: 3
    },
    {
        name: 'Samsung Galaxy S21',
        width: 360,
        height: 780,
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        devicePixelRatio: 2.75
    },
    {
        name: 'iPad Pro',
        width: 1024,
        height: 1366,
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        devicePixelRatio: 2
    },
    {
        name: 'Google Pixel 5',
        width: 393,
        height: 851,
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        devicePixelRatio: 2.75
    }
];

// CSS dosyasını oku
let cssContent = '';
try {
    cssContent = fs.readFileSync('style.css', 'utf8');
} catch (error) {
    console.log('⚠️  CSS dosyası okunamadı');
}

// HTML dosyasını oku
let htmlContent = '';
try {
    htmlContent = fs.readFileSync('index.html', 'utf8');
} catch (error) {
    console.log('⚠️  HTML dosyası okunamadı');
}

// Mobil CSS özelliklerini kontrol et
function checkMobileCSSFeatures() {
    console.log('\n🔍 Mobil CSS Özellikleri Kontrolü:');
    
    const checks = [
        { name: 'Responsive viewport meta etiketi', test: htmlContent.includes('viewport') },
        { name: 'Media queries kullanımı', test: cssContent.includes('@media') },
        { name: 'Touch-friendly boyutlar', test: cssContent.includes('min-width:') || cssContent.includes('max-width:') },
        { name: 'Responsive font boyutları', test: cssContent.includes('rem') || cssContent.includes('em') },
        { name: 'Flexible box model', test: cssContent.includes('flex') },
        { name: 'Mobile-first tasarım', test: cssContent.includes('@media screen and (max-width') },
        { name: 'Responsive resimler', test: cssContent.includes('max-width: 100%') },
        { name: 'Mobile animasyonlar', test: cssContent.includes(':active') || cssContent.includes(':hover') },
        { name: 'Mobile buton stilleri', test: cssContent.includes('padding') && cssContent.includes('border-radius') },
        { name: 'Mobile metin okunabilirliği', test: cssContent.includes('font-size') && cssContent.includes('line-height') }
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
    
    console.log(`\n📊 Mobil CSS Özellikleri: ${passed}/${checks.length} kontrol başarılı`);
    return passed >= checks.length * 0.8; // %80 başarı oranı
}

// Mobil JavaScript özelliklerini kontrol et
function checkMobileJavaScriptFeatures() {
    console.log('\n🔍 Mobil JavaScript Özellikleri Kontrolü:');
    
    const jsContent = fs.readFileSync('script.js', 'utf8');
    
    const checks = [
        { name: 'Touch event desteği', test: jsContent.includes('touchstart') || jsContent.includes('ontouchstart') },
        { name: 'Responsive boyut kontrolü', test: jsContent.includes('innerWidth') || jsContent.includes('offsetWidth') },
        { name: 'Mobile performans optimizasyonu', test: jsContent.includes('requestAnimationFrame') || jsContent.includes('debounce') },
        { name: 'Mobile geri butonu desteği', test: jsContent.includes('popstate') || jsContent.includes('hashchange') },
        { name: 'Mobile kaydırma optimizasyonu', test: jsContent.includes('scroll') || jsContent.includes('touchmove') }
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
    
    console.log(`\n📊 Mobil JavaScript Özellikleri: ${passed}/${checks.length} kontrol başarılı`);
    return passed >= checks.length * 0.6; // %60 başarı oranı (bazı özellikler opsiyonel)
}

// HTML mobil uyumluluğunu kontrol et
function checkMobileHTMLStructure() {
    console.log('\n🔍 Mobil HTML Yapısı Kontrolü:');
    
    const checks = [
        { name: 'Viewport meta etiketi', test: htmlContent.includes('name="viewport"') },
        { name: 'Touch-friendly elementler', test: htmlContent.includes('button') || htmlContent.includes('input') },
        { name: 'Mobile-friendly form yapısı', test: htmlContent.includes('form') },
        { name: 'Accessible HTML yapısı', test: htmlContent.includes('alt=') || htmlContent.includes('aria-label') },
        { name: 'Mobile-friendly tab yapısı', test: htmlContent.includes('select') || htmlContent.includes('option') }
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
    
    console.log(`\n📊 Mobil HTML Yapısı: ${passed}/${checks.length} kontrol başarılı`);
    return passed >= checks.length * 0.8; // %80 başarı oranı
}

// Performans optimizasyonlarını kontrol et
function checkMobilePerformance() {
    console.log('\n⚡ Mobil Performans Optimizasyonları:');
    
    const jsContent = fs.readFileSync('script.js', 'utf8');
    const cssContent = fs.readFileSync('style.css', 'utf8');
    
    const checks = [
        { name: 'CSS minifikasyonu', test: !cssContent.includes('\n\n') && !cssContent.includes('  ') },
        { name: 'JavaScript minifikasyonu', test: !jsContent.includes('\n\n') && !jsContent.includes('  ') },
        { name: 'Resim optimizasyonu', test: htmlContent.includes('loading="lazy"') || htmlContent.includes('srcset') },
        { name: 'Font optimizasyonu', test: cssContent.includes('font-display: swap') },
        { name: 'Lazy loading', test: jsContent.includes('IntersectionObserver') || jsContent.includes('loading="lazy"') },
        { name: 'Mobile caching', test: jsContent.includes('localStorage') || jsContent.includes('sessionStorage') }
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
    
    console.log(`\n📊 Mobil Performans: ${passed}/${checks.length} kontrol başarılı`);
    return passed >= checks.length * 0.6; // %60 başarı oranı
}

// Mobil cihaz senaryolarını test et
function testMobileScenarios() {
    console.log('\n📱 Mobil Cihaz Senaryoları:');
    
    mobileScenarios.forEach(scenario => {
        console.log(`\n📱 ${scenario.name} (${scenario.width}x${scenario.height}):`);
        
        // CSS breakpoint kontrolü
        const hasBreakpoint = cssContent.includes(`@media (max-width: ${scenario.width}px)`) || 
                             cssContent.includes(`@media (min-width: ${scenario.width}px)`);
        
        if (hasBreakpoint) {
            console.log(`  ✅ Özel breakpoint: ${scenario.width}px`);
        } else {
            console.log(`  ⚠️  Özel breakpoint yok: ${scenario.width}px`);
        }
        
        // Genel mobil uyumluluk kontrolü
        const mobileFriendly = cssContent.includes('flex') && cssContent.includes('rem') && 
                              cssContent.includes('max-width: 100%');
        
        if (mobileFriendly) {
            console.log(`  ✅ Mobil uyumlu`);
        } else {
            console.log(`  ❌ Mobil uyumsuz`);
        }
    });
}

// Testleri çalıştır
function runTests() {
    console.log('='.repeat(50));
    
    const cssOk = checkMobileCSSFeatures();
    const jsOk = checkMobileJavaScriptFeatures();
    const htmlOk = checkMobileHTMLStructure();
    const performanceOk = checkMobilePerformance();
    
    testMobileScenarios();
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 TOPLAM MOBİL SONUÇLAR');
    console.log('='.repeat(50));
    
    const results = [
        { name: 'Mobil CSS Özellikleri', status: cssOk },
        { name: 'Mobil JavaScript Özellikleri', status: jsOk },
        { name: 'Mobil HTML Yapısı', status: htmlOk },
        { name: 'Mobil Performans', status: performanceOk }
    ];
    
    const passedTests = results.filter(r => r.status).length;
    const totalTests = results.length;
    
    results.forEach(result => {
        console.log(`${result.status ? '✅' : '❌'} ${result.name}`);
    });
    
    console.log(`\n🎯 Genel Mobil Başarı Oranı: ${passedTests}/${totalTests} (${(passedTests/totalTests*100).toFixed(1)}%)`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 Tüm mobil testler başarılı! Uygulama mobil uyumluluk açısından hazır.');
        process.exit(0);
    } else if (passedTests >= totalTests * 0.75) {
        console.log('\n⚠️  Çoğunlukla mobil uyumlu. Bazı iyileştirmeler yapılabilir.');
        process.exit(1);
    } else {
        console.log('\n❌ Ciddi mobil uyumsuzluklar var. Düzeltmeler gerekiyor.');
        process.exit(2);
    }
}

// Testleri çalıştır
runTests();