/**
 * Copyright 2019 Google LLC
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

// @license © 2019 Google LLC. Licensed under the Apache License, Version 2.0.
const win = window;
const doc = document;
const store = win.localStorage;
const MQ_DARK = '(prefers-color-scheme: dark)';
const MQ_LIGHT = [
  '(prefers-color-scheme: light)',
  '(prefers-color-scheme: no-preference)',
];
const LIGHT = 'light';
const DARK = 'dark';
const REMEMBER = 'remember';
const LEGEND = 'legend';
const TOGGLE = 'toggle';
const SWITCH = 'switch';
const APPEARANCE = 'appearance';
const PERMANENT = 'permanent';
const MODE = 'mode';
const COLOR_SCHEME_CHANGE = 'colorschemechange';
const PERMANENT_COLOR_SCHEME = 'permanentcolorscheme';
const ALL = 'all';
const NAME = 'dark-mode-toggle';

// See https://html.spec.whatwg.org/multipage/common-dom-interfaces.html ↵
// #reflecting-content-attributes-in-idl-attributes.
const installStringReflection = (obj, attrName, propName = attrName) => {
  Object.defineProperty(obj, propName, {
    enumerable: true,
    get() {
      const value = this.getAttribute(attrName);
      return value === null ? '' : value;
    },
    set(v) {
      this.setAttribute(attrName, v);
    },
  });
};

const installBoolReflection = (obj, attrName, propName = attrName) => {
  Object.defineProperty(obj, propName, {
    enumerable: true,
    get() {
      return this.hasAttribute(attrName);
    },
    set(v) {
      if (v) {
        this.setAttribute(attrName, '');
      } else {
        this.removeAttribute(attrName);
      }
    },
  });
};

const template = doc.createElement('template');
template.innerHTML = `
<style>
*,
::before,
::after {
  box-sizing: border-box;
}

:host {
  contain: content;
  display: block;
}

:host([hidden]) {
  display: none;
}

form {
  background-color: var(--${NAME}-background-color, transparent);
  color: var(--${NAME}-color, inherit);
  padding: 0;
}

fieldset {
  border: none;
}

legend {
  font: var(--${NAME}-legend-font, inherit);
  padding: 0;
}

input,
label {
  cursor: pointer;
}

label {
  padding: 0.15rem;
}

input {
  opacity: 0;
  position: absolute;
  pointer-events: none;
}

input:focus + label {
  outline: rgb(229, 151, 0) auto 2px;
  outline: -webkit-focus-ring-color auto 5px;
}

label::before {
  content: "";
  display: inline-block;
  background-size: var(--${NAME}-icon-size, 1rem);
  background-repeat: no-repeat;
  height: var(--${NAME}-icon-size, 1rem);
  width: var(--${NAME}-icon-size, 1rem);
  vertical-align: middle;
  margin: 0 0.5rem 0 0;
}

label[dir="rtl"]::before {
  margin: 0 0 0 0.5rem;
}

#lightLabel::before {
  background-image: var(--${NAME}-light-icon, none);
}

#darkLabel::before {
  filter: var(--${NAME}-icon-filter, none);
  background-image: var(--${NAME}-dark-icon, none);
}

#checkboxLabel::before {
  background-image: var(--${NAME}-checkbox-icon, none);
}

#permanentLabel::before {
  background-image: var(--${NAME}-remember-icon-unchecked, none);
}

#lightLabel,
#darkLabel,
#checkboxLabel {
  font: var(--${NAME}-label-font, inherit);
}

#lightLabel:empty,
#darkLabel:empty,
#checkboxLabel:empty {
  font-size: 0;
  padding: 0;
}

#permanentLabel {
  font: var(--${NAME}-remember-font, inherit);
}

input:checked + #permanentLabel::before {
  background-image: var(--${NAME}-remember-icon-checked, none);
}

input:checked + #darkLabel,
input:checked + #lightLabel {
  background-color: var(--${NAME}-active-mode-background-color, transparent);
}

input:checked + #darkLabel::before,
input:checked + #lightLabel::before {
  background-color: var(--${NAME}-active-mode-background-color, transparent);
}

input:checked + #checkboxLabel::before {
  filter: var(--${NAME}-icon-filter, none);
}

input:checked + #checkboxLabel + aside #permanentLabel::before {
  filter: var(--${NAME}-remember-filter, none);
}

aside {
  visibility: hidden;
  margin-top: 0.15rem;
}

#lightLabel:focus-visible ~ aside,
#darkLabel:focus-visible ~ aside,
#checkboxLabel:focus-visible ~ aside {
  visibility: visible;
  transition: visibility 0s;
}

@media (hover: hover) {
  aside {
    transition: visibility 3s;
  }

  aside:hover {
    visibility: visible;
  }

  #lightLabel:hover ~ aside,
  #darkLabel:hover ~ aside,
  #checkboxLabel:hover ~ aside {
    visibility: visible;
    transition: visibility 0s;
  }

  aside #permanentLabel:empty {
    display: none;
  }
}
</style>
<form>
<fieldset>
  <legend></legend>

  <input id="lightRadio" name="mode" type="radio">
  <label id="lightLabel" for="lightRadio"></label>

  <input id="darkRadio" name="mode" type="radio">
  <label id="darkLabel" for="darkRadio"></label>

  <input id="darkCheckbox" type="checkbox">
  <label id="checkboxLabel" for="darkCheckbox"></label>

  <aside>
    <input id="permanentCheckbox" type="checkbox">
    <label id="permanentLabel" for="permanentCheckbox"></label>
  </aside>
</fieldset>
</form>`;

export class DarkModeToggle extends HTMLElement {
  static get observedAttributes() {
    return [MODE, APPEARANCE, PERMANENT, LEGEND, LIGHT, DARK, REMEMBER];
  }

  constructor() {
    super();

    installStringReflection(this, MODE);
    installStringReflection(this, APPEARANCE);
    installStringReflection(this, LEGEND);
    installStringReflection(this, LIGHT);
    installStringReflection(this, DARK);
    installStringReflection(this, REMEMBER);

    installBoolReflection(this, PERMANENT);

    this._darkCSS = null;
    this._lightCSS = null;

    doc.addEventListener(COLOR_SCHEME_CHANGE, (e) => {
      this.mode = e.detail.colorScheme;
      this._updateRadios();
      this._updateCheckbox();
    });

    doc.addEventListener(PERMANENT_COLOR_SCHEME, (e) => {
      this.permanent = e.detail.permanent;
      this.permanentCheckbox.checked = this.permanent;
    });

    this._initializeDOM();
  }

  _initializeDOM() {
    const shadowRoot = this.attachShadow({mode: 'closed'});
    shadowRoot.appendChild(template.content.cloneNode(true));

    // Store original `media` attribute value.
    // Note: we treat `prefers-color-scheme: light` and
    // `prefers-color-scheme: no-preference` the same.
    this._darkCSS =
        doc.querySelectorAll(`link[rel="stylesheet"][media="${MQ_DARK}"]`);
    this._darkCSS.forEach((link) => link.dataset.originalMedia = link.media);
    this._lightCSS = document.querySelectorAll(MQ_LIGHT.map((mqLight) => {
      return `link[rel="stylesheet"][media*="${mqLight}"]`;
    }).join(', '));
    this._lightCSS.forEach((link) => link.dataset.originalMedia = link.media);

    // Get DOM references.
    this.lightRadio = shadowRoot.querySelector('#lightRadio');
    this.lightLabel = shadowRoot.querySelector('#lightLabel');
    this.darkRadio = shadowRoot.querySelector('#darkRadio');
    this.darkLabel = shadowRoot.querySelector('#darkLabel');
    this.darkCheckbox = shadowRoot.querySelector('#darkCheckbox');
    this.checkboxLabel = shadowRoot.querySelector('#checkboxLabel');
    this.legendLabel = shadowRoot.querySelector('legend');
    this.permanentAside = shadowRoot.querySelector('aside');
    this.permanentCheckbox = shadowRoot.querySelector('#permanentCheckbox');
    this.permanentLabel = shadowRoot.querySelector('#permanentLabel');

    // Does the browser support native `prefers-color-scheme`?
    const hasNativePrefersColorScheme =
        win.matchMedia('(prefers-color-scheme)').media !== 'not all';
    // Listen to `prefers-color-scheme` changes, unless `permanent` is true.
    if (hasNativePrefersColorScheme) {
      win.matchMedia(MQ_DARK).addListener(({matches}) => {
        if (!this.permanent) {
          this.mode = matches ? DARK : LIGHT;
          this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});
        }
      });
    }
    // Set initial state, giving preference to a remembered value, then the
    // native value (if supported), and eventually defaulting to a light
    // experience.
    const rememberedValue = store.getItem(NAME);
    if (rememberedValue && [DARK, LIGHT].includes(rememberedValue)) {
      this.mode = rememberedValue;
      this.permanentCheckbox.checked = true;
      this.permanent = true;
    } else if (hasNativePrefersColorScheme) {
      if ((win.matchMedia(MQ_LIGHT[0]).matches) ||
          (win.matchMedia(MQ_LIGHT[1]).matches)) {
        this.mode = LIGHT;
      } else if (win.matchMedia(MQ_DARK).matches) {
        this.mode = DARK;
      }
    }
    if (!this.mode) {
      this.mode = LIGHT;
    }
    if (this.permanent && !rememberedValue) {
      store.setItem(NAME, this.mode);
    }

    // Default to toggle appearance.
    if (!this.appearance) {
      this.appearance = TOGGLE;
    }

    // Update the appearance to either of toggle or switch.
    this._updateAppearance();

    // Update the radios
    this._updateRadios();

    // Make the checkbox reflect the state of the radios
    this._updateCheckbox();

    // Synchronize the behavior of the radio and the checkbox.
    [this.lightRadio, this.darkRadio].forEach((input) => {
      input.addEventListener('change', () => {
        this.mode = this.lightRadio.checked ? LIGHT : DARK;
        this._updateCheckbox();
        this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});
      });
    });
    this.darkCheckbox.addEventListener('change', () => {
      this.mode = this.darkCheckbox.checked ? DARK : LIGHT;
      this._updateRadios();
      this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});
    });

    // Make remembering the last mode optional
    this.permanentCheckbox.addEventListener('change', () => {
      this.permanent = this.permanentCheckbox.checked;
      this._dispatchEvent(PERMANENT_COLOR_SCHEME, {
        permanent: this.permanent,
      });
    });

    // Finally update the mode and let the world know what's going on
    this._updateMode();
    this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});
    this._dispatchEvent(PERMANENT_COLOR_SCHEME, {
      permanent: this.permanent,
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === MODE) {
      if (![LIGHT, DARK].includes(newValue)) {
        throw new RangeError(`Allowed values: "${LIGHT}" and "${DARK}".`);
      }
      // Only show the dialog programmatically on devices not capable of hover
      // and only if there is a label
      if (win.matchMedia('(hover: none)').matches && this.remember) {
        this._showPermanentAside();
      }
      if (this.permanent) {
        store.setItem(NAME, this.mode);
      }
      this._updateRadios();
      this._updateCheckbox();
      this._updateMode();
    } else if (name === APPEARANCE) {
      if (![TOGGLE, SWITCH].includes(newValue)) {
        throw new RangeError('Allowed values: "${TOGGLE}" and "${SWITCH}".');
      }
      this._updateAppearance();
    } else if (name === PERMANENT) {
      if (this.permanent) {
        store.setItem(NAME, this.mode);
      } else {
        store.removeItem(NAME);
      }
      this.permanentCheckbox.checked = this.permanent;
    } else if (name === LEGEND) {
      this.legendLabel.textContent = newValue;
    } else if (name === REMEMBER) {
      this.permanentLabel.textContent = newValue;
    } else if (name === LIGHT) {
      this.lightLabel.textContent = newValue;
      if (this.mode === LIGHT) {
        this.checkboxLabel.textContent = newValue;
      }
    } else if (name === DARK) {
      this.darkLabel.textContent = newValue;
      if (this.mode === DARK) {
        this.checkboxLabel.textContent = newValue;
      }
    }
  }

  _dispatchEvent(type, value) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: value,
    }));
  }

  _updateAppearance() {
    // Hide or show the light-related affordances dependent on the appearance,
    // which can be "switch" or "toggle".
    const appearAsToggle = this.appearance === TOGGLE;
    this.lightRadio.hidden = appearAsToggle;
    this.lightLabel.hidden = appearAsToggle;
    this.darkRadio.hidden = appearAsToggle;
    this.darkLabel.hidden = appearAsToggle;
    this.darkCheckbox.hidden = !appearAsToggle;
    this.checkboxLabel.hidden = !appearAsToggle;
  }

  _updateRadios() {
    if (this.mode === LIGHT) {
      this.lightRadio.checked = true;
    } else {
      this.darkRadio.checked = true;
    }
  }

  _updateCheckbox() {
    if (this.mode === LIGHT) {
      this.checkboxLabel.style.setProperty(`--${NAME}-checkbox-icon`,
          `var(--${NAME}-light-icon)`);
      this.checkboxLabel.textContent = this.light;
      this.darkCheckbox.checked = false;
    } else {
      this.checkboxLabel.style.setProperty(`--${NAME}-checkbox-icon`,
          `var(--${NAME}-dark-icon)`);
      this.checkboxLabel.textContent = this.dark;
      this.darkCheckbox.checked = true;
    }
  }

  _updateMode() {
    if (this.mode === LIGHT) {
      this._lightCSS.forEach((link) => {
        link.media = ALL;
        link.disabled = false;
      });
      this._darkCSS.forEach((link) => {
        link.media = link.dataset.originalMedia;
        link.disabled = true;
      });
    } else {
      this._darkCSS.forEach((link) => {
        link.media = ALL;
        link.disabled = false;
      });
      this._lightCSS.forEach((link) => {
        link.media = link.dataset.originalMedia;
        link.disabled = true;
      });
    }
  }

  _showPermanentAside() {
    this.permanentAside.style.visibility = 'visible';
    win.setTimeout(() => {
      this.permanentAside.style.visibility = 'hidden';
    }, 3000);
  }
}

win.customElements.define(NAME, DarkModeToggle);
