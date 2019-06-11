((win, doc, mqDark, mqsLight) => {
  const LIGHT = 'light';
  const DARK = 'dark';
  const TOGGLE = 'toggle';
  const SWITCH = 'switch';
  const LEGEND = 'legend';
  const APPEARANCE = 'appearance';
  const MODE = 'mode';
  const MODE_CHANGE = 'modechange';
  const ALL = 'all';
  const ELEMENT_NAME = 'dark-mode-toggle';
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
    background-color: var(--${ELEMENT_NAME}-background-color, transparent);
    color: var(--${ELEMENT_NAME}-color, inherit);
    border: var(--${ELEMENT_NAME}-border, none);
    padding: 0;
  }

  fieldset {
    border: none;
  }

  legend {
    font: var(--${ELEMENT_NAME}-legend-font, inherit);
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
    filter: var(--${ELEMENT_NAME}-icon-filter, none);
  }

  label::before {
    margin: 0 0.5rem 0 0;
  }

  label[dir="rtl"]::before {
    margin: 0 0 0 0.5rem;
  }

  #lightLabel::before {
    background-image: var(--${ELEMENT_NAME}-light-icon, none);
  }

  #darkLabel::before {
    background-image: var(--${ELEMENT_NAME}-dark-icon, none);
  }

  #checkboxLabel::before {
    background-image: var(--${ELEMENT_NAME}-checkbox-icon, none);
  }

  label {
    padding: 0.15rem;
    font: var(--${ELEMENT_NAME}-label-font, inherit);
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
    background-color: var(--${ELEMENT_NAME}-active-mode-color, transparent);
  }

  input:checked + label::before {
    background-color: var(--${ELEMENT_NAME}-active-mode-color, transparent);
    border-radius: 1rem;
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
      return [MODE, APPEARANCE, LEGEND, LIGHT, DARK];
    }

    constructor() {
      super();

      installStringReflection(this, MODE);
      installStringReflection(this, APPEARANCE);
      installStringReflection(this, LEGEND);
      installStringReflection(this, LIGHT);
      installStringReflection(this, DARK);

      this._darkCSS = null;
      this._lightCSS = null;

      doc.addEventListener(MODE_CHANGE, (e) => {
        // Don't react on our own events.
        if (e.srcElement === this) {
          return;
        }
        this.mode = e.detail.mode;
        const darkModeOn = this.mode === DARK;
        this.darkCheckbox.checked = darkModeOn;
        this.darkRadio.checked = darkModeOn;
        this.lightRadio.checked = !darkModeOn;
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
      // Set initial state, giving preference to the native value, defaulting to
      // a light experience.
      if (hasNativePrefersColorScheme) {
        if ((win.matchMedia(mqsLight[0]).matches) ||
            (win.matchMedia(mqsLight[1]).matches)) {
          this.lightRadio.checked = true;
          this.mode = LIGHT;
        } else if (win.matchMedia(mqDark).matches) {
          this.darkRadio.checked = true;
          this.darkCheckbox.checked = true;
          this.mode = DARK;
        }
      }
      if (!this.mode) {
        this.lightRadio.checked = true;
        this.mode = LIGHT;
      }

      // Default to toggle appearance.
      if (!this.appearance) {
        this.appearance = TOGGLE;
      }

      // Update the appearance to either of toggle or switch.
      this._updateAppearance();

      // Make the checkbox reflect the state of the radios
      this._updateCheckbox();

      // Synchronize the behavior of the radio and the checkbox.
      [this.lightRadio, this.darkRadio].forEach((input) => {
        input.addEventListener('change', () => {
          this.darkCheckbox.checked = this.darkRadio.checked;
          this.mode = this.lightRadio.checked ? LIGHT : DARK;
          this._dispatchEvent();
        });
      });
      this.darkCheckbox.addEventListener('change', () => {
        this.darkRadio.checked = this.darkCheckbox.checked;
        this.lightRadio.checked = !this.darkCheckbox.checked;
        this.mode = this.darkCheckbox.checked ? DARK : LIGHT;
        this._dispatchEvent();
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === MODE) {
        if (newValue !== LIGHT && newValue !== DARK) {
          throw new RangeError(`Allowed values: "${LIGHT}" and "${DARK}".`);
        }
        this._updateMode();
      } else if (name === APPEARANCE) {
        if (newValue !== TOGGLE && newValue !== SWITCH) {
          throw new RangeError('Allowed values: "${TOGGLE}" and "${SWITCH}".');
        }
        this._updateAppearance();
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
      this.dispatchEvent(new CustomEvent(MODE_CHANGE, {
        bubbles: true,
        composed: true,
        detail: {mode: this.mode}
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

    _updateCheckbox() {
      if (this.mode === LIGHT) {
        this.checkboxLabel.style.setProperty(`--${ELEMENT_NAME}-checkbox-icon`,
            this._lightIcon);
        this.checkboxLabel.textContent = this.light;
      } else {
        this.checkboxLabel.style.setProperty(`--${ELEMENT_NAME}-checkbox-icon`,
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

  win.customElements.define(ELEMENT_NAME, DarkModeToogle);
})(window, document, '(prefers-color-scheme: dark)', [
  '(prefers-color-scheme: light)',
  '(prefers-color-scheme: no-preference)',
]);
