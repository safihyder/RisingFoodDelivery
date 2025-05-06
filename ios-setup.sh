#!/bin/bash

# Rising Food Delivery iOS App Setup Script
# This script helps set up and build the iOS app on a macOS system

echo "---------------------------------------------"
echo "Rising Food Delivery iOS App Setup"
echo "---------------------------------------------"

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "⚠️ Xcode is not installed. Please install Xcode from the App Store."
    exit 1
fi

# Check if CocoaPods is installed
if ! command -v pod &> /dev/null; then
    echo "⚠️ CocoaPods is not installed. Installing CocoaPods..."
    sudo gem install cocoapods
fi

# Build the web app
echo "🔨 Building web app..."
npm run build

# Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync ios

# Set up iOS project
echo "🍎 Setting up iOS project..."
cd ios/App
pod install
cd ../..

# Open in Xcode
echo "📱 Opening in Xcode..."
npx cap open ios

echo "---------------------------------------------"
echo "✅ Setup complete!"
echo "You can now build and run the app in Xcode."
echo "To run on a physical device, you'll need to set up:"
echo "1. An Apple Developer account"
echo "2. A valid provisioning profile"
echo "3. A signing certificate"
echo "---------------------------------------------" 