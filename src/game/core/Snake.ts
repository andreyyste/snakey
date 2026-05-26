import Phaser from 'phaser';
import { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, MOVE_INTERVAL } from '../constants';

export class Snake {
  private scene: Phaser.Scene;
  private segments: Phaser.GameObjects.Image[] = [];
  public direction: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 0);
  public nextDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 0);

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create() {
    const offset = GRID_SIZE / 2;
    const startX = Math.floor(CANVAS_WIDTH / 2 / GRID_SIZE) * GRID_SIZE + offset;
    const startY = Math.floor(CANVAS_HEIGHT / 2 / GRID_SIZE) * GRID_SIZE + offset;

    this.segments = [];
    this.segments.push(this.scene.add.image(startX, startY, 'snake-head').setOrigin(0.5));
    this.segments.push(this.scene.add.image(startX - GRID_SIZE, startY, 'snake-body').setOrigin(0.5));
    this.segments.push(this.scene.add.image(startX - GRID_SIZE * 2, startY, 'snake-body').setOrigin(0.5));
    
    this.direction.set(1, 0);
    this.nextDirection.set(1, 0);
  }

  public getSegments() {
    return this.segments;
  }
  
  public getHead() {
    return this.segments[0];
  }

  // Returns collision result and old tail position for growing
  public move(): { dead: boolean, newX: number, newY: number, tailOldX: number, tailOldY: number } {
    this.direction.copy(this.nextDirection);
    const head = this.segments[0];
    
    const logicalHeadX = Math.round((head.x - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
    const logicalHeadY = Math.round((head.y - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;

    let newX = logicalHeadX + this.direction.x * GRID_SIZE;
    let newY = logicalHeadY + this.direction.y * GRID_SIZE;

    let tailOldX = 0, tailOldY = 0;

    // Wall collision
    if (newX >= CANVAS_WIDTH || newX < 0 || newY >= CANVAS_HEIGHT || newY < 0) {
      return { dead: true, newX, newY, tailOldX, tailOldY };
    }

    // Self collision
    for (let i = 1; i < this.segments.length - 1; i++) {
      const seg = this.segments[i];
      const segX = Math.round((seg.x - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
      const segY = Math.round((seg.y - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
      
      if (Math.abs(newX - segX) < 2 && Math.abs(newY - segY) < 2) {
        return { dead: true, newX, newY, tailOldX, tailOldY };
      }
    }

    const tail = this.segments[this.segments.length - 1];
    tailOldX = Math.round((tail.x - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
    tailOldY = Math.round((tail.y - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;

    // Move body
    for (let i = this.segments.length - 1; i > 0; i--) {
      const prev = this.segments[i - 1];
      const targetX = Math.round((prev.x - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
      const targetY = Math.round((prev.y - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
      
      const dx = Math.abs(this.segments[i].x - targetX);
      const dy = Math.abs(this.segments[i].y - targetY);

      if (dx > GRID_SIZE * 1.5 || dy > GRID_SIZE * 1.5) {
        this.segments[i].setPosition(targetX, targetY);
      } else {
        this.scene.tweens.add({
          targets: this.segments[i],
          x: targetX,
          y: targetY,
          duration: MOVE_INTERVAL,
          ease: 'Linear'
        });
      }
    }

    // Move head
    this.scene.tweens.add({
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

    return { dead: false, newX, newY, tailOldX, tailOldY };
  }

  public grow(tailOldX: number, tailOldY: number) {
    const newSegment = this.scene.add.image(tailOldX, tailOldY, 'snake-body').setOrigin(0.5);
    this.segments.push(newSegment);
  }
}
