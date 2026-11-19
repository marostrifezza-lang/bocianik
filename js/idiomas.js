/*
 * idiomas.js — Language switching (Spanish, English, Slovak).
 *
 * What it does:  - keeps the current language (saved on the phone)
 *                - provides t("key", { name: "Ana" }) to get a text in the
 *                  current language, replacing {name}-style placeholders
 *                - formats numbers with the right decimal separator
 * How to use:    t("home.hello", { name: "Ana" });  Lang.plural("home.daysLeft", 12);
 *                Lang.set("sk");  Lang.current();
 *                Texts live in textos-es.js, textos-en.js and textos-sk.js,
 *                which must be loaded BEFORE this file.
 * Depends on:    window.TEXTS_ES, window.TEXTS_EN, window.TEXTS_SK.
 */

window.Lang = (function () {
  // ===================================================================
  // Section: configuration
  // ===================================================================

  // Order used by the header button: each tap moves to the next language.
  const LANGUAGES = ["es", "en", "sk"];
  const DICTIONARIES = { es: window.TEXTS_ES, en: window.TEXTS_EN, sk: window.TEXTS_SK };
  // Used by date and number formatting (Intl API).
  const LOCALES = { es: "es-ES", en: "en-GB", sk: "sk-SK" };
  const STORAGE_KEY = "bocianik-idioma";

  // ===================================================================
  // Section: choosing the language
  // ===================================================================

  // Language used until she picks another one with the header button.
  const DEFAULT_LANGUAGE = "sk";

  /**
   * First language: the one saved before on this phone; otherwise Slovak.
   * localStorage is used (not IndexedDB) because it is read instantly at start-up.
   */
  function initialLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (LANGUAGES.includes(saved)) return saved;
    } catch (error) { /* storage blocked: fall through */ }
    return DEFAULT_LANGUAGE;
  }

  let current = initialLanguage();
  document.documentElement.lang = current;

  function set(code) {
    current = LANGUAGES.includes(code) ? code : "es";
    document.documentElement.lang = current;
    try { localStorage.setItem(STORAGE_KEY, current); } catch (error) { /* ignore */ }
  }

  /** Next language in the cycle es -> en -> sk -> es. */
  function next() {
    return LANGUAGES[(LANGUAGES.indexOf(current) + 1) % LANGUAGES.length];
  }

  // ===================================================================
  // Section: texts and numbers
  // ===================================================================

  /**
   * Text for a key in the current language. Falls back to Spanish, and then
   * to the key itself, so a missing translation never breaks the screen.
   * {placeholders} are replaced by the values in "vars".
   */
  function translate(key, vars = {}) {
    const text = DICTIONARIES[current][key] ?? DICTIONARIES.es[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  }

  /**
   * Text that depends on a count ("1 día" / "3 días"; in Slovak also
   * "2 dni" / "5 dní"). The browser's Intl.PluralRules says which form the
   * language uses for that number: "one", "few", "many" or "other".
   * Dictionary keys are "<key>.one", "<key>.few", "<key>.other", ...;
   * if a form is missing we use "<key>.other".
   */
  function plural(key, count, vars = {}) {
    const category = new Intl.PluralRules(LOCALES[current]).select(count);
    const formKey = DICTIONARIES[current][`${key}.${category}`] !== undefined
      ? `${key}.${category}`
      : `${key}.other`;
    return translate(formKey, { n: count, ...vars });
  }

  /** Format a number with the language's decimal separator (1,5 / 1.5). */
  function number(value, maxDecimals = 1) {
    return new Intl.NumberFormat(LOCALES[current], { maximumFractionDigits: maxDecimals }).format(value);
  }

  return {
    current: () => current,
    locale: () => LOCALES[current],
    set, next, translate, plural, number, LANGUAGES,
  };
})();

// Short global name because it is used everywhere in the screens.
window.t = window.Lang.translate;
