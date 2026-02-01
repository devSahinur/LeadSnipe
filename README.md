# LeadSnipe - Email Extractor Chrome Extension

<div align="center">

![LeadSnipe Logo](https://img.shields.io/badge/LeadSnipe-Email%20Extractor-667eea?style=for-the-badge&logo=google-chrome&logoColor=white)

**Extract business emails from any webpage in one click.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-leadsnipe.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://leadsnipe.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-devSahinur-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/devSahinur/LeadSnipe)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Tech Stack](#tech-stack) • [Contributing](#contributing)

</div>

---

## About

LeadSnipe is a powerful Chrome extension designed for **cold email marketers**, **sales teams**, and **lead generation professionals**. Extract, filter, and export emails from any webpage instantly - completely free and privacy-focused.

## Features

| Feature | Description |
|---------|-------------|
| **Smart Email Detection** | Advanced regex patterns detect emails from any webpage content |
| **Business/Personal Filter** | Automatically separates business emails from Gmail, Yahoo, etc. |
| **Domain Analytics** | See top domains at a glance with email count |
| **One-Click Copy** | Auto-copy all extracted emails to clipboard |
| **Export Options** | Download as CSV or TXT file for CRM import |
| **100% Privacy** | All processing happens locally - zero data collection |

## Installation

### From Source (Developer Mode)

1. **Clone the repository**
   ```bash
   git clone https://github.com/devSahinur/LeadSnipe.git
   ```

2. **Open Chrome Extensions**
   ```
   chrome://extensions/
   ```

3. **Enable Developer Mode**
   - Toggle "Developer mode" in the top right corner

4. **Load Extension**
   - Click "Load unpacked"
   - Select the `LeadSnipe` folder

5. **Done!**
   - The extension icon will appear in your toolbar

### Browser Support

| Browser | Status |
|---------|--------|
| Chrome | ✅ Supported |
| Brave | ✅ Supported |
| Edge | ✅ Supported |
| Opera | ✅ Supported |
| Firefox | 🔄 Coming Soon |

## Usage

1. **Navigate** to any webpage with email addresses
2. **Click** the LeadSnipe extension icon
3. **Click** "Extract Emails from Page"
4. **Filter** by All / Business / Personal emails
5. **Copy** or **Export** your leads

### Export Formats

- **CSV** - Includes Email, Domain, Type columns (CRM-ready)
- **TXT** - Plain text list, one email per line
- **Clipboard** - Instant copy for quick paste

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Extension:** Chrome Manifest V3
- **Landing Page:** Vanilla HTML/CSS with scroll animations
- **Hosting:** Netlify

## Project Structure

```
LeadSnipe/
├── manifest.json          # Chrome extension manifest
├── popup.html             # Extension popup UI
├── popup.js               # Main extraction logic
├── content.js             # Content script
├── browser-polyfill.js    # Cross-browser support
├── build.js               # Build script for multi-browser
├── manifest.chrome.json   # Chrome-specific manifest
├── manifest.firefox.json  # Firefox-specific manifest
├── landing-page/
│   └── index.html         # Marketing landing page
├── icons/
│   └── README.txt         # Icon requirements
├── .gitignore
└── README.md
```

## Screenshots

<div align="center">

### Extension Popup
*Dark themed UI with business/personal email filtering*

### Landing Page
*Modern responsive marketing page*

</div>

## Roadmap

- [ ] Firefox extension support
- [ ] Email validation feature
- [ ] Bulk extraction from multiple tabs
- [ ] Integration with popular CRMs
- [ ] Browser action badge with email count

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

<div align="center">

**Sahinur Islam**

[![GitHub](https://img.shields.io/badge/GitHub-devSahinur-181717?style=flat-square&logo=github)](https://github.com/devSahinur)
[![Portfolio](https://img.shields.io/badge/Portfolio-sahinur.vercel.app-667eea?style=flat-square&logo=vercel)](https://sahinur.vercel.app)

</div>

---

<div align="center">

**If you found this useful, please give it a ⭐ on GitHub!**

Made with ❤️ by [Sahinur](https://github.com/devSahinur)

</div>
