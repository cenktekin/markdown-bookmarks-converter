# Free for Dev Bookmarks Converter

A powerful tool to convert large markdown README files (like free-for-dev) into browser-compatible bookmarks format.

## 🚀 Overview

This standalone tool helps developers organize and manage extensive resource lists by converting markdown-formatted README files into standard HTML bookmarks files. Perfect for projects like [ripienaar/free-for-dev](https://github.com/ripienaar/free-for-dev) that contain hundreds of developer resources.

## ✨ Key Features

- **Dual Interface**: Both command-line Python script and web-based interface
- **Smart Parsing**: Automatically extracts headings as categories and links as bookmarks
- **Netscape Format**: Generates standard browser-compatible HTML bookmarks
- **Responsive Design**: Mobile-friendly web interface with real-time conversion
- **UTF-8 Support**: Full Turkish character and language support
- **Comprehensive Testing**: Extensive test suite for various input formats
- **No Dependencies**: Python script uses only standard libraries

## 🛠️ Usage

### Command Line
```bash
python convert_to_bookmarks.py -i README.md -o bookmarks.html -t "Bookmarks" -r "Free for Dev"
```

### Web Interface
1. Open `index.html` in your browser
2. Select your markdown file
3. Configure output settings
4. Generate and download bookmarks file

## 📁 Project Structure

```
├── convert_to_bookmarks.py    # Python conversion script
├── index.html                 # Web interface
├── script.js                  # Frontend logic
├── style.css                  # Responsive styling
├── bookmarks.html             # Sample output
├── test_*.md                  # Test files
├── browser_compatibility_test.js
├── mobile_compatibility_test.js
└── validate_output.js         # Output validation
```

## 🎯 Use Cases

- **Resource Management**: Convert large developer resource lists
- **Documentation**: Bookmark project documentation and references
- **Research**: Organize research materials and links
- **Personal Knowledge**: Create personal bookmark collections from markdown notes

## 📊 Technical Details

- **Python Script**: Pure Python with standard libraries only
- **Web Interface**: Vanilla HTML/CSS/JavaScript (no frameworks)
- **Output Format**: Netscape Bookmark File Format (HTML)
- **Encoding**: UTF-8 with full Unicode support
- **Testing**: Comprehensive test coverage for edge cases

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Note**: This tool is designed to work with large markdown resource lists and is particularly useful for projects containing extensive collections of developer tools, APIs, and resources.