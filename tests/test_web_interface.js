// Web arayüzünü test etmek için basit bir betik
const fs = require('fs');
const path = require('path');

// Test için README içeriği
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

// Test için HTML bookmarks formatı oluşturan fonksiyon
function processReadmeToBookmarks(readmeContent, title, rootCategory) {
    // HTML bookmarks formatı oluştur
    let bookmarksHTML = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>${title}</TITLE>
<H1>${title}</H1>
<DL><p>
    <DT><H3 ADD_DATE="${Date.now()}" LAST_MODIFIED="${Date.now()}" PERSONAL_TOOLBAR_FOLDER="true">${rootCategory}</H3>
    <DL><p>
`;

    // README içeriğini satır satır işle
    const lines = readmeContent.split('\n');
    let currentCategory = '';
    let inCodeBlock = false;
    
    for (let line of lines) {
        line = line.trim();
        
        // Kod bloklarını atla
        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) continue;
        
        // Başlık satırlarını kategori olarak ekle
        if (line.startsWith('# ')) {
            currentCategory = line.substring(2).trim();
            bookmarksHTML += `        <DT><H3 ADD_DATE="${Date.now()}" LAST_MODIFIED="${Date.now()}">${currentCategory}</H3>\n`;
            bookmarksHTML += `        <DL><p>\n`;
        }
        // Alt başlık satırlarını kategori olarak ekle
        else if (line.startsWith('## ')) {
            currentCategory = line.substring(3).trim();
            bookmarksHTML += `        <DT><H3 ADD_DATE="${Date.now()}" LAST_MODIFIED="${Date.now()}">${currentCategory}</H3>\n`;
            bookmarksHTML += `        <DL><p>\n`;
        }
        // Linkleri yer imi olarak ekle
        else if (line.startsWith('- [') || line.startsWith('* [')) {
            const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch) {
                const linkText = linkMatch[1];
                const linkUrl = linkMatch[2];
                bookmarksHTML += `        <DT><A HREF="${linkUrl}" ADD_DATE="${Date.now()}" LAST_MODIFIED="${Date.now()}">${linkText}</A>\n`;
            }
        }
        // Doğrudan linkleri ekle
        else if (line.startsWith('http://') || line.startsWith('https://')) {
            const linkText = line.replace(/^https?:\/\//, '').split('/')[0];
            bookmarksHTML += `        <DT><A HREF="${line}" ADD_DATE="${Date.now()}" LAST_MODIFIED="${Date.now()}">${linkText}</A>\n`;
        }
    }
    
    bookmarksHTML += `    </DL><p>\n</DL><p>\n</DL><p>`;
    
    return bookmarksHTML;
}

// Testi çalıştır
console.log('Web arayüzü testi başlatılıyor...');

// Test için HTML bookmarks oluştur
const bookmarksContent = processReadmeToBookmarks(
    testReadmeContent,
    'Test Bookmarks',
    'Test Kategori'
);

// Test dosyasını kaydet
const testOutputPath = path.join(__dirname, 'test_bookmarks_from_web.html');
fs.writeFileSync(testOutputPath, bookmarksContent, 'utf8');

console.log(`✅ Test başarıyla tamamlandı!`);
console.log(`📁 Oluşturulan dosya: ${testOutputPath}`);
console.log(`📊 Dosya boyutu: ${fs.statSync(testOutputPath).size} bayt`);

// Oluşturulan dosyanın içeriğini kontrol et
console.log('\n📋 Oluşturulan HTML bookmarks dosyasının içeriği:');
console.log(bookmarksContent.substring(0, 500) + '...');

console.log('\n🎉 Web arayüzü testi başarıyla tamamlandı!');