/*
 * pantalla-mas.js — "Más" menu and the Help screen.
 *
 * What it does:  - "mas":   menu with the less-used sections (names game,
 *                           settings and backup, help) and
 *                           the gift dedication.
 *                - "ayuda": how each part of the app works, privacy notes and
 *                           the creator's name.
 * How to use:    App.show("mas");  App.show("ayuda", { back: "mas" }).
 * Depends on:    config.js, idiomas.js, utilidades.js, app.js.
 */

window.Screens = window.Screens || {};

// =====================================================================
// Section: "Más" menu
// =====================================================================

window.Screens.mas = {
  titleKey: "more.title",

  // [screen name, icon, title key, description key]
  ITEMS: [
    ["nombres", "💞", "names.title", "more.namesHint"],
    ["ajustes", "⚙️", "settings.title", "more.settingsHint"],
    ["ayuda", "❓", "help.title", "more.helpHint"],
  ],

  render(container) {
    const e = Utils.escapeHtml;
    container.innerHTML = `
      ${this.ITEMS.map(([screen, icon, titleKey, hintKey]) => `
        <button class="tarjeta accion" data-go="${screen}">
          <span class="icono-grande" aria-hidden="true">${icon}</span>
          <span><strong>${e(t(titleKey))}</strong>
                <span class="texto-secundario">${e(t(hintKey))}</span></span>
        </button>`).join("")}
      <p class="dedicatoria pie">${e(CONFIG.dedication[Lang.current()] || CONFIG.dedication.es)}<br>
        — ${e(CONFIG.giftFrom)}</p>`;

    container.querySelectorAll("[data-go]").forEach((button) => {
      button.addEventListener("click", () => App.show(button.dataset.go, { back: "mas" }));
    });
  },
};

// =====================================================================
// Section: Help screen
// =====================================================================

window.Screens.ayuda = {
  titleKey: "help.title",
  tab: "mas",

  // Help topics; each one has "help.<topic>.title" and "help.<topic>.body"
  // in the text files. Body texts may contain several paragraphs separated by "\n".
  TOPICS: ["install", "home", "diary", "counter", "lists", "names", "privacy", "backup", "languageTheme"],

  render(container) {
    const e = Utils.escapeHtml;
    const paragraphs = (text) => text.split("\n").map((line) => `<p>${e(line)}</p>`).join("");

    container.innerHTML = `
      ${this.TOPICS.map((topic, index) => `
        <details class="tarjeta ayuda-tema" ${index === 0 ? "open" : ""}>
          <summary>${e(t(`help.${topic}.title`))}</summary>
          ${paragraphs(t(`help.${topic}.body`, { app: CONFIG.appName }))}
        </details>`).join("")}

      <section class="tarjeta creador">
        <h2>${e(t("help.creator.title"))}</h2>
        <p>${e(t("help.creator.body", { app: CONFIG.appName }))}</p>
        <p><strong>${e(CONFIG.creatorName)}</strong></p>
      </section>`;
  },
};
