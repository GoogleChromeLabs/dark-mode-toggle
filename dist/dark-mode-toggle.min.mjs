((a,b,c,d)=>{// https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
const e=(a,b,c=b)=>{Object.defineProperty(a,c,{enumerable:!0,get(){const a=this.getAttribute(b);return null===a?'':a},set(a){this.setAttribute(b,a)}})},f=b.createElement('template');f.innerHTML=`
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
</form>`;class g extends HTMLElement{static get observedAttributes(){return['mode','appearance','legend','light','dark']}constructor(){super(),e(this,'mode'),e(this,'appearance'),e(this,'legend'),e(this,'light'),e(this,'dark'),this._darkCSS=null,this._lightCSS=null,this._initializeDOM()}_initializeDOM(){const e=this.attachShadow({mode:'closed'});e.appendChild(f.content.cloneNode(!0)),this._darkCSS=b.querySelectorAll(`link[rel="stylesheet"][media="${c}"]`),this._darkCSS.forEach(a=>a.dataset.originalMedia=a.media),this._lightCSS=document.querySelectorAll(d.map(a=>`link[rel="stylesheet"][media*="${a}"]`).join(', ')),this._lightCSS.forEach(a=>a.dataset.originalMedia=a.media),this.lightInput=e.querySelector('#lightInput'),this.lightLabel=e.querySelector('.lightLabel'),this.darkRadio=e.querySelector('#darkRadio'),this.darkCheckbox=e.querySelector('#darkCheckbox'),this.darkLabels=e.querySelectorAll('.darkLabel'),this.lightInput.hidden='toggle'===this.appearance,this.lightLabel.hidden='toggle'===this.appearance,this.darkRadio.hidden='toggle'===this.appearance,this.darkLabels[0].hidden='toggle'===this.appearance,this.darkCheckbox.hidden='toggle'!==this.appearance,this.darkLabels[1].hidden='toggle'!==this.appearance,this.legendLabel=e.querySelector('legend');const g=a.matchMedia('(prefers-color-scheme)').matches;this.lightInput.checked=!!(g&&(a.matchMedia(d[0]).matches||a.matchMedia(d[1]).matches)),this.lightInput.checked&&(this.mode='light'),this.darkRadio.checked=!!(g&&a.matchMedia(c).matches),this.darkCheckbox.checked=this.darkRadio.checked,this.darkRadio.checked&&(this.mode='dark'),[this.lightInput,this.darkRadio,this.darkCheckbox].forEach(a=>{a.addEventListener('change',a=>{this.mode=a.target.value,'dark'!==this.mode||a.target.checked||(this.lightInput.checked=!0),'light'===this.mode&&(this.darkCheckbox.checked=!1),this._updateMode.bind(this)()})})}attributeChangedCallback(a,b,c){if('mode'===a){if('light'!==c&&'dark'!==c)throw new RangeError;'light'===c?this.lightInput.click():this.darkRadio.click(),this._updateMode()}else if('legend'===a)this.legendLabel.textContent=c;else if('light'===a)this.lightLabel.textContent=c;else if('dark'===a)this.darkLabels.forEach(a=>a.textContent=c);else if('appearance'===a);}_updateMode(){this.lightInput.checked?(this._lightCSS.forEach(a=>{a.media='all',a.disabled=!1}),this._darkCSS.forEach(a=>{a.media=a.dataset.originalMedia,a.disabled=!0})):(this._darkCSS.forEach(a=>{a.media='all',a.disabled=!1}),this._lightCSS.forEach(a=>{a.media=a.dataset.originalMedia,a.disabled=!0}))}}a.customElements.define('dark-mode-toggle',g)})(window,document,'(prefers-color-scheme: dark)',['(prefers-color-scheme: light)','(prefers-color-scheme: no-preference)']);
