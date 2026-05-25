import Phaser from 'phaser';

export class DomManager {
  private scene: Phaser.Scene;
  private domBodies: { element: HTMLElement, body: Phaser.Geom.Rectangle, id: string, hasBeenEaten: boolean }[] = [];
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public init() {
    this.scanDomElements();
    window.addEventListener('resize', () => {
      this.scanDomElements();
      this.updatePositions();
    });
  }

  private scanDomElements() {
    this.domBodies = [];

    // Walk the DOM to find all text nodes
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const nodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      nodes.push(node as Text);
    }

    nodes.forEach(textNode => {
      if (!textNode.nodeValue || !textNode.nodeValue.trim()) return;
      
      const parent = textNode.parentNode as HTMLElement;
      if (!parent) return;

      // Skip elements that shouldn't be eaten (canvas overlay, dummy container, scripts)
      if (parent.closest('script, style, noscript, .fixed.inset-0, #game-container-shell')) return;
      
      const rect = parent.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      if (parent.computedStyleMap?.().get('visibility')?.toString() === 'hidden') return;

      const text = textNode.nodeValue;
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
          // Ensure it can be transformed and measured properly, but keep layout inline
          span.style.display = 'inline-block';
          fragment.appendChild(span);
          hasValidChar = true;
        }
      }

      if (hasValidChar) {
        parent.replaceChild(fragment, textNode);
      }
    });

    // Collect all newly created edible characters
    const edibleSpans = document.querySelectorAll('.edible-char');
    edibleSpans.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      
      this.domBodies.push({
        element: el as HTMLElement,
        body: new Phaser.Geom.Rectangle(rect.left + window.scrollX, rect.top + window.scrollY, rect.width, rect.height),
        id: `char-${index}`,
        hasBeenEaten: false
      });
    });

    // Collect non-text media, inputs, badges, and icon containers
    const nonTextElements = document.querySelectorAll('img, svg, video, input, textarea, button, a, .bg-white.rounded-lg, .w-10.h-10');
    nonTextElements.forEach((el, index) => {
      if (el.closest('.fixed.inset-0, #game-container-shell')) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      if (el.computedStyleMap?.().get('visibility')?.toString() === 'hidden') return;
      
      (el as HTMLElement).style.transition = 'all 0.3s ease';
      this.domBodies.push({
        element: el as HTMLElement,
        body: new Phaser.Geom.Rectangle(rect.left + window.scrollX, rect.top + window.scrollY, rect.width, rect.height),
        id: `media-${index}`,
        hasBeenEaten: false
      });
    });

    // Add container walls
    const container = document.getElementById('game-container-shell');
    if (container) {
      const rect = container.getBoundingClientRect();
      const ax = rect.left + window.scrollX;
      const ay = rect.top + window.scrollY;
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
        this.domBodies.push({
          element: container,
          body: wall,
          id: `wall-${idx}`,
          hasBeenEaten: false,
          isWall: true
        } as any);
      });
    }
      
    // Add cards as hollow walls
    const cards = document.querySelectorAll('.bg-white.rounded-2xl');
    cards.forEach((card, index) => {
      if (card.id === 'game-container-shell') return;
      const rect = card.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      
      const ax = rect.left + window.scrollX;
      const ay = rect.top + window.scrollY;
      const w = rect.width;
      const h = rect.height;
      const thick = 15;
      
      (card as HTMLElement).style.transition = 'all 0.5s ease';
      
      const walls = [
        new Phaser.Geom.Rectangle(ax, ay, w, thick),
        new Phaser.Geom.Rectangle(ax, ay + h - thick, w, thick),
        new Phaser.Geom.Rectangle(ax, ay, thick, h),
        new Phaser.Geom.Rectangle(ax + w - thick, ay, thick, h),
      ];
      
      walls.forEach((wall, wIdx) => {
        this.domBodies.push({
          element: card as HTMLElement,
          body: wall,
          id: `card-${index}-wall-${wIdx}`,
          hasBeenEaten: false,
          isCardWall: true
        } as any);
      });
    });
  }

  public updatePositions() {
    this.domBodies.forEach(item => {
      if (!item.hasBeenEaten) {
        const rect = item.element.getBoundingClientRect();
        item.body.setTo(rect.left + window.scrollX, rect.top + window.scrollY, rect.width, rect.height);
      }
    });
  }

  public checkCollisions(headRect: Phaser.Geom.Rectangle): { element: HTMLElement, body: Phaser.Geom.Rectangle }[] {
    const hits: { element: HTMLElement, body: Phaser.Geom.Rectangle }[] = [];
    for (const item of this.domBodies) {
      if (!item.hasBeenEaten && Phaser.Geom.Intersects.RectangleToRectangle(item.body, headRect)) {
        item.hasBeenEaten = true;
        hits.push(item);
      }
    }
    return hits;
  }
  
  public getRemainingCount() {
    return this.domBodies.filter(i => !i.hasBeenEaten).length;
  }
}
