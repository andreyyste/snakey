# 🐍 Snakey - Escape The Matrix

[![Live Demo](https://img.shields.io/badge/Live%20Demo-rasis.me-blue?style=for-the-badge)](https://rasis.me)

A modern twist on the classic Snake game, built with **React 19**, **Vite**, **Tailwind CSS**, and **Phaser 3**.

What starts as a simple, confined 800x600 arcade game quickly turns into an interactive web-breaking experience where the snake breaks out of its canvas and consumes the actual DOM elements of the website.

---

## ✨ Features

- **Classic Gameplay**: A polished retro snake experience with smooth grid-based movement and responsive controls.
- **Escape Mode**: Upon reaching a score of 100, the mysterious **Red Pill** appears. Eating it shatters the boundaries of the canvas, allowing the snake to roam freely across the entire webpage.
- **DOM Eating Sandbox**: The snake gains the ability to physically eat HTML elements (text characters, dropdowns, inputs, progress bars, audio widgets, and cards).
- **Dynamic Content Support**: Relies on a reactive observer that immediately adapts when new elements are injected or loaded dynamically (e.g. lazy-loaded content, scrolls).
- **Cinematic Viewport Finale**: Once you're done eating elements, crash the snake into any edge of the browser viewport to trigger a dramatic end-game sequence where the website collapses, folds, and falls off the screen, leaving a pitch-black void before resetting.

---

## 🧠 The DOM Destruction Engine (Architecture)

The heart of *Snakey* is its custom DOM parser and rendering pipeline, built to bridge the gap between Phaser's WebGL/Canvas game loops and the browser's Document Object Model (DOM).

```
                 [ Phaser Game Loop ]
                          │
            Detects head coordinate overlap
                          │
                          ▼
                    [ DomManager ]
             Orchestrates & tracks state
             │            │            │
      Scans dynamic       │      Triggers anims
      DOM updates         │      upon chomps
             │            │            │
             ▼            ▼            ▼
       [ DomScanner ]  [ Physics ]  [ DomAnimator ]
      Recurses shadow  Synchronizes  Applies tag-specific
       DOM / elements   rect bounds  CSS & pseudo transitions
```

### 🔍 1. `DomScanner` (The Parser)
The `DomScanner` acts as the parser. It crawls the webpage DOM and generates target coordinate bodies for Phaser.
- **Recursive Tree Walking**: Walks the DOM tree node-by-node. If it finds text nodes, it safely splits them character-by-character and wraps them inside individual `.edible-char` spans to allow letter-by-letter consumption.
- **Shadow DOM Traversal**: Recursively traverses shadow roots (`shadowRoot`), unlocking the ability to scan inside custom Web Components and embedded widgets.
- **Computed Visibility Filtering**: Checks computed style values (`window.getComputedStyle`) to ignore elements hidden via `display: none`, `visibility: hidden`, or `opacity: 0`.
- **Phaser Canvas Excluder**: Automatically identifies the Phaser game canvas and prevents the snake from eating the container rendering the game.
- **Multi-Element Mapping**: Targets a wide array of tags: `img`, `svg`, `video`, `input`, `textarea`, `button`, `a`, `select`, `progress`, `meter`, `canvas`, `hr`, `iframe`, and `audio`.

### ⚙️ 2. `DomManager` (The Orchestrator)
The `DomManager` acts as the main bridge keeping state and listening to browser viewport changes.
- **Dynamic Mutation Observer**: Integrates a `MutationObserver` to watch for dynamically added elements (lazy-loaded elements, infinite scrolling) and triggers rescans safely by temporarily disconnecting/connecting to prevent infinite loops.
- **Viewport Scroll-Aware Bounds**: Keeps snake movement bound within the current viewport (`window.scrollX` / `window.scrollY` limits), allowing the snake to feel like it scrolls dynamically with the page.
- **Collision Syncing**: Compares Phaser's head coordinates to `domBodies` coordinates (updated dynamically on resize/scroll) and flags them in memory.
- **Canvas Lifecycle Restoration**: When the game restarts, it completely restores the Phaser canvas back to its original layout container (`#game-container-shell`), strips off full-screen fixed styling, resets the scale resolution back to `800x600`, and cleans up observers.

### 🎨 3. `DomAnimator` (The Animator)
The `DomAnimator` triggers specific transitions on HTML elements when eaten by the snake:
- **`select` (Dropdown)**: Dynamically expands the dropdown option list (`select.size`) for 300ms, simulating a visual dropdown click, before chomping and shrinking.
- **`hr` (Horizontal Line)**: Scales horizontally down (`scaleX(0)`) to center before fading.
- **`progress` / `meter`**: Animates the value bar draining down to 0 over 200ms before scaling to 0.
- **`input[type=checkbox]` / `input[type=radio]`**: Triggers a rapid click toggle (6 times at 50ms interval) to simulate click madness before disappearing.
- **`input` / `textarea`**: Shakes horizontally (vibration effect) for 400ms before spinning and shrinking.
- **`audio` / `video`**: Instantly speeds up playback rate to 3.0x and fades out audio volume to 0 (if playing) before pausing and shrinking.
- **`.card-container`**: Uses a `::before` pseudo-element for background styling (white background, shadows, borders) so that when eaten, only the card background rotates and shrinks, leaving the text inside completely visible and edible in place.
- **Descendant Cleanup**: Automatically marks all children of eaten elements as eaten to avoid leaving "ghost" collider blocks.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/andreyyste/snakey.git
   cd snakey
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Play!**
   Open `http://localhost:5173` in your browser. Use the **Arrow Keys** or **WASD** to control the snake.

---

## 🛠️ Built With

- [React 19](https://react.dev/)
- [Vite 8](https://vitejs.dev/)
- [Phaser 3](https://phaser.io/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📜 License
This project is open-source and available under the MIT License.
