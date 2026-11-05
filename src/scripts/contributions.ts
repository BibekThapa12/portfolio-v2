// GitHub contributions calendar, loaded live on every visit and drawn in the site's own colours.
// shortcut: uses a public, token-free proxy of GitHub's calendar; move to GitHub's GraphQL API behind a serverless function if it goes away.
const API = 'https://github-contributions-api.jogruber.de/v4/';

type Day = { date: string; count: number; level: number };

// Pads the front so the first column starts on Sunday, like GitHub's calendar.
export function withLeadingBlanks(days: Day[]): (Day | null)[] {
  const pad = days.length ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0;
  return [...Array<null>(pad).fill(null), ...days];
}

const fmt = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const monthName = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' });

export async function startContributions(root: HTMLElement) {
  const grid = root.querySelector<HTMLElement>('.gh-grid')!;
  const months = root.querySelector<HTMLElement>('.gh-months')!;
  const total = root.closest('section')!.querySelector<HTMLElement>('.gh-total')!;
  try {
    const res = await fetch(`${API}${root.dataset.user}?y=last`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: { total: { lastYear: number }; contributions: Day[] } = await res.json();
    const cells = withLeadingBlanks(data.contributions);

    grid.replaceChildren(...cells.map((d) => {
      const cell = document.createElement('i');
      if (d) {
        cell.dataset.l = String(d.level);
        cell.title = `${d.count || 'No'} contribution${d.count === 1 ? '' : 's'} on ${fmt.format(new Date(`${d.date}T00:00:00Z`))}`;
      } else cell.className = 'blank';
      return cell;
    }));

    // a month label over the first week that starts in that month; none in the last two weeks, where it would overflow
    let last = '';
    const weeks = Math.ceil(cells.length / 7);
    months.replaceChildren();
    for (let w = 0; w < weeks; w++) {
      const first = cells.slice(w * 7, w * 7 + 7).find(Boolean);
      const m = first ? monthName.format(new Date(`${first.date}T00:00:00Z`)) : '';
      if (m && m !== last && w > 0 && w < weeks - 2) {
        const label = document.createElement('span');
        label.textContent = m;
        label.style.gridColumn = String(w + 1);
        months.append(label);
      }
      last = m || last;
    }

    const n = data.total.lastYear;
    const line = (v: number) => `${v.toLocaleString('en')} contribution${n === 1 ? '' : 's'} in the last year, loaded live from GitHub.`;
    total.textContent = line(n);
    grid.setAttribute('aria-label', `GitHub contributions calendar: ${n} in the last year`);
    root.classList.add('is-loaded');
    // phones scroll the calendar sideways; start them on the most recent weeks
    const scroller = root.querySelector<HTMLElement>('.gh-scroll')!;
    scroller.scrollLeft = scroller.scrollWidth;
    animate(root, total, n, line);
  } catch {
    total.textContent = 'Live activity could not be loaded right now. It is always on my GitHub profile.';
    root.classList.add('is-error');
  }
}

// Like the other sections: once the card scrolls into view, the weeks fill in left to right and the total counts up.
// Reduced motion keeps the finished calendar as it is.
async function animate(root: HTMLElement, total: HTMLElement, n: number, line: (v: number) => string) {
  if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  const scrollTrigger = { trigger: root, start: 'top 80%', once: true };
  // cells run down each week (column) before the next; no overshoot ease, since scaling past 1 overflows the scroller and flashes a scrollbar
  gsap.fromTo(root.querySelectorAll('.gh-grid i'), { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'power3.out', stagger: (i) => Math.floor(i / 7) * 0.022 + (i % 7) * 0.01, scrollTrigger });
  gsap.fromTo(root.querySelectorAll('.gh-months span'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.09, scrollTrigger });
  const count = { v: 0 };
  gsap.to(count, { v: n, duration: 1.6, ease: 'power3.out', snap: { v: 1 }, onStart: () => { total.setAttribute('aria-live', 'off'); total.textContent = line(0); }, onUpdate: () => { total.textContent = line(count.v); }, scrollTrigger: { trigger: root.closest('section')!, start: 'top 80%', once: true } });
}
