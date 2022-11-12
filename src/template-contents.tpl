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
    white-space: nowrap;
  }

  input {
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }

  input:focus-visible + label {
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
  }

  label:not(:empty)::before {
    margin-inline-end: 0.5rem;
  }

  [part="lightLabel"]::before {
    background-image: var(--${NAME}-light-icon, url("${DEFAULT_URL}sun.png"));
  }

  [part="darkLabel"]::before {
    filter: var(--${NAME}-icon-filter, none);
    background-image: var(--${NAME}-dark-icon, url("${DEFAULT_URL}moon.png"));
  }

  [part="toggleLabel"]::before {
    background-image: var(--${NAME}-checkbox-icon, none);
  }

  [part="permanentLabel"]::before {
    background-image: var(--${NAME}-remember-icon-unchecked, url("${DEFAULT_URL}unchecked.svg"));
  }

  [part="lightLabel"],
  [part="darkLabel"],
  [part="toggleLabel"] {
    font: var(--${NAME}-label-font, inherit);
  }

  [part="lightLabel"]:empty,
  [part="darkLabel"]:empty,
  [part="toggleLabel"]:empty {
    font-size: 0;
    padding: 0;
  }

  [part="permanentLabel"] {
    font: var(--${NAME}-remember-font, inherit);
  }

  input:checked + [part="permanentLabel"]::before {
    background-image: var(--${NAME}-remember-icon-checked, url("${DEFAULT_URL}checked.svg"));
  }

  input:checked + [part="darkLabel"],
  input:checked + [part="lightLabel"] {
    background-color: var(--${NAME}-active-mode-background-color, transparent);
  }

  input:checked + [part="darkLabel"]::before,
  input:checked + [part="lightLabel"]::before {
    background-color: var(--${NAME}-active-mode-background-color, transparent);
  }

  input:checked + [part="toggleLabel"]::before {
    filter: var(--${NAME}-icon-filter, none);
  }

  /* Make sure "sliderLaber" is right before aside otherwise won't work */
  input:checked + [part="sliderLabel"] + aside [part="permanentLabel"]::before {
    filter: var(--${NAME}-remember-filter, invert(100%));
  }

  aside {
    visibility: hidden;
    margin-block-start: 0.15rem;
  }

  [part="lightLabel"]:focus-visible ~ aside,
  [part="darkLabel"]:focus-visible ~ aside,
  [part="toggleLabel"]:focus-visible ~ aside,
  [part="sliderLabel"]:focus-visible ~ aside {
    visibility: visible;
    transition: visibility 0s;
  }

  aside [part="permanentLabel"]:empty {
    display: none;
  }

  @media (hover: hover) {
    aside {
      transition: visibility 3s;
    }

    aside:hover {
      visibility: visible;
    }

    [part="lightLabel"]:hover ~ aside,
    [part="darkLabel"]:hover ~ aside,
    [part="toggleLabel"]:hover ~ aside,
    [part="sliderLabel"]:hover ~ aside {
      visibility: visible;
      transition: visibility 0s;
    }
  }

  [part="sliderLabel"]:not([hidden]) {
    display: inline-block;
    position: relative;
    height: calc(var(--${NAME}-icon-size, 1rem) * 2);
    width: calc(var(--${NAME}-icon-size, 1rem) * 3.5);
    background-color: #b7bbbd;
    border-radius: var(--${NAME}-icon-size, 1rem);
    transition: 0.4s;
  }
  [part="sliderLabel"]:not([hidden])::before {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: calc(var(--${NAME}-icon-size, 1rem) * 0.25);
    left: calc(var(--${NAME}-icon-size, 1rem) * 0.25);
    height: calc(var(--${NAME}-icon-size, 1rem) * 1.5);
    width: calc(var(--${NAME}-icon-size, 1rem) * 1.5);
    border-radius: 100%;
    /* border: 2px #333 solid; */
    box-shadow: 0 0.15em 0.3em rgb(0 0 0 / 15%), 0 0.2em 0.5em rgb(0 0 0 / 30%);
    background-color: #fff;
    color: #333;
    transition: 0.4s;
    content: "";
    background-position: center;
    background-size: var(--${NAME}-icon-size, 1rem);
    background-image: var(--${NAME}-light-icon, url("${DEFAULT_URL}fa-sun.svg"));
    box-sizing: border-box;
  }
  input:checked + [part="sliderLabel"] {
    background-color: #4e5255;
  }
  input:checked + [part="sliderLabel"]:not([hidden])::before {
    left: calc(100% - var(--${NAME}-icon-size, 1rem) * 1.75);
    border-color: #000; /* inverted */
    background-color: #ccc; /* inverted */
    color: #000; /* inverted */
    background-size: var(--${NAME}-icon-size, 1rem);
    background-image: var(--${NAME}-dark-icon, url("${DEFAULT_URL}fa-moon.svg"));
    filter: var(--${NAME}-icon-filter, invert(100%));
    box-shadow: 0 0.5px hsl(0deg 0% 100% / 16%);
  }
  [part="sliderLabel"]:not([hidden])::after {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: calc(var(--${NAME}-icon-size,1rem) * 0.25);
    left: calc(100% - var(--${NAME}-icon-size, 1rem) * 1.75);
    height: calc(var(--${NAME}-icon-size, 1rem) * 1.5);
    width: calc(var(--${NAME}-icon-size, 1rem) * 1.5);
    border-radius: 100%;
    color: #333;
    content: "";
    background-position: center;
    background-size: var(--${NAME}-icon-size, 1rem);
    background-image: var(--${NAME}-dark-icon, url("${DEFAULT_URL}fa-moon.svg"));
    background-repeat: no-repeat;
    box-sizing: border-box;
    opacity: .5;
  }
  input:checked + [part="sliderLabel"]:not([hidden])::after {
    left: calc(var(--${NAME}-icon-size,1rem) * 0.25);
    background-image: var(--${NAME}-light-icon, url("${DEFAULT_URL}fa-sun.svg"));
    filter: var(--${NAME}-icon-filter, invert(100%));
  }
</style>
<form part="form">
  <fieldset part="fieldset">
    <legend part="legend"></legend>
    <input part="lightRadio" id="l" name="mode" type="radio">
    <label part="lightLabel" for="l"></label>
    <input part="darkRadio" id="d" name="mode" type="radio">
    <label  part="darkLabel" for="d"></label>
    <input part="toggleCheckbox" id="t" type="checkbox">
    <label part="toggleLabel" for="t"></label>
    <input part="sliderCheckbox" id="s" type="checkbox">
    <label part="sliderLabel" for="s"></label>
    <aside part="aside">
      <input part="permanentCheckbox" id="p" type="checkbox">
      <label part="permanentLabel" for="p"></label>
    </aside>
  </fieldset>
</form>
