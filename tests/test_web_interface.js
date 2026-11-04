// Ortak dönüştürücünün davranış testleri
const assert = require('assert');
const path = require('path');
const { processReadmeToBookmarks } = require(path.join(__dirname, '..', 'converter.js'));

const testReadmeContent = `# Test Projesi

Bu bir test README dosyasıdır.

## Web Servisleri

- [Google](https://www.google.com)
- [GitHub](https://github.com)
- [Stack Overflow](https://stackoverflow.com)

## Araçlar

- [VS Code](https://code.visualstudio.com)
- [Chrome](https://www.google.com/chrome)

## Öğrenme Kaynakları

- [MDN Web Docs](https://developer.mozilla.org)
- [W3Schools](https://www.w3schools.com)`;

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

console.log('Web arayüzü testi başlatılıyor...');

const html = processReadmeToBookmarks(testReadmeContent, 'Test Bookmarks', 'Test Kategori');

check('Netscape DOCTYPE üretiliyor', () => {
    assert.ok(html.startsWith('<!DOCTYPE NETSCAPE-Bookmark-file-1>'));
});

check('Kök kategori ve 3 bölüm kategorisi var', () => {
    assert.strictEqual((html.match(/<DT><H3 /g) || []).length, 4);
});

check('7 link yer imine dönüşüyor', () => {
    assert.strictEqual((html.match(/<DT><A HREF=/g) || []).length, 7);
});

check('DL etiketleri dengeli', () => {
    const opened = (html.match(/<DL><p>/g) || []).length;
    const closed = (html.match(/<\/DL><p>/g) || []).length;
    assert.strictEqual(opened, closed);
});

check('Başlık ve kategori HTML escape ediliyor', () => {
    const escaped = processReadmeToBookmarks(
        '# <script>alert(1)</script>\n- [x](https://example.com)',
        '</TITLE><script>alert("t")</script>',
        '<img src=x onerror=alert(1)>'
    );
    assert.ok(!escaped.includes('<script>'));
    assert.ok(escaped.includes('&lt;script&gt;'));
    assert.ok(escaped.includes('&quot;t&quot;'));
});

check('# seviye-1 başlık da kategori üretiyor (orphan yok)', () => {
    const single = processReadmeToBookmarks('# Ana Baslik\n- [Link](https://example.com)', 'T', 'R');
    assert.ok(single.includes('>Ana Baslik</H3>'));
});

check('##/### hiyerarşisi iç içe açılıyor', () => {
    const nested = processReadmeToBookmarks(
        '## Ust\n- [A](https://a.example)\n### Alt\n- [B](https://b.example)',
        'T',
        'R'
    );
    const upperIndex = nested.indexOf('>Ust</H3>');
    const lowerIndex = nested.indexOf('>Alt</H3>');
    assert.ok(upperIndex > -1 && lowerIndex > upperIndex);
    const between = nested.slice(upperIndex, lowerIndex);
    assert.ok(between.includes('<DL><p>'));
    assert.ok(!between.includes('</DL><p>'));
});

console.log('\n' + '='.repeat(50));
if (failures === 0) {
    console.log('🎉 Web arayüzü testleri başarılı');
    process.exit(0);
}
console.log(`❌ ${failures} test başarısız`);
process.exit(1);
