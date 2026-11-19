/*
 * pantalla-nombres.js — Baby-name game for two people on one phone.
 *
 * What it does:  1. "Nombres":  both add names they like (girl, boy or either).
 *                2. "Votar":    each person, in turn and without looking at the
 *                               other's votes, says yes or no to every name.
 *                3. "Coinciden": names BOTH people said yes to.
 *                Everything stays on this phone (no server), so they take turns.
 * How to use:    App.show("nombres", { back: "mas" }).
 * Data shape:    Store key "names": [{ id, name, kind: "girl"|"boy"|"any",
 *                                      votes: { a: true|false, b: true|false } }]
 *                "a" is her, "b" is her partner.
 * Depends on:    idiomas.js, utilidades.js, almacenamiento.js, app.js.
 */

window.Screens = window.Screens || {};

window.Screens.nombres = {
  titleKey: "names.title",
  tab: "mas",

  // Current sub-view ("add", "vote", "matches") and who is voting ("a" or "b").
  view: "add",
  voter: null,

  KIND_ICONS: { girl: "👧", boy: "👦", any: "🌈" },

  async render(container) {
    this.container = container;
    this.names = await Store.get("names", []);
    this.draw();
  },

  save() {
    return Store.set("names", this.names);
  },

  /** Display names of the two players. */
  players() {
    const settings = App.getSettings();
    return { a: settings.name || t("names.playerA"), b: settings.partnerName || t("names.playerB") };
  },

  // ===================================================================
  // Section: layout with the three sub-views
  // ===================================================================

  draw() {
    const views = [["add", "✍️", "names.viewAdd"], ["vote", "🗳️", "names.viewVote"], ["matches", "💞", "names.viewMatches"]];
    this.container.innerHTML = `
      <div class="selector">
        ${views.map(([view, icon, key]) =>
          `<button data-view="${view}" class="${this.view === view ? "activa" : ""}">${icon} ${t(key)}</button>`).join("")}
      </div>
      <div id="contenido-nombres"></div>`;

    this.container.querySelectorAll("[data-view]").forEach((button) => {
      button.addEventListener("click", () => {
        this.view = button.dataset.view;
        this.voter = null;
        this.draw();
      });
    });

    const content = this.container.querySelector("#contenido-nombres");
    if (this.view === "add") this.drawAdd(content);
    if (this.view === "vote") this.drawVote(content);
    if (this.view === "matches") this.drawMatches(content);
  },

  // ===================================================================
  // Section: adding names
  // ===================================================================

  drawAdd(content) {
    const e = Utils.escapeHtml;
    content.innerHTML = `
      <form class="tarjeta formulario" id="form-nombre">
        <label>${e(t("names.addLabel"))}
          <input type="text" name="name" required placeholder="${e(t("names.addPlaceholder"))}">
        </label>
        <div class="fila-botones">
          <select name="kind" aria-label="${e(t("names.kind"))}">
            <option value="girl">👧 ${e(t("names.girl"))}</option>
            <option value="boy">👦 ${e(t("names.boy"))}</option>
            <option value="any" selected>🌈 ${e(t("names.any"))}</option>
          </select>
          <button class="boton principal">${e(t("common.add"))}</button>
        </div>
      </form>
      ${this.names.length === 0 ? `<p class="vacio">${e(t("names.empty"))}</p>` : `
        <ul class="tarjeta lista-simple">
          ${this.names.map((entry) => `
            <li><span>${this.KIND_ICONS[entry.kind]} ${e(entry.name)}</span>
                <button class="quitar" data-remove="${entry.id}" aria-label="${e(t("common.remove"))}">✕</button></li>`).join("")}
        </ul>`}`;

    content.querySelector("#form-nombre").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.target;
      // Several names can be typed at once, separated by commas.
      const newNames = form.elements.name.value.split(",").map((name) => name.trim()).filter(Boolean);
      newNames.forEach((name) => {
        const alreadyThere = this.names.some((entry) => entry.name.toLowerCase() === name.toLowerCase());
        if (!alreadyThere) this.names.push({ id: Utils.newId(), name, kind: form.elements.kind.value, votes: {} });
      });
      await this.save();
      this.drawAdd(content);
      content.querySelector('input[name="name"]').focus();
    });

    content.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", async () => {
        this.names = this.names.filter((entry) => entry.id !== button.dataset.remove);
        await this.save();
        this.drawAdd(content);
      });
    });
  },

  // ===================================================================
  // Section: voting (one card at a time, hidden from the other person)
  // ===================================================================

  drawVote(content) {
    const e = Utils.escapeHtml;
    const players = this.players();

    // Step 1: choose who is voting.
    if (!this.voter) {
      content.innerHTML = `
        <p class="ayuda">${e(t("names.whoVotes"))}</p>
        <div class="fila-botones">
          <button class="boton principal" data-voter="a">${e(players.a)}</button>
          <button class="boton principal" data-voter="b">${e(players.b)}</button>
        </div>`;
      content.querySelectorAll("[data-voter]").forEach((button) => {
        button.addEventListener("click", () => {
          this.voter = button.dataset.voter;
          this.drawVote(content);
        });
      });
      return;
    }

    // Step 2: next name this person has not voted yet.
    const pending = this.names.filter((entry) => entry.votes[this.voter] === undefined);
    if (pending.length === 0) {
      content.innerHTML = `
        <p class="vacio">${e(t(this.names.length ? "names.allVoted" : "names.empty"))}</p>
        <button class="boton" id="cambiar-votante">${e(t("names.changeVoter"))}</button>`;
      content.querySelector("#cambiar-votante").addEventListener("click", () => {
        this.voter = null;
        this.drawVote(content);
      });
      return;
    }

    const current = pending[0];
    content.innerHTML = `
      <p class="ayuda">${e(t("names.votingAs", { name: players[this.voter] }))} · ${e(Lang.plural("names.remaining", pending.length))}</p>
      <div class="tarjeta carta-nombre">
        <span class="tipo-nombre" aria-hidden="true">${this.KIND_ICONS[current.kind]}</span>
        <span class="nombre-grande">${e(current.name)}</span>
      </div>
      <div class="fila-botones votos">
        <button class="boton voto-no" data-vote="no">✖️ ${e(t("names.no"))}</button>
        <button class="boton voto-si" data-vote="yes">❤️ ${e(t("names.yes"))}</button>
      </div>
      <button class="boton enlace" id="cambiar-votante">${e(t("names.changeVoter"))}</button>`;

    content.querySelectorAll("[data-vote]").forEach((button) => {
      button.addEventListener("click", async () => {
        current.votes[this.voter] = button.dataset.vote === "yes";
        await this.save();
        this.drawVote(content);
      });
    });
    content.querySelector("#cambiar-votante").addEventListener("click", () => {
      this.voter = null;
      this.drawVote(content);
    });
  },

  // ===================================================================
  // Section: matches
  // ===================================================================

  drawMatches(content) {
    const e = Utils.escapeHtml;
    const matches = this.names.filter((entry) => entry.votes.a === true && entry.votes.b === true);
    content.innerHTML = `
      ${matches.length === 0 ? `<p class="vacio">${e(t("names.noMatches"))}</p>` : `
        <ul class="tarjeta lista-simple coincidencias">
          ${matches.map((entry) => `<li>💞 ${this.KIND_ICONS[entry.kind]} <strong>${e(entry.name)}</strong></li>`).join("")}
        </ul>`}
      ${this.names.length ? `<button class="boton peligro" id="reiniciar-votos">${e(t("names.resetVotes"))}</button>` : ""}`;

    const resetButton = content.querySelector("#reiniciar-votos");
    if (resetButton) {
      resetButton.addEventListener("click", async () => {
        if (!confirm(t("names.confirmReset"))) return;
        this.names.forEach((entry) => (entry.votes = {}));
        await this.save();
        this.drawMatches(content);
      });
    }
  },
};
