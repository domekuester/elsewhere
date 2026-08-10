// The enquiry form has no server endpoint. It validates in the browser and hands a composed
// message to the visitor's own mail client, so there is nothing to post to, rate-limit, or leak.
const form = document.querySelector<HTMLFormElement>('[data-enquiry-form]');

if (form) {
  const address = form.querySelector<HTMLAnchorElement>('.contact-fallback a')?.textContent?.trim() ?? '';
  const typeSelect = form.querySelector<HTMLSelectElement>('#enquiry-type')!;
  const photoField = form.querySelector<HTMLElement>('[data-photo-field]')!;
  const photoInput = form.querySelector<HTMLInputElement>('#enquiry-photo')!;
  const messageHint = form.querySelector<HTMLElement>('[data-message-hint]')!;
  const parameters = new URLSearchParams(location.search);

  // A licensing enquiry must always identify the exact photograph, never "the third one from Japan".
  const requestedPhoto = parameters.get('photo');
  if (requestedPhoto && /^[A-Za-z0-9-]{1,32}$/.test(requestedPhoto)) {
    photoInput.value = requestedPhoto;
    photoField.hidden = false;
  }

  const requestedType = parameters.get('type');
  if (requestedType && [...typeSelect.options].some((option) => option.value === requestedType)) {
    typeSelect.value = requestedType;
  }

  const syncHint = () => {
    messageHint.hidden = !['licensing', 'print'].includes(typeSelect.value);
  };
  typeSelect.addEventListener('change', syncHint);
  syncHint();

  const setError = (field: HTMLInputElement | HTMLTextAreaElement, invalid: boolean) => {
    const error = form.querySelector<HTMLElement>(`[data-error-for="${field.id}"]`);
    field.setAttribute('aria-invalid', String(invalid));
    if (error) error.hidden = !invalid;
    return !invalid;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.querySelector<HTMLInputElement>('#enquiry-name')!;
    const email = form.querySelector<HTMLInputElement>('#enquiry-email')!;
    const organisation = form.querySelector<HTMLInputElement>('#enquiry-organisation')!;
    const message = form.querySelector<HTMLTextAreaElement>('#enquiry-message')!;

    const valid = [
      setError(name, name.value.trim().length === 0),
      setError(email, !email.checkValidity() || email.value.trim().length === 0),
      setError(message, message.value.trim().length === 0),
    ].every(Boolean);

    if (!valid) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    const label = typeSelect.options[typeSelect.selectedIndex]?.text ?? 'Enquiry';
    const reference = photoField.hidden ? '' : `Photograph: ${photoInput.value}\n`;
    const subject = photoField.hidden ? `${label} — Elsewhere` : `${label} — Elsewhere — ${photoInput.value}`;
    const body = [
      `${message.value.trim()}\n`,
      '—',
      `Name: ${name.value.trim()}`,
      `Email: ${email.value.trim()}`,
      ...(organisation.value.trim() ? [`Organisation: ${organisation.value.trim()}`] : []),
      `Enquiry: ${label}`,
      reference.trim(),
    ].filter(Boolean).join('\n');

    window.elsewhereTrack?.('enquiry_submit', photoField.hidden ? typeSelect.value : `${typeSelect.value}:${photoInput.value}`);
    window.location.href = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

export {};
