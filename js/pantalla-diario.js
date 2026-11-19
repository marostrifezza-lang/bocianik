/*
 * pantalla-diario.js — Pregnancy diary with one photo per week, plus the album.
 *
 * What it does:  - lists the diary entries (photo + note + week)
 *                - lets her add, edit and delete entries
 *                - plays all the photos in order as a slideshow ("álbum")
 *                Photos are compressed and stored ONLY on the phone (IndexedDB).
 * How to use:    App.show("diario").
 * Depends on:    idiomas.js, utilidades.js, almacenamiento.js, app.js.
 */

window.Screens = window.Screens || {};

window.Screens.diario = {
  titleKey: "diary.title",

  // Temporary URLs created to display photos; freed when leaving the screen
  // so they do not keep memory busy.
  objectUrls: [],

  async render(container) {
    this.container = container;
    App.onLeave(() => this.freeObjectUrls());
    await this.drawList();
  },

  // ===================================================================
  // Section: list of entries
  // ===================================================================

  async drawList() {
    this.freeObjectUrls();
    const entries = await Store.diary.all();
    const photoCount = entries.filter((entry) => entry.photo).length;

    this.container.innerHTML = `
      <div class="fila-botones">
        <button class="boton principal" id="nueva-entrada">➕ ${Utils.escapeHtml(t("diary.newEntry"))}</button>
        <button class="boton" id="ver-album" ${photoCount < 2 ? "disabled" : ""}>▶️ ${Utils.escapeHtml(t("diary.album"))}</button>
      </div>
      ${entries.length === 0
        ? `<p class="vacio">${Utils.escapeHtml(t("diary.empty"))} 📷</p>`
        : `<div class="grilla-diario">${entries.map((entry) => this.entryCard(entry)).join("")}</div>`}
    `;

    this.container.querySelector("#nueva-entrada").addEventListener("click", () => this.openEditor(null));
    this.container.querySelector("#ver-album").addEventListener("click", () => this.playAlbum(entries));
    this.container.querySelectorAll(".entrada").forEach((card) => {
      card.addEventListener("click", async () => this.openEditor(await Store.diary.get(card.dataset.id)));
    });
  },

  entryCard(entry) {
    const e = Utils.escapeHtml;
    const image = entry.photo
      ? `<img src="${this.urlFor(entry.photo)}" alt="${e(t("diary.week", { week: entry.week }))}">`
      : `<div class="sin-foto" aria-hidden="true">📝</div>`;
    return `
      <button class="entrada" data-id="${e(entry.id)}">
        ${image}
        <span class="entrada-semana">${e(t("diary.week", { week: entry.week }))}</span>
        ${entry.note ? `<span class="entrada-nota">${e(entry.note)}</span>` : ""}
      </button>`;
  },

  urlFor(blob) {
    const url = URL.createObjectURL(blob);
    this.objectUrls.push(url);
    return url;
  },

  freeObjectUrls() {
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.objectUrls = [];
  },

  // ===================================================================
  // Section: add / edit editor (a sheet that slides over the list)
  // ===================================================================

  openEditor(entry) {
    const e = Utils.escapeHtml;
    const isNew = !entry;
    const currentWeek = Math.max(1, Utils.pregnancyStatus(App.getSettings().dueDate).week);
    const editing = entry || { id: Utils.newId(), week: currentWeek, note: "", photo: null, createdAt: Date.now() };
    let newPhoto = null; // Blob chosen in this session of the editor

    const sheet = document.createElement("div");
    sheet.className = "hoja-fondo";
    sheet.innerHTML = `
      <form class="hoja formulario">
        <h2>${e(t(isNew ? "diary.newEntry" : "diary.editEntry"))}</h2>
        <label>${e(t("diary.weekLabel"))}
          <input type="number" name="week" min="1" max="45" value="${editing.week}" required>
        </label>
        <div class="vista-previa">${editing.photo ? `<img src="${this.urlFor(editing.photo)}" alt="">` : ""}</div>
        <label class="boton">📷 <span class="texto-boton-foto">${e(t(editing.photo ? "diary.changePhoto" : "diary.choosePhoto"))}</span>
          <input type="file" name="photo" accept="image/*" hidden>
        </label>
        <label>${e(t("diary.note"))}
          <textarea name="note" rows="4" placeholder="${e(t("diary.notePlaceholder"))}">${e(editing.note)}</textarea>
        </label>
        <div class="fila-botones">
          <button type="submit" class="boton principal">${e(t("common.save"))}</button>
          <button type="button" class="boton" data-action="cancel">${e(t("common.cancel"))}</button>
        </div>
        ${isNew ? "" : `<button type="button" class="boton peligro" data-action="delete">${e(t("diary.deleteEntry"))}</button>`}
      </form>`;
    document.body.appendChild(sheet);

    const form = sheet.querySelector("form");
    const preview = sheet.querySelector(".vista-previa");
    const close = () => sheet.remove();

    // Compress the photo as soon as it is chosen and show a preview.
    form.elements.photo.addEventListener("change", async () => {
      const file = form.elements.photo.files[0];
      if (!file) return;
      preview.innerHTML = `<p class="ayuda">${e(t("diary.preparingPhoto"))}</p>`;
      newPhoto = await Utils.compressImage(file);
      preview.innerHTML = `<img src="${this.urlFor(newPhoto)}" alt="">`;
      sheet.querySelector(".texto-boton-foto").textContent = t("diary.changePhoto");
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      editing.week = Number(form.elements.week.value);
      editing.note = form.elements.note.value.trim();
      if (newPhoto) editing.photo = newPhoto;
      await Store.diary.save(editing);
      close();
      Utils.toast(t("common.saved") + " 💗");
      this.drawList();
    });

    sheet.querySelector('[data-action="cancel"]').addEventListener("click", close);
    const deleteButton = sheet.querySelector('[data-action="delete"]');
    if (deleteButton) {
      deleteButton.addEventListener("click", async () => {
        if (!confirm(t("diary.confirmDelete"))) return;
        await Store.diary.remove(editing.id);
        close();
        this.drawList();
      });
    }
  },

  // ===================================================================
  // Section: album (full-screen slideshow of all photos in week order)
  // ===================================================================

  playAlbum(entries) {
    const slides = entries.filter((entry) => entry.photo);
    if (slides.length === 0) return;

    const SECONDS_PER_PHOTO = 1.8;
    let index = 0;
    let playing = true;

    const overlay = document.createElement("div");
    overlay.className = "album";
    overlay.innerHTML = `
      <img class="album-foto" alt="">
      <div class="album-semana"></div>
      <div class="album-controles">
        <button data-action="prev" aria-label="${t("album.previous")}">⏮️</button>
        <button data-action="toggle" aria-label="${t("album.pause")}">⏸️</button>
        <button data-action="next" aria-label="${t("album.next")}">⏭️</button>
        <button data-action="close" aria-label="${t("common.close")}">✖️</button>
      </div>`;
    document.body.appendChild(overlay);

    const image = overlay.querySelector(".album-foto");
    const label = overlay.querySelector(".album-semana");
    const toggleButton = overlay.querySelector('[data-action="toggle"]');
    const urls = slides.map((slide) => URL.createObjectURL(slide.photo));

    // Fade out, swap the picture, fade back in.
    const showSlide = () => {
      image.classList.remove("visible");
      setTimeout(() => {
        image.src = urls[index];
        label.textContent = t("diary.week", { week: slides[index].week });
        image.classList.add("visible");
      }, 250);
    };
    const step = (direction) => {
      index = (index + direction + slides.length) % slides.length;
      showSlide();
    };

    const timer = setInterval(() => playing && step(1), SECONDS_PER_PHOTO * 1000);

    overlay.addEventListener("click", (event) => {
      const action = event.target.dataset.action;
      if (action === "prev") step(-1);
      if (action === "next") step(1);
      if (action === "toggle") {
        playing = !playing;
        toggleButton.textContent = playing ? "⏸️" : "▶️";
      }
      if (action === "close") {
        clearInterval(timer);
        urls.forEach((url) => URL.revokeObjectURL(url));
        overlay.remove();
      }
    });

    showSlide();
  },
};
