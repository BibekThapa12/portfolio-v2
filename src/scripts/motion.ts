// Page motion with GSAP: hero intro, scroll entrances, 3D tilt on project cards, magnetic buttons.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('gsap-on');

// opacity, not autoAlpha: content waiting to animate stays readable to screen readers, find and print
const shown = { opacity: 1, y: 0, scale: 1 };
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Hero: the parts arrive in order on load
  gsap
    .timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
    .fromTo('.hero [data-reveal]', { opacity: 0, y: 28 }, { ...shown, stagger: 0.09 });

  // Every other section: its parts rise in once as it enters
  gsap.utils.toArray<HTMLElement>('main > section').forEach((section) => {
    gsap.fromTo(
      section.querySelectorAll('[data-reveal]'),
      { opacity: 0, y: 32 },
      { ...shown, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: section, start: 'top 80%', once: true } },
    );
  });


  // Education years count up to themselves when the cards arrive
  gsap.utils.toArray<HTMLElement>('.edu-year').forEach((el) => {
    const to = Number(el.textContent);
    const n = { v: to - 24 };
    el.textContent = String(n.v);
    gsap.to(n, { v: to, duration: 1.4, ease: 'power3.out', snap: { v: 1 }, onUpdate: () => { el.textContent = String(n.v); }, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });

  // Journey: the rail fills as you scroll through it and each step lights up as the fill reaches it.
  // Without this (no script, reduced motion) the rail is full and every step is lit.
  const journey = document.querySelector<HTMLElement>('.journey-wrap');
  if (!journey) return;
  journey.classList.add('journey-animated');
  const line = { start: 'top 60%', end: 'bottom 60%' };
  gsap.fromTo('.journey-progress', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: journey, ...line, scrub: true } });
  journey.querySelectorAll<HTMLElement>('.step').forEach((step) =>
    ScrollTrigger.create({
      trigger: step,
      start: 'top 60%',
      onEnter: () => step.classList.add('lit'),
      onLeaveBack: () => step.classList.remove('lit'),
    }),
  );
  return () => journey.classList.remove('journey-animated');
});

// Project cards tilt towards a mouse pointer, only where hovering exists and motion is welcome
mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
  const cards = gsap.utils.toArray<HTMLElement>('.project');
  const handlers = cards.map((card) => {
    const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      rotY(((e.clientX - r.left) / r.width - 0.5) * 6);
      rotX(-((e.clientY - r.top) / r.height - 0.5) * 6);
    };
    const leave = () => { rotX(0); rotY(0); };
    gsap.set(card, { transformPerspective: 1200 });
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', leave);
    return () => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); };
  });
  // Skill tiles and education cards: the soft light follows the pointer
  const spots = gsap.utils.toArray<HTMLElement>('.spot');
  const spotHandlers = spots.map((el) => {
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  });

  // Buttons lean towards the pointer, then spring back
  const magnets = gsap.utils.toArray<HTMLElement>('.btn').map((btn) => {
    const x = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' });
    const y = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });
    const move = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.3);
      y((e.clientY - r.top - r.height / 2) * 0.4);
    };
    const leave = () => { gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' }); };
    btn.addEventListener('pointermove', move);
    btn.addEventListener('pointerleave', leave);
    return () => { btn.removeEventListener('pointermove', move); btn.removeEventListener('pointerleave', leave); };
  });

  return () => [...handlers, ...spotHandlers, ...magnets].forEach((off) => off());
});

// Trigger positions depend on the web font's metrics
document.fonts.ready.then(() => ScrollTrigger.refresh());
