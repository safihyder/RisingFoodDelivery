# Rising Food Delivery

A modern food delivery platform built with React, Capacitor, and Android integration.

## Project Overview

Rising Food Delivery is a comprehensive food delivery platform that includes:

- Web application built with React and Vite
- Native Android application using Capacitor
- Real-time delivery status checking
- Restaurant management features
- User authentication

## Repository Structure

This repository contains both the web application code and the Android application:

```
/
├── src/               # React web application source code
├── public/            # Public assets for the web application
├── android/           # Android application code (Capacitor-generated)
├── dist/              # Built web application (generated)
├── node_modules/      # Dependencies (not tracked in git)
└── capacitor.config.json  # Capacitor configuration
```

## Development Setup

### Prerequisites

- Node.js 16+ and npm
- Android Studio for Android development
- JDK 17+
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/RisingFoodDelivery.git
cd RisingFoodDelivery
```

2. Install dependencies:

```bash
npm install
```

3. Run the web application:

```bash
npm run dev
```

### Building for Android

1. Build the web application:

```bash
npm run build
```

2. Sync with Android:

```bash
npx cap sync android
```

3. Open in Android Studio:

```bash
npx cap open android
```

## Git Workflow

This repository includes both web and Android code. The Android code is generated from the web code using Capacitor.

### Committing Changes

- Web code changes should be committed directly
- The Android platform folder is included in the repository, but build files are gitignored
- Always run `npx cap sync android` after making changes to the web code before committing

### Before Pushing to GitHub

1. Build the web application: `npm run build`
2. Sync with Android: `npx cap sync android`
3. Test the Android build: `npx cap open android`
4. Commit all changes: `git add . && git commit -m "Your message"`
5. Push to GitHub: `git push origin main`

## License

[Specify your license here]

## Contact

[Your contact information]
