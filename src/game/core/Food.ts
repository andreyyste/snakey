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

  public reposition(snake: Snake) {
    let valid = false;
    let rx = 0;
    let ry = 0;

    while (!valid) {
      const gridX = Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE));
      const gridY = Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE));
      
      rx = gridX * GRID_SIZE + GRID_SIZE / 2;
      ry = gridY * GRID_SIZE + GRID_SIZE / 2;

      valid = true;
      for (const segment of snake.getSegments()) {
        const segX = Math.round((segment.x - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
        const segY = Math.round((segment.y - GRID_SIZE / 2) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
        if (Math.abs(segX - rx) < 2 && Math.abs(segY - ry) < 2) {
          valid = false;
          break;
        }
      }
    }

    this.sprite.setPosition(rx, ry);
    
    this.sprite.setScale(0);
    this.scene.tweens.add({
      targets: this.sprite,
      scale: 1,
      duration: 200,
      ease: 'Back.out'
    });
  }
}
