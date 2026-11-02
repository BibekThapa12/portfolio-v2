// Hero monogram: "BT" drawn as a grid of flickering 0s and 1s. The digits fly in and assemble on load,
// scatter away from the pointer and spring back home. Reduced motion gets a single still frame.

interface Digit {
  hx: number; // home position (CSS px)
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  inside: boolean; // part of the letters, or a loose digit around them
  alpha: number;
  blue: boolean;
}

const RADIUS = 110; // how far the pointer pushes digits (CSS px at a 560px canvas)

export async function startMonogram(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  await document.fonts.load('700 100px Geist').catch(() => {});

  let digits: Digit[] = [];
  let size = 0, dpr = 1, scale = 1;
  let ink = '#ededef', accent = '#4da3ff';
  const pointer = { x: -1e4, y: -1e4 };
  let seed = 7;
  const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280; // stable layout on every visit
  const bit = () => (Math.random() < 0.5 ? '0' : '1');

  const readColours = () => {
    const css = getComputedStyle(document.documentElement);
    ink = css.getPropertyValue('--fg').trim();
    accent = css.getPropertyValue('--accent').trim();
  };

  // Lay out the digits: sample the letters on a grid, keep cells inside them plus a few loose ones
  const build = (fromScatter: boolean) => {
    size = canvas.clientWidth;
    if (!size) return;
    dpr = Math.min(devicePixelRatio, 2);
    scale = size / 560;
    canvas.width = canvas.height = Math.round(size * dpr);
    const off = document.createElement('canvas');
    off.width = off.height = Math.round(size);
    const o = off.getContext('2d')!;
    o.fillStyle = '#fff';
    o.font = `700 ${Math.round(size * 0.67)}px Geist, system-ui, sans-serif`;
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    o.fillText('BT', size / 2, size * 0.53);
    const px = o.getImageData(0, 0, off.width, off.height).data;
    // small screens keep a minimum spacing so the digits never overlap
    const stepX = Math.max(7, 8 * scale), stepY = Math.max(9, 10.5 * scale);
    seed = 7;
    digits = [];
    for (let y = stepY; y < size; y += stepY) {
      for (let x = stepX / 2; x < size; x += stepX) {
        const inside = px[((y | 0) * off.width + (x | 0)) * 4 + 3] > 128;
        if (!inside && rand() > 0.035) continue;
        const sx = fromScatter ? size / 2 + (rand() - 0.5) * size * 1.6 : x;
        const sy = fromScatter ? size / 2 + (rand() - 0.5) * size * 1.6 : y;
        digits.push({ hx: x, hy: y, x: sx, y: sy, vx: 0, vy: 0, char: bit(), inside, alpha: inside ? 0.55 + rand() * 0.45 : 0.18, blue: inside && rand() > 0.9 });
      }
    }
  };

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.font = `500 ${Math.max(8, 9 * scale)}px "Geist Mono", ui-monospace, Consolas, monospace`;
    ctx.textAlign = 'center';
    for (const d of digits) {
      ctx.globalAlpha = d.alpha;
      ctx.fillStyle = d.blue ? accent : ink;
      ctx.fillText(d.char, d.x, d.y);
    }
    ctx.globalAlpha = 1;
  };

  const step = () => {
    const r = RADIUS * scale;
    for (const d of digits) {
      const dx = d.x - pointer.x, dy = d.y - pointer.y, dist = Math.hypot(dx, dy);
      if (dist < r && dist > 0) {
        const push = ((r - dist) / r) * 3.2;
        d.vx += (dx / dist) * push;
        d.vy += (dy / dist) * push;
      }
      d.vx = (d.vx + (d.hx - d.x) * 0.045) * 0.86; // spring home, with damping
      d.vy = (d.vy + (d.hy - d.y) * 0.045) * 0.86;
      d.x += d.vx;
      d.y += d.vy;
      if (Math.random() < 0.012) d.char = bit(); // the flicker
    }
  };

  readColours();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { readColours(); draw(); });

  if (still.matches) {
    build(false);
    draw();
    addEventListener('resize', () => { build(false); draw(); });
    return;
  }

  build(true);
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  const loop = () => {
    if (visible) { step(); draw(); }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  addEventListener('pointermove', (e) => {
    const b = canvas.getBoundingClientRect();
    pointer.x = e.clientX - b.left;
    pointer.y = e.clientY - b.top;
  }, { passive: true });
  canvas.closest('.hero')?.addEventListener('pointerleave', () => { pointer.x = pointer.y = -1e4; });
  let resizeTimer = 0;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => build(false), 150); });
}
