# Studiply Focus Mode Extension

A Chrome extension that blocks distracting websites during Studiply focus sessions to help you stay focused and productive.

## Features

- 🚫 **Website Blocking**: Automatically blocks distracting websites during focus sessions
- 🎯 **Seamless Integration**: Works automatically with Studiply focus sessions
- ⚙️ **Customizable**: Easy to configure blocked sites
- 🔒 **Privacy-First**: All data stored locally on your device
- 🎨 **Beautiful UI**: Modern, intuitive interface

## Installation

### For Users (Chrome Web Store)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (when published)
2. Search for "Studiply Focus Mode"
3. Click "Add to Chrome"
4. Confirm installation

### For Developers (Manual Installation)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will be installed and ready to use

## How It Works

1. **Start Focus Session**: Begin a focus session on Studiply
2. **Automatic Blocking**: The extension automatically blocks distracting websites
3. **Stay Focused**: When you try to visit a blocked site, you'll see a friendly reminder
4. **End Session**: When your focus session ends, all websites are unblocked

## Default Blocked Sites

- Facebook
- Instagram
- Twitter/X
- TikTok
- YouTube
- Reddit
- Snapchat
- Discord
- Netflix

## Publishing to Chrome Web Store

### Prerequisites
1. Chrome Web Store Developer Account ($5 one-time fee)
2. Complete extension package
3. Privacy policy and terms of service

### Steps to Publish

1. **Prepare Extension Package**
   ```bash
   # Create a ZIP file of the extension
   zip -r studiply-focus-extension.zip . -x "*.git*" "README.md" "*.md"
   ```

2. **Create Chrome Web Store Listing**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Click "New Item"
   - Upload the ZIP file
   - Fill in store listing details:
     - **Name**: Studiply Focus Mode
     - **Summary**: Block distracting websites during focus sessions
     - **Description**: Detailed description of features and benefits
     - **Category**: Productivity
     - **Language**: English
     - **Screenshots**: Create screenshots of the extension in action
     - **Icon**: Use the provided icon files

3. **Required Information**
   - **Privacy Policy**: Must be hosted on a public URL
   - **Support URL**: Link to support/help page
   - **Homepage URL**: https://studiply.it
   - **Permissions Justification**: Explain why each permission is needed

4. **Review Process**
   - Submit for review
   - Wait for Google's review (usually 1-3 days)
   - Address any feedback or issues
   - Extension goes live once approved

### Store Listing Content

#### Description
```
🎯 Stay focused and productive with Studiply Focus Mode!

This extension automatically blocks distracting websites during your Studiply focus sessions, helping you maintain concentration and achieve your learning goals.

✨ Features:
• Automatic website blocking during focus sessions
• Seamless integration with Studiply
• Customizable blocked sites list
• Beautiful, intuitive interface
• Privacy-first design (all data stored locally)
• Works with Pomodoro, Deep Work, and custom sessions

🚀 How it works:
1. Start a focus session on Studiply
2. The extension automatically blocks distracting websites
3. Stay focused and productive
4. Websites are unblocked when your session ends

Perfect for students, professionals, and anyone who wants to eliminate digital distractions and boost productivity.

Start your focused learning journey today with Studiply Focus Mode!
```

#### Privacy Policy Template
```
Privacy Policy for Studiply Focus Mode Extension

Last updated: [Date]

This extension respects your privacy and operates with minimal data collection:

Data We Collect:
- No personal information is collected
- No browsing history is stored
- No data is transmitted to external servers

Data Storage:
- All data is stored locally on your device
- Focus session preferences are saved locally
- Blocked sites list is stored locally

Data Usage:
- Data is used only to provide the extension's functionality
- No data is shared with third parties
- No analytics or tracking is performed

Contact:
For questions about this privacy policy, contact us at privacy@studiply.it
```

## Development

### File Structure
```
studiply-focus-extension-production/
├── manifest.json          # Extension manifest
├── background.js          # Background service worker
├── content.js            # Content script
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── blocked.html          # Blocked website page
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

### Testing
1. Load the extension in Chrome
2. Visit Studiply and start a focus session
3. Try to visit a blocked website
4. Verify the blocking works correctly
5. Test the popup functionality

## Support

For support, visit: https://studiply.it/support
For bugs or feature requests, contact: support@studiply.it

## License

© 2024 Studiply. All rights reserved.
