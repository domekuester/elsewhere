// The licensing enquiry funnel.
//
// Two jobs, deliberately separate: resolve the photograph a visitor arrived with, and run the
// enquiry form's submission lifecycle. Either can be absent — the page works as a general enquiry
// with no `?photo=`, and it renders no form at all until a Formspree form ID is configured — so
// neither half assumes the other exists.
//
// Everything shown or sent about a photograph comes from the published catalog, resolved through
// the shared projection in src/data/licensing.ts. The query string is treated as a request to look
// something up, never as content: no value from the URL is written into the page or into the
// submission, and an unknown, private or not-for-license reference falls back silently to the
// generic enquiry rather than reporting anything about why.

import { withBase } from '../config/paths';
import { resolveLicensingPhoto, type LicensingCatalogPhoto, type PublicLicensingPhoto } from '../data/licensing';

const section = document.querySelector<HTMLElement>('[data-licensing-section]');

if (section) {
  const form = section.querySelector<HTMLFormElement>('[data-licensing-form]');
  const selected = section.querySelector<HTMLElement>('[data-licensing-selected]')!;
  const selectedImage = selected.querySelector<HTMLImageElement>('[data-licensing-selected-image]')!;
  const selectedContext = selected.querySelector<HTMLElement>('[data-licensing-selected-context]')!;
  const selectedReference = selected.querySelector<HTMLElement>('[data-licensing-selected-reference]')!;
  const returnLinks = [...section.querySelectorAll<HTMLAnchorElement>('[data-licensing-selected-return], [data-licensing-success-return]')];
  const parameters = new URLSearchParams(location.search);
  const track = (name: string, context?: string) => window.elsewhereTrack?.(name, context);

  // The section label a funnel entry declares about itself. Recorded so a future measurement phase
  // can tell an archive-originated enquiry from one that started on this page; it never becomes a URL.
  const requestedSection = parameters.get('from') ?? '';
  const sourceSection = /^[a-z0-9-]{1,48}$/.test(requestedSection) ? requestedSection : 'direct';

  /* ---------------------------------------------------------------- selected photograph ------ */

  const setField = (key: string, value: string) => {
    const input = form?.querySelector<HTMLInputElement>(`[data-licensing-field="${key}"]`);
    if (input) input.value = value;
  };

  const showSelected = (photo: PublicLicensingPhoto) => {
    // textContent and setAttribute throughout: registry values are trusted data, but this surface
    // is reached from a URL and must never be able to become a markup injection point.
    selectedImage.src = withBase(photo.src);
    selectedImage.alt = photo.alt;
    if (photo.width && photo.height) {
      selectedImage.width = photo.width;
      selectedImage.height = photo.height;
    }
    selectedContext.textContent = photo.publicContext ?? '';
    selectedContext.hidden = !photo.publicContext;
    selectedReference.textContent = photo.reference;
    selected.hidden = false;

    for (const link of returnLinks) {
      link.href = withBase(photo.returnPath);
      const label = link.querySelector<HTMLElement>('[data-licensing-return-label]');
      if (label) label.textContent = `Return to ${photo.returnLabel}`;
      link.hidden = false;
    }

    if (referenceField) referenceField.hidden = true;
    setField('id', photo.id);
    setField('reference', photo.reference);
    setField('context', photo.publicContext ?? '');
    setField('image', new URL(withBase(photo.publicImage), location.origin).href);
    setField('page', `${location.origin}${location.pathname}?photo=${photo.id}`);
    setField('section', sourceSection);

    const subject = form?.querySelector<HTMLInputElement>('[data-licensing-subject]');
    if (subject) subject.value = `ELSEWHERE licensing enquiry — ${photo.id}`;

    // Without a form the page still hands the reference on to the enquiry route it does have, so a
    // visitor who came from a photograph never has to remember which one it was.
    const fallback = section.querySelector<HTMLAnchorElement>('.licensing-enquiry-fallback .enquiry-action');
    if (fallback) {
      const url = new URL(fallback.href, location.href);
      url.searchParams.set('photo', photo.id);
      fallback.href = url.pathname + url.search;
    }

    // Arriving at #enquiry scrolls before this block exists; re-anchor once it does, and again
    // once the photograph has laid out, so the enquiry is what the visitor actually lands on
    // rather than whatever the section grew past while the image was still arriving.
    if (location.hash === '#enquiry') {
      const anchor = () => section.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
      anchor();
      if (!selectedImage.complete) selectedImage.addEventListener('load', anchor, { once: true });
    }
    track('licensing_photo_selected', photo.id);
  };

  // Both paths start from the general enquiry's values; resolution only ever narrows them.
  setField('section', sourceSection);
  setField('page', `${location.origin}${location.pathname}`);

  const referenceField = section.querySelector<HTMLElement>('[data-licensing-reference-field]');
  const requestedPhoto = parameters.get('photo');
  if (requestedPhoto) {
    // Hidden up front rather than after resolution, so a visitor who arrived from a photograph is
    // never briefly shown a field asking which photograph they mean.
    if (referenceField) referenceField.hidden = true;
    fetch(withBase('/data/photo-catalog.json'))
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const photo = resolveLicensingPhoto((data?.photos ?? []) as LicensingCatalogPhoto[], requestedPhoto);
        if (photo) showSelected(photo);
        // An unknown, private or not-for-license reference is simply a general enquiry, and the
        // visitor gets the field back to say in their own words what they were looking at.
        else if (referenceField) referenceField.hidden = false;
      })
      // A registry that cannot be read is not an error the visitor needs to see: the page is a
      // complete general licensing enquiry without it.
      .catch(() => { if (referenceField) referenceField.hidden = false; });
  }

  /* ------------------------------------------------------------------------- the form -------- */

  if (form) {
    const endpoint = form.dataset.licensingEndpoint ?? '';
    const submit = form.querySelector<HTMLButtonElement>('[data-licensing-submit]')!;
    const submitLabel = form.querySelector<HTMLElement>('[data-licensing-submit-label]')!;
    const status = form.querySelector<HTMLElement>('[data-licensing-status]')!;
    const success = section.querySelector<HTMLElement>('[data-licensing-success]')!;
    const successHeading = success.querySelector<HTMLElement>('[data-licensing-success-heading]')!;
    const idleLabel = submitLabel.textContent ?? 'Send enquiry';
    let sending = false;

    // Native validation is the correct behaviour without JavaScript; with it, the page owns the
    // messages so they can be specific and appear in ELSEWHERE's own voice.
    form.noValidate = true;

    type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const required = [...form.querySelectorAll<Field>('[required]')];
    const describedBy = new Map<string, string>();

    for (const field of required) {
      describedBy.set(field.id, field.getAttribute('aria-describedby') ?? '');
      const error = form.querySelector<HTMLElement>(`[data-error-for="${field.id}"]`);
      if (error && !error.id) error.id = `${field.id}-error`;
    }

    const setError = (field: Field, invalid: boolean) => {
      const error = form.querySelector<HTMLElement>(`[data-error-for="${field.id}"]`);
      field.setAttribute('aria-invalid', String(invalid));
      if (error) {
        error.hidden = !invalid;
        // The message is associated with the field rather than merely placed near it, so a screen
        // reader reaching the input is told what is wrong with it.
        const base = describedBy.get(field.id) ?? '';
        const next = invalid ? `${base} ${error.id}`.trim() : base;
        if (next) field.setAttribute('aria-describedby', next);
        else field.removeAttribute('aria-describedby');
      }
      return !invalid;
    };

    const validate = () => required
      .map((field) => setError(field, field.value.trim().length === 0 || !field.checkValidity()))
      .every(Boolean);

    /**
     * The public photo id this enquiry is about, or 'general' when it is not about one frame.
     *
     * The single source of event context for the whole funnel, so `licensing_form_view`,
     * `licensing_submit`, `licensing_success` and `licensing_error` can be joined on the same
     * value. It reads the hidden field the registry wrote, which is a published catalog id —
     * never a URL parameter and never anything the visitor typed.
     */
    const photoReference = () =>
      form.querySelector<HTMLInputElement>('[data-licensing-field="id"]')?.value || 'general';

    // The funnel's denominator. `licensing_open` counts intent to enquire; this counts the form
    // actually reaching the visitor, which is what `licensing_submit` should be measured against.
    // Fired once, on first intersection, so a scroll back up does not inflate it.
    if ('IntersectionObserver' in window) {
      const seen = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        track('licensing_form_view', photoReference());
      }, { threshold: 0.2 });
      seen.observe(form);
    }

    const setStatus = (message: string, action: string | null) => {
      status.textContent = message;
      status.hidden = message.length === 0;
      if (action) status.dataset.licensingAction = action;
      else delete status.dataset.licensingAction;
    };

    const setSending = (active: boolean) => {
      sending = active;
      submit.disabled = active;
      submit.setAttribute('aria-busy', String(active));
      submitLabel.textContent = active ? 'Sending…' : idleLabel;
    };

    const showSuccess = () => {
      form.hidden = true;
      success.hidden = false;
      success.dataset.licensingAction = 'success';
      successHeading.focus();
      track('licensing_success', photoReference());
    };

    // Entered text is never discarded on failure: the visitor has written the most valuable field
    // on the page and must not be asked to write it twice.
    const showFailure = (message: string) => {
      setStatus(message, 'error');
      setSending(false);
      form.querySelector<HTMLElement>('[data-licensing-fallback]')?.removeAttribute('hidden');
      status.focus();
      // The photograph, never the reason. A provider's refusal message is the provider's words
      // about the provider's problem, and a field-level one describes what the visitor typed;
      // neither belongs in an event. That an enquiry failed, and about which frame, is the whole
      // measurable fact.
      track('licensing_error', photoReference());
    };

    /** Formspree replies `{ next }` on success and `{ error }` or `{ errors: [...] }` on refusal. */
    const post = async () => {
      const response = await fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const body = await response.json().catch(() => null);
      if (response.ok && body && typeof body.next === 'string') return { ok: true as const };
      const errors: Array<{ field?: string; message?: string }> = Array.isArray(body?.errors) ? body.errors : [];
      const named = errors.filter((error) => typeof error.field === 'string');
      for (const error of named) {
        const field = form.querySelector<Field>(`[name="${CSS.escape(error.field!)}"]`);
        if (field && required.includes(field)) setError(field, true);
      }
      // A field-level message is specific enough to be worth repeating; a general provider message
      // ("Form is not accepting submissions") is the provider's voice about the provider's problem,
      // and the visitor is told the same calm thing whatever went wrong on that side.
      return { ok: false as const, message: named.length > 0 ? errors[0]?.message ?? '' : '', hasFieldErrors: named.length > 0 };
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      // Guards the second click, the double tap, and the Enter key held down. A duplicate enquiry
      // costs the visitor nothing and costs the owner a confusing inbox.
      if (sending) return;

      if (!validate()) {
        setStatus('Please complete the highlighted fields.', 'invalid');
        form.querySelector<Field>('[aria-invalid="true"]')?.focus();
        return;
      }

      setStatus('', null);
      setSending(true);
      track('licensing_submit', photoReference());

      // Dev-only review path. `import.meta.env.DEV` is statically false in a production build, so
      // this branch and the states it exercises are eliminated from the shipped bundle.
      if (import.meta.env.DEV && !endpoint) {
        const outcome = new URLSearchParams(location.search).get('preview');
        await new Promise((resolve) => setTimeout(resolve, 700));
        if (outcome === 'error') showFailure('Something went wrong while sending the enquiry. Please try again.');
        else if (outcome === 'invalid') {
          const email = form.querySelector<Field>('#licensing-email')!;
          setError(email, true);
          showFailure('Please check the highlighted fields and send again.');
          email.focus();
        } else showSuccess();
        return;
      }

      try {
        const result = await post();
        if (result.ok) showSuccess();
        else if (result.hasFieldErrors) {
          showFailure(result.message || 'Please check the highlighted fields and send again.');
          form.querySelector<Field>('[aria-invalid="true"]')?.focus();
        } else showFailure(result.message || 'Something went wrong while sending the enquiry. Please try again.');
      } catch {
        showFailure('The enquiry could not be sent — this is usually a connection problem. Please try again.');
      }
    });

    // Clearing an error as soon as it is addressed keeps the form from arguing with the visitor.
    for (const field of required) {
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true' && field.value.trim() && field.checkValidity()) setError(field, false);
      });
    }
  }
}

export {};
