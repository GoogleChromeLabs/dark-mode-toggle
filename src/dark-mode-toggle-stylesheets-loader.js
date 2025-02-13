/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @license © 2024 Google LLC. Licensed under the Apache License, Version 2.0.
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @license © 2024 Google LLC. Licensed under the Apache License, Version 2.0.
(() => {
  const ELEMENT_ID = 'dark-mode-toggle-stylesheets';
  const STORAGE_NAME = 'dark-mode-toggle';
  const LIGHT = 'light';
  const DARK = 'dark';

  let stylesheetsAndMetatag = document.getElementById(ELEMENT_ID).textContent;

  let mode = null;
  try {
    mode = localStorage.getItem(STORAGE_NAME);
  } catch (e) {
    return;
  }

  const lightCSSMediaRegex = /\(\s*prefers-color-scheme\s*:\s*light\s*\)/gi;
  const darkCSSMediaRegex = /\(\s*prefers-color-scheme\s*:\s*dark\s*\)/gi;
  const darkLightRegex = /\b(?:dark\s+light|light\s+dark)\b/;

  switch (mode) {
    case LIGHT:
      stylesheetsAndMetatag = stylesheetsAndMetatag
        .replace(lightCSSMediaRegex, '$&, all')
        .replace(darkCSSMediaRegex, '$& and not all')
        .replace(darkLightRegex, mode);
      break;

    case DARK:
      stylesheetsAndMetatag = stylesheetsAndMetatag
        .replace(darkCSSMediaRegex, '$&, all')
        .replace(lightCSSMediaRegex, '$& and not all')
        .replace(darkLightRegex, mode);
      break;
  }

  document.write(stylesheetsAndMetatag);
})();
