import Phaser from 'phaser';
import { IDomBody } from './DomManager';

export class DomScanner {
  // A generic list of standard HTML tags that are interactive, media-rich, or structural
  private static targetSelector = 'img, svg, video, input, textarea, button, a, select, progress, meter, canvas, hr, iframe, audio';

  public static scan(scrollX: number, scrollY: number, gameCanvas: HTMLCanvasElement | null = null): IDomBody[] {
    const domBodies: IDomBody[] = [];

    // Dynamically identify the game container shell to exclude it from being eaten
    const gameShell = gameCanvas 
      ? (document.getElementById('game-container-shell') || gameCanvas.closest('#game-container-shell') || gameCanvas.parentElement) 
      : null;

    // 1. First Pass: Find all text nodes recursively (including inside Shadow DOM)
    const textNodes: Text[] = [];
    this.findTextNodes(document.body, textNodes, gameCanvas, gameShell);
    
    // Replace text nodes with edible character spans
    textNodes.forEach(textNode => {
      this.replaceTextNodeWithSpans(textNode);
    });

    // 2. Second Pass: Traverse the DOM recursively to collect characters and matching elements
    this.collectEdibleElements(document.body, scrollX, scrollY, domBodies, gameCanvas, gameShell);

    // 3. Add game container walls
    this.addGameShellWalls(scrollX, scrollY, domBodies, gameShell);

    return domBodies;
  }

  /**
   * Evaluates whether an element should be ignored by the scanner.
   * Excludes the game's own interface, scripts, styles, overlays, and already eaten nodes.
   */
  private static isExcluded(el: HTMLElement, gameCanvas: HTMLCanvasElement | null, gameShell: HTMLElement | null, ignoreEdibleChar = false): boolean {
    if (el === gameCanvas) return true;
    if (el.dataset.eaten === 'true') return true;
    
    // Do not exclude elements if the game shell is body or html
    if (gameShell && gameShell !== document.body && gameShell !== document.documentElement) {
      if (gameShell.contains(el)) return true;
    }

    // Exclude the score display specifically since it is outside the shell in the local game
    if (el.closest('#score-display')) return true;
    
    // Ignore hidden utilities, code, and styling
    if (el.closest('script, style, noscript, .fixed.inset-0')) return true;

    // Only ignore already split character spans during the text-finding pass
    if (ignoreEdibleChar && el.closest('.edible-char')) return true;

    return false;
  }

  /**
   * Helper to detect if an element acts as a card layout.
   * Matches local card-containers and standard card classes, or dynamically detects block boxes 
   * on other websites that have shadow borders and a background.
   */
  private static isCardElement(el: HTMLElement, style: CSSStyleDeclaration): boolean {
    if (el.classList.contains('card-container') || el.classList.contains('card')) return true;
    
    const tagName = el.tagName.toLowerCase();
    if (tagName !== 'div' && tagName !== 'section' && tagName !== 'article') return false;
    
    const hasShadow = style.boxShadow && style.boxShadow !== 'none';
    const hasBorder = (style.borderStyle && style.borderStyle !== 'none' && parseFloat(style.borderWidth) > 0) ||
                      (style.borderWidth && parseFloat(style.borderWidth) > 0 && style.borderColor && style.borderColor !== 'transparent');
    const hasBg = style.backgroundColor && style.backgroundColor !== 'transparent' && style.backgroundColor !== 'rgba(0, 0, 0, 0)';
    
    // Card elements usually have a reasonable structural size
    const isLarge = el.offsetWidth > 150 && el.offsetHeight > 100;
    
    return isLarge && (hasShadow || (hasBorder && hasBg));
  }

  private static findTextNodes(node: Node, result: Text[], gameCanvas: HTMLCanvasElement | null = null, gameShell: HTMLElement | null = null) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue && node.nodeValue.trim()) {
        const parent = node.parentNode as HTMLElement;
        if (parent && !this.isExcluded(parent, gameCanvas, gameShell, true)) {
          result.push(node as Text);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (this.isExcluded(el, gameCanvas, gameShell, true)) return;
      
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return;

      el.childNodes.forEach(child => this.findTextNodes(child, result, gameCanvas, gameShell));
      if (el.shadowRoot) {
        el.shadowRoot.childNodes.forEach(child => this.findTextNodes(child, result, gameCanvas, gameShell));
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

  private static collectEdibleElements(
    node: Node, 
    scrollX: number, 
    scrollY: number, 
    domBodies: IDomBody[], 
    gameCanvas: HTMLCanvasElement | null = null, 
    gameShell: HTMLElement | null = null
  ) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (this.isExcluded(el, gameCanvas, gameShell, false)) return;

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
        // Check if it is a card container
        else if (this.isCardElement(el, style)) {
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
      el.childNodes.forEach(child => this.collectEdibleElements(child, scrollX, scrollY, domBodies, gameCanvas, gameShell));
      // Recurse into shadow DOM
      if (el.shadowRoot) {
        el.shadowRoot.childNodes.forEach(child => this.collectEdibleElements(child, scrollX, scrollY, domBodies, gameCanvas, gameShell));
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

  private static addGameShellWalls(scrollX: number, scrollY: number, domBodies: IDomBody[], gameShell: HTMLElement | null = null) {
    const container = gameShell || document.getElementById('game-container-shell');
    if (container && container !== document.body && container !== document.documentElement) {
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
