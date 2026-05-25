import Phaser from 'phaser';
import { GRID_SIZE, MOVE_INTERVAL } from './constants';
import { AudioManager } from './systems/AudioManager';
import { GameUI } from './ui/GameUI';
import { Snake } from './core/Snake';
import { Food } from './core/Food';
import { DomManager } from './systems/DomManager';
export class SnakeScene extends Phaser.Scene {
  private snake!: Snake;
  private food!: Food;
  private audioManager!: AudioManager;
  private gameUI!: GameUI;
  private domManager!: DomManager;
  
  private moveTimer: number = 0;
  private score: number = 0;
  private isGameOver: boolean = false;
  private isEscaped: boolean = false;
  private finalPhaseStarted: boolean = false;
  private specialFood: Phaser.GameObjects.Image | null = null;
  private redPillSpawned: boolean = false;
  
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
    // Makanan Spesial (Red Pill)
    graphics.clear();
    graphics.fillStyle(0x000000, 1); // Hitam outer
    graphics.fillRoundedRect(gs / 4, gs / 4, gs / 2, gs / 2, 4 * factor);
    graphics.fillStyle(0xff0000, 1); // Merah inner
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
    this.gameUI = new GameUI(this);
    this.gameUI.create();
    this.isGameOver = false;
    this.isEscaped = false;
    this.redPillSpawned = false;
    this.specialFood = null;
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
    this.handleInput();
    this.moveTimer += delta;
    
