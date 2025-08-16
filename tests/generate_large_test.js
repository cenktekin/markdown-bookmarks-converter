const fs = require('fs');

console.log('Büyük test dosyası oluşturuluyor...');

// Büyük bir markdown dosyası oluştur
const categories = [
    'Web Servisleri',
    'Araçlar',
    'Öğrenme Kaynakları',
    'Teknoloji Blogları',
    'Open Source Projeler',
    'API Dokümantasyonları',
    'Kütüphaneler',
    'Framework\'ler',
    'Veritabanları',
    'Cloud Servisleri'
];

const links = [
    'https://www.google.com',
    'https://github.com',
    'https://stackoverflow.com',
    'https://developer.mozilla.org',
    'https://www.w3schools.com',
    'https://code.visualstudio.com',
    'https://www.npmjs.com',
    'https://nodejs.org',
    'https://reactjs.org',
    'https://vuejs.org',
    'https://angular.io',
    'https://jquery.com',
    'https://lodash.com',
    'https://axios.com',
    'https://expressjs.com',
    'https://mongodb.com',
    'https://postgresql.org',
    'https://redis.io',
    'https://aws.amazon.com',
    'https://azure.microsoft.com'
];

let content = '# Büyük Test Dosyası\n\n';
content += 'Bu dosya, performans testi için büyük bir içerik içerir.\n\n';

// 10.000 satırlık içerik oluştur
for (let i = 0; i < 1000; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    content += `## ${category} ${i + 1}\n\n`;
    
    // Her kategori için 10 link ekle
    for (let j = 0; j < 10; j++) {
        const link = links[Math.floor(Math.random() * links.length)];
        const title = `Link ${i + 1}-${j + 1}`;
        content += `- [${title}](${link})\n`;
    }
    
    content += '\n';
}

// Dosyayı yaz
fs.writeFileSync('test_large.md', content, 'utf8');

console.log('Büyük test dosyası oluşturuldu: test_large.md');
console.log(`Dosya boyutu: ${fs.statSync('test_large.md').size} bayt`);
console.log(`Satır sayısı: ${content.split('\n').length}`);