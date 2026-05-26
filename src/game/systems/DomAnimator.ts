import { IDomBody } from './DomManager';

export class DomAnimator {
  private static activeIntervals = new Set<any>();
  private static activeTimeouts = new Set<any>();

  /**
   * Clears all running intervals and timeouts registered by this animator.
   * This is critical to call when the game is restarted or destroyed to prevent memory leaks 
   * and callbacks running in the background after the elements have been restored/unmounted.
   */
  public static clearAll() {
    this.activeIntervals.forEach(id => clearInterval(id));
    this.activeIntervals.clear();
    this.activeTimeouts.forEach(id => clearTimeout(id));
    this.activeTimeouts.clear();
  }

  public static animateEat(item: IDomBody, domBodies: IDomBody[]) {
    if (item.element) {
      if (item.type === 'cardWall') {
        item.element.dataset.cardEaten = 'true';
      } else {
        item.element.dataset.eaten = 'true';
      }
    }

    // Mark descendants as eaten to avoid "ghost" collisions, except for cardWall
    if (item.element && item.type !== 'cardWall') {
      domBodies.forEach(b => {
        if (!b.hasBeenEaten && b !== item && item.element.contains(b.element)) {
          b.hasBeenEaten = true;
          if (b.element) {
            b.element.dataset.eaten = 'true';
          }
          b.element.style.transform = 'scale(0)';
          b.element.style.opacity = '0';
        }
      });
    }

    const el = item.element;
    if (!el) return;

    if (item.type === 'wall') {
      el.style.transform = 'scale(0) rotate(90deg)';
      el.style.opacity = '0';
      // Mark all wall segments of this container as eaten to avoid duplicate animations
      domBodies
        .filter(b => b.type === 'wall' && b.element === el)
        .forEach(b => (b.hasBeenEaten = true));
    } else if (item.type === 'cardWall') {
      el.classList.add('card-eaten');
      // Mark all wall segments of this card as eaten
      domBodies
        .filter(b => b.type === 'cardWall' && b.element === el)
        .forEach(b => (b.hasBeenEaten = true));
    } else if (item.type === 'finalTarget') {
      el.style.transform = 'scale(0) rotate(180deg)';
      el.style.opacity = '0';
      const timeoutId = setTimeout(() => {
        el.style.visibility = 'hidden';
        DomAnimator.activeTimeouts.delete(timeoutId);
      }, 500);
      DomAnimator.activeTimeouts.add(timeoutId);
    } else {
      // Tag-specific custom animations for different elements
      const tagName = el.tagName.toLowerCase();

      if (tagName === 'select') {
        const select = el as HTMLSelectElement;
        // Expand the dropdown list visually
        select.size = Math.max(select.options.length, 3);
        select.style.transform = 'scale(1.05)';
        
        const timeoutId1 = setTimeout(() => {
          select.style.transition = 'all 0.5s ease';
          select.style.transform = 'scale(0) rotate(90deg)';
          select.style.opacity = '0';
          const timeoutId2 = setTimeout(() => {
            select.style.visibility = 'hidden';
            DomAnimator.activeTimeouts.delete(timeoutId2);
          }, 500);
          DomAnimator.activeTimeouts.add(timeoutId2);
          DomAnimator.activeTimeouts.delete(timeoutId1);
        }, 300);
        DomAnimator.activeTimeouts.add(timeoutId1);
      } 
      else if (tagName === 'hr') {
        // Shrink horizontally to 0 width
        el.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        el.style.transform = 'scaleX(0)';
        el.style.opacity = '0';
      } 
      else if (tagName === 'progress' || tagName === 'meter') {
        const prog = el as HTMLProgressElement | HTMLMeterElement;
        // Drain value down to 0
        const startVal = prog.value;
        let currentVal = startVal;
        const steps = 10;
        const interval = 20; // 200ms total
        const stepVal = startVal / steps;
        
        const drain = setInterval(() => {
          currentVal -= stepVal;
          if (currentVal <= 0) {
            clearInterval(drain);
            DomAnimator.activeIntervals.delete(drain);
            prog.value = 0;
            prog.style.transform = 'scale(0) rotate(180deg)';
            prog.style.opacity = '0';
          } else {
            prog.value = currentVal;
          }
        }, interval);
        DomAnimator.activeIntervals.add(drain);
      } 
      else if (tagName === 'input' && ((el as HTMLInputElement).type === 'checkbox' || (el as HTMLInputElement).type === 'radio')) {
        const input = el as HTMLInputElement;
        // Toggle rapidly to simulate a frantic click
        let count = 0;
        const toggle = setInterval(() => {
          input.checked = !input.checked;
          count++;
          if (count >= 6) {
            clearInterval(toggle);
            DomAnimator.activeIntervals.delete(toggle);
            input.style.transform = 'scale(0)';
            input.style.opacity = '0';
          }
        }, 50);
        DomAnimator.activeIntervals.add(toggle);
      }
      else if (tagName === 'input' || tagName === 'textarea') {
        // Shaking vibration effect before shrinking
        let offset = 0;
        const vibrate = setInterval(() => {
          offset = offset === 0 ? 5 : 0;
          el.style.transform = `translateX(${offset}px)`;
        }, 50);
        DomAnimator.activeIntervals.add(vibrate);
        
        const timeoutId1 = setTimeout(() => {
          clearInterval(vibrate);
          DomAnimator.activeIntervals.delete(vibrate);
          el.style.transition = 'all 0.4s ease';
          el.style.transform = 'scale(0) rotate(-45deg)';
          el.style.opacity = '0';
          const timeoutId2 = setTimeout(() => {
            el.style.visibility = 'hidden';
            DomAnimator.activeTimeouts.delete(timeoutId2);
          }, 400);
          DomAnimator.activeTimeouts.add(timeoutId2);
          DomAnimator.activeTimeouts.delete(timeoutId1);
        }, 400);
        DomAnimator.activeTimeouts.add(timeoutId1);
      }
      else if (tagName === 'iframe') {
        // Spin and fall down
        el.style.transition = 'transform 0.8s ease-in, opacity 0.8s ease-in';
        el.style.transform = 'translateY(150px) rotate(360deg) scale(0)';
        el.style.opacity = '0';
      }
      else if (tagName === 'video' || tagName === 'audio') {
        const media = el as HTMLVideoElement | HTMLAudioElement;
        // Fast forward play rate and fade out volume if playing
        try {
          if (!media.paused) {
            media.playbackRate = 3.0;
            let vol = media.volume;
            const fade = setInterval(() => {
              vol = Math.max(0, vol - 0.1);
              media.volume = vol;
              if (vol <= 0) {
                clearInterval(fade);
                DomAnimator.activeIntervals.delete(fade);
                media.pause();
              }
            }, 30);
            DomAnimator.activeIntervals.add(fade);
          }
        } catch (e) {
          // Ignore potential browser safety restrictions on volume/playbackRate updates
        }
        el.style.transform = 'scale(0) rotate(-180deg)';
        el.style.opacity = '0';
      }
      else {
        // Default animation (spins and shrinks)
        el.style.transform = 'scale(0) translateY(-20px) rotate(180deg)';
        el.style.opacity = '0';
        const timeoutId = setTimeout(() => {
          el.style.visibility = 'hidden';
          DomAnimator.activeTimeouts.delete(timeoutId);
        }, 500);
        DomAnimator.activeTimeouts.add(timeoutId);
      }
    }
  }
}
