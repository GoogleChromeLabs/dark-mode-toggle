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
    margin: 0;
    padding-block: 0.25rem;
    padding-inline: 0.25rem;
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
    white-space: nowrap;
  }

  input {
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }

  input:focus + label {
    outline: #e59700 auto 2px;
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
    margin-inline-end: 0.5rem;
  }

  #lightLabel::before {
    background-image: var(--${NAME}-light-icon, url("${DEFAULT_URL}sun.png"));
  }

  #darkLabel::before {
    filter: var(--${NAME}-icon-filter, none);
    background-image: var(--${NAME}-dark-icon, url("${DEFAULT_URL}moon.png"));
  }

  #checkboxLabel::before {
    background-image: var(--${NAME}-checkbox-icon, none);
  }

  #permanentLabel::before {
    background-image: var(--${NAME}-remember-icon-unchecked, url("${DEFAULT_URL}unchecked.svg"));
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
    background-image: var(--${NAME}-remember-icon-checked, url("${DEFAULT_URL}checked.svg"));
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
    filter: var(--${NAME}-remember-filter, invert(100%));
  }

  aside {
    visibility: hidden;
    margin-block-start: 0.15rem;
  }

  #lightLabel:focus-visible ~ aside,
  #darkLabel:focus-visible ~ aside,
  #checkboxLabel:focus-visible ~ aside {
    visibility: visible;
    transition: visibility 0s;
  }

  aside #permanentLabel:empty {
    display: none;
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
</form>
