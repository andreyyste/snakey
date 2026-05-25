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
    const factor = 5;
    const gs = GRID_SIZE * factor;
    
    // Body Ular
    graphics.fillStyle(0x3b82f6, 1);
    graphics.fillRoundedRect(1 * factor, 1 * factor, gs - 2 * factor, gs - 2 * factor, 4 * factor);
    graphics.generateTexture('snake-body', gs, gs);
    
    // Kepala Ular
    graphics.clear();
    graphics.fillStyle(0x1d4ed8, 1);
    graphics.fillRoundedRect(1 * factor, 1 * factor, gs - 2 * factor, gs - 2 * factor, 6 * factor);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(gs - 5 * factor, 6 * factor, 2 * factor); 
    graphics.fillCircle(gs - 5 * factor, gs - 6 * factor, 2 * factor); 
    graphics.generateTexture('snake-head', gs, gs);
    
    // Makanan
    graphics.clear();
    graphics.fillStyle(0xef4444, 1);
    graphics.fillCircle(gs / 2, gs / 2, gs / 2 - 2 * factor);
    graphics.generateTexture('food', gs, gs);
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
    
    // Scale interval by fatScale so velocity (px/sec) remains constant as stepSize increases
    const currentInterval = MOVE_INTERVAL * this.snake.fatScale;
    
    if (this.moveTimer >= currentInterval) {
      this.moveTimer -= currentInterval;
      this.processGameTick(currentInterval);
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

  private processGameTick(duration: number) {
    const { dead, newX, newY, tailOldX, tailOldY } = this.snake.move(duration);

    if (dead) {
      this.isGameOver = true;
      this.audioManager.playDieSound();
      this.gameUI.showGameOver();
      return;
    }

    // Check food collision
    const dist = Phaser.Math.Distance.Between(newX, newY, this.food.sprite.x, this.food.sprite.y);
    if (dist < this.snake.stepSize * 0.8) {
      this.score += 10;
      this.game.events.emit('score-update', this.score);
      this.audioManager.playEatSound();
      
      if (this.score >= 70) {
        this.snake.fatten();
      }
      this.snake.grow(tailOldX, tailOldY);
      
      this.food.reposition(this.snake);
    }
  }
}
