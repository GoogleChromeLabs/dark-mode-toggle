((win, doc, mqDark, mqsLight) => {
  // https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
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

  :host([hidden]) {
    display: none;
  }

  form {
    background-color: var(--dark-mode-toggle-background-color, transparent);
    color: var(--dark-mode-toggle-color, inherit);
    border: var(--dark-mode-toggle-border, none);
  }

  fieldset {
    border: none;
  }

  legend {
    font: var(--dark-mode-toggle-legend-font, inherit);
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
    margin: 0 0.5rem;
    vertical-align: middle;
    filter: var(--dark-mode-toggle-icon-filter, none);
  }

  .lightLabel::before {
    background-image: var(--dark-mode-toggle-light-icon);
  }

  .darkLabel::before {
    background-image: var(--dark-mode-toggle-dark-icon);
  }

  label {
    padding: 0.15rem;
    font: var(--dark-mode-toggle-label-font, inherit);
  }

  input {
    opacity: 0;
    position: absolute;*/
  }

  input:focus + label {
    outline: -webkit-focus-ring-color auto 5px;
    outline: focus-ring-color auto 5px;
  }

  input:checked + label {
    background-color: var(--dark-mode-toggle-active-mode-color, transparent);
  }

  input:checked + label::before {
    background-color: var(--dark-mode-toggle-active-mode-color, transparent);
    border-radius: 1rem;
  }
</style>
<form id="theme">
  <fieldset>
    <legend></legend>

    <input value="light" id="lightInput" name="mode" type="radio">
    <label class="lightLabel" for="lightInput"></label>

    <input value="dark" id="darkRadio" name="mode" type="radio">
    <label class="darkLabel" for="darkRadio"></label>

    <input value="dark" id="darkCheckbox" name="mode" type="checkbox">
    <label class="darkLabel" for="darkCheckbox"></label>
  </fieldset>
</form>`;

  class DarkModeToogle extends HTMLElement {
    static get observedAttributes() {
      return ['mode', 'appearance', 'legend', 'light', 'dark'];
    }

    constructor() {
      super();

      installStringReflection(this, 'mode');
      installStringReflection(this, 'appearance');
      installStringReflection(this, 'legend');
      installStringReflection(this, 'light');
      installStringReflection(this, 'dark');

      this._darkCSS = null;
      this._lightCSS = null;

      this._initializeDOM();
    }

    _initializeDOM() {
      const shadowRoot = this.attachShadow({mode: 'closed'});
      shadowRoot.appendChild(template.content.cloneNode(true));

      this._darkCSS =
          doc.querySelectorAll(`link[rel="stylesheet"][media="${mqDark}"]`);
      this._darkCSS.forEach((link) => link.dataset.originalMedia = link.media);
      // Treat `prefers-color-scheme: light` and
      // `prefers-color-scheme: no-preference` alike
      this._lightCSS = document.querySelectorAll(mqsLight.map((mqLight) => {
        return `link[rel="stylesheet"][media*="${mqLight}"]`;
      }).join(', '));
      this._lightCSS.forEach((link) => link.dataset.originalMedia = link.media);

      this.lightInput = shadowRoot.querySelector('#lightInput');
      this.lightLabel = shadowRoot.querySelector('.lightLabel');

      this.darkRadio = shadowRoot.querySelector('#darkRadio');
      this.darkCheckbox = shadowRoot.querySelector('#darkCheckbox');
      this.darkLabels = shadowRoot.querySelectorAll('.darkLabel');


      this.lightInput.hidden = this.appearance === 'toggle';
      this.lightLabel.hidden = this.appearance === 'toggle';
      this.darkRadio.hidden = this.appearance === 'toggle';
      this.darkLabels[0].hidden = this.appearance === 'toggle';
      this.darkCheckbox.hidden = this.appearance !== 'toggle';
      this.darkLabels[1].hidden = this.appearance !== 'toggle';

      this.legendLabel = shadowRoot.querySelector('legend');

      const hasNativePrefersColorScheme =
          win.matchMedia('(prefers-color-scheme)').matches;
      this.lightInput.checked = hasNativePrefersColorScheme &&
          ((win.matchMedia(mqsLight[0]).matches) ||
           (win.matchMedia(mqsLight[1]).matches)) ? true : false;
      if (this.lightInput.checked) {
        this.mode = 'light';
      }

      this.darkRadio.checked = hasNativePrefersColorScheme &&
          win.matchMedia(mqDark).matches ? true : false;
          this.darkCheckbox.checked = this.darkRadio.checked;
      if (this.darkRadio.checked) {
        this.mode = 'dark';
      }

      [this.lightInput, this.darkRadio, this.darkCheckbox].forEach((input) => {
        input.addEventListener('change', (e) => {
          this.mode = e.target.value;
          if (this.mode === 'dark' && !e.target.checked) {
            this.lightInput.checked = true;
          }
          if (this.mode === 'light') {
            this.darkCheckbox.checked = false;
          }
          this._updateMode.bind(this)();
        });
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'mode') {
        if (newValue !== 'light' && newValue !== 'dark') {
          throw (new RangeError());
        }
        if (newValue === 'light') {
          this.lightInput.click();
        } else {
          this.darkRadio.click();
        }
        this._updateMode();
      } else if (name === 'legend') {
        this.legendLabel.textContent = newValue;
      } else if (name === 'light') {
        this.lightLabel.textContent = newValue;
      } else if (name === 'dark') {
        this.darkLabels.forEach(darkLabel => darkLabel.textContent = newValue);
      } else if (name === 'appearance') {
      }
    }

    _updateMode() {
      if (this.lightInput.checked) {
        this._lightCSS.forEach((link) => {
          link.media = 'all';
          link.disabled = false;
        });
        this._darkCSS.forEach((link) => {
          link.media = link.dataset.originalMedia;
          link.disabled = true;
        });
      } else {
        this._darkCSS.forEach((link) => {
          link.media = 'all';
          link.disabled = false;
        });
        this._lightCSS.forEach((link) => {
          link.media = link.dataset.originalMedia;
          link.disabled = true;
        });
      }
    }
  }

  win.customElements.define('dark-mode-toggle', DarkModeToogle);
})(window, document, '(prefers-color-scheme: dark)', [
  '(prefers-color-scheme: light)',
  '(prefers-color-scheme: no-preference)',
]);
