# 🐍 Snakey Chrome Extension - DOM Eating Snake

A modern, interactive Chrome Extension that turns the web into your snake's sandbox. With a single click in your browser toolbar, a snake is released directly onto any active webpage, allowing you to slither around and devour all DOM elements (text characters, headings, images, cards, inputs, and interactive widgets) in real time!

---

## ✨ Features

- **One-Click Activation**: No initial arcade cabinet screen or normal-phase score requirements. Clicking the extension icon in the toolbar immediately releases the snake at the center of your current screen viewport.
- **Proximity-Based Lazy DOM Splitting (Performance Optimization)**:
  - **Zero Startup Lag**: Heavy webpages (like Wikipedia or complex dashboards) are scanned in milliseconds without UI freezing, because text nodes are *not* split at startup.
  - **Just-In-Time Splitting**: Text paragraphs, lists, and headers are represented as single blocks. They are dynamically split into individual edible character spans *only* when the snake crawls within a **100px buffer** of them.
  - **Memory Efficiency**: Keeps the DOM lightweight and physics loops operating at high frame rates, even on massive webpages.
- **Universal DOM Devouring**:
  - Eats leaf characters and text.
  - Collapses visual cards using style-based layout bounding clone boxes.
  - Triggers custom interactive behaviors on special elements: drains progress bars, vibrates input fields, clicks checkboxes, expansions on dropdown selectors, and speeds up media playbacks.
- **Website Collapse Finale**: If the snake crawls off the page limits, the entire website rotates, blurs, and slides into a black void before the page reloads.

---

## 🛠️ Tech Stack

- **React 19**
- **Vite 8**
- **Phaser 3 / Phaser 4 (Phaser.AUTO)**
- **Tailwind CSS 4**
- **TypeScript**
- **Chrome Extension Manifest V3**

---

## 🚀 Installation & Loading the Extension

To install and load the unpacked extension in Chrome:

### 1. Build the Extension Local Directory
Ensure you have [Node.js](https://nodejs.org/) installed:

1. Clone and enter the extension branch directory:
   ```bash
   git clone -b snakey-extension https://github.com/andreyyste/snakey.git snakey-extension
   cd snakey-extension
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Compile the production bundles:
   ```bash
   npm run build
   ```
   *This outputs the extension package files directly to the `dist/` directory, including `manifest.json`, `background.js`, and compiled assets.*

### 2. Load the Unpacked Extension in Chrome
1. Open Google Chrome (or any Chromium-based browser).
2. Go to the extension settings page: `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select the **`dist`** folder inside your `snakey-extension` project directory.

### 3. Let the Snake Loose!
1. Pin the **Snakey** extension icon to your toolbar.
2. Open any webpage (e.g., [Wikipedia: Snake](https://en.wikipedia.org/wiki/Snake)).
3. Click the extension icon.
4. Control the snake using **Arrow Keys** or **WASD**.
5. Eat the web! Press **SPACE** to restart if you die.

---

## 📂 Code Architecture

The extension logic sits on top of Phaser and React, utilizing three main custom systems:

1. **[DomScanner.ts](file:///home/andrey/snakey-extension/src/game/systems/DomScanner.ts)**: Recursively parses the DOM tree, identifies interactive elements, handles card boundaries, and groups unsplit text paragraphs.
2. **[DomManager.ts](file:///home/andrey/snakey-extension/src/game/systems/DomManager.ts)**: Orchestrates viewport collision checks, dynamically triggers just-in-time element splits when the snake approaches, and handles window resize checks.
3. **[DomAnimator.ts](file:///home/andrey/snakey-extension/src/game/systems/DomAnimator.ts)**: Handles visual css transitions and tag-specific chomping animations.

---

## 📜 License
This project is open-source and available under the MIT License.
