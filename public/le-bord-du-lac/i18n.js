// Language preference only. No analytics, network requests or account required.
export const languages = Object.freeze(['en', 'de', 'fr']);
export const isLanguage = value => languages.includes(value);
const preferenceKey = 'le-bord-du-lac-language';
const baseLanguage = value => typeof value === 'string' ? value.trim().toLowerCase().split(/[-_]/)[0] : '';

export function resolveLanguage({ search = '', saved = '', browserLanguages = [] } = {}) {
  const requested = baseLanguage(new URLSearchParams(search).get('lang'));
  if (isLanguage(requested)) return requested;
  if (isLanguage(saved)) return saved;
  for (const locale of browserLanguages) {
    const language = baseLanguage(locale);
    if (isLanguage(language)) return language;
  }
  return 'en';
}

export function initialLanguage(environment = window) {
  let saved = '';
  try { saved = environment.localStorage.getItem(preferenceKey); } catch { /* Private browsing may deny storage. */ }
  return resolveLanguage({
    search: environment.location.search,
    saved,
    browserLanguages: environment.navigator.languages || [environment.navigator.language]
  });
}

export function rememberLanguage(language, environment = window) {
  if (!isLanguage(language)) return false;
  try { environment.localStorage.setItem(preferenceKey, language); } catch { /* Selection still works without storage. */ }
  // Keep the route, other query parameters and section. A shared link carries the selected language.
  try {
    const url = new URL(environment.location.href);
    url.searchParams.set('lang', language);
    environment.history.replaceState(environment.history.state, '', url.pathname + url.search + url.hash);
  } catch { /* Embedded previews can restrict history changes. */ }
  return true;
}

export function bookingUrl(language) {
  const suffix = { en: 'en-gb', de: 'de', fr: 'fr' }[isLanguage(language) ? language : 'en'];
  return `https://www.booking.com/hotel/re/le-bord-du-lac.${suffix}.html`;
}
