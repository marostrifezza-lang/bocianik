/*
 * pantalla-ajustes.js — Settings, backup copy and data protection.
 *
 * What it does:  - edit her name, her partner's name and the due date
 *                - choose the color palette of the app
 *                - download a backup file with ALL data (photos included)
 *                - restore a backup file (e.g. on a new phone)
 *                - show whether the browser protects the data from automatic
 *                  deletion, and how much space the app uses
 *                - delete everything
 * How to use:    App.show("ajustes", { back: "mas" }).
 *                Screens.ajustes.pickBackupAndRestore() is also used by the
 *                welcome screen.
 * Depends on:    idiomas.js, utilidades.js, almacenamiento.js, app.js.
 */

window.Screens = window.Screens || {};

window.Screens.ajustes = {
  titleKey: "settings.title",
  tab: "mas",

  async render(container) {
    const e = Utils.escapeHtml;
    const settings = App.getSettings();
    const persistent = await Store.isPersistent();
    const usedMb = await Store.usedMegabytes();
    const lastBackup = await Store.get("lastBackupAt", null);

    container.innerHTML = `
      <form class="tarjeta formulario" id="form-ajustes">
        <h2>${e(t("settings.yourData"))}</h2>
        <label>${e(t("welcome.yourName"))}
          <input type="text" name="name" value="${e(settings.name)}" required>
        </label>
        <label>${e(t("welcome.dueDate"))}
          <input type="date" name="dueDate" value="${e(settings.dueDate)}" required>
        </label>
        <label>${e(t("welcome.partnerName"))}
          <input type="text" name="partnerName" value="${e(settings.partnerName)}">
        </label>
        <button class="boton principal">${e(t("common.save"))}</button>
      </form>

      <section class="tarjeta">
        <h2>${e(t("settings.colorsTitle"))}</h2>
        <div class="paletas">
          ${Object.entries(App.PALETTES).map(([name, [main, second]]) => `
            <button class="paleta ${name === App.currentPalette() ? "activa" : ""}" data-palette="${name}">
              <span class="paleta-muestra" style="background: linear-gradient(135deg, ${main} 50%, ${second} 50%)"></span>
              <span>${e(t("palette." + name))}</span>
            </button>`).join("")}
        </div>
      </section>

      <section class="tarjeta">
        <h2>${e(t("settings.backupTitle"))}</h2>
        <p>${e(t("settings.backupExplain"))}</p>
        <p class="texto-secundario">${e(lastBackup
          ? t("settings.lastBackup", { date: Utils.formatShortDateTime(lastBackup) })
          : t("settings.noBackupYet"))}</p>
        <div class="fila-botones">
          <button class="boton principal" id="descargar-copia">⬇️ ${e(t("settings.download"))}</button>
          <button class="boton" id="restaurar-copia">⬆️ ${e(t("settings.restore"))}</button>
        </div>
      </section>

      <section class="tarjeta">
        <h2>${e(t("settings.storageTitle"))}</h2>
        <p>${persistent ? "✅ " + e(t("settings.persistentYes")) : "⚠️ " + e(t("settings.persistentNo"))}</p>
        ${usedMb !== null ? `<p class="texto-secundario">${e(t("settings.used", { mb: Lang.number(usedMb) }))}</p>` : ""}
      </section>

      <section class="tarjeta">
        <h2>${e(t("settings.dangerTitle"))}</h2>
        <button class="boton peligro" id="borrar-todo">🗑️ ${e(t("settings.deleteAll"))}</button>
      </section>`;

    container.querySelector("#form-ajustes").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.target;
      await App.saveSettings({
        name: form.elements.name.value.trim(),
        dueDate: form.elements.dueDate.value,
        partnerName: form.elements.partnerName.value.trim(),
      });
      Utils.toast(t("common.saved") + " 💗");
    });

    // Palette samples: apply the colors at once and mark the chosen one.
    container.querySelectorAll("[data-palette]").forEach((button) => {
      button.addEventListener("click", () => {
        App.setPalette(button.dataset.palette);
        container.querySelectorAll("[data-palette]").forEach((other) => other.classList.toggle("activa", other === button));
      });
    });

    container.querySelector("#descargar-copia").addEventListener("click", () => this.downloadBackup());
    container.querySelector("#restaurar-copia").addEventListener("click", () => this.pickBackupAndRestore());
    container.querySelector("#borrar-todo").addEventListener("click", () => this.deleteEverything());
  },

  // ===================================================================
  // Section: backup
  // ===================================================================

  async downloadBackup() {
    Utils.toast(t("settings.preparing"));
    const backup = await Store.exportAll();
    const blob = new Blob([JSON.stringify(backup)], { type: "application/json" });
    const fileName = `bocianik-backup-${Utils.toIsoDate(new Date())}.json`;
    Utils.downloadBlob(blob, fileName);
    // Save the date AFTER exporting, so it is not part of the copy itself.
    await Store.set("lastBackupAt", Date.now());
    Utils.toast(t("settings.downloaded"));
  },

  /** Let her choose a backup file, then replace all data with it. */
  pickBackupAndRestore() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.addEventListener("change", async () => {
      const file = input.files[0];
      if (!file) return;
      if (!confirm(t("settings.confirmRestore"))) return;
      try {
        const backup = JSON.parse(await file.text());
        await Store.importAll(backup);
        // Reload so every screen reads the restored data.
        location.reload();
      } catch (error) {
        alert(t("settings.restoreFailed") + "\n" + error.message);
      }
    });
    input.click();
  },

  // ===================================================================
  // Section: delete everything
  // ===================================================================

  async deleteEverything() {
    // Two confirmations because this cannot be undone.
    if (!confirm(t("settings.confirmDelete1"))) return;
    if (!confirm(t("settings.confirmDelete2"))) return;
    await Store.clearAll();
    location.reload();
  },
};
