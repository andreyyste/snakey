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

/**
 * DomManager orchestrates the integration between the Phaser game scene and the webpage.
 * It manages the lifecycle of scanned DOM elements, coordinates window resize and scroll checks, 
 * performs physics-like rectangle collision detection, and filters MutationObserver actions 
 * to handle dynamically loaded content without crashing the layout threads.
 */
export class DomManager {
  private scene: Phaser.Scene;
  private domBodies: IDomBody[] = [];
  private observer: MutationObserver | null = null;
  private isScanning: boolean = false;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Initializes the manager, performs the initial screen scan, binds window resizing hook, 
   * and registers the MutationObserver.
   */
  public init() {
    this.scanDomElements();
    window.addEventListener('resize', this.onResize);

    // Setup MutationObserver to watch for dynamically added DOM elements (lazy load, infinite scroll, etc).
    // This allows the snake to eat contents loaded dynamically as the user scrolls.
    this.observer = new MutationObserver((mutations) => {
      // Prevent loop: skip processing if we are currently modifying the DOM during scan/split operations.
      if (this.isScanning) return;
      
      let shouldRescan = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          // Prevent infinite reflow loops: ignore nodes that were added by the scanner itself (.edible-char).
          // Only trigger a full rescan if third-party layout elements were added to the DOM.
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
        // Disconnect temporarily to prevent mutation events while processing and splitting text.
        this.observer?.disconnect();
        this.scanDomElements();
        this.observer?.observe(document.body, { childList: true, subtree: true });
      }
    });

    this.observer.observe(document.body, { childList: true, subtree: true });

    // Ensure clean closure on scene changes or restarts to prevent ghost listeners.
    this.scene.sys.game.events.once('destroy', () => this.destroy());
    this.scene.events.once('shutdown', () => this.destroy());
  }

  /**
   * Callback executed when the browser window is resized.
   * Forces a fresh tree scan and updates all coordinate rectangles.
   */
  private onResize = () => {
    this.scanDomElements();
  }

  /**
   * Performs a comprehensive DOM scan.
   * Dynamically resolves the game container shell, passing it to the scanner 
   * to ensure the game container itself is excluded from eating loops.
   */
  private scanDomElements() {
    this.isScanning = true;
    try {
      const gameCanvas = this.scene.game?.canvas || null;
      // Dynamically locate the game container to exclude it from DOM eating.
      // Checks for custom React containers, falling back to the canvas's physical parent wrapper.
      const gameContainer = document.getElementById('phaser-game-container') || 
                            document.getElementById('game-container-shell') || 
                            (gameCanvas ? gameCanvas.parentElement : null);
      this.domBodies = DomScanner.scan(window.scrollX, window.scrollY, gameCanvas, gameContainer);
    } finally {
      this.isScanning = false;
    }
  }

  /**
   * Updates coordinates of all active elements.
   * Required when the page layout reflows or is scrolled to ensure 
   * coordinate parity between Phaser world space and DOM bounding boxes.
   */
  public updatePositions() {
    this.domBodies.forEach(item => {
      if (!item.hasBeenEaten) {
        const rect = item.element.getBoundingClientRect();
        item.body.setTo(rect.left + window.scrollX, rect.top + window.scrollY, rect.width, rect.height);
      }
    });
  }

  /**
   * Checks if the snake's head overlaps with any scanned DOM element.
   * Returns a list of all collided elements.
   * 
   * @param headRect Phaser boundary rectangle representing the snake's head
   */
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
  
  /**
   * Forwards eat requests to DomAnimator to trigger custom transition profiles.
   */
  public eatElement(item: IDomBody) {
    DomAnimator.animateEat(item, this.domBodies);
  }

  /**
   * Helper function to dynamically add elements to the tracking list.
   */
  public addBody(body: IDomBody) {
    this.domBodies.push(body);
  }

  /**
   * Returns the count of remaining edible DOM elements.
   */
  public getRemainingCount() {
    return this.domBodies.filter(i => !i.hasBeenEaten).length;
  }

  /**
   * Clean up event listeners and MutationObservers to avoid memory leaks.
   */
  public destroy() {
    window.removeEventListener('resize', this.onResize);
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
