/*
 * utilidades.js — Small helper functions shared by all screens.
 *
 * What it does:  date math for the pregnancy, text formatting, safe HTML
 *                escaping, image compression and file download helpers.
 * How to use:    call the functions on window.Utils, e.g. Utils.pregnancyStatus(dueDate).
 * Depends on:    idiomas.js (Lang.locale) for date formatting.
 */

window.Utils = (function () {
  // ===================================================================
  // Section: constants
  // ===================================================================

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  // A full-term pregnancy is counted as 280 days (40 weeks) from the
  // first day of the last menstrual period to the due date.
  const PREGNANCY_DAYS = 280;

  // ===================================================================
  // Section: dates
  // ===================================================================

  /**
   * Parse a "YYYY-MM-DD" string as a LOCAL date at midnight.
   * (new Date("2027-03-10") would be UTC midnight, which can shift the day
   * by one depending on the time zone, so we build it by parts.)
   */
  function parseLocalDate(isoText) {
    const [year, month, day] = isoText.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  /** Format a Date as "YYYY-MM-DD" using local time (for <input type="date">). */
  function toIsoDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  /** Today at local midnight, so day differences are whole numbers. */
  function today() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  /** Whole days from dateA to dateB (positive when B is later). */
  function daysBetween(dateA, dateB) {
    // Math.round absorbs the 1-hour jump of daylight-saving changes.
    return Math.round((dateB - dateA) / MS_PER_DAY);
  }

  /** Due date calculated from the first day of the last period (+280 days). */
  function dueDateFromLastPeriod(lastPeriodIso) {
    const start = parseLocalDate(lastPeriodIso);
    return new Date(start.getTime() + PREGNANCY_DAYS * MS_PER_DAY);
  }

  /**
   * Everything the home screen needs to know about the pregnancy today.
   * Returns { week, extraDays, daysLeft, trimester, progress (0..1) }.
   */
  function pregnancyStatus(dueDateIso) {
    const dueDate = parseLocalDate(dueDateIso);
    const daysLeft = daysBetween(today(), dueDate);
    const daysPregnant = PREGNANCY_DAYS - daysLeft;

    const week = Math.floor(daysPregnant / 7);
    const extraDays = ((daysPregnant % 7) + 7) % 7; // keep it positive

    // Trimester boundaries commonly used: weeks 1-13, 14-27, 28 onward.
    let trimester = 1;
    if (week >= 28) trimester = 3;
    else if (week >= 14) trimester = 2;

    const progress = Math.min(1, Math.max(0, daysPregnant / PREGNANCY_DAYS));
    return { week, extraDays, daysLeft, trimester, progress };
  }

  /** Long, friendly date in the current language: "lunes, 3 de marzo de 2027". */
  function formatLongDate(date) {
    return date.toLocaleDateString(Lang.locale(), {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  }

  /** Short date and time: "3 mar, 14:05". */
  function formatShortDateTime(timestamp) {
    const date = new Date(timestamp);
    const day = date.toLocaleDateString(Lang.locale(), { day: "numeric", month: "short" });
    return `${day}, ${formatClock(timestamp)}`;
  }

  /** Clock time "14:05". */
  function formatClock(timestamp) {
    return new Date(timestamp).toLocaleTimeString(Lang.locale(), { hour: "2-digit", minute: "2-digit" });
  }

  /** Duration in seconds as "m:ss" (e.g. 75 -> "1:15"). */
  function formatDuration(totalSeconds) {
    const seconds = Math.max(0, Math.round(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
  }

  // ===================================================================
  // Section: text and HTML
  // ===================================================================

  /**
   * Escape text before inserting it into innerHTML, so names or notes that
   * contain "<" or "&" are shown as text and never run as code.
   */
  function escapeHtml(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** Short random id for list items, entries, etc. */
  function newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // ===================================================================
  // Section: images
  // ===================================================================

  /**
   * Shrink a photo before storing it, so dozens of pictures fit easily on
   * the phone. Keeps the aspect ratio; longest side at most maxSide pixels.
   * Returns a JPEG Blob.
   */
  async function compressImage(file, maxSide = 1600, quality = 0.85) {
    // createImageBitmap applies the photo's EXIF rotation, so portrait
    // photos taken with the phone are not stored sideways.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  }

  /** Blob -> "data:image/jpeg;base64,..." (used by the backup file). */
  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  /** "data:...;base64,..." -> Blob (used when restoring a backup). */
  async function dataUrlToBlob(dataUrl) {
    const response = await fetch(dataUrl);
    return response.blob();
  }

  // ===================================================================
  // Section: files
  // ===================================================================

  /** Offer a Blob to the user as a downloaded file. */
  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Give the browser time to start the download before freeing the memory.
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  /** Show a short message at the bottom of the screen for a few seconds. */
  function toast(message) {
    const box = document.getElementById("toast");
    box.textContent = message;
    box.classList.add("visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => box.classList.remove("visible"), 2600);
  }

  return {
    parseLocalDate, toIsoDate, today, daysBetween, dueDateFromLastPeriod,
    pregnancyStatus, formatLongDate, formatShortDateTime, formatClock, formatDuration,
    escapeHtml, newId, compressImage, blobToDataUrl, dataUrlToBlob, downloadBlob, toast,
  };
})();
