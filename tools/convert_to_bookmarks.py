#!/usr/bin/env python3
"""
README.md dosyasını okuyarak browser bookmarks formatında HTML dosyası oluşturur.

Bu betik, markdown formatındaki README dosyasını tarayıcı yer imleri formatına dönüştürür.
## ve ### başlıklarını kategori ve alt kategori olarak işler, markdown linklerini yer imlerine dönüştürür.

Kullanım:
    python convert_to_bookmarks.py [SEÇENEKLER]

Seçenekler:
    -i, --input      Girdi markdown dosyası yolu (varsayılan: README.md)
    -o, --output     Çıktı HTML dosyası yolu (varsayılan: bookmarks.html)
    -t, --title      Yer imleri dosyası başlığı (varsayılan: Bookmarks)
    -v, --verbose    Detaylı çıktı modu
    -h, --help       Bu yardım mesajını göster
"""

import argparse
import logging
import re
import sys
from datetime import datetime
from html import escape
from pathlib import Path
from typing import List, Dict, Tuple, Optional


def setup_logging(verbose: bool = False) -> None:
    """Loglama ayarlarını yapılandırır."""
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )


def validate_file_path(file_path: Path, file_type: str = "dosya") -> Path:
    """Dosya yolunun geçerliliğini kontrol eder."""
    if not file_path.exists():
        raise FileNotFoundError(f"{file_type} bulunamadı: {file_path}")
    if not file_path.is_file():
        raise ValueError(f"{file_type} bir dosya değil: {file_path}")
    return file_path


def read_markdown_file(file_path: Path) -> str:
    """Markdown dosyasını okur ve içeriğini döndürür."""
    try:
        validate_file_path(file_path, "Girdi dosyası")
        content = file_path.read_text(encoding='utf-8')
        logging.info(f"Dosya başarıyla okundu: {file_path}")
        return content
    except UnicodeDecodeError:
        logging.error("UTF-8 ile kodlanmamış dosya tespit edildi")
        raise ValueError("Dosya UTF-8 formatında olmalıdır")
    except Exception as e:
        logging.error(f"Dosya okuma hatası: {e}")
        raise


def parse_markdown_sections(content: str) -> List[Dict[str, str]]:
    """
    Markdown içeriğini bölümlere ayırır.
    
    Args:
        content: Markdown içeriği
        
    Returns:
        Bölüm listesi, her bölüm {'title': başlık, 'content': içerik} formatında
    """
    # ## ve ### başlıklarını yakala
    section_pattern = re.compile(r'^(#{1,3})\s+(.+)$', re.MULTILINE)
    
    sections = []
    current_section = None
    current_level = 0
    
    lines = content.split('\n')
    
    for line in lines:
        match = section_pattern.match(line)
        if match:
            # Yeni bölüm bulundu
            level = len(match.group(1))
            title = match.group(2).strip()
            
            # Önceki bölümü kaydet
            if current_section:
                sections.append(current_section)
            
            # Yeni bölümü başlat
            current_section = {
                'title': title,
                'content': '',
                'level': level
            }
            current_level = level
        elif current_section and line.strip():
            # Mevcut bölüme içerik ekle
            current_section['content'] += line + '\n'
    
    # Son bölümü ekle
    if current_section:
        sections.append(current_section)
    
    logging.info(f"Toplam {len(sections)} bölüm bulundu")
    return sections


def extract_links_from_content(content: str) -> List[Tuple[str, str]]:
    """
    Markdown içeriğinden linkleri çıkarır.
    
    Gelişmiş regex patterni ile:
    - [](https://...) formatındaki linkleri yakalar
    - Boşlukları ve özel karakterleri doğru işler
    - URL'leri ve başlıkları ayrı ayrı döndürür
    
    Args:
        content: Markdown içeriği
        
    Returns:
        (başlık, url) tuple listesi
    """
    # Gelişmiş regex patterni
    link_pattern = re.compile(
        r'\s*[-*+]\s*\[([^\]]*)\]\(([^)]+)\)',  # Markdown listeleri için
        re.MULTILINE
    )
    
    links = []
    for match in link_pattern.finditer(content):
        title = match.group(1).strip()
        url = match.group(2).strip()
        
        # Boş linkleri atla
        if title and url and url.startswith(('http://', 'https://')):
            links.append((title, url))
    
    logging.debug(f"İçerikten {len(links)} link bulundu")
    return links


def generate_timestamp() -> str:
    """Unix zaman damgası formatında string döndürür."""
    return str(int(datetime.now().timestamp()))


