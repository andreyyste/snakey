import Phaser from 'phaser';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const MOVE_INTERVAL = 120; // milliseconds per move

export class SnakeScene extends Phaser.Scene {
  private snake: Phaser.GameObjects.Image[] = [];
  private food!: Phaser.GameObjects.Image;
  
  private direction: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 0);
  private nextDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 0);
  private moveTimer: number = 0;
  
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private scoreContainer!: Phaser.GameObjects.Container;
  
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  private isGameOver: boolean = false;
  private gameOverContainer!: Phaser.GameObjects.Container;
  
  private audioCtx: AudioContext | null = null;

  constructor() {
    super('SnakeScene');
  }

  private initAudio() {
    if (!this.audioCtx) {
      // Browser modern membutuhkan interaksi user sebelum memainkan audio
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }



  private playTurnSound() {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    // Suara "blip" tajam saat berbelok
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.audioCtx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  private playEatSound() {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    // Suara ceria saat makan apel
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    osc.frequency.setValueAtTime(900, this.audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime); // Volume naik
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.2);
  }

  private playDieSound() {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    // Suara "buzzer" kegagalan
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime); // Volume naik
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.4);
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
    
    // Makanan (Apel Merah)
    graphics.clear();
    graphics.fillStyle(0xef4444, 1);
    graphics.fillCircle(GRID_SIZE / 2, GRID_SIZE / 2, GRID_SIZE / 2 - 2);
    graphics.generateTexture('food', GRID_SIZE, GRID_SIZE);
  }

  create() {
    this.initAudio();

    this.isGameOver = false;
    this.snake = [];
    this.direction.set(1, 0);
    this.nextDirection.set(1, 0);
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

    const offset = GRID_SIZE / 2;
    const startX = Math.floor(CANVAS_WIDTH / 2 / GRID_SIZE) * GRID_SIZE + offset;
    const startY = Math.floor(CANVAS_HEIGHT / 2 / GRID_SIZE) * GRID_SIZE + offset;

    this.snake.push(this.add.image(startX, startY, 'snake-head').setOrigin(0.5));
    this.snake.push(this.add.image(startX - GRID_SIZE, startY, 'snake-body').setOrigin(0.5));
    this.snake.push(this.add.image(startX - GRID_SIZE * 2, startY, 'snake-body').setOrigin(0.5));

    this.food = this.add.image(0, 0, 'food').setOrigin(0.5);
    this.repositionFood();

    // UI Score Modern (Pill shape)
    const scoreBg = this.add.graphics();
    scoreBg.fillStyle(0xf8fafc, 1); // slate-50
    scoreBg.lineStyle(2, 0xe2e8f0, 1); // slate-200
    scoreBg.fillRoundedRect(0, 0, 100, 44, 22);
    scoreBg.strokeRoundedRect(0, 0, 100, 44, 22);

    this.scoreText = this.add.text(60, 22, '0', {
      fontSize: '20px',
      color: '#0f172a', // slate-900
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    // Apple Icon near score
    const scoreIcon = this.add.image(24, 22, 'food').setScale(1.2);

    this.scoreContainer = this.add.container(20, 20, [scoreBg, scoreIcon, this.scoreText]).setDepth(100);
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
      this.moveSnake();
      this.moveTimer = 0;
    }
  }

  private handleInput() {
    if ((this.cursors.left.isDown || this.wasd.left.isDown) && this.direction.x === 0) {
      this.initAudio();
      if (this.nextDirection.x !== -1) {
        this.nextDirection.set(-1, 0);
        this.playTurnSound();
      }
    } else if ((this.cursors.right.isDown || this.wasd.right.isDown) && this.direction.x === 0) {
      this.initAudio();
      if (this.nextDirection.x !== 1) {
        this.nextDirection.set(1, 0);
        this.playTurnSound();
      }
    } else if ((this.cursors.up.isDown || this.wasd.up.isDown) && this.direction.y === 0) {
      this.initAudio();
      if (this.nextDirection.y !== -1) {
        this.nextDirection.set(0, -1);
        this.playTurnSound();
      }
    } else if ((this.cursors.down.isDown || this.wasd.down.isDown) && this.direction.y === 0) {
      this.initAudio();
      if (this.nextDirection.y !== 1) {
        this.nextDirection.set(0, 1);
        this.playTurnSound();
      }
    }
  }

  private gameOver() {
    this.isGameOver = true;
    this.playDieSound();
    
    // UI Game Over Modern
    const overlay = this.add.rectangle(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH, CANVAS_HEIGHT, 0xffffff, 0.8);
    
    const box = this.add.graphics();
    const boxW = 360; 
    const boxH = 180;
    box.fillStyle(0xffffff, 1);
    box.fillRoundedRect(-boxW/2, -boxH/2, boxW, boxH, 24);
    box.lineStyle(1, 0xe2e8f0, 1);
    box.strokeRoundedRect(-boxW/2, -boxH/2, boxW, boxH, 24);

    const title = this.add.text(0, -20, 'Game Over', {
      fontSize: '32px',
      color: '#0f172a',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontStyle: '800'
    }).setOrigin(0.5);

    const subtitle = this.add.text(0, 30, 'Press SPACE to Restart', {
      fontSize: '16px',
      color: '#64748b',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontStyle: '600'
    }).setOrigin(0.5);

    this.gameOverContainer = this.add.container(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, [overlay, box, title, subtitle]);
    this.gameOverContainer.setDepth(200);

    // Animasi masuk
    this.gameOverContainer.setScale(0.9);
    this.gameOverContainer.setAlpha(0);
    this.tweens.add({
      targets: this.gameOverContainer,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: 'Back.out'
    });
  }

  private moveSnake() {
    this.direction.copy(this.nextDirection);

    const head = this.snake[0];
    
    const logicalHeadX = Math.round((head.x - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
    const logicalHeadY = Math.round((head.y - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;

    let newX = logicalHeadX + this.direction.x * GRID_SIZE;
    let newY = logicalHeadY + this.direction.y * GRID_SIZE;

    // Cek tabrakan dengan dinding
    if (newX >= CANVAS_WIDTH || newX < 0 || newY >= CANVAS_HEIGHT || newY < 0) {
      this.gameOver();
      return;
    }

    for (let i = 1; i < this.snake.length - 1; i++) {
      const seg = this.snake[i];
      const segX = Math.round((seg.x - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
      const segY = Math.round((seg.y - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
      
      if (Math.abs(newX - segX) < 2 && Math.abs(newY - segY) < 2) {
        this.gameOver();
        return; 
      }
    }

    const tail = this.snake[this.snake.length - 1];
    const tailOldX = Math.round((tail.x - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
    const tailOldY = Math.round((tail.y - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;

    for (let i = this.snake.length - 1; i > 0; i--) {
      const prev = this.snake[i - 1];
      const targetX = Math.round((prev.x - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
      const targetY = Math.round((prev.y - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
      
      const dx = Math.abs(this.snake[i].x - targetX);
      const dy = Math.abs(this.snake[i].y - targetY);

      if (dx > GRID_SIZE * 1.5 || dy > GRID_SIZE * 1.5) {
        this.snake[i].setPosition(targetX, targetY);
      } else {
        this.tweens.add({
          targets: this.snake[i],
          x: targetX,
          y: targetY,
          duration: MOVE_INTERVAL,
          ease: 'Linear'
        });
      }
    }

    this.tweens.add({
      targets: head,
      x: newX,
      y: newY,
      duration: MOVE_INTERVAL,
      ease: 'Linear'
    });
    
    if (this.direction.x === 1) head.setAngle(0);
    else if (this.direction.x === -1) head.setAngle(180);
    else if (this.direction.y === 1) head.setAngle(90);
    else if (this.direction.y === -1) head.setAngle(-90);

    if (Math.abs(newX - this.food.x) < 2 && Math.abs(newY - this.food.y) < 2) {
      this.eatFood(tailOldX, tailOldY);
    }
  }

  private eatFood(tailOldX: number, tailOldY: number) {
    this.score += 10;
    this.scoreText.setText(`${this.score}`);
    this.playEatSound();
    
    this.tweens.add({
      targets: this.scoreContainer,
      scaleX: 1.1,
      scaleY: 1.1,
      yoyo: true,
      duration: 100
    });

    const newSegment = this.add.image(tailOldX, tailOldY, 'snake-body').setOrigin(0.5);
    this.snake.push(newSegment);

    this.repositionFood();
  }

  private repositionFood() {
    let valid = false;
    let rx = 0;
    let ry = 0;

    while (!valid) {
      const gridX = Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE));
      const gridY = Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE));
      
      rx = gridX * GRID_SIZE + GRID_SIZE / 2;
      ry = gridY * GRID_SIZE + GRID_SIZE / 2;

      valid = true;
      for (const segment of this.snake) {
        const segX = Math.round((segment.x - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
        const segY = Math.round((segment.y - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
        if (Math.abs(segX - rx) < 2 && Math.abs(segY - ry) < 2) {
          valid = false;
          break;
        }
      }
    }

    this.food.setPosition(rx, ry);
    
    this.food.setScale(0);
    this.tweens.add({
      targets: this.food,
      scale: 1,
      duration: 200,
      ease: 'Back.out'
    });
  }
}
