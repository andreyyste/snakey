import Phaser from 'phaser';
import { GRID_SIZE, MOVE_INTERVAL } from './constants';
import { AudioManager } from './systems/AudioManager';
import { GameUI } from './ui/GameUI';
import { Snake } from './core/Snake';
import { Food } from './core/Food';
import { DomManager } from './systems/DomManager';
import { InputManager } from './systems/InputManager';
import { DomAnimator } from './systems/DomAnimator';

export class SnakeScene extends Phaser.Scene {
  private snake!: Snake;
  private food!: Food;
  private audioManager!: AudioManager;
  private gameUI!: GameUI;
  private domManager!: DomManager;
  private inputManager!: InputManager;

  private moveTimer: number = 0;
  private score: number = 0;
  private isGameOver: boolean = false;
  private isEscaped: boolean = false;
  private finalPhaseStarted: boolean = false;

  constructor() {
    super('SnakeScene');
  }

  preload() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    const factor = 5;
    const gs = GRID_SIZE * factor;

    graphics.fillStyle(0x3b82f6, 1);
    graphics.fillRoundedRect(1 * factor, 1 * factor, gs - 2 * factor, gs - 2 * factor, 4 * factor);
    graphics.generateTexture('snake-body', gs, gs);

    graphics.clear();
    graphics.fillStyle(0x1d4ed8, 1);
    graphics.fillRoundedRect(1 * factor, 1 * factor, gs - 2 * factor, gs - 2 * factor, 6 * factor);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(gs - 5 * factor, 6 * factor, 2 * factor);
    graphics.fillCircle(gs - 5 * factor, gs - 6 * factor, 2 * factor);
    graphics.generateTexture('snake-head', gs, gs);

    graphics.clear();
    graphics.fillStyle(0xef4444, 1);
    graphics.fillCircle(gs / 2, gs / 2, gs / 2 - 2 * factor);
    graphics.generateTexture('food', gs, gs);

