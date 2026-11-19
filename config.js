/*
 * config.js — Gift settings for "Bocianik".
 *
 * What it does:  holds the few texts that personalize the gift (who gives it,
 *                a short dedication, and the creator's name for the Help screen).
 * How to use:    edit the values below before publishing. Do NOT put private
 *                data here (her name, due date, addresses): this file is
 *                published in a PUBLIC GitHub repository and anyone can read it.
 *                Her name and due date are typed by her inside the app and are
 *                stored only on her phone.
 * Depends on:    nothing. Loaded first by index.html; other scripts read
 *                window.CONFIG.
 */

window.CONFIG = {
  // App name shown in the header and the welcome screen ("bocianik" = little stork in Slovak).
  appName: "Bocianik",

  // Who gives the gift (shown as "Un regalo de ...").
  giftFrom: "Mariano",
  // Slovak declines names after "od" (from): "Darček od Mariana".
  giftFromSlovak: "Mariana",

  // Creator shown in the Help screen (no e-mail: this file is public).
  creatorName: "Mariano Gonzalez",

  // Short dedication shown on the welcome screen, one text per language.
  dedication: {
    es: "Para acompañarte en estos meses tan especiales.",
    en: "To keep you company during these very special months.",
    sk: "Aby ťa sprevádzala počas týchto výnimočných mesiacov.",
  },
};
