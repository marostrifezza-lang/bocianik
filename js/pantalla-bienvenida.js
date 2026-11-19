/*
 * pantalla-bienvenida.js — Welcome screen, shown only the first time.
 *
 * What it does:  shows the gift dedication and asks for her name and the due
 *                date (or the first day of her last period, to calculate it).
 *                Can also restore a backup copy instead (e.g. on a new phone).
 * How to use:    App.show("bienvenida"). Saves settings and goes to "inicio".
 * Depends on:    config.js, idiomas.js, utilidades.js, app.js,
 *                pantalla-ajustes.js (Screens.ajustes.pickBackupAndRestore).
 */

window.Screens = window.Screens || {};

window.Screens.bienvenida = {
  titleKey: "welcome.title",
  hideTabs: true,

  /** Name of who gives the gift, in the grammatical form the language needs. */
  giverName() {
    return Lang.current() === "sk" ? CONFIG.giftFromSlovak : CONFIG.giftFrom;
  },

  render(container) {
    const e = Utils.escapeHtml;
    container.innerHTML = `
      <section class="tarjeta bienvenida">
        <img class="logo-grande" src="iconos/icono-192.png" alt="">
        <h1>${e(CONFIG.appName)}</h1>
        <p class="regalo-de">${e(t("welcome.giftFrom", { name: this.giverName() }))}</p>
        <p class="dedicatoria">${e(CONFIG.dedication[Lang.current()] || CONFIG.dedication.es)}</p>
      </section>

      <form class="tarjeta formulario" id="form-bienvenida">
        <label>${e(t("welcome.yourName"))}
          <input type="text" name="name" required autocomplete="given-name">
        </label>

        <fieldset>
          <legend>${e(t("welcome.whichDate"))}</legend>
          <label class="opcion"><input type="radio" name="dateKind" value="due" checked>
            ${e(t("welcome.optionDue"))}</label>
          <label class="opcion"><input type="radio" name="dateKind" value="lastPeriod">
            ${e(t("welcome.optionLastPeriod"))}</label>
        </fieldset>

        <label><span id="etiqueta-fecha">${e(t("welcome.dueDate"))}</span>
          <span class="campo-fecha"><input type="date" name="date" required></span>
        </label>
        <p class="ayuda" id="calculo-fecha"></p>

        <label>${e(t("welcome.partnerName"))} <span class="opcional">${e(t("welcome.partnerHint"))}</span>
          <input type="text" name="partnerName">
        </label>

        <button type="submit" class="boton principal">${e(t("welcome.start"))}</button>
      </form>

      <p class="centrado">
        <button type="button" class="boton enlace" id="restaurar-copia">${e(t("welcome.restore"))}</button>
      </p>
    `;

    const form = container.querySelector("#form-bienvenida");
    const dateInput = form.elements.date;
    const dateLabel = container.querySelector("#etiqueta-fecha");
    const calculation = container.querySelector("#calculo-fecha");

    // Change the date label and show the calculated due date when needed.
    function updateDateHint() {
      const kind = form.elements.dateKind.value;
      dateLabel.textContent = t(kind === "due" ? "welcome.dueDate" : "welcome.lastPeriod");
      calculation.textContent = "";
      if (kind === "lastPeriod" && dateInput.value) {
        const due = Utils.dueDateFromLastPeriod(dateInput.value);
        calculation.textContent = t("welcome.calculated", { date: Utils.formatLongDate(due) });
      }
    }
    form.addEventListener("change", updateDateHint);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const kind = form.elements.dateKind.value;
      const dueDate = kind === "due"
        ? dateInput.value
        : Utils.toIsoDate(Utils.dueDateFromLastPeriod(dateInput.value));

      await App.saveSettings({
        name: form.elements.name.value.trim(),
        partnerName: form.elements.partnerName.value.trim(),
        dueDate,
      });
      App.show("inicio");
    });

    container.querySelector("#restaurar-copia").addEventListener("click", () => {
      Screens.ajustes.pickBackupAndRestore();
    });
  },
};
