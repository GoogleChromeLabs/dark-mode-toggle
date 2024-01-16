"use strict";

(() => {
  const ELEMENT_ID = "dark-mode-toggle-stylesheets";
  const STORAGE_NAME = "dark-mode-toggle";
  const LIGHT = "light";
  const DARK = "dark";

  let stylesheets = document.getElementById(ELEMENT_ID).textContent;

  let mode = null;
  try {
    mode = localStorage.getItem(STORAGE_NAME);
  } catch (e) {}

  const lightCSSMediaRegex = /\(\s*prefers-color-scheme\s*:\s*light\s*\)/gi;
  const darkCSSMediaRegex = /\(\s*prefers-color-scheme\s*:\s*dark\s*\)/gi;

  switch (mode) {
    case LIGHT:
      stylesheets = stylesheets
        .replace(lightCSSMediaRegex, "$&, all")
        .replace(darkCSSMediaRegex, "$& and not all");
      break;

    case DARK:
      stylesheets = stylesheets
        .replace(darkCSSMediaRegex, "$&, all")
        .replace(lightCSSMediaRegex, "$& and not all");
      break;
  }

  document.write(stylesheets);
})();
