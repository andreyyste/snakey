import Phaser from 'phaser';
import { GRID_SIZE, MOVE_INTERVAL } from './constants';
import { AudioManager } from './systems/AudioManager';
import { GameUI } from './ui/GameUI';
import { Snake } from './core/Snake';
import { Food } from './core/Food';
import { DomManager } from './systems/DomManager';
import { InputManager } from './systems/InputManager';

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

    this.sys.game.events.on('destroy', () => {
      window.removeEventListener('scroll', this.handleScroll);
    });
    window.addEventListener('scroll', this.handleScroll);
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
    const { dead, newX, newY, tailOldX, tailOldY } = this.snake.move(duration, this.isEscaped);

    if (dead) {
      this.isGameOver = true;
      this.audioManager.playDieSound();
      this.gameUI.showGameOver();
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

      if (this.domManager.getRemainingCount() <= 0) {
        if (!this.finalPhaseStarted) {
          this.startFinalPhase();
        } else {
          this.triggerWebBroke();
        }
      }
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

  private startFinalPhase() {
    this.finalPhaseStarted = true;
    
    const scoreElement = document.getElementById('score-display');
    if (scoreElement) {
      scoreElement.style.border = '2px dashed red';
      scoreElement.style.transition = 'all 0.5s ease';
      
      const rect = scoreElement.getBoundingClientRect();
      this.domManager.addBody({
        element: scoreElement,
        body: new Phaser.Geom.Rectangle(rect.left + window.scrollX, rect.top + window.scrollY, rect.width, rect.height),
        id: 'score-display-target',
        hasBeenEaten: false,
        type: 'finalTarget'
      });
    }
    
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.width = '40px';
    cursor.style.height = '40px';
    cursor.style.borderRadius = '50%';
    cursor.style.border = '2px dashed red';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    document.body.appendChild(cursor);
    
    let cursorBody = new Phaser.Geom.Rectangle(0, 0, 40, 40);
    this.domManager.addBody({
      element: cursor,
      body: cursorBody,
      id: 'cursor-target',
      hasBeenEaten: false,
      type: 'finalTarget'
    });

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursorBody.setTo(e.clientX - 20 + window.scrollX, e.clientY - 20 + window.scrollY, 40, 40);
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    this.sys.game.events.once('destroy', () => {
      window.removeEventListener('mousemove', onMouseMove);
    });
  }

  private triggerWebBroke() {
    this.isGameOver = true;
    const root = document.getElementById('root');
    if (root) {
      root.style.transition = 'all 2s ease-in-out';
      root.style.transform = 'rotate(15deg) scale(0.5) translateY(100vh)';
      root.style.opacity = '0';
      root.style.filter = 'blur(10px)';
    }
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
}
