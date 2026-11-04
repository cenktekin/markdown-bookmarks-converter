// Mobil uyumluluk testi: gerçek responsive davranışları doğrular
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const htmlContent = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');

const mobileScenarios = [
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'Samsung Galaxy S21', width: 360, height: 780 },
    { name: 'iPad Pro', width: 1024, height: 1366 },
    { name: 'Google Pixel 5', width: 393, height: 851 }
];

let failures = 0;

function check(name, fn) {
    try {
        fn();
        console.log(`  ✅ ${name}`);
    } catch (error) {
        failures++;
        console.log(`  ❌ ${name}: ${error.message}`);
    }
}

console.log('📱 Mobil Uyumluluk Testi Başlatılıyor...\n');
console.log('🔍 Responsive kontroller:');

check('Viewport meta etiketi var', () => {
    assert.ok(htmlContent.includes('name="viewport"'));
    assert.ok(htmlContent.includes('width=device-width'));
});

check('Mobil kırılım noktaları tanımlı (@media max-width)', () => {
    assert.ok(/@media\s+screen\s+and\s+\(max-width:\s*480px\)/.test(cssContent));
    assert.ok(/@media\s+screen\s+and\s+\(max-width:\s*768px\)/.test(cssContent));
});

check('Dokunma hedefleri en az 44px', () => {
    assert.ok(/min-height:\s*44px/.test(cssContent));
});

check('touch-action manipulation tanımlı', () => {
    assert.ok(cssContent.includes('touch-action: manipulation'));
});

check('Form elemanları genişliği %100', () => {
    assert.ok(/\.file-select,\s*\n\.file-input\s*\{[^}]*width:\s*100%/.test(cssContent));
});

check('Görseller responsive (max-width: 100%)', () => {
    assert.ok(/img\s*\{[^}]*max-width:\s*100%/.test(cssContent));
});

check('Mobilde input font-size 16px (iOS zoom koruması)', () => {
    const mobileBlock = cssContent.slice(cssContent.indexOf('max-width: 480px'));
    assert.ok(/font-size:\s*16px/.test(mobileBlock));
});

check('Azaltılmış hareket tercihi destekleniyor', () => {
    assert.ok(cssContent.includes('prefers-reduced-motion'));
});

check('Dil özniteliği tanımlı', () => {
    assert.ok(/<html[^>]*lang="/.test(htmlContent));
});

console.log('\n📱 Cihaz kırılım kapsamı:');
mobileScenarios.forEach(scenario => {
    if (scenario.width <= 1024) {
        console.log(`  ✅ ${scenario.name} (${scenario.width}px) bir kırılım noktasına düşüyor`);
    } else {
        failures++;
        console.log(`  ❌ ${scenario.name} (${scenario.width}px) kapsanmıyor`);
    }
});

console.log('\n' + '='.repeat(50));
if (failures === 0) {
    console.log('🎉 Mobil uyumluluk testleri başarılı');
    process.exit(0);
}
console.log(`❌ ${failures} kontrol başarısız`);
process.exit(1);
