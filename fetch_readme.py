#!/usr/bin/env python3
"""
GitHub'dan README.md dosyasını çeken betik
free-for-dev projesi için düzenli güncelleme sağlar
"""

import os
import sys
import requests
import re
import logging
import argparse
from datetime import datetime
from urllib.parse import urlparse
from pathlib import Path

# Ayarlar
GITHUB_REPO = "ripienaar/free-for-dev"
README_FILENAME = "README.md"
LOG_FILE = "fetch_readme.log"
USER_AGENT = "free-for-dev-readme-fetcher/1.0"

# Loglama yapılandırması
def setup_logging():
    """Loglama sistemini kurar"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(LOG_FILE),
            logging.StreamHandler(sys.stdout)
        ]
    )
    return logging.getLogger(__name__)

logger = setup_logging()

def fetch_readme_from_api(repo_url=None):
    """
    GitHub API kullanarak README.md dosyasını çeker
    Returns: (success: bool, content: str or error: str)
    """
    try:
        # URL'den repo bilgilerini çıkar
        if repo_url:
            parsed_url = urlparse(repo_url)
            path_parts = parsed_url.path.strip('/').split('/')
            if len(path_parts) < 2:
                return False, "Geçersiz repo URL formatı"
            owner, repo = path_parts[0], path_parts[1]
        else:
            owner, repo = GITHUB_REPO.split('/')
        
        # GitHub API endpoint
        url = f"https://api.github.com/repos/{owner}/{repo}/readme"
        
        headers = {
            "Accept": "application/vnd.github.v3.raw",
            "User-Agent": USER_AGENT
        }
        
        logger.info(f"GitHub API'den README çekiliyor: {url}")
        
        response = requests.get(url, headers=headers, timeout=30)
        
        # HTTP hataları
        if response.status_code == 404:
            return False, "README.md dosyası bulunamadı"
        elif response.status_code == 403:
            return False, "GitHub API limiti aşıldı. Lütfen daha sonra tekrar deneyin."
        elif response.status_code == 401:
            return False, "GitHub API erişim hatası"
        elif response.status_code != 200:
            return False, f"HTTP {response.status_code}: {response.text}"
        
        # Başarılı yanıt
        content = response.text
        logger.info(f"README başarıyla alındı. Boyut: {len(content)} karakter")
        return True, content
        
    except requests.exceptions.Timeout:
        return False, "İstek zaman aşımına uğradı"
    except requests.exceptions.ConnectionError:
        return False, "İnternet bağlantısı hatası"
    except requests.exceptions.RequestException as e:
        return False, f"İstek hatası: {str(e)}"
    except Exception as e:
        return False, f"Beklenmedik hata: {str(e)}"

def fetch_readme_direct(repo_url=None, branch='main'):
    """
    Alternatif: GitHub'dan doğrudan README dosyasını çeker
    Returns: (success: bool, content: str or error: str)
    """
    try:
        # URL'den repo bilgilerini çıkar
        if repo_url:
            parsed_url = urlparse(repo_url)
            path_parts = parsed_url.path.strip('/').split('/')
            if len(path_parts) < 2:
                return False, "Geçersiz repo URL formatı"
            owner, repo = path_parts[0], path_parts[1]
        else:
            owner, repo = GITHUB_REPO.split('/')
        
        # Raw GitHub URL
        url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{README_FILENAME}"
        
        logger.info(f"Doğrudan URL'den README çekiliyor: {url}")
        
        response = requests.get(url, timeout=30)
        
        if response.status_code != 200:
            return False, f"HTTP {response.status_code}: {response.text}"
        
        content = response.text
        logger.info(f"README başarıyla alındı. Boyut: {len(content)} karakter")
        return True, content
        
    except requests.exceptions.Timeout:
        return False, "İstek zaman aşımına uğradı"
    except requests.exceptions.ConnectionError:
        return False, "İnternet bağlantısı hatası"
    except requests.exceptions.RequestException as e:
        return False, f"İstek hatası: {str(e)}"
    except Exception as e:
        return False, f"Beklenmedik hata: {str(e)}"

def save_readme(content, filename=README_FILENAME):
    """
    README içeriğini dosyaya kaydeder
    Returns: (success: bool, error: str or None)
    """
    try:
        # Mevcut dizine kaydet
        readme_path = Path(filename)
        
        # Dosyayı yaz
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        logger.info(f"README başarıyla kaydedildi: {readme_path.absolute()}")
        return True, None
        
    except IOError as e:
        return False, f"Dosya yazma hatası: {str(e)}"
    except Exception as e:
        return False, f"Beklenmedik hata: {str(e)}"

def main():
    """Ana fonksiyon"""
    # Komut satırı argümanlarını işle
    parser = argparse.ArgumentParser(description='GitHub reposundan README dosyasını çeker')
    parser.add_argument('--repo', default=GITHUB_REPO,
                       help=f'GitHub repo URL (varsayılan: {GITHUB_REPO})')
    parser.add_argument('--branch', default='main',
                       help='Repo branch adı (varsayılan: main)')
    parser.add_argument('--output', default=README_FILENAME,
                       help=f'Çıktı dosyası adı (varsayılan: {README_FILENAME})')
    parser.add_argument('--raw-only', action='store_true',
                       help='Sadece raw URL yöntemini kullan')
    
    args = parser.parse_args()
    
    logger.info("README fetch işlemi başlatıldı")
    logger.info(f"Hedef repo: {args.repo}")
    logger.info(f"Branch: {args.branch}")
    
    # Önce API ile dene
    if not args.raw_only:
        success, result = fetch_readme_from_api(args.repo)
        
        if success:
            # İçeriği dosyaya kaydet
            success, error = save_readme(result, args.output)
            if success:
                logger.info("README fetch işlemi başarıyla tamamlandı")
                print("README başarıyla güncellendi!")
                return
            else:
                logger.error(f"Dosya kaydetme başarısız: {error}")
                print(f"Hata: {error}")
                sys.exit(1)
        else:
            logger.warning(f"API ile çekim başarısız: {result}")
            logger.info("Alternatif yöntem deneniyor...")
    
    # Alternatif olarak doğrudan URL ile dene
    success, result = fetch_readme_direct(args.repo, args.branch)
    
    if not success:
        logger.error(f"Alternatif yöntem de başarısız: {result}")
        print(f"Hata: {result}")
        sys.exit(1)
    
    # İçeriği dosyaya kaydet
    success, error = save_readme(result, args.output)
    
    if not success:
        logger.error(f"Dosya kaydetme başarısız: {error}")
        print(f"Hata: {error}")
        sys.exit(1)
    
    logger.info("README fetch işlemi başarıyla tamamlandı")
    print("README başarıyla güncellendi!")

if __name__ == "__main__":
    main()