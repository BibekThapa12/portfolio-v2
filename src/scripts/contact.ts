// Contact compose window: Send opens the visitor's mail app with the chosen subject and their message.
// Without script the form still submits as a GET to mailto:, but browsers then encode spaces as "+".

export function mailtoHref(email: string, subject: string, body: string) {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body.trim()) params.push(`body=${encodeURIComponent(body.trim())}`);
  return `mailto:${email}?${params.join('&')}`;
}

export function startContact(form: HTMLFormElement) {
  const email = form.dataset.email!;
  const hint = form.querySelector<HTMLElement>('.compose-hint');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    location.href = mailtoHref(email, String(data.get('subject') ?? ''), String(data.get('body') ?? ''));
    if (hint) {
      hint.textContent = 'Opening your email app…';
      hint.classList.add('is-sent');
    }
  });
}
