((win, doc, store, mqDark, mqsLight) => {
  const LIGHT = 'light';
  const DARK = 'dark';
  const TOGGLE = 'toggle';
  const SWITCH = 'switch';
  const LEGEND = 'legend';
  const APPEARANCE = 'appearance';
  const PERSIST = 'persist';
  const MODE = 'mode';
  const COLOR_SCHEME_CHANGE = 'colorschemechange';
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

  label::before {
    content: "";
    display: inline-block;
    background-size: 1rem;
    background-repeat: no-repeat;
    height: 1rem;
    width: 1rem;
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

  label {
    padding: 0.15rem;
    font: var(--${NAME}-label-font, inherit);
  }

  input {
    opacity: 0;
    position: absolute;
  }

  input:focus + label {
    outline: rgb(229, 151, 0) auto 5px;
    outline: -webkit-focus-ring-color auto 5px;
  }

  input:checked + label {
    background-color: var(--${NAME}-active-mode-background-color, transparent);
  }

  input:checked + label::before {
    background-color: var(--${NAME}-active-mode-background-color, transparent);
    border-radius: 1rem;
  }

  input:checked + #checkboxLabel::before {
    filter: var(--${NAME}-icon-filter, none);
  }
</style>
<form id="theme">
  <fieldset>
    <legend id="legend"></legend>

    <input id="lightRadio" name="mode" type="radio">
    <label id="lightLabel" for="lightRadio"></label>

    <input id="darkRadio" name="mode" type="radio">
    <label id="darkLabel" for="darkRadio"></label>

    <input id="darkCheckbox" name="mode" type="checkbox">
    <label id="checkboxLabel" for="darkCheckbox"></label>
  </fieldset>
</form>`;

  class DarkModeToogle extends HTMLElement {
    static get observedAttributes() {
      return [MODE, APPEARANCE, PERSIST, LEGEND, LIGHT, DARK];
    }

    constructor() {
      super();

      installStringReflection(this, MODE);
      installStringReflection(this, APPEARANCE);
      installStringReflection(this, LEGEND);
      installStringReflection(this, LIGHT);
      installStringReflection(this, DARK);

      installBoolReflection(this, PERSIST);

      this._darkCSS = null;
      this._lightCSS = null;

      doc.addEventListener(COLOR_SCHEME_CHANGE, (e) => {
        this.mode = e.detail.colorScheme;
        this._updateRadios();
        this._updateCheckbox();
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
          doc.querySelectorAll(`link[rel="stylesheet"][media="${mqDark}"]`);
      this._darkCSS.forEach((link) => link.dataset.originalMedia = link.media);
      this._lightCSS = document.querySelectorAll(mqsLight.map((mqLight) => {
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
      this.legendLabel = shadowRoot.querySelector('#legend');

      // Store the light and the dark icon coming from CSS variables.
      this._lightIcon = win.getComputedStyle(this.lightLabel, ':before')
          .getPropertyValue('background-image');
      this._darkIcon = win.getComputedStyle(this.darkLabel, ':before')
          .getPropertyValue('background-image');

      // Does the browser support native `prefers-color-scheme`?
      const hasNativePrefersColorScheme =
          win.matchMedia('(prefers-color-scheme)').matches;
      // Set initial state, giving preference to a persisted value, then the
      // native value (if supported), and eventually defaulting to a light
      // experience.
      const persistedValue = store.getItem(NAME);
      if (persistedValue && [DARK, LIGHT].includes(persistedValue)) {
        this.mode = persistedValue;
      } else if (hasNativePrefersColorScheme) {
        if ((win.matchMedia(mqsLight[0]).matches) ||
            (win.matchMedia(mqsLight[1]).matches)) {
          this.mode = LIGHT;
        } else if (win.matchMedia(mqDark).matches) {
          this.mode = DARK;
        }
      }
      if (!this.mode) {
        this.mode = LIGHT;
      }
      if (this.persistMode && !persistedValue) {
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
          this._dispatchEvent();
        });
      });
      this.darkCheckbox.addEventListener('change', () => {
        this.mode = this.darkCheckbox.checked ? DARK : LIGHT;
        this._updateRadios();
        this._dispatchEvent();
      });

      // Finally update the mode
      this._updateMode();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === MODE) {
        if (newValue !== LIGHT && newValue !== DARK) {
          throw new RangeError(`Allowed values: "${LIGHT}" and "${DARK}".`);
        }
        if (this.persistMode) {
          store.setItem(NAME, this.mode);
        }
        this._updateMode();
      } else if (name === APPEARANCE) {
        if (newValue !== TOGGLE && newValue !== SWITCH) {
          throw new RangeError('Allowed values: "${TOGGLE}" and "${SWITCH}".');
        }
        this._updateAppearance();
      } else if (name === PERSIST) {
        this.persistMode = this.hasAttribute(PERSIST);
        if (this.persistMode) {
          store.setItem(NAME, this.mode);
        } else {
          store.removeItem(NAME);
        }
      } else if (name === LEGEND) {
        this.legendLabel.textContent = newValue;
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

    _dispatchEvent() {
      this.dispatchEvent(new CustomEvent(COLOR_SCHEME_CHANGE, {
        bubbles: true,
        composed: true,
        detail: {colorScheme: this.mode},
      }));
    }

    _updateAppearance() {
      // Hide or show the light-related affordances dependent on the appearance,
      // which can be "switch" or "toggle".
      const appearAsToogle = this.appearance === TOGGLE;
      this.lightRadio.hidden = appearAsToogle;
      this.lightLabel.hidden = appearAsToogle;
      this.darkRadio.hidden = appearAsToogle;
      this.darkLabel.hidden = appearAsToogle;
      this.darkCheckbox.hidden = !appearAsToogle;
      this.checkboxLabel.hidden = !appearAsToogle;
    }

    _updateRadios() {
      if (this.mode === LIGHT) {
        this.lightRadio.checked = true;
      } else {
        this.darkRadio.checked = true;
        this.darkCheckbox.checked = true;
      }
    }

    _updateCheckbox() {
      if (this.mode === LIGHT) {
        this.checkboxLabel.style.setProperty(`--${NAME}-checkbox-icon`,
            this._lightIcon);
        this.checkboxLabel.textContent = this.light;
      } else {
        this.checkboxLabel.style.setProperty(`--${NAME}-checkbox-icon`,
            this._darkIcon);
        this.checkboxLabel.textContent = this.dark;
      }
    }

    _updateMode() {
      this._updateCheckbox();
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
  }

  win.customElements.define(NAME, DarkModeToogle);
})(window, document, window.localStorage, '(prefers-color-scheme: dark)', [
  '(prefers-color-scheme: light)',
  '(prefers-color-scheme: no-preference)',
]);