    graphics.clear();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRoundedRect(gs / 4, gs / 4, gs / 2, gs / 2, 4 * factor);
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRoundedRect(gs / 4 + 2 * factor, gs / 4 + 2 * factor, gs / 2 - 4 * factor, gs / 2 - 4 * factor, 2 * factor);
    graphics.generateTexture('special-food', gs, gs);
  }

  create() {
    if (this.cameras && this.cameras.main) {
      this.cameras.main.scrollX = 0;
      this.cameras.main.scrollY = 0;
    }

    this.audioManager = new AudioManager();
    this.audioManager.init();

    this.snake = new Snake(this);
    this.snake.create();

    this.food = new Food(this);
    this.food.create();
    this.food.reposition(this.snake);

    this.domManager = new DomManager(this);
    this.inputManager = new InputManager(this, this.audioManager);

    this.gameUI = new GameUI(this);
    this.gameUI.create();

    this.isGameOver = false;
    this.isEscaped = false;
    this.finalPhaseStarted = false;
    this.score = 0;
    this.moveTimer = 0;

    this.sys.game.events.once('destroy', this.onDestroy);
    this.events.once('shutdown', this.onShutdown);
    window.addEventListener('scroll', this.handleScroll);
  }

  private onDestroy = () => {
    window.removeEventListener('scroll', this.handleScroll);
    this.restoreCanvas();
  }

  private onShutdown = () => {
    window.removeEventListener('scroll', this.handleScroll);
    this.restoreCanvas();
  }

  private restoreCanvas() {
    this.isEscaped = false;
    this.isGameOver = false;

    const canvas = this.game.canvas;
    const container = document.getElementById('phaser-game-container');
    if (container) {
      container.appendChild(canvas);
    } else {
      const shell = document.getElementById('game-container-shell');
      if (shell) {
        shell.appendChild(canvas);
      }
    }

    // Reset canvas inline styles
    canvas.style.position = '';
    canvas.style.top = '';
    canvas.style.left = '';
    canvas.style.width = '';
    canvas.style.height = '';
    canvas.style.zIndex = '';
    canvas.style.pointerEvents = '';

    // Reset camera scroll
    if (this.cameras && this.cameras.main) {
      this.cameras.main.scrollX = 0;
      this.cameras.main.scrollY = 0;
    }

    // Resize back to normal game size
    this.scale.resize(800, 600);

    // Clean up DomManager
    if (this.domManager) {
      this.domManager.destroy();
    }

    // Clear any running CSS animation timers to prevent memory leaks and style overrides
    DomAnimator.clearAll();

    // Restore DOM elements styles
    const eatenElements = document.querySelectorAll('[data-eaten], [data-card-eaten], .card-eaten');
    eatenElements.forEach((node) => {
      const el = node as HTMLElement;
      el.style.transform = '';
      el.style.opacity = '';
      el.style.visibility = '';
      el.style.background = '';
      el.style.borderColor = '';
      el.style.boxShadow = '';
      el.style.transition = '';
      el.classList.remove('card-eaten');
      delete el.dataset.eaten;
      delete el.dataset.cardEaten;
    });
  }

  private handleScroll = () => {
    if (this.isEscaped && this.cameras.main) {
      this.cameras.main.scrollX = window.scrollX;
      this.cameras.main.scrollY = window.scrollY;
    }
  }

  update(time: number, delta: number) {
    if (this.isGameOver) {
      if (this.input.keyboard?.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 250)) {
        this.scene.restart();
      }
      return;
    }

    this.inputManager.handleInput(this.snake);

    this.moveTimer += delta;

    if (this.moveTimer >= MOVE_INTERVAL) {
      this.moveTimer -= MOVE_INTERVAL;
      this.processGameTick(MOVE_INTERVAL);
    }
  }

  private processGameTick(duration: number) {
    const { dead, hitWall, newX, newY, tailOldX, tailOldY } = this.snake.move(duration, this.isEscaped);

    if (dead) {
      if (this.isEscaped && hitWall) {
        this.triggerWebBroke();
      } else {
        this.isGameOver = true;
        this.audioManager.playDieSound();
        this.gameUI.showGameOver();
      }
      return;
    }

    if (this.isEscaped) {
      this.processEscapePhase(newX, newY, tailOldX, tailOldY);
    } else {
      this.processNormalPhase(newX, newY, tailOldX, tailOldY);
    }
  }

  private processNormalPhase(newX: number, newY: number, tailOldX: number, tailOldY: number) {
    if (this.food.checkCollision(newX, newY, this.snake.stepSize)) {
      this.score += 10;
      this.game.events.emit('score-update', this.score);
      this.audioManager.playEatSound();
      
      this.snake.grow(tailOldX, tailOldY);
      this.food.reposition(this.snake);

      if (this.score >= 100) {
        this.food.spawnSpecial(this.snake);
      }
    }

    if (this.food.checkSpecialCollision(newX, newY, this.snake.stepSize)) {
      this.audioManager.playEatSound();
      this.triggerEscape();
    }
  }

  private processEscapePhase(newX: number, newY: number, tailOldX: number, tailOldY: number) {
    const headRect = new Phaser.Geom.Rectangle(
      newX - this.snake.stepSize / 2,
      newY - this.snake.stepSize / 2,
      this.snake.stepSize,
      this.snake.stepSize
    );
    
    const domHits = this.domManager.checkCollisions(headRect);
    if (domHits.length > 0) {
      const oldScore = this.score;
      domHits.forEach(domHit => {
        this.score += 1;
        this.game.events.emit('score-update', this.score);
        this.domManager.eatElement(domHit);
      });

      const previousTens = Math.floor(oldScore / 10);
      const currentTens = Math.floor(this.score / 10);
      for(let i=0; i < (currentTens - previousTens); i++){
         this.snake.grow(tailOldX, tailOldY);
      }

      this.audioManager.playEatSound();
    }
  }

  private triggerEscape() {
    this.isEscaped = true;
    this.food.hide();
    
    this.cameras.main.scrollX = window.scrollX;
    this.cameras.main.scrollY = window.scrollY;

    const canvas = this.game.canvas;
    const rect = canvas.getBoundingClientRect();
    const dx = rect.left + window.scrollX;
    const dy = rect.top + window.scrollY;

    const segments = this.snake.getSegments();
    segments.forEach(seg => {
      this.tweens.killTweensOf(seg);
      seg.x += dx;
      seg.y += dy;
    });

    // @ts-ignore
    this.snake.logicalPositions.forEach(pos => {
      pos.x += dx;
      pos.y += dy;
    });

    document.body.appendChild(canvas);
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';

    this.scale.resize(window.innerWidth, window.innerHeight);
    this.domManager.init();
  }

  private triggerWebBroke() {
    this.isGameOver = true;
    
    // Fade body background to black
    document.body.style.backgroundColor = 'black';
    document.body.style.transition = 'background-color 1s ease';

    const root = document.getElementById('root');
    if (root) {
      root.style.transition = 'all 2.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
      root.style.transform = 'rotate(25deg) scale(0) translateY(120vh)';
      root.style.opacity = '0';
      root.style.filter = 'blur(20px)';
    }

    // Fade out game canvas
    const canvas = this.game.canvas;
    canvas.style.transition = 'opacity 1s ease';
    canvas.style.opacity = '0';

    setTimeout(() => {
      window.location.reload();
    }, 3500);
  }
}
