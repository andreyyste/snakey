import Phaser from 'phaser';
import { DomScanner } from './DomScanner';
import { DomAnimator } from './DomAnimator';

export type DomBodyType = 'char' | 'media' | 'wall' | 'cardWall' | 'finalTarget';

export interface IDomBody {
  element: HTMLElement;
  body: Phaser.Geom.Rectangle;
  id: string;
  hasBeenEaten: boolean;
  type: DomBodyType;
}

export class DomManager {
  private scene: Phaser.Scene;
  private domBodies: IDomBody[] = [];
  private observer: MutationObserver | null = null;
  private isScanning: boolean = false;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public init() {
    this.scanDomElements();
    window.addEventListener('resize', this.onResize);

    // Setup MutationObserver to watch for dynamically added DOM elements (lazy load, inf scroll, etc)
    this.observer = new MutationObserver((mutations) => {
      // Skip if we are currently modifying the DOM inside scanDomElements to prevent loop
      if (this.isScanning) return;
      
      let shouldRescan = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          const hasExternalNodes = Array.from(mutation.addedNodes).some(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
              return !el.classList.contains('edible-char') && !el.closest('.edible-char');
            }
            return true;
          });
          
          if (hasExternalNodes) {
            shouldRescan = true;
            break;
          }
        }
      }

      if (shouldRescan) {
        this.observer?.disconnect();
        this.scanDomElements();
        this.observer?.observe(document.body, { childList: true, subtree: true });
      }
    });

    this.observer.observe(document.body, { childList: true, subtree: true });

    // Clean up on scene destroy
    this.scene.sys.game.events.once('destroy', () => this.destroy());
    this.scene.events.once('shutdown', () => this.destroy());
  }

  private onResize = () => {
    this.scanDomElements();
    this.updatePositions();
  }

  private scanDomElements() {
    this.isScanning = true;
    try {
      const gameCanvas = this.scene.game?.canvas || null;
      this.domBodies = DomScanner.scan(window.scrollX, window.scrollY, gameCanvas);
    } finally {
      this.isScanning = false;
    }
  }

  public updatePositions() {
    this.domBodies.forEach(item => {
      if (!item.hasBeenEaten) {
        const rect = item.element.getBoundingClientRect();
        item.body.setTo(rect.left + window.scrollX, rect.top + window.scrollY, rect.width, rect.height);
      }
    });
  }

  public checkCollisions(headRect: Phaser.Geom.Rectangle): IDomBody[] {
    const hits: IDomBody[] = [];
    for (const item of this.domBodies) {
      if (!item.hasBeenEaten && Phaser.Geom.Intersects.RectangleToRectangle(item.body, headRect)) {
        item.hasBeenEaten = true;
        hits.push(item);
      }
    }
    return hits;
  }
  
  public eatElement(item: IDomBody) {
    DomAnimator.animateEat(item, this.domBodies);
  }

  public addBody(body: IDomBody) {
    this.domBodies.push(body);
  }

  public getRemainingCount() {
    return this.domBodies.filter(i => !i.hasBeenEaten).length;
  }

  public destroy() {
    window.removeEventListener('resize', this.onResize);
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
