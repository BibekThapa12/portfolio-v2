// Custom cursor for mouse users: a dot, a lagging ring that reacts to what is under it,
// and a soft spotlight that follows the pointer and lights the dot field beneath it (pulses on click).
import { gsap } from 'gsap';

export function startCursor() {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  if (!fine.matches) return; // touch screens keep their own behaviour

  const dot = Object.assign(document.createElement('div'), { className: 'cursor-dot' });
  const ring = Object.assign(document.createElement('div'), { className: 'cursor-ring' });
  const label = document.createElement('span');
  ring.append(label);
  // the light sits behind the content (see .spotlight), so it brightens the dots, never the text
  const light = Object.assign(document.createElement('div'), { className: 'spotlight' });
  for (const el of [light, ring, dot]) el.setAttribute('aria-hidden', 'true');
  document.body.append(light, ring, dot);
  document.documentElement.classList.add('custom-cursor');

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' });
  const lightX = gsap.quickTo(light, 'x', { duration: 0.6, ease: 'power3' });
  const lightY = gsap.quickTo(light, 'y', { duration: 0.6, ease: 'power3' });

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    dotX(e.clientX); dotY(e.clientY); ringX(e.clientX); ringY(e.clientY); lightX(e.clientX); lightY(e.clientY);
    document.documentElement.classList.add('cursor-in');
  }, { passive: true });
  document.addEventListener('pointerleave', () => document.documentElement.classList.remove('cursor-in'));

  // What is under the pointer changes the ring: links grow it, project windows say "View"
  document.addEventListener('pointerover', (e) => {
    const t = (e.target as Element).closest<HTMLElement>('a, button, [data-cursor]');
    ring.classList.toggle('is-link', !!t);
    const text = t?.dataset.cursor ?? '';
    ring.classList.toggle('has-label', !!text);
    label.textContent = text;
  });

  // Click: the ring squeezes and the light pulses
  addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    ring.classList.add('is-down');
    light.classList.remove('pulse');
    void light.offsetWidth; // restart the pulse animation on every click
    light.classList.add('pulse');
  });
  addEventListener('pointerup', () => ring.classList.remove('is-down'));
}
