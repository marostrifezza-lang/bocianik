/*
 * pantalla-listas.js — Checklists (hospital bag, documents, home, ...).
 *
 * What it does:  shows several checklists that she can tick, edit and extend.
 *                The first time, it creates a few starter lists with common
 *                items; she can delete anything that does not apply to her.
 *                Starter lists and items store a translation KEY instead of
 *                text, so they change language with the app. Lists and items
 *                she adds herself store the text exactly as she typed it.
 * How to use:    App.show("listas").
 * Data shape:    Store key "lists":
 *                [{ id, titleKey | title, open, items: [{ id, textKey | text, done }] }]
 * Depends on:    idiomas.js, utilidades.js, almacenamiento.js, app.js.
 */

window.Screens = window.Screens || {};

window.Screens.listas = {
  titleKey: "lists.title",

  // ===================================================================
  // Section: starter content (only used the very first time)
  // ===================================================================

  // Each list: [title key, number of items]. Item keys are "<list>.item1", "<list>.item2", ...
  // (the texts are in textos-*.js).
  STARTER_LISTS: [
    ["lists.bagMom", 9],
    ["lists.bagBaby", 8],
    ["lists.documents", 4],
    ["lists.beforeArrival", 6],
  ],

  /** Build the starter lists with ids and unchecked items. */
  createStarterLists() {
    return this.STARTER_LISTS.map(([titleKey, itemCount], index) => ({
      id: Utils.newId(),
      titleKey,
      open: index === 0, // only the first list starts expanded
      items: Array.from({ length: itemCount }, (unused, i) => ({
        id: Utils.newId(), textKey: `${titleKey}.item${i + 1}`, done: false,
      })),
    }));
  },

  /** Text to show for a list title or item: her own text, or the translated starter text. */
  label(entry, textField, keyField) {
    return entry[textField] ?? t(entry[keyField]);
  },

  // ===================================================================
  // Section: drawing
  // ===================================================================

  async render(container) {
    this.container = container;
    this.lists = await Store.get("lists", null);
    if (!this.lists) {
      this.lists = this.createStarterLists();
      await this.save();
    }
    this.draw();
  },

  save() {
    return Store.set("lists", this.lists);
  },

  draw() {
    const e = Utils.escapeHtml;
    this.container.innerHTML = `
      <p class="ayuda">${e(t("lists.hospitalHint"))}</p>
      ${this.lists.map((list) => {
        const doneCount = list.items.filter((item) => item.done).length;
        return `
          <details class="tarjeta lista" data-list="${list.id}" ${list.open ? "open" : ""}>
            <summary>
              <span>${e(this.label(list, "title", "titleKey"))}</span>
              <span class="contador-lista">${doneCount}/${list.items.length}</span>
            </summary>
            <ul>
              ${list.items.map((item) => `
                <li class="${item.done ? "hecho" : ""}">
                  <label><input type="checkbox" data-item="${item.id}" ${item.done ? "checked" : ""}>
                    <span>${e(this.label(item, "text", "textKey"))}</span></label>
                  <button class="quitar" data-remove="${item.id}" aria-label="${e(t("common.remove"))}">✕</button>
                </li>`).join("")}
            </ul>
            <form class="agregar-item" data-add="${list.id}">
              <input type="text" placeholder="${e(t("lists.addItem"))}" required>
              <button class="boton" aria-label="${e(t("common.add"))}">➕</button>
            </form>
            <button class="boton enlace peligro" data-delete-list="${list.id}">${e(t("lists.deleteList"))}</button>
          </details>`;
      }).join("")}

      <form class="tarjeta agregar-item" id="nueva-lista">
        <input type="text" placeholder="${e(t("lists.newListName"))}" required>
        <button class="boton principal">${e(t("lists.createList"))}</button>
      </form>
    `;
    this.wireEvents();
  },

  // ===================================================================
  // Section: user actions
  // ===================================================================

  /** Find the list that contains an element of the page. */
  listOf(element) {
    const id = element.closest("[data-list]").dataset.list;
    return this.lists.find((list) => list.id === id);
  },

  wireEvents() {
    const c = this.container;

    // Remember which lists are expanded so they stay that way.
    c.querySelectorAll("details.lista").forEach((details) => {
      details.addEventListener("toggle", () => {
        this.listOf(details).open = details.open;
        this.save();
      });
    });

    // Tick / untick an item (update the page in place, no full redraw).
    c.querySelectorAll("input[data-item]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const list = this.listOf(checkbox);
        const item = list.items.find((entry) => entry.id === checkbox.dataset.item);
        item.done = checkbox.checked;
        checkbox.closest("li").classList.toggle("hecho", item.done);
        const doneCount = list.items.filter((entry) => entry.done).length;
        checkbox.closest("details").querySelector(".contador-lista").textContent =
          `${doneCount}/${list.items.length}`;
        this.save();
      });
    });

    c.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => {
        const list = this.listOf(button);
        list.items = list.items.filter((item) => item.id !== button.dataset.remove);
        this.save();
        this.draw();
      });
    });

    c.querySelectorAll("form[data-add]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = form.querySelector("input");
        this.listOf(form).items.push({ id: Utils.newId(), text: input.value.trim(), done: false });
        this.save();
        this.draw();
      });
    });

    c.querySelectorAll("[data-delete-list]").forEach((button) => {
      button.addEventListener("click", () => {
        const list = this.listOf(button);
        if (!confirm(t("lists.confirmDelete", { name: this.label(list, "title", "titleKey") }))) return;
        this.lists = this.lists.filter((entry) => entry.id !== list.id);
        this.save();
        this.draw();
      });
    });

    c.querySelector("#nueva-lista").addEventListener("submit", (event) => {
      event.preventDefault();
      const input = event.target.querySelector("input");
      this.lists.push({ id: Utils.newId(), title: input.value.trim(), open: true, items: [] });
      this.save();
      this.draw();
    });
  },
};
