# 🐍 Snakey - Escape The Matrix

A modern twist on the classic Snake game, built with **React**, **Vite**, **Tailwind CSS**, and **Phaser 3**.
What starts as a simple, confined 800x600 arcade game quickly turns into an interactive web-breaking experience where the snake breaks out of its canvas and consumes the actual DOM elements of the website.

![Demo](https://via.placeholder.com/800x400.png?text=Snakey+-+Escape+The+Matrix)

## ✨ Features

- **Classic Gameplay**: A polished retro snake experience with smooth grid-based movement and responsive controls.
- **Escape Mode**: Upon reaching a score of 100, the mysterious **Red Pill** appears. Eating it shatters the boundaries of the canvas, allowing the snake to roam freely across the entire webpage.
- **DOM Eater**: The snake gains the ability to physically eat HTML elements (text characters, cards, icons). Powered by a custom `DomManager` that dynamically maps DOM nodes to Phaser physics bodies!
- **Dynamic Content Support**: Modify or add any text/components to the React website; the game will automatically detect and make them edible without any extra configuration.
- **Cinematic Finale**: Once the entire webpage is devoured, a unique "Web Broke" sequence kicks in, spinning and shattering the remaining root layout before resetting.
- **Modern Stack**: Lightning fast HMR with Vite, beautiful layout with Tailwind CSS, and robust game loops with Phaser 3.

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

## 🏗️ Architecture & Refactoring

The game's source code is structured with a strong emphasis on clean architecture and separation of concerns:
- **`SnakeScene.ts`**: The main director orchestrating game states.
- **`InputManager.ts`**: Handles complex keyboard logic cleanly.
- **`DomManager.ts`**: The bridge between Phaser's physics engine and React's DOM nodes. It parses the DOM tree, injects `edible-char` spans, and synchronizes positions.
- **`Food.ts` / `Snake.ts`**: Core game entities encapsulating their own collision, movement, and visual logic.

## 🛠️ Built With

- [React 18](https://reactjs.org/)
- [Vite](https://vitejs.org/)
- [Phaser 3](https://phaser.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 📜 License
This project is open-source and available under the MIT License.
