import Phaser from 'phaser';
import { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, MOVE_INTERVAL } from '../constants';

export class Snake {
  private scene: Phaser.Scene;
  private segments: Phaser.GameObjects.Image[] = [];
  private logicalPositions: Phaser.Math.Vector2[] = [];
  public direction: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 0);
  public nextDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 0);
  public stepSize: number = GRID_SIZE;
  private readonly TEXTURE_SCALE = 0.2;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create() {
    const offset = GRID_SIZE / 2;
    const startX = Math.floor(CANVAS_WIDTH / 2 / GRID_SIZE) * GRID_SIZE + offset;
    const startY = Math.floor(CANVAS_HEIGHT / 2 / GRID_SIZE) * GRID_SIZE + offset;

    this.segments = [];
    this.logicalPositions = [];

    this.logicalPositions.push(new Phaser.Math.Vector2(startX, startY));
    this.logicalPositions.push(new Phaser.Math.Vector2(startX - GRID_SIZE, startY));
    this.logicalPositions.push(new Phaser.Math.Vector2(startX - GRID_SIZE * 2, startY));

    this.segments.push(this.scene.add.image(startX, startY, 'snake-head').setOrigin(0.5).setScale(this.TEXTURE_SCALE));
    this.segments.push(this.scene.add.image(startX - GRID_SIZE, startY, 'snake-body').setOrigin(0.5).setScale(this.TEXTURE_SCALE));
    this.segments.push(this.scene.add.image(startX - GRID_SIZE * 2, startY, 'snake-body').setOrigin(0.5).setScale(this.TEXTURE_SCALE));
    
    this.direction.set(1, 0);
    this.nextDirection.set(1, 0);
    this.stepSize = GRID_SIZE;
  }

  public getSegments() {
    return this.segments;
  }
  
  public getHead() {
    return this.segments[0];
  }

  // Returns collision result and old tail position for growing
  public move(duration: number, isEscaped: boolean = false): { dead: boolean, newX: number, newY: number, tailOldX: number, tailOldY: number } {
    this.direction.copy(this.nextDirection);
    
    const headPos = this.logicalPositions[0];
    let newX = headPos.x + this.direction.x * this.stepSize;
    let newY = headPos.y + this.direction.y * this.stepSize;

    let tailOldPos = this.logicalPositions[this.logicalPositions.length - 1];
    let tailOldX = tailOldPos.x;
    let tailOldY = tailOldPos.y;

    // Wall collision
    const boundsW = isEscaped ? document.documentElement.scrollWidth : CANVAS_WIDTH;
    const boundsH = isEscaped ? document.documentElement.scrollHeight : CANVAS_HEIGHT;

    if (newX >= boundsW || newX < 0 || newY >= boundsH || newY < 0) {
      if (isEscaped) {
        // Optional wrap around or just die. Let's wrap around when escaped!
        if (newX >= boundsW) newX = 0;
        else if (newX < 0) newX = boundsW;
        if (newY >= boundsH) newY = 0;
        else if (newY < 0) newY = boundsH;
      } else {
        return { dead: true, newX, newY, tailOldX, tailOldY };
      }
    }

    // Self collision (lenient hitbox)
    for (let i = 1; i < this.logicalPositions.length - 1; i++) {
      const pos = this.logicalPositions[i];
      const dist = Phaser.Math.Distance.Between(newX, newY, pos.x, pos.y);
      if (dist < this.stepSize * 0.4) {
        return { dead: true, newX, newY, tailOldX, tailOldY };
      }
    }

    // Update logical positions backwards
    for (let i = this.logicalPositions.length - 1; i > 0; i--) {
      this.logicalPositions[i].copy(this.logicalPositions[i - 1]);
    }
    
    // Update head logical position
    this.logicalPositions[0].set(newX, newY);

    // Tween sprites to match logical positions
    for (let i = 0; i < this.segments.length; i++) {
      const target = this.logicalPositions[i];
      const sprite = this.segments[i];
      
      const dx = Math.abs(sprite.x - target.x);
      const dy = Math.abs(sprite.y - target.y);

      if (dx > this.stepSize * 1.5 || dy > this.stepSize * 1.5) {
        sprite.setPosition(target.x, target.y);
      } else {
        this.scene.tweens.add({
          targets: sprite,
          x: target.x,
          y: target.y,
          duration: duration,
          ease: 'Linear'
        });
      }
    }
    
    const head = this.segments[0];
    if (this.direction.x === 1) head.setAngle(0);
    else if (this.direction.x === -1) head.setAngle(180);
    else if (this.direction.y === 1) head.setAngle(90);
    else if (this.direction.y === -1) head.setAngle(-90);

    return { dead: false, newX, newY, tailOldX, tailOldY };
  }

  public grow(tailOldX: number, tailOldY: number) {
    this.logicalPositions.push(new Phaser.Math.Vector2(tailOldX, tailOldY));
    const newSegment = this.scene.add.image(tailOldX, tailOldY, 'snake-body').setOrigin(0.5);
    newSegment.setScale(this.TEXTURE_SCALE);
    this.segments.push(newSegment);
  }

  public fatten() {
    // Disabled as requested
  }
}
