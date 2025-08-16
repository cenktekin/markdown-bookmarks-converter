class BookmarksConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.discoverMarkdownFiles();
    }

    initializeElements() {
        // Form elemanları
        this.readmeFileSelect = document.getElementById('readme-file');
        this.readmeUpload = document.getElementById('readme-upload');
        this.outputFileInput = document.getElementById('output-file');
        this.titleInput = document.getElementById('title');
        this.rootCategoryInput = document.getElementById('root-category');
        this.convertBtn = document.getElementById('convert-btn');
        this.saveToFolderBtn = document.getElementById('save-to-folder-btn');
        
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
        this.generatedContent = '';

        // Yerel dosya durumu
        this.localFileContent = null;
        this.localFileName = null;

        // Hedef klasör (File System Access API)
        this.dirHandle = null;
    }

    bindEvents() {
        this.convertBtn.addEventListener('click', () => this.startConversion());
        if (this.saveToFolderBtn) {
            this.saveToFolderBtn.addEventListener('click', () => this.saveFileToFolder());
        }
        
        // Form değişikliklerinde buton durumunu güncelle
        [this.readmeFileSelect, this.outputFileInput, this.titleInput, this.rootCategoryInput].forEach(element => {
            element.addEventListener('change', () => this.updateConvertButtonState());
            element.addEventListener('input', () => this.updateConvertButtonState());
        });

        // Yerel dosya seçimini dinle
        if (this.readmeUpload) {
            this.readmeUpload.addEventListener('change', (e) => this.handleLocalFileSelect(e));
        }
    }

    async discoverMarkdownFiles() {
        // Sade liste: yalnızca kök dizindeki README.md
        this.populateFileSelect(['README.md']);
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
        const hasAnyReadme = !!this.localFileContent || !!(this.readmeFileSelect && this.readmeFileSelect.value);
        const hasInput = hasAnyReadme && this.outputFileInput.value.trim();
        this.convertBtn.disabled = !hasInput;
    }

    handleLocalFileSelect(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) {
            this.localFileContent = null;
            this.localFileName = null;
            this.updateConvertButtonState();
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            this.localFileContent = reader.result || '';
            this.localFileName = file.name;
            // Seçim kutusunu görsel olarak güncelle (bilgi amaçlı)
            if (this.readmeFileSelect) {
                // Değer aynı kalsın; yerel dosya öncelikli kullanılacak
            }
            this.addLog(`Yerel dosya seçildi: ${file.name} (${file.size} bayt)`, 'info');
            this.updateConvertButtonState();
        };
        reader.onerror = () => {
            this.localFileContent = null;
            this.localFileName = null;
            this.addLog('Yerel dosya okunamadı.', 'error');
            this.updateConvertButtonState();
        };
        reader.readAsText(file);
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
        const readmeFile = this.readmeFileSelect ? this.readmeFileSelect.value : '';
        const outputFile = this.outputFileInput.value.trim();
        const title = this.titleInput.value.trim();
        const rootCategory = this.rootCategoryInput.value.trim();

        // Yerel dosya varsa, seçim zorunlu değil
        if (!this.localFileContent && !readmeFile) {
            this.addLog('Lütfen bir README dosyası seçin veya yerel dosya yükleyin.', 'error');
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
            input: this.readmeFileSelect ? this.readmeFileSelect.value : '',
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
            if (this.localFileContent) {
                readmeContent = this.localFileContent;
                this.addLog(`Yerel dosya içeriği kullanılacak${this.localFileName ? `: ${this.localFileName}` : ''}`, 'info');
            } else if (formData.input === 'test_readme.md') {
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
            this.generatedContent = bookmarksContent;
            
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

    async saveFileToFolder() {
        try {
            if (!this.generatedContent) {
                this.addLog('Kaydedilecek içerik bulunamadı. Önce dönüştürme yapın.', 'error');
                return;
            }
            const suggestedName = (this.outputFileInput.value.trim() || 'bookmarks.html').replace(/\s+/g, '_');
            // Öncelikle bir hedef klasör seçildiyse oraya direkt yazalım
            if (this.dirHandle && (await this.verifyDirPermission(this.dirHandle))) {
                const fileHandle = await this.dirHandle.getFileHandle(suggestedName, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(new Blob([this.generatedContent], { type: 'text/html;charset=utf-8' }));
                await writable.close();
                this.addLog(`Dosya klasöre kaydedildi: ${suggestedName}`, 'success');
                return;
            }

            // Klasör seçilmemişse showSaveFilePicker deneyelim
            if (window.showSaveFilePicker) {
                const handle = await window.showSaveFilePicker({
                    suggestedName,
                    types: [
                        {
                            description: 'HTML Bookmarks',
                            accept: { 'text/html': ['.html', '.htm'] }
                        }
                    ]
                });
                const writable = await handle.createWritable();
                await writable.write(new Blob([this.generatedContent], { type: 'text/html;charset=utf-8' }));
                await writable.close();
                this.addLog(`Dosya kaydedildi: ${handle.name}`, 'success');
            } else {
                // Destek yoksa normal indirme ile geri dön
                this.addLog('Tarayıcı yerel kaydetmeyi desteklemiyor. Lütfen Chromium tabanlı bir tarayıcı kullanın.', 'error');
                this.generatedFilePath = URL.createObjectURL(new Blob([this.generatedContent], { type: 'text/html;charset=utf-8' }));
            }
        } catch (err) {
            this.addLog(`Klasöre kaydetme başarısız: ${err.message}`, 'error');
        }
    }

    async verifyDirPermission(dirHandle) {
        if (!dirHandle) return false;
        const opts = { mode: 'readwrite' };
        if (await dirHandle.queryPermission(opts) === 'granted') return true;
        if (await dirHandle.requestPermission(opts) === 'granted') return true;
        return false;
    }

    // Klasör etiketi yönetimi kaldırıldı (UI sadeleştirildi)

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