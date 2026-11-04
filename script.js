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
            let readmeContent = this.localFileContent;

            if (readmeContent != null) {
                this.addLog(`Yerel dosya içeriği kullanılacak${this.localFileName ? `: ${this.localFileName}` : ''}`, 'info');
            } else {
                const response = await fetch('./README.md');
                if (!response.ok) {
                    throw new Error('README.md dosyası okunamadı');
                }
                readmeContent = await response.text();
            }

            this.addLog('README dosyası başarıyla okundu', 'success');
            this.updateProgress(30);

            // README içeriğini işle ve HTML bookmarks oluştur
            const bookmarksContent = window.MarkdownBookmarks.processReadmeToBookmarks(
                readmeContent,
                formData.title,
                formData.rootCategory
            );
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

        const heading = document.createElement('h3');
        heading.textContent = '❌ İşlem Başarısız!';
        const paragraph = document.createElement('p');
        paragraph.textContent = message;
        const retryButton = document.createElement('button');
        retryButton.className = 'retry-btn';
        retryButton.textContent = 'Tekrar Dene';
        retryButton.addEventListener('click', () => location.reload());

        errorDiv.append(heading, paragraph, retryButton);
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
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = message;

        if (this.logMessages) {
            this.logMessages.appendChild(logEntry);
            this.logMessages.scrollTop = this.logMessages.scrollHeight;
        }

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