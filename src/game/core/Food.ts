import Phaser from 'phaser';
import { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import { Snake } from './Snake';

export class Food {
  private scene: Phaser.Scene;
  public sprite!: Phaser.GameObjects.Image;
  public specialSprite: Phaser.GameObjects.Image | null = null;
  public redPillSpawned: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create() {
    this.sprite = this.scene.add.image(0, 0, 'food').setOrigin(0.5);
    this.redPillSpawned = false;
    this.specialSprite = null;
  }

  private readonly TEXTURE_SCALE = 0.2;

  public reposition(snake: Snake) {
    const { rx, ry } = this.getRandomValidPosition(snake);
    this.sprite.setPosition(rx, ry);
    this.sprite.setScale(0);
    this.scene.tweens.add({
      targets: this.sprite,
      scale: this.TEXTURE_SCALE,
      duration: 200,
      ease: 'Back.out'
    });
  }

  public spawnSpecial(snake: Snake) {
    if (this.redPillSpawned) return;
    this.redPillSpawned = true;
    
    const { rx, ry } = this.getRandomValidPosition(snake);
    this.specialSprite = this.scene.add.image(rx, ry, 'special-food').setOrigin(0.5);
    this.specialSprite.setScale(0);
    this.scene.tweens.add({
      targets: this.specialSprite,
      scale: 0.3,
      duration: 500,
      ease: 'Elastic.out',
      yoyo: true,
      repeat: -1,
      hold: 500
    });
  }

  public hide() {
    this.sprite.setVisible(false);
    this.sprite.setActive(false);
  }

  public checkCollision(x: number, y: number, stepSize: number): boolean {
    if (!this.sprite.active) return false;
    const dist = Phaser.Math.Distance.Between(x, y, this.sprite.x, this.sprite.y);
    return dist < stepSize * 0.8;
  }

  public checkSpecialCollision(x: number, y: number, stepSize: number): boolean {
    if (!this.specialSprite || !this.specialSprite.active) return false;
    const dist = Phaser.Math.Distance.Between(x, y, this.specialSprite.x, this.specialSprite.y);
    if (dist < stepSize * 0.8) {
      this.specialSprite.destroy();
      this.specialSprite = null;
      return true;
    }
    return false;
  }

  private getRandomValidPosition(snake: Snake): { rx: number, ry: number } {
    let valid = false;
    let rx = 0;
    let ry = 0;
    const margin = GRID_SIZE * 2;

    while (!valid) {
      rx = Phaser.Math.Between(margin, CANVAS_WIDTH - margin);
      ry = Phaser.Math.Between(margin, CANVAS_HEIGHT - margin);

      valid = true;
      for (const segment of snake.getSegments()) {
        const dist = Phaser.Math.Distance.Between(rx, ry, segment.x, segment.y);
        if (dist < snake.stepSize * 1.5) {
          valid = false;
          break;
        }
      }
    }
    return { rx, ry };
  }
}