def create_bookmark_html(
    sections: List[Dict[str, str]],
    title: str = "Bookmarks",
    root_category: str = "Free for Dev"
) -> str:
    """
    Browser bookmarks HTML formatında içerik oluşturur.
    
    Args:
        sections: Parse edilmiş bölümler
        title: HTML başlığı
        root_category: Ana kategori adı
        
    Returns:
        HTML içeriği
    """
    html_lines = [
        '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
        '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
        f'<TITLE>{escape(title)}</TITLE>',
        '<H1>Bookmarks</H1>',
        '<DL><p>',
        f'<DT><H3 ADD_DATE="{generate_timestamp()}" LAST_MODIFIED="{generate_timestamp()}" PERSONAL_TOOLBAR_FOLDER="true">{escape(root_category)}</H3>',
        '<DL><p>'
    ]
    
    for section in sections:
        section_title = section['title']
        section_content = section['content']
        level = section['level']
        
        # Boş kategorileri atla
        if not section_content.strip():
            logging.debug(f"Boş kategori atlanıyor: {section_title}")
            continue
        
        # Linkleri çıkar
        links = extract_links_from_content(section_content)
        
        if not links:
            logging.debug(f"Link içermeyen kategori atlanıyor: {section_title}")
            continue
        
        # Kategori başlığını ekle
        if level == 2:  ## Ana kategori
            html_lines.append(f'<DT><H3 ADD_DATE="{generate_timestamp()}" LAST_MODIFIED="{generate_timestamp()}">{escape(section_title)}</H3>')
        elif level == 3:  ### Alt kategori
            html_lines.append(f'<DT><H3 ADD_DATE="{generate_timestamp()}" LAST_MODIFIED="{generate_timestamp()}" FOLDER="true">{escape(section_title)}</H3>')
        
        html_lines.append('<DL><p>')
        
        # Linkleri ekle
        for link_title, link_url in links:
            html_lines.append(f'<DT><A HREF="{escape(link_url)}" ADD_DATE="{generate_timestamp()}">{escape(link_title)}</A>')
        
        html_lines.append('</DL><p>')
    
    # Kapanış etiketleri
    html_lines.append('</DL><p></DL><p>')
    
    return '\n'.join(html_lines)


def write_output_file(content: str, output_path: Path) -> None:
    """Çıktı dosyasına yazar."""
    try:
        # Çıktı dizinini oluştur
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Dosyaya yaz
        output_path.write_text(content, encoding='utf-8')
        logging.info(f"Çıktı dosyası başarıyla oluşturuldu: {output_path}")
    except Exception as e:
        logging.error(f"Çıktı dosyası yazma hatası: {e}")
        raise


def main():
    """Ana fonksiyon."""
    parser = argparse.ArgumentParser(
        description='README.md dosyasını browser bookmarks formatına dönüştürür',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    
    parser.add_argument(
        '-i', '--input',
        type=Path,
        default=Path('README.md'),
        help='Girdi markdown dosyası yolu (varsayılan: README.md)'
    )
    
    parser.add_argument(
        '-o', '--output',
        type=Path,
        default=Path('bookmarks.html'),
        help='Çıktı HTML dosyası yolu (varsayılan: bookmarks.html)'
    )
    
    parser.add_argument(
        '-t', '--title',
        type=str,
        default='Bookmarks',
        help='Yer imleri dosyası başlığı (varsayılan: Bookmarks)'
    )
    
    parser.add_argument(
        '-r', '--root-category',
        type=str,
        default='Free for Dev',
        help='Ana kategori adı (varsayılan: Free for Dev)'
    )
    
    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Detaylı çıktı modu'
    )
    
    args = parser.parse_args()
    
    # Loglama ayarları
    setup_logging(args.verbose)
    
    try:
        logging.info("Markdown to Bookmarks converter başlatıldı")
        logging.info(f"Girdi dosyası: {args.input}")
        logging.info(f"Çıktı dosyası: {args.output}")
        logging.info(f"Başlık: {args.title}")
        
        # Markdown dosyasını oku
        markdown_content = read_markdown_file(args.input)
        
        # Bölümleri parse et
        sections = parse_markdown_sections(markdown_content)
        
        # HTML oluştur
        html_content = create_bookmark_html(
            sections,
            args.title,
            args.root_category
        )
        
        # Çıktı dosyasına yaz
        write_output_file(html_content, args.output)
        
        logging.info("Dönüştürme işlemi başarıyla tamamlandı")
        
    except Exception as e:
        logging.error(f"İşlem sırasında hata oluştu: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()