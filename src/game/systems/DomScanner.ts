import Phaser from 'phaser';
import { IDomBody } from './DomManager';

export class DomScanner {
  private static targetSelector = 'img, svg, video, input, textarea, button, a, select, progress, meter, canvas, hr, iframe, audio';

  public static scan(scrollX: number, scrollY: number, gameCanvas: HTMLCanvasElement | null = null, gameContainer: HTMLElement | null = null): IDomBody[] {
    const domBodies: IDomBody[] = [];

    // 1. First Pass: Find all text nodes recursively (including inside Shadow DOM)
    const textNodes: Text[] = [];
    this.findTextNodes(document.body, textNodes, gameCanvas, gameContainer);
    
    // Replace text nodes with edible character spans
    textNodes.forEach(textNode => {
      this.replaceTextNodeWithSpans(textNode);
    });

    // 2. Second Pass: Traverse the DOM recursively to collect characters and matching elements
    this.collectEdibleElements(document.body, scrollX, scrollY, domBodies, gameCanvas, gameContainer);

    // 3. Add game container walls
    this.addGameShellWalls(scrollX, scrollY, domBodies, gameContainer);

    return domBodies;
  }

  private static isExcludedElement(el: HTMLElement, gameCanvas: HTMLCanvasElement | null, gameContainer: HTMLElement | null, isTextScan: boolean = false): boolean {
    if (el === gameCanvas || el === gameContainer) return true;
    if (gameContainer && gameContainer.contains(el)) return true;
    if (el.dataset.eaten === 'true' || el.closest('[data-eaten="true"]')) return true;
    if (el.id === 'score-display') return true;

    const tagName = el.tagName.toLowerCase();
    if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
      return true;
    }

    if (isTextScan) {
      if (el.classList.contains('edible-char') || el.closest('.edible-char')) {
        return true;
      }
    }

    // Dynamic full-screen fixed overlay check (like backdrops, modal overlays)
    const style = window.getComputedStyle(el);
    if (style.position === 'fixed') {
      const rect = el.getBoundingClientRect();
      if (rect.width >= window.innerWidth * 0.9 && rect.height >= window.innerHeight * 0.9) {
        return true;
      }
    }

    return false;
  }

  private static findTextNodes(node: Node, result: Text[], gameCanvas: HTMLCanvasElement | null = null, gameContainer: HTMLElement | null = null) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue && node.nodeValue.trim()) {
        const parent = node.parentNode as HTMLElement;
        if (parent && !parent.closest('script, style, noscript, .edible-char, [data-eaten="true"]')) {
          // Prevent scanning text nodes that are part of the game container itself
          if (gameContainer && gameContainer.contains(parent)) return;
          result.push(node as Text);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (this.isExcludedElement(el, gameCanvas, gameContainer, true)) return;
      
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return;

      el.childNodes.forEach(child => this.findTextNodes(child, result, gameCanvas, gameContainer));
      if (el.shadowRoot) {
        el.shadowRoot.childNodes.forEach(child => this.findTextNodes(child, result, gameCanvas, gameContainer));
      }
    }
  }

  private static replaceTextNodeWithSpans(textNode: Text) {
    const text = textNode.nodeValue || '';
    const parent = textNode.parentNode;
    if (!parent) return;

    const fragment = document.createDocumentFragment();
    let hasValidChar = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.trim() === '') {
        fragment.appendChild(document.createTextNode(char));
      } else {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'edible-char';
        span.style.transition = 'all 0.3s ease';
        span.style.display = 'inline-block';
        fragment.appendChild(span);
        hasValidChar = true;
      }
    }

    if (hasValidChar) {
      parent.replaceChild(fragment, textNode);
    }
  }

  /**
   * Style-based card detection heuristic to identify card/block layout components dynamically.
   * Checks if an element has non-trivial boundaries (shadows, borders, or distinct backgrounds).
   */
  private static isCardElement(el: HTMLElement, style: CSSStyleDeclaration, rect: DOMRect): boolean {
    if (el === document.body || el === document.documentElement || el.id === 'root') return false;
    if (rect.width < 120 || rect.height < 80) return false;
    
    // Exclude large full-viewport layout sections/wrappers
    if (rect.width >= window.innerWidth * 0.9 || rect.height >= window.innerHeight * 0.9) return false;

    // Check if the element contains children (it must be a layout container, not a leaf tag)
    if (el.childElementCount === 0) return false;

    // 1. Box shadow (standard visual boundary for modern cards)
    const hasShadow = style.boxShadow !== 'none' && style.boxShadow !== '';
    // 2. Visible border
    const hasBorder = style.borderStyle !== 'none' && style.borderWidth !== '0px' && style.borderColor !== 'transparent';
    // 3. Different background color from transparent
    const hasBg = style.backgroundColor !== 'transparent' && style.backgroundColor !== 'rgba(0, 0, 0, 0)';

    return hasShadow || hasBorder || hasBg;
  }

  private static collectEdibleElements(node: Node, scrollX: number, scrollY: number, domBodies: IDomBody[], gameCanvas: HTMLCanvasElement | null = null, gameContainer: HTMLElement | null = null) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (this.isExcludedElement(el, gameCanvas, gameContainer)) return;

      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return;

      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        // Check if it is a split character
        if (el.classList.contains('edible-char')) {
          domBodies.push({
            element: el,
            body: new Phaser.Geom.Rectangle(rect.left + scrollX, rect.top + scrollY, rect.width, rect.height),
            id: `char-${domBodies.length}`,
            hasBeenEaten: false,
            type: 'char'
          });
        }
        // Check if it is a card container (exclude from targetSelector matching to prevent duplicate collisions)
        else if (this.isCardElement(el, style, rect)) {
          if (el.dataset.cardEaten !== 'true') {
            this.addCardWalls(el, rect, scrollX, scrollY, domBodies);
          }
        }
        // Check if it is a media or other interactive element
        else if (el.matches(this.targetSelector)) {
          // Add transition if not already set
          if (!el.style.transition) {
            el.style.transition = 'all 0.3s ease';
          }
          domBodies.push({
            element: el,
            body: new Phaser.Geom.Rectangle(rect.left + scrollX, rect.top + scrollY, rect.width, rect.height),
            id: `media-${domBodies.length}`,
            hasBeenEaten: false,
            type: 'media'
          });
        }
      }

      // Recurse into children
      el.childNodes.forEach(child => this.collectEdibleElements(child, scrollX, scrollY, domBodies, gameCanvas, gameContainer));
      // Recurse into shadow DOM
      if (el.shadowRoot) {
        el.shadowRoot.childNodes.forEach(child => this.collectEdibleElements(child, scrollX, scrollY, domBodies, gameCanvas, gameContainer));
      }
    }
  }

  private static addCardWalls(card: HTMLElement, rect: DOMRect, scrollX: number, scrollY: number, domBodies: IDomBody[]) {
    const ax = rect.left + scrollX;
    const ay = rect.top + scrollY;
    const w = rect.width;
    const h = rect.height;
    const thick = 15;
    
    // Add transition if not already set
    if (!card.style.transition) {
      card.style.transition = 'all 0.5s ease';
    }
    
    const walls = [
      new Phaser.Geom.Rectangle(ax, ay, w, thick),
      new Phaser.Geom.Rectangle(ax, ay + h - thick, w, thick),
      new Phaser.Geom.Rectangle(ax, ay, thick, h),
      new Phaser.Geom.Rectangle(ax + w - thick, ay, thick, h),
    ];
    
    walls.forEach((wall, wIdx) => {
      domBodies.push({
        element: card,
        body: wall,
        id: `card-${card.id || 'unnamed'}-wall-${wIdx}`,
        hasBeenEaten: false,
        type: 'cardWall'
      });
    });
  }

  private static addGameShellWalls(scrollX: number, scrollY: number, domBodies: IDomBody[], gameContainer: HTMLElement | null = null) {
    const container = gameContainer || document.getElementById('game-container-shell');
    if (container) {
      const rect = container.getBoundingClientRect();
      const ax = rect.left + scrollX;
      const ay = rect.top + scrollY;
      const w = rect.width;
      const h = rect.height;
      const thick = 15;
      
      container.style.transition = 'all 0.5s ease';
      
      const walls = [
        new Phaser.Geom.Rectangle(ax, ay, w, thick),
        new Phaser.Geom.Rectangle(ax, ay + h - thick, w, thick),
        new Phaser.Geom.Rectangle(ax, ay, thick, h),
        new Phaser.Geom.Rectangle(ax + w - thick, ay, thick, h),
      ];
      
      walls.forEach((wall, idx) => {
        domBodies.push({
          element: container,
          body: wall,
          id: `wall-${idx}`,
          hasBeenEaten: false,
          type: 'wall'
        });
      });
    }
  }
}
