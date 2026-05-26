import Phaser from 'phaser';
import { GRID_SIZE, MOVE_INTERVAL } from './constants';
import { AudioManager } from './systems/AudioManager';
import { GameUI } from './ui/GameUI';
import { Snake } from './core/Snake';
import { Food } from './core/Food';

export class SnakeScene extends Phaser.Scene {
  private snake!: Snake;
  private food!: Food;
  private audioManager!: AudioManager;
  private gameUI!: GameUI;
  
  private moveTimer: number = 0;
  private score: number = 0;
  private isGameOver: boolean = false;
  
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super('SnakeScene');
  }

  preload() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Body Ular
    graphics.fillStyle(0x3b82f6, 1);
    graphics.fillRoundedRect(1, 1, GRID_SIZE - 2, GRID_SIZE - 2, 4);
    graphics.generateTexture('snake-body', GRID_SIZE, GRID_SIZE);
    
    // Kepala Ular
    graphics.clear();
    graphics.fillStyle(0x1d4ed8, 1);
    graphics.fillRoundedRect(1, 1, GRID_SIZE - 2, GRID_SIZE - 2, 6);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(GRID_SIZE - 5, 6, 2); 
    graphics.fillCircle(GRID_SIZE - 5, GRID_SIZE - 6, 2); 
    graphics.generateTexture('snake-head', GRID_SIZE, GRID_SIZE);
    
    // Makanan
    graphics.clear();
    graphics.fillStyle(0xef4444, 1);
    graphics.fillCircle(GRID_SIZE / 2, GRID_SIZE / 2, GRID_SIZE / 2 - 2);
    graphics.generateTexture('food', GRID_SIZE, GRID_SIZE);
  }

  create() {
    this.audioManager = new AudioManager();
    this.audioManager.init();

    this.snake = new Snake(this);
    this.snake.create();

    this.food = new Food(this);
    this.food.create();
    this.food.reposition(this.snake);

    this.gameUI = new GameUI(this);
    this.gameUI.create();

    this.isGameOver = false;
    this.score = 0;
    this.moveTimer = 0;

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
      }) as any;
    }
  }

  update(time: number, delta: number) {
    if (this.isGameOver) {
      if (this.input.keyboard?.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 250)) {
        this.scene.restart();
      }
      return;
    }

    this.handleInput();

    this.moveTimer += delta;
    if (this.moveTimer >= MOVE_INTERVAL) {
      this.processGameTick();
      this.moveTimer = 0;
    }
  }

  private handleInput() {
    const s = this.snake;
    if ((this.cursors.left.isDown || this.wasd.left.isDown) && s.direction.x === 0) {
      this.audioManager.init();
      if (s.nextDirection.x !== -1) {
        s.nextDirection.set(-1, 0);
        this.audioManager.playTurnSound();
      }
    } else if ((this.cursors.right.isDown || this.wasd.right.isDown) && s.direction.x === 0) {
      this.audioManager.init();
      if (s.nextDirection.x !== 1) {
        s.nextDirection.set(1, 0);
        this.audioManager.playTurnSound();
      }
    } else if ((this.cursors.up.isDown || this.wasd.up.isDown) && s.direction.y === 0) {
      this.audioManager.init();
      if (s.nextDirection.y !== -1) {
        s.nextDirection.set(0, -1);
        this.audioManager.playTurnSound();
      }
    } else if ((this.cursors.down.isDown || this.wasd.down.isDown) && s.direction.y === 0) {
      this.audioManager.init();
      if (s.nextDirection.y !== 1) {
        s.nextDirection.set(0, 1);
        this.audioManager.playTurnSound();
      }
    }
  }

  private processGameTick() {
    const { dead, newX, newY, tailOldX, tailOldY } = this.snake.move();

    if (dead) {
      this.isGameOver = true;
      this.audioManager.playDieSound();
      this.gameUI.showGameOver();
      return;
    }

    // Check food collision
    if (Math.abs(newX - this.food.sprite.x) < 2 && Math.abs(newY - this.food.sprite.y) < 2) {
      this.score += 10;
      this.gameUI.updateScore(this.score);
      this.audioManager.playEatSound();
      this.snake.grow(tailOldX, tailOldY);
      this.food.reposition(this.snake);
    }
  }
}
