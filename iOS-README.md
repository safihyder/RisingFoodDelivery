# Rising Food Delivery - iOS App Setup

This document provides instructions for setting up and building the Rising Food Delivery iOS app.

## Prerequisites

To build the iOS app, you need:

- A Mac computer running macOS (iOS apps can only be built on macOS)
- Xcode (latest version recommended)
- CocoaPods
- Node.js and npm

## Getting Started

1. Clone or copy this repository to your Mac
2. Install all dependencies:

   ```
   npm install
   ```

3. Make the setup script executable:

   ```
   chmod +x ios-setup.sh
   ```

4. Run the setup script:
   ```
   ./ios-setup.sh
   ```

This script will:

- Build the web app
- Sync with Capacitor
- Install CocoaPods dependencies
- Open the project in Xcode

## Manual Setup

If you prefer to set up manually, follow these steps:

1. Build the web app:

   ```
   npm run build
   ```

2. Sync with Capacitor:

   ```
   npx cap sync ios
   ```

3. Navigate to iOS project directory and install pods:

   ```
   cd ios/App
   pod install
   ```

4. Open the project in Xcode:
   ```
   npx cap open ios
   ```

## Building and Running the App

1. In Xcode, select your target device (simulator or connected iPhone)
2. Click the "Play" button to build and run

## Troubleshooting

### Common Issues

1. **Signing Issues**:

   - In Xcode, go to the "Signing & Capabilities" tab
   - Ensure you have selected a valid team
   - If building for a physical device, you need an Apple Developer account

2. **Pod Install Fails**:

   - Try running `pod repo update` before `pod install`
   - Make sure you have the latest CocoaPods: `sudo gem install cocoapods`

3. **Build Errors**:
   - Check Xcode console for specific error messages
   - Ensure all required permissions are added to Info.plist
   - Make sure all Capacitor plugins are properly installed

## App Store Deployment

To submit to the App Store:

1. Set up an App ID in the Apple Developer Portal
2. Create distribution certificates and provisioning profiles
3. Configure app store distribution in Xcode
4. Archive the app in Xcode
5. Upload to App Store Connect

## Contact

For assistance, please contact the development team.

---

Happy Coding! 🍔📱
