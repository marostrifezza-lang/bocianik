/*
 * app.js — Starts the app, moves between screens, switches language and theme.
 *
 * What it does:  - registers the service worker (offline use + installable app)
 *                - asks the browser to keep the data persistent
 *                - shows the welcome screen the first time, then the home screen
 *                - handles the bottom tab bar and the "back" arrow
 *                - header buttons: language (ES -> EN -> SK) and light/dark mode
 *                - color palette chosen in "Ajustes" (App.setPalette)
 * How to use:    loaded LAST by index.html. Screens register themselves in
 *                window.Screens; any screen can call App.show("diario"), etc.
 * Depends on:    config.js, idiomas.js, utilidades.js, almacenamiento.js and
 *                every pantalla-*.js file (all loaded before this one).
 */

window.App = (function () {
  // ===================================================================
  // Section: state
  // ===================================================================

  // Name of the screen currently shown, the one "back" returns to, and the
  // options it was opened with (needed to redraw it after a language change).
  let currentScreen = null;
  let currentOptions = {};
  let backTarget = null;

  // Settings typed in by her: { name, partnerName, dueDate }.
  let settings = {};

  // Some screens start timers or keep the screen awake; they register a
  // cleanup function here that runs when the user leaves the screen.
  let cleanupCurrentScreen = null;

  const THEME_KEY = "bocianik-tema";
  const PALETTE_KEY = "bocianik-paleta";

  // Color palettes (the CSS for each one is in estilos.css). The two colors
  // are only used to draw the round samples in the settings screen.
  // "rosa" is the default because it matches the pink icon.
  const DEFAULT_PALETTE = "rosa";
  const PALETTES = {
    rosa: ["#d4668e", "#7fa59a"],
    terracota: ["#c96f5a", "#7fa58f"],
    lavanda: ["#8a6bbf", "#cf7f9c"],
    salvia: ["#5f9473", "#c98a5a"],
    celeste: ["#4f86b8", "#d9906a"],
  };

  // ===================================================================
  // Section: settings
  // ===================================================================

  function getSettings() {
    return settings;
  }

  async function saveSettings(newSettings) {
    settings = { ...settings, ...newSettings };
    await Store.set("settings", settings);
  }

  // ===================================================================
  // Section: navigation
  // ===================================================================

  /**
   * Show a screen by name (a key of window.Screens).
   * "options.back" names the screen the back arrow should return to.
   */
  async function show(screenName, options = {}) {
    const screen = window.Screens[screenName];
    if (!screen) throw new Error("Unknown screen: " + screenName);

    if (cleanupCurrentScreen) {
      cleanupCurrentScreen();
      cleanupCurrentScreen = null;
    }

    currentScreen = screenName;
    currentOptions = options;
    backTarget = options.back || null;

    // Header: title and optional back arrow.
    document.getElementById("titulo-pantalla").textContent = t(screen.titleKey);
    document.getElementById("boton-volver").hidden = !backTarget;

    // Bottom tabs: highlight this screen's tab (sub-screens of "Más" keep "Más" lit).
    const activeTab = screen.tab || screenName;
    document.querySelectorAll("#pestanas button").forEach((button) => {
      button.classList.toggle("activa", button.dataset.screen === activeTab);
    });
    document.getElementById("pestanas").hidden = screen.hideTabs === true;

    const container = document.getElementById("pantalla");
    container.innerHTML = "";
    window.scrollTo(0, 0);
    await screen.render(container, options);
  }

  /** Let the current screen register what to stop when leaving it. */
  function onLeave(cleanupFunction) {
    cleanupCurrentScreen = cleanupFunction;
  }

  function wireNavigation() {
    document.querySelectorAll("#pestanas button").forEach((button) => {
      button.addEventListener("click", () => show(button.dataset.screen));
    });
    document.getElementById("boton-volver").addEventListener("click", () => {
      if (backTarget) show(backTarget);
    });
  }

  // ===================================================================
  // Section: language
  // ===================================================================

  /** Put translated texts in the parts of the page outside the screens. */
  function translateFixedTexts() {
    document.querySelectorAll("[data-t]").forEach((element) => {
      element.textContent = t(element.dataset.t);
    });
    document.getElementById("boton-idioma").textContent = Lang.current().toUpperCase();
    document.getElementById("boton-idioma").setAttribute("aria-label", t("header.language"));
    document.getElementById("boton-volver").setAttribute("aria-label", t("header.back"));
  }

  function wireLanguageButton() {
    document.getElementById("boton-idioma").addEventListener("click", () => {
      Lang.set(Lang.next());
      translateFixedTexts();
      // Redraw the current screen in the new language (same options as before).
      if (currentScreen) show(currentScreen, currentOptions);
    });
  }

  // ===================================================================
  // Section: light / dark theme
  // ===================================================================

  /**
   * The theme is an attribute on <html> (data-theme="light" | "dark") that the
   * CSS reads. With no saved choice we follow the phone's own setting.
   */
  function currentTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (error) { /* storage blocked: fall through */ }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const button = document.getElementById("boton-tema");
    // The icon shows what you get when tapping: the moon goes to dark mode.
    button.textContent = theme === "dark" ? "☀️" : "🌙";
    button.setAttribute("aria-label", t(theme === "dark" ? "header.lightMode" : "header.darkMode"));
    updateStatusBarColor();
  }

  /** Color of Android's status bar: the same as the header of the current colors. */
  function updateStatusBarColor() {
    const headerColor = getComputedStyle(document.documentElement).getPropertyValue("--superficie-suave").trim();
    document.querySelector('meta[name="theme-color"]').content = headerColor;
  }

  function wireThemeButton() {
    document.getElementById("boton-tema").addEventListener("click", () => {
      const newTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, newTheme); } catch (error) { /* ignore */ }
      applyTheme(newTheme);
    });
  }

  // ===================================================================
  // Section: color palette
  // ===================================================================

  function currentPalette() {
    try {
      const saved = localStorage.getItem(PALETTE_KEY);
      if (saved in PALETTES) return saved;
    } catch (error) { /* storage blocked: fall through */ }
    return DEFAULT_PALETTE;
  }

  /** Change the colors of the whole app and remember the choice on this phone. */
  function setPalette(name) {
    if (!(name in PALETTES)) return;
    document.documentElement.dataset.palette = name;
    try { localStorage.setItem(PALETTE_KEY, name); } catch (error) { /* ignore */ }
    updateStatusBarColor();
  }

  // ===================================================================
  // Section: offline support
  // ===================================================================

  function registerServiceWorker() {
    // Service workers only work over https or localhost (not file://).
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("sw.js").catch((error) => {
        console.warn("Service worker registration failed:", error);
      });
    }
  }

  // ===================================================================
  // Section: start-up
  // ===================================================================

  async function start() {
    document.getElementById("nombre-app").textContent = CONFIG.appName;
    translateFixedTexts();
    document.documentElement.dataset.palette = currentPalette();
    applyTheme(currentTheme());
    wireNavigation();
    wireLanguageButton();
    wireThemeButton();
    registerServiceWorker();
    Store.requestPersistence(); // no need to wait for the answer

    settings = await Store.get("settings", {});
    // First launch: no due date yet -> welcome screen.
    await show(settings.dueDate ? "inicio" : "bienvenida");
  }

  document.addEventListener("DOMContentLoaded", start);

  return { show, onLeave, getSettings, saveSettings, setPalette, currentPalette, PALETTES };
})();
