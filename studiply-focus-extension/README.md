# Studiply Focus Mode Extension

A browser extension that blocks distracting websites during Studiply focus sessions.

## Features

- 🚫 Blocks distracting websites during focus sessions
- 🎯 Integrates with Studiply website
- ⏰ Shows focus session progress
- 📊 Displays blocking statistics
- 🔄 Real-time status updates

## Installation

### For Chrome/Edge:

1. Download or clone this extension
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your extensions list

### For Firefox:

1. Download or clone this extension
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension folder

## Usage

1. Install the extension
2. Go to [Studiply.it](https://studiply.it)
3. Navigate to Focus Mode
4. Click "Start" to begin a focus session
5. The extension will automatically block distracting websites

## Blocked Websites (Default)

- Facebook
- Instagram
- Twitter
- TikTok
- YouTube
- Reddit
- Snapchat

## How It Works

1. **Website Integration**: The Studiply website sends messages to the extension when focus mode starts/stops
2. **Dynamic Blocking**: The extension uses Chrome's `declarativeNetRequest` API to block websites
3. **Redirect Pages**: Blocked websites redirect to a friendly reminder page
4. **Status Tracking**: The extension tracks focus session progress and statistics

## Permissions

- `declarativeNetRequest`: To block websites
- `storage`: To save focus session data
- `activeTab`: To interact with the current tab
- `<all_urls>`: To block websites across the internet

## Development

To modify the extension:

1. Edit the source files
2. Go to `chrome://extensions/`
3. Click the refresh button on the extension card
4. Test your changes

## Files Structure

```
studiply-focus-extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for website communication
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── blocked.html          # Page shown when sites are blocked
├── icons/                # Extension icons
└── README.md             # This file
```

## Support

If you encounter any issues:

1. Check that the extension is enabled
2. Refresh the Studiply website
3. Try restarting your browser
4. Check the browser console for error messages

## Privacy

This extension:
- Only blocks websites during active focus sessions
- Does not collect or store personal data
- Only communicates with the Studiply website
- All data is stored locally in your browser
