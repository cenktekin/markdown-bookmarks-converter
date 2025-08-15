class BookmarksConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.discoverMarkdownFiles();
    }

    initializeElements() {
        // Form elemanları
        this.readmeFileSelect = document.getElementById('readme-file');
        this.outputFileInput = document.getElementById('output-file');
        this.titleInput = document.getElementById('title');
        this.rootCategoryInput = document.getElementById('root-category');
        this.convertBtn = document.getElementById('convert-btn');
        this.downloadBtn = document.getElementById('download-btn');
        
        // Durum elemanları
        this.progressSection = document.getElementById('progress-section');
        this.progressBar = document.querySelector('.progress-fill');
        this.logMessages = document.getElementById('log-messages');
        this.resultSection = document.getElementById('result-section');
        
        // Buton metinleri
        this.btnText = document.querySelector('.btn-text');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        
        // Oluşturulan dosya yolu
        this.generatedFilePath = '';
    }

    bindEvents() {
        this.convertBtn.addEventListener('click', () => this.startConversion());
        this.downloadBtn.addEventListener('click', () => this.downloadFile());
        
        // Form değişikliklerinde buton durumunu güncelle
        [this.readmeFileSelect, this.outputFileInput, this.titleInput, this.rootCategoryInput].forEach(element => {
            element.addEventListener('change', () => this.updateConvertButtonState());
            element.addEventListener('input', () => this.updateConvertButtonState());
        });
    }

    async discoverMarkdownFiles() {
        try {
            // Web ortamında mevcut markdown dosyalarını varsayılan olarak ayarla
            const markdownFiles = ['README.md', 'test_readme.md', 'test_bookmarks.md', 'test_bookmarks2.md', 'test_invalid_format.txt', 'test_empty.md', 'test_special_chars.md', 'test_large.md'];
            this.populateFileSelect(markdownFiles);
        } catch (error) {
            console.log('Dosya listesi alınamadı, varsayılan dosya kullanılacak:', error);
            this.populateFileSelect(['README.md']);
        }
    }

    populateFileSelect(files) {
        // Mevcut seçenekleri temizle (varsayılan hariç)
        const defaultOption = this.readmeFileSelect.querySelector('option[value="README.md"]');
        this.readmeFileSelect.innerHTML = '';
        this.readmeFileSelect.appendChild(defaultOption);
        
        // Dosya listesini ekle
        files.forEach(file => {
            if (file.endsWith('.md') || file.endsWith('.markdown') || file.endsWith('.txt')) {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                this.readmeFileSelect.appendChild(option);
            }
        });
        
        this.updateConvertButtonState();
    }

    updateConvertButtonState() {
        const hasInput = this.readmeFileSelect.value && this.outputFileInput.value.trim();
        this.convertBtn.disabled = !hasInput;
    }

    async startConversion() {
        if (!this.validateInputs()) {
            return;
        }

        this.setLoadingState(true);
        this.clearLogs();
        this.showProgress();
        
        try {
            const formData = this.getFormData();
            await this.convertToBookmarks(formData);
            this.showSuccess();
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoadingState(false);
        }
    }

    validateInputs() {
        const readmeFile = this.readmeFileSelect.value;
        const outputFile = this.outputFileInput.value.trim();
        const title = this.titleInput.value.trim();
        const rootCategory = this.rootCategoryInput.value.trim();

        if (!readmeFile) {
            this.addLog('Lütfen bir README dosyası seçin.', 'error');
            return false;
        }

        if (!outputFile) {
            this.addLog('Lütfen çıktı dosya adı girin.', 'error');
            return false;
        }

        if (!title) {
            this.addLog('Lütfen yer imleri başlığı girin.', 'error');
            return false;
        }

        if (!rootCategory) {
            this.addLog('Lütfen ana kategori adı girin.', 'error');
            return false;
        }

        return true;
    }

    getFormData() {
        return {
            input: this.readmeFileSelect.value,
            output: this.outputFileInput.value.trim(),
            title: this.titleInput.value.trim(),
            rootCategory: this.rootCategoryInput.value.trim()
        };
    }

    async convertToBookmarks(formData) {
        this.addLog('Dönüştürme işlemi başlatıldı...', 'info');
        this.updateProgress(10);

        try {
            // Web ortamında README dosyasını oku - test için sabit içerik
            let readmeContent = '';
            
            // Seçilen dosyaya göre içerik belirle
            if (formData.input === 'test_readme.md') {
                readmeContent = `# Test Projesi

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
            } else if (formData.input === 'test_invalid_format.txt') {
                readmeContent = `Bu geçersiz bir formattadır.
Gerçek markdown formatı değildir.

# Başlık
- [Link](https://example.com)
Bu bir link değildir.

## Alt Başlık
Normal metin`;
            } else if (formData.input === 'test_empty.md') {
                readmeContent = '';
            } else if (formData.input === 'test_special_chars.md') {
                readmeContent = `# Özel Karakter Testi

Bu bir başlıktır: Türkçe karakterler: ç, ğ, ı, ö, ş, ü

## Linkler
- [Google](https://www.google.com/search?q=türkçe+arama)
- [GitHub](https://github.com/özeldosya)
- [Stack Overflow](https://stackoverflow.com/questions?q=javascript)

### Özel URL'ler
- [URL with spaces](https://example.com/path with spaces/file.html)
- [URL with params](https://example.com/test?param1=value1&param2=value2)
- [URL with hash](https://example.com/page#section1)

## Metinler
Bu metinlerde özel karakterler var: 123, @, #, $, %, ^, &, *, (, ), -, +, =, {, }, [, ], |, \\, :, ;, ", ', <, >, ,, ., /, ?, ~, \``;
            } else if (formData.input === 'README.md') {
                // README.md dosyasının içeriğini oku
                const response = await fetch('/README.md');
                if (response.ok) {
                    readmeContent = await response.text();
                } else {
                    throw new Error('README.md dosyası okunamadı');
                }
            } else {
                throw new Error(`Desteklenmeyen dosya: ${formData.input}`);
            }
            
            this.addLog('README dosyası başarıyla okundu', 'success');
            this.updateProgress(30);

            // README içeriğini işle ve HTML bookmarks oluştur
            const bookmarksContent = this.processReadmeToBookmarks(readmeContent, formData.title, formData.rootCategory);
            
            this.addLog('HTML bookmarks dosyası oluşturuluyor...', 'info');
            this.updateProgress(70);

            // Dosya içeriğini blob olarak oluştur
            const blob = new Blob([bookmarksContent], { type: 'text/html;charset=utf-8' });
            this.generatedFilePath = URL.createObjectURL(blob);
            
            this.addLog('Dosya başarıyla oluşturuldu!', 'success');
            this.updateProgress(100);
            
        } catch (error) {
            this.addLog(`Dönüştürme sırasında hata oluştu: ${error.message}`, 'error');
            throw new Error(`Dönüştürme sırasında hata oluştu: ${error.message}`);
        }
    }

    processReadmeToBookmarks(readmeContent, title, rootCategory) {
        // HTML bookmarks formatı oluştur - Netscape standardına uygun
        const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
        let bookmarksHTML = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>${title}</TITLE>
<H1>${title}</H1>
<DL><p>
    <DT><H3 ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}" PERSONAL_TOOLBAR_FOLDER="true">${rootCategory}</H3>
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
                bookmarksHTML += `        <DT><H3 ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}">${currentCategory}</H3>\n`;
                bookmarksHTML += `        <DL><p>\n`;
            }
            // Alt başlık satırlarını kategori olarak ekle
            else if (line.startsWith('## ')) {
                currentCategory = line.substring(3).trim();
                bookmarksHTML += `        <DT><H3 ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}">${currentCategory}</H3>\n`;
                bookmarksHTML += `        <DL><p>\n`;
            }
            // Linkleri yer imi olarak ekle
            else if (line.startsWith('- [') || line.startsWith('* [')) {
                const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
                if (linkMatch) {
                    const linkText = linkMatch[1];
                    const linkUrl = linkMatch[2];
                    bookmarksHTML += `        <DT><A HREF="${linkUrl}" ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}">${linkText}</A>\n`;
                }
            }
            // Doğrudan linkleri ekle
            else if (line.startsWith('http://') || line.startsWith('https://')) {
                const linkText = line.replace(/^https?:\/\//, '').split('/')[0];
                bookmarksHTML += `        <DT><A HREF="${line}" ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}">${linkText}</A>\n`;
            }
        }
        
        bookmarksHTML += `    </DL><p>\n</DL><p>\n</DL><p>`;
        
        return bookmarksHTML;
    }

    showProgress() {
        this.progressSection.style.display = 'block';
        this.resultSection.style.display = 'none';
        this.progressBar.style.width = '0%';
    }

    updateProgress(percentage) {
        this.progressBar.style.width = `${percentage}%`;
    }

    showSuccess() {
        this.progressSection.style.display = 'none';
        this.resultSection.style.display = 'block';
        this.downloadBtn.style.display = 'inline-block';
        
        if (this.generatedFilePath) {
            this.downloadBtn.onclick = () => this.downloadFile();
        }
    }

    showError(message) {
        this.addLog(`Hata: ${message}`, 'error');
        this.progressSection.style.display = 'none';
        this.resultSection.style.display = 'block';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <h3>❌ İşlem Başarısız!</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="retry-btn">Tekrar Dene</button>
        `;
        
        this.resultSection.innerHTML = '';
        this.resultSection.appendChild(errorDiv);
    }

    downloadFile() {
        if (this.generatedFilePath) {
            const link = document.createElement('a');
            link.href = this.generatedFilePath;
            // Dosya adını çıktı dosya adından al
            const fileName = this.outputFileInput.value.trim() || 'bookmarks.html';
            link.download = fileName;
            link.click();
        }
    }

    setLoadingState(isLoading) {
        this.convertBtn.disabled = isLoading;
        this.btnText.style.display = isLoading ? 'none' : 'inline';
        this.loadingSpinner.style.display = isLoading ? 'inline-block' : 'none';
    }

    clearLogs() {
        this.logMessages.innerHTML = '';
    }

    addLog(message, type = 'info') {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        
        const timestamp = new Date().toLocaleTimeString('tr-TR');
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        this.logMessages.appendChild(logEntry);
        this.logMessages.scrollTop = this.logMessages.scrollHeight;
        
        // Konsola da logla
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    new BookmarksConverter();
});

// Hata yönetimi
window.addEventListener('error', (event) => {
    console.error('Global hata:', event.error);
});

// Promise hatalarını yakala
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise reddedildi:', event.reason);
});

// Tarayıcı uyumluluk kontrolü
if (typeof window !== 'undefined' && !window.fetch) {
    document.addEventListener('DOMContentLoaded', () => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #f5c6cb;
        `;
        errorDiv.innerHTML = `
            <h3>Tarayıcı Uyumsuzluğu</h3>
            <p>Tarayıcınız modern web özelliklerini desteklemiyor. Lütfen güncel bir tarayıcı kullanın (Chrome, Firefox, Safari, Edge).</p>
        `;
        
        const container = document.querySelector('.main-content');
        container.insertBefore(errorDiv, container.firstChild);
    });
}