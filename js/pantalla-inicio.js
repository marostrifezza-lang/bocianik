/*
 * pantalla-inicio.js — Home screen: countdown and "size of the week".
 *
 * What it does:  shows the current week + days, a progress ring for the whole
 *                pregnancy, the days left until the due date, the fruit/vegetable
 *                comparison of the week, and a reminder to add this week's photo.
 * How to use:    App.show("inicio").
 * Depends on:    idiomas.js, utilidades.js, almacenamiento.js, datos-semanas.js, app.js.
 */

window.Screens = window.Screens || {};

window.Screens.inicio = {
  titleKey: "home.title",

  async render(container) {
    const e = Utils.escapeHtml;
    const settings = App.getSettings();
    const status = Utils.pregnancyStatus(settings.dueDate);
    const dueDate = Utils.parseLocalDate(settings.dueDate);

    // Has she already saved a diary entry for the current week?
    const entries = await Store.diary.all();
    const hasPhotoThisWeek = entries.some((entry) => entry.week === status.week);

    container.innerHTML = `
      <p class="saludo">${e(t("home.hello", { name: settings.name || "" }))} 💗</p>

      <section class="tarjeta progreso">
        ${this.progressRing(status)}
        <div class="cuenta-regresiva">${this.countdownText(status)}</div>
        <p class="fecha-parto">${e(t("home.dueDate", { date: Utils.formatLongDate(dueDate) }))}</p>
      </section>

      ${this.sizeCard(status.week)}

      <button class="tarjeta accion" id="atajo-foto">
        <span class="icono-grande" aria-hidden="true">${hasPhotoThisWeek ? "📸" : "🤰"}</span>
        <span>
          <strong>${e(t(hasPhotoThisWeek ? "home.photoDone" : "home.photoAsk"))}</strong>
          <span class="texto-secundario">${e(t(hasPhotoThisWeek ? "home.photoDoneHint" : "home.photoAskHint"))}</span>
        </span>
      </button>
    `;

    container.querySelector("#atajo-foto").addEventListener("click", () => App.show("diario"));
  },

  // -------------------------------------------------------------------
  // Progress ring: an SVG circle whose colored stroke grows with the weeks.
  // -------------------------------------------------------------------
  progressRing(status) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    // stroke-dashoffset hides the part of the circle not yet "filled".
    const hiddenLength = circumference * (1 - status.progress);
    const weekShown = Math.max(0, status.week);
    const daysText = status.extraDays === 0 ? "" : Lang.plural("home.plusDays", status.extraDays);

    return `
      <div class="anillo">
        <svg viewBox="0 0 160 160" aria-hidden="true">
          <circle class="anillo-fondo" cx="80" cy="80" r="${radius}"></circle>
          <circle class="anillo-avance" cx="80" cy="80" r="${radius}"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${hiddenLength}"></circle>
        </svg>
        <div class="anillo-texto">
          <span class="semana-numero">${weekShown}</span>
          <span class="semana-etiqueta">${Lang.plural("home.weeks", weekShown)}</span>
          <span class="semana-dias">${daysText}</span>
        </div>
      </div>
      <p class="trimestre">${t("home.trimester", { n: status.trimester, percent: Math.round(status.progress * 100) })}</p>
    `;
  },

  // -------------------------------------------------------------------
  // Countdown sentence, with special cases for the due day and after it.
  // -------------------------------------------------------------------
  countdownText(status) {
    if (status.daysLeft > 0) {
      return Lang.plural("home.daysLeft", status.daysLeft, { days: `<strong>${status.daysLeft}</strong>` });
    }
    if (status.daysLeft === 0) return t("home.dueToday") + " 🎉";
    return Lang.plural("home.pastDays", -status.daysLeft);
  },

  // -------------------------------------------------------------------
  // "Your baby is the size of ..." card, using the weekly table.
  // -------------------------------------------------------------------
  sizeCard(week) {
    const e = Utils.escapeHtml;
    if (week < WEEK_DATA_FIRST) {
      return `
        <section class="tarjeta tamano">
          <span class="fruta" aria-hidden="true">✨</span>
          <p>${e(t("home.tooSmall", { week: WEEK_DATA_FIRST }))}</p>
        </section>`;
    }
    const data = WEEK_DATA[Math.min(week, WEEK_DATA_LAST)];
    const item = data[Lang.current()] || data.es;
    const measures = this.measuresText(data);

    return `
      <section class="tarjeta tamano">
        <span class="fruta" aria-hidden="true">${data.emoji}</span>
        <p>${t("home.sizeOf", { item: `<strong>${e(item)}</strong>` })}</p>
        ${measures ? `<p class="medidas">${e(measures)}</p>` : ""}
        <p class="nota">${e(t("home.sizeNote"))}</p>
      </section>`;
  },

  /** "About 16 cm and 283 g" in the current language (or "" without data). */
  measuresText(data) {
    const length = this.formatAmount(data.cm, (value) => Lang.number(value) + " cm");
    const weight = this.formatAmount(data.grams, (grams) =>
      grams >= 1000 ? Lang.number(grams / 1000) + " kg" : Lang.number(grams, 0) + " g");

    if (length && data.cmLessThan) return t("home.lessThan", { length });
    if (length && weight) return t("home.lengthAndWeight", { length, weight });
    if (length) return t("home.lengthOnly", { length });
    return "";
  },

  /** Format a single value or a [min, max] range with the given formatter. */
  formatAmount(value, format) {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return t("home.range", { min: format(value[0]), max: format(value[1]) });
    return format(value);
  },
};
