/*
 * almacenamiento.js — Everything the app saves, kept ONLY on this phone.
 *
 * What it does:  wraps IndexedDB (the browser's built-in database) with a few
 *                simple functions. Nothing is ever sent to a server.
 *                - store "datos":  small JSON values by key (settings, lists,
 *                                  names, contractions, kick sessions, ...)
 *                - store "diario": diary entries, each with an optional photo Blob
 *                Also builds and restores the backup file.
 * How to use:    await Store.get("settings", {}); await Store.set("settings", value);
 *                await Store.diary.all(); await Store.diary.save(entry); ...
 * Depends on:    utilidades.js (Utils.blobToDataUrl / Utils.dataUrlToBlob),
 *                idiomas.js (t) and config.js (app name) for the error message.
 */

window.Store = (function () {
  // ===================================================================
  // Section: configuration
  // ===================================================================

  const DB_NAME = "bocianik";
  const DB_VERSION = 1;
  const KEY_VALUE_STORE = "datos";
  const DIARY_STORE = "diario";
  const BACKUP_FORMAT = "bocianik-backup";

  // ===================================================================
  // Section: opening the database
  // ===================================================================

  let dbPromise = null;

  /** Open the database once and reuse the same connection afterwards. */
  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      // Runs only the first time (or when DB_VERSION goes up): create the stores.
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(KEY_VALUE_STORE)) db.createObjectStore(KEY_VALUE_STORE);
        if (!db.objectStoreNames.contains(DIARY_STORE)) db.createObjectStore(DIARY_STORE, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  }

  /**
   * Run one operation inside a transaction and return its result as a Promise.
   * "work" receives the object store and must return an IDBRequest.
   */
  async function runRequest(storeName, mode, work) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const request = work(transaction.objectStore(storeName));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // ===================================================================
  // Section: key-value data
  // ===================================================================

  /** Read a value; return defaultValue when it was never saved. */
  async function get(key, defaultValue) {
    const value = await runRequest(KEY_VALUE_STORE, "readonly", (store) => store.get(key));
    return value === undefined ? defaultValue : value;
  }

  /** Save (or replace) a value. */
  function set(key, value) {
    return runRequest(KEY_VALUE_STORE, "readwrite", (store) => store.put(value, key));
  }

  // ===================================================================
  // Section: diary entries
  // ===================================================================

  const diary = {
    /** All entries, oldest week first. */
    async all() {
      const entries = await runRequest(DIARY_STORE, "readonly", (store) => store.getAll());
      return entries.sort((a, b) => a.week - b.week || a.createdAt - b.createdAt);
    },
    get(id) {
      return runRequest(DIARY_STORE, "readonly", (store) => store.get(id));
    },
    save(entry) {
      return runRequest(DIARY_STORE, "readwrite", (store) => store.put(entry));
    },
    remove(id) {
      return runRequest(DIARY_STORE, "readwrite", (store) => store.delete(id));
    },
  };

  // ===================================================================
  // Section: protection against automatic deletion
  // ===================================================================

  /**
   * Ask the browser to treat our data as "persistent", so it is not
   * deleted automatically when the phone runs low on space.
   * Chrome usually grants it to installed apps. Returns true/false.
   */
  async function requestPersistence() {
    if (!navigator.storage || !navigator.storage.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return navigator.storage.persist();
  }

  async function isPersistent() {
    if (!navigator.storage || !navigator.storage.persisted) return false;
    return navigator.storage.persisted();
  }

  /** Space used by the app in MB (approximate), or null if unknown. */
  async function usedMegabytes() {
    if (!navigator.storage || !navigator.storage.estimate) return null;
    const estimate = await navigator.storage.estimate();
    return estimate.usage / (1024 * 1024);
  }

  // ===================================================================
  // Section: backup (export / import)
  // ===================================================================

  /**
   * Build one JSON object with ALL the app data. Photos are converted to
   * text (base64) so everything fits in a single file.
   */
  async function exportAll() {
    const keys = await runRequest(KEY_VALUE_STORE, "readonly", (store) => store.getAllKeys());
    const values = {};
    for (const key of keys) values[key] = await get(key);

    const entries = [];
    for (const entry of await diary.all()) {
      const copy = { ...entry };
      if (entry.photo) copy.photo = await Utils.blobToDataUrl(entry.photo);
      entries.push(copy);
    }

    return { format: BACKUP_FORMAT, version: 1, createdAt: Date.now(), values, diary: entries };
  }

  /** Replace all current data with the content of a backup object. */
  async function importAll(backup) {
    if (!backup || backup.format !== BACKUP_FORMAT) {
      throw new Error(t("backup.invalidFile", { app: CONFIG.appName }));
    }
    await clearAll();
    for (const [key, value] of Object.entries(backup.values || {})) await set(key, value);
    for (const entry of backup.diary || []) {
      const copy = { ...entry };
      if (typeof entry.photo === "string") copy.photo = await Utils.dataUrlToBlob(entry.photo);
      await diary.save(copy);
    }
  }

  /** Delete everything (used by "Borrar todo" and before restoring a backup). */
  async function clearAll() {
    await runRequest(KEY_VALUE_STORE, "readwrite", (store) => store.clear());
    await runRequest(DIARY_STORE, "readwrite", (store) => store.clear());
  }

  return { get, set, diary, requestPersistence, isPersistent, usedMegabytes, exportAll, importAll, clearAll };
})();