    const currentInterval = MOVE_INTERVAL;
    
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
    const { dead, newX, newY, tailOldX, tailOldY } = this.snake.move(duration, this.isEscaped);
    if (dead) {
      this.isGameOver = true;
      this.audioManager.playDieSound();
      this.gameUI.showGameOver();
      return;
    }
    // Check DOM collision if escaped
    if (this.isEscaped) {
      const headRect = new Phaser.Geom.Rectangle(
        newX - this.snake.stepSize / 2,
        newY - this.snake.stepSize / 2,
        this.snake.stepSize,
        this.snake.stepSize
      );
      
      const domHits = this.domManager.checkCollisions(headRect);
      if (domHits && domHits.length > 0) {
        const oldScore = this.score;
        domHits.forEach(domHit => {
          this.score += 1; // Actually score is ignored for now per user request, but we keep the visual
          this.game.events.emit('score-update', this.score);
          
          if ((domHit as any).isWall) {
            domHit.element.style.transform = 'scale(0) rotate(90deg)';
            domHit.element.style.opacity = '0';
            this.domManager['domBodies'].filter(b => (b as any).isWall && b.element === domHit.element).forEach(b => b.hasBeenEaten = true);
          } else if ((domHit as any).isCardWall) {
            domHit.element.style.background = 'transparent';
            domHit.element.style.borderColor = 'transparent';
            domHit.element.style.boxShadow = 'none';
            this.domManager['domBodies'].filter(b => (b as any).isCardWall && b.element === domHit.element).forEach(b => b.hasBeenEaten = true);
          } else if ((domHit as any).isFinalTarget) {
            domHit.element.style.transform = 'scale(0) rotate(180deg)';
            domHit.element.style.opacity = '0';
            setTimeout(() => {
              domHit.element.style.visibility = 'hidden';
            }, 500);
          } else {
            domHit.element.style.transform = 'scale(0) translateY(-20px) rotate(180deg)';
            domHit.element.style.opacity = '0';
            setTimeout(() => {
              domHit.element.style.visibility = 'hidden';
            }, 500);
          }
        });
        const previousTens = Math.floor(oldScore / 10);
        const currentTens = Math.floor(this.score / 10);
        for(let i=0; i < (currentTens - previousTens); i++){
           this.snake.grow(tailOldX, tailOldY);
        }
        this.audioManager.playEatSound();
        // Check if any element was actually eaten to trigger broke state
        if (this.domManager.getRemainingCount() <= 0) {if (!this.finalPhaseStarted) {
            this.startFinalPhase();
          } else {
            this.triggerWebBroke();
          }
        }
      }
    }
    // Check normal food collision
    if (this.food && this.food.sprite && this.food.sprite.active) {
      const dist = Phaser.Math.Distance.Between(newX, newY, this.food.sprite.x, this.food.sprite.y);
      if (dist < this.snake.stepSize * 0.8) {
        this.score += 10;
        this.game.events.emit('score-update', this.score);
        this.audioManager.playEatSound();
        
        this.snake.grow(tailOldX, tailOldY);
        this.food.reposition(this.snake);
        // Spawn Red Pill logic
        if (!this.redPillSpawned && this.score >= 100 && !this.isEscaped) {
          this.spawnRedPill();
        }
      }
    }
    // Check special food collision
    if (this.specialFood && this.specialFood.active) {
      const dist = Phaser.Math.Distance.Between(newX, newY, this.specialFood.x, this.specialFood.y);
      if (dist < this.snake.stepSize * 0.8) {
        this.specialFood.destroy();
        this.audioManager.playEatSound();
        this.triggerEscape();
      }
    }
  }
  private spawnRedPill() {
    this.redPillSpawned = true;
    let valid = false;
    let rx = 0;
    let ry = 0;
    const margin = 32 * 2;
    while (!valid) {
      rx = Phaser.Math.Between(margin, 800 - margin);
      ry = Phaser.Math.Between(margin, 600 - margin);
      valid = true;
      for (const segment of this.snake.getSegments()) {
        if (Phaser.Math.Distance.Between(rx, ry, segment.x, segment.y) < this.snake.stepSize * 1.5) {
          valid = false;
          break;
        }
      }
    }
    
    this.specialFood = this.add.image(rx, ry, 'special-food').setOrigin(0.5);
    this.specialFood.setScale(0);
    this.tweens.add({
      targets: this.specialFood,
      scale: 0.3,
      duration: 500,
      ease: 'Elastic.out',
      yoyo: true,
      repeat: -1,
      hold: 500
    });
  }
  private triggerEscape() {
    this.isEscaped = true;
    
    // Hide game UI & normal food
    this.food.sprite.setVisible(false);
    this.food.sprite.setActive(false);
    
    // Initialize camera scroll to prevent jumping
    this.cameras.main.scrollX = window.scrollX;
    this.cameras.main.scrollY = window.scrollY;
    const canvas = this.game.canvas;
    const rect = canvas.getBoundingClientRect();
    const dx = rect.left + window.scrollX;
    const dy = rect.top + window.scrollY;
    // Shift snake positions so it doesn't jump
    const segments = this.snake.getSegments();
    segments.forEach(seg => {
      this.tweens.killTweensOf(seg);
      seg.x += dx;
      seg.y += dy;
    });
    // @ts-ignore - access logical positions
    this.snake.logicalPositions.forEach(pos => {
      pos.x += dx;
      pos.y += dy;
    });
    // Move canvas to body to completely escape React's CSS transforms and overflow: hidden
    document.body.appendChild(canvas);
    
    // Make canvas fullscreen via DOM directly
    canvas.style.position = 'fixed';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    // Resize game engine
    this.scale.resize(window.innerWidth, window.innerHeight);
    this.domManager.init();
  }
  private startFinalPhase() {
    this.finalPhaseStarted = true;
    
    // 1. Make Score Edible
    const scoreElement = document.getElementById('score-display');
    if (scoreElement) {
      scoreElement.style.border = '2px dashed red';
      scoreElement.style.transition = 'all 0.5s ease';
      
      const rect = scoreElement.getBoundingClientRect();
      this.domManager['domBodies'].push({
        element: scoreElement,
        body: new Phaser.Geom.Rectangle(rect.left + window.scrollX, rect.top + window.scrollY, rect.width, rect.height),
        id: 'score-display-target',
        hasBeenEaten: false,
        isFinalTarget: true
      } as any);
    }
    
    // 2. Create Cursor Tracker
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
    this.domManager['domBodies'].push({
      element: cursor,
      body: cursorBody,
      id: 'cursor-target',
      hasBeenEaten: false,
      isFinalTarget: true
    } as any);
    // Update cursor position on mouse move
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
