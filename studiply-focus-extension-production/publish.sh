#!/bin/bash

# Studiply Focus Mode Extension - Publish Script
# This script prepares the extension for Chrome Web Store submission

echo "🚀 Preparing Studiply Focus Mode Extension for Chrome Web Store..."

# Create a clean directory for the store package
STORE_DIR="studiply-focus-extension-store"
rm -rf $STORE_DIR
mkdir $STORE_DIR

# Copy all necessary files
echo "📁 Copying extension files..."
cp manifest.json $STORE_DIR/
cp background.js $STORE_DIR/
cp content.js $STORE_DIR/
cp popup.html $STORE_DIR/
cp popup.js $STORE_DIR/
cp blocked.html $STORE_DIR/
cp -r icons $STORE_DIR/

# Create the ZIP file for Chrome Web Store
echo "📦 Creating ZIP file for Chrome Web Store..."
cd $STORE_DIR
zip -r ../studiply-focus-extension-store.zip . -x "*.DS_Store" "*.git*"
cd ..

echo "✅ Extension package created: studiply-focus-extension-store.zip"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://chrome.google.com/webstore/devconsole/"
echo "2. Click 'New Item'"
echo "3. Upload studiply-focus-extension-store.zip"
echo "4. Fill in the store listing details"
echo "5. Submit for review"
echo ""
echo "🎯 Your extension is ready for Chrome Web Store submission!"
