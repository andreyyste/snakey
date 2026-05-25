import Phaser from 'phaser';
import { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import { Snake } from './Snake';

export class Food {
  private scene: Phaser.Scene;
  public sprite!: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create() {
    this.sprite = this.scene.add.image(0, 0, 'food').setOrigin(0.5);
  }

  private readonly TEXTURE_SCALE = 0.2;

  public reposition(snake: Snake) {
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

    this.sprite.setPosition(rx, ry);
    
    this.sprite.setScale(0);
    this.scene.tweens.add({
      targets: this.sprite,
      scale: this.TEXTURE_SCALE,
      duration: 200,
      ease: 'Back.out'
    });
  }
}
