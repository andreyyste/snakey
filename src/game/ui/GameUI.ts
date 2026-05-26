import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

export class GameUI {
  private scene: Phaser.Scene;
  private scoreText!: Phaser.GameObjects.Text;
  private scoreContainer!: Phaser.GameObjects.Container;
  private gameOverContainer!: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public create() {
    const scoreBg = this.scene.add.graphics();
    scoreBg.fillStyle(0xf8fafc, 1);
    scoreBg.lineStyle(2, 0xe2e8f0, 1);
    scoreBg.fillRoundedRect(0, 0, 100, 44, 22);
    scoreBg.strokeRoundedRect(0, 0, 100, 44, 22);

    this.scoreText = this.scene.add.text(60, 22, '0', {
      fontSize: '20px',
      color: '#0f172a',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    const scoreIcon = this.scene.add.image(24, 22, 'food').setScale(1.2);
    this.scoreContainer = this.scene.add.container(20, 20, [scoreBg, scoreIcon, this.scoreText]).setDepth(100);
  }

  public updateScore(score: number) {
    this.scoreText.setText(`${score}`);
    this.scene.tweens.add({
      targets: this.scoreContainer,
      scaleX: 1.1,
      scaleY: 1.1,
      yoyo: true,
      duration: 100
    });
  }

  public showGameOver() {
    const overlay = this.scene.add.rectangle(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH, CANVAS_HEIGHT, 0xffffff, 0.8);
    
    const box = this.scene.add.graphics();
    const boxW = 360; 
    const boxH = 180;
    box.fillStyle(0xffffff, 1);
    box.fillRoundedRect(-boxW/2, -boxH/2, boxW, boxH, 24);
    box.lineStyle(1, 0xe2e8f0, 1);
    box.strokeRoundedRect(-boxW/2, -boxH/2, boxW, boxH, 24);

    const title = this.scene.add.text(0, -20, 'Game Over', {
      fontSize: '32px',
      color: '#0f172a',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontStyle: '800'
    }).setOrigin(0.5);

    const subtitle = this.scene.add.text(0, 30, 'Press SPACE to Restart', {
      fontSize: '16px',
      color: '#64748b',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontStyle: '600'
    }).setOrigin(0.5);

    this.gameOverContainer = this.scene.add.container(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, [overlay, box, title, subtitle]);
    this.gameOverContainer.setDepth(200);

    this.gameOverContainer.setScale(0.9);
    this.gameOverContainer.setAlpha(0);
    this.scene.tweens.add({
      targets: this.gameOverContainer,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: 'Back.out'
    });
  }
}
