/*
 * pantalla-contador.js — Contraction timer and baby-movement counter.
 *
 * What it does:  Two tools in one screen (switch with the buttons on top):
 *                - Contracciones: one big button to mark start and end of each
 *                  contraction. Shows duration, time between contractions and
 *                  a summary of the last hour.
 *                - Movimientos: start a session and tap once per movement;
 *                  shows the count and how long it took.
 *                The app does NOT tell her when to go to the hospital: that
 *                depends on what her doctor or midwife told her.
 *                Times are saved as timestamps, so a contraction in progress
 *                survives closing the app or locking the phone.
 *                While this screen is open the phone screen stays on.
 * How to use:    App.show("contador").
 * Depends on:    idiomas.js, utilidades.js, almacenamiento.js, app.js.
 */

window.Screens = window.Screens || {};

window.Screens.contador = {
  titleKey: "counter.title",

  // Which tool is shown: "contractions" or "kicks". Remembered while the app is open.
  mode: "contractions",

  async render(container) {
    this.container = container;
    this.tickTimer = setInterval(() => this.updateLiveTime(), 1000);
    this.keepScreenOn();

    App.onLeave(() => {
      clearInterval(this.tickTimer);
      this.releaseScreen();
    });

    await this.draw();
  },

  async draw() {
    this.container.innerHTML = `
      <div class="selector">
        <button data-mode="contractions" class="${this.mode === "contractions" ? "activa" : ""}">⏱️ ${t("counter.contractions")}</button>
        <button data-mode="kicks" class="${this.mode === "kicks" ? "activa" : ""}">👣 ${t("counter.kicks")}</button>
      </div>
      <div id="contenido-contador"></div>
    `;
    this.container.querySelectorAll(".selector button").forEach((button) => {
      button.addEventListener("click", () => {
        this.mode = button.dataset.mode;
        this.draw();
      });
    });

    const content = this.container.querySelector("#contenido-contador");
    if (this.mode === "contractions") await this.drawContractions(content);
    else await this.drawKicks(content);
  },

  // ===================================================================
  // Section: contractions
  // ===================================================================

  async drawContractions(content) {
    const list = await Store.get("contractions", []); // [{ start, end }], newest last
    const active = list.length > 0 && !list[list.length - 1].end;
    this.liveStart = active ? list[list.length - 1].start : null;

    content.innerHTML = `
      <button class="boton-gigante ${active ? "en-curso" : ""}" id="boton-contraccion">
        <span>${t(active ? "counter.contractionEnded" : "counter.contractionStarted")}</span>
        <span class="tiempo-vivo" id="tiempo-vivo">${active ? "0:00" : ""}</span>
      </button>

      ${this.contractionSummary(list)}

      <p class="nota">${t("counter.hospitalNote")}</p>

      ${list.length ? `
        <h2>${t("counter.lastContractions")}</h2>
        <table class="tabla">
          <thead><tr><th>${t("counter.start")}</th><th>${t("counter.duration")}</th><th>${t("counter.sincePrevious")}</th></tr></thead>
          <tbody>${this.contractionRows(list)}</tbody>
        </table>
        <button class="boton peligro" id="borrar-contracciones">${t("counter.clearHistory")}</button>` : ""}
    `;
    this.updateLiveTime();

    content.querySelector("#boton-contraccion").addEventListener("click", async () => {
      const now = Date.now();
      if (active) list[list.length - 1].end = now;
      else list.push({ start: now, end: null });
      await Store.set("contractions", list);
      this.drawContractions(content);
    });

    const clearButton = content.querySelector("#borrar-contracciones");
    if (clearButton) {
      clearButton.addEventListener("click", async () => {
        if (!confirm(t("counter.confirmClear"))) return;
        await Store.set("contractions", []);
        this.drawContractions(content);
      });
    }
  },

  /** Table rows, newest first. "Since previous" = start to start. */
  contractionRows(list) {
    const rows = [];
    for (let i = list.length - 1; i >= 0 && rows.length < 30; i--) {
      const item = list[i];
      const duration = item.end ? Utils.formatDuration((item.end - item.start) / 1000) : t("counter.inProgress");
      const interval = i > 0 ? Utils.formatDuration((item.start - list[i - 1].start) / 1000) : "—";
      rows.push(`<tr><td>${Utils.formatShortDateTime(item.start)}</td><td>${duration}</td><td>${interval}</td></tr>`);
    }
    return rows.join("");
  },

  /** Averages for the contractions that started in the last 60 minutes. */
  contractionSummary(list) {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recent = list.filter((item) => item.start >= oneHourAgo && item.end);
    if (recent.length < 2) return "";

    const averageDuration =
      recent.reduce((sum, item) => sum + (item.end - item.start), 0) / recent.length / 1000;
    // Intervals between consecutive contractions inside the hour.
    const intervals = recent.slice(1).map((item, i) => (item.start - recent[i].start) / 1000);
    const averageInterval = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;

    return `
      <section class="tarjeta resumen">
        <h2>${t("counter.lastHour")}</h2>
        <div class="cifras">
          <div><strong>${recent.length}</strong><span>${t("counter.contractionsLower")}</span></div>
          <div><strong>${Utils.formatDuration(averageDuration)}</strong><span>${t("counter.averageDuration")}</span></div>
          <div><strong>${Utils.formatDuration(averageInterval)}</strong><span>${t("counter.averageInterval")}</span></div>
        </div>
      </section>`;
  },

  // ===================================================================
  // Section: baby movements
  // ===================================================================

  async drawKicks(content) {
    const session = await Store.get("kickActive", null); // { start, count } or null
    const history = await Store.get("kickSessions", []);  // [{ start, end, count }]
    this.liveStart = session ? session.start : null;

    content.innerHTML = session ? `
        <button class="boton-gigante en-curso" id="sumar-movimiento">
          <span class="contador-grande">${session.count}</span>
          <span>${t("counter.tapEachKick")}</span>
          <span class="tiempo-vivo" id="tiempo-vivo"></span>
        </button>
        <div class="fila-botones">
          <button class="boton" id="restar-movimiento">↩️ ${t("counter.undoOne")}</button>
          <button class="boton principal" id="terminar-sesion">${t("counter.finish")}</button>
        </div>`
      : `
        <button class="boton-gigante" id="empezar-sesion">
          <span>${t("counter.startKicks")}</span>
        </button>`;

    content.innerHTML += `
      <p class="nota">${t("counter.kicksNote")}</p>
      ${history.length ? `
        <h2>${t("counter.previousSessions")}</h2>
        <table class="tabla">
          <thead><tr><th>${t("counter.day")}</th><th>${t("counter.kicks")}</th><th>${t("counter.time")}</th></tr></thead>
          <tbody>${history.slice(-20).reverse().map((item) => `
            <tr><td>${Utils.formatShortDateTime(item.start)}</td><td>${item.count}</td>
                <td>${Utils.formatDuration((item.end - item.start) / 1000)}</td></tr>`).join("")}
          </tbody>
        </table>` : ""}
    `;
    this.updateLiveTime();

    const on = (id, handler) => {
      const element = content.querySelector("#" + id);
      if (element) element.addEventListener("click", handler);
    };

    on("empezar-sesion", async () => {
      await Store.set("kickActive", { start: Date.now(), count: 0 });
      this.drawKicks(content);
    });
    on("sumar-movimiento", async () => {
      session.count += 1;
      await Store.set("kickActive", session);
      content.querySelector(".contador-grande").textContent = session.count;
      if (navigator.vibrate) navigator.vibrate(30); // tiny feedback on Android
    });
    on("restar-movimiento", async () => {
      session.count = Math.max(0, session.count - 1);
      await Store.set("kickActive", session);
      content.querySelector(".contador-grande").textContent = session.count;
    });
    on("terminar-sesion", async () => {
      history.push({ start: session.start, end: Date.now(), count: session.count });
      await Store.set("kickSessions", history);
      await Store.set("kickActive", null);
      this.drawKicks(content);
    });
  },

  // ===================================================================
  // Section: live clock and keeping the screen on
  // ===================================================================

  /** Refresh the running time shown inside the big button (every second). */
  updateLiveTime() {
    const label = this.container && this.container.querySelector("#tiempo-vivo");
    if (label && this.liveStart) label.textContent = Utils.formatDuration((Date.now() - this.liveStart) / 1000);
  },

  /**
   * Screen Wake Lock API: keeps the display on while timing contractions.
   * The browser drops the lock when the app goes to the background, so we
   * ask again when it becomes visible.
   */
  async keepScreenOn() {
    if (!("wakeLock" in navigator)) return;
    const request = async () => {
      try {
        this.wakeLock = await navigator.wakeLock.request("screen");
      } catch (error) {
        // Not critical: the counter works the same without it.
      }
    };
    this.onVisible = () => document.visibilityState === "visible" && request();
    document.addEventListener("visibilitychange", this.onVisible);
    request();
  },

  releaseScreen() {
    if (this.onVisible) document.removeEventListener("visibilitychange", this.onVisible);
    if (this.wakeLock) this.wakeLock.release().catch(() => {});
    this.wakeLock = null;
  },
};
