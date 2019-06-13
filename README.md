# `<dark-mode-toggle>` Element

A custom element that allows you to easily add a *Dark Mode* 🌒 toggle or switch
to your site and that adds
[`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme)
support even to browsers that don't support the media feature natively.

## Installation

```bash
npm install --save dark-mode-toggle
```

## Usage

<!--
```
<custom-element-demo>
  <template>
    <script type="module" src="https://tomayac.github.io/dark-mode-toggle/dist/dark-mode-toggle.min.mjs">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<!-- ⚠️ Split your CSS in common, dark, and light, don't worry whether your browser actually supports the media query. -->
<!-- <link rel="stylesheet" href="common.css"> -->
<!-- <link rel="stylesheet" href="light.css" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"> -->
<!-- <link rel="stylesheet" href="dark.css" media="(prefers-color-scheme: dark)"> -->

<!-- Include the custom element code -->
<!-- <script type="module" src="dark-mode-toggle.min.mjs"></script> -->

<!-- Use the custom element, see the demo for configuration options -->
<dark-mode-toggle></dark-mode-toggle>
```

## Properties

Properties can be set directly on the custom element at creation time, or dynamically via JavaScript.

Note that the icons are set via CSS variables.

- `mode` (Optional): Any of `"dark"` or `"light"`. Defaults to whatever the
  user's preferred color scheme is according to `prefers-color-scheme`, or
  `"light"` if the user's browser doesn't support the media query. If set,
  overrides the user's preferred color scheme.

- `appearance` (Optional): Any of `"toggle"` or `"switch"`. Defaults to
  `"toggle"`. The `"switch"` appearance conveys the idea of a theme switcher
  (light/dark), whereas `"toggle"` conveys the idea of a dark mode toggle
  (on/off).

- `persist` (Optional): Boolean that if present persists the last selected mode
  (`"dark"` or `"light"`), which allows the user to persistently override their
  usual preferred color scheme. Defaults to not persist the last choice.

- `legend` (Optional): Any string value that represents the legend for the
  toggle or switch. Defaults to no legend.

- `light` (Optional): Any string value that represents the label for the
  `"light"` mode. Defaults to no label.

- `dark` (Optional): Any string value that represents the label for the
  `"dark"` mode. Defaults to no label.

## Events

- `colorschemechange`: Fired when the color scheme gets changed.
  ```js
    /* On the page */
    document.addEventListener('colorschemechange', (e) => {
      console.log(`Color scheme changed to ${e.detail.colorScheme}.`);
    })
  ```

## Example

```js
const darkModeToggle = document.querySelector('dark-mode-toggle');

// Set the mode to dark
darkModeToggle.mode = 'dark';
// Set the mode to light
darkModeToggle.mode = 'light';

// Set the legend to "Dark Mode"
darkModeToggle.legend = 'Dark Mode';
// Set the light label to "off"
darkModeToggle.light = 'off';
// Set the dark label to "on"
darkModeToggle.dark = 'on';

// Set the appearance to resemble a switch (theme: light/dark)
darkModeToggle.appearance = 'switch';
// Set the appearance to resemble a toggle (dark mode: on/off)
darkModeToggle.appearance = 'toggle';

// Persist the user's last color scheme choice
darkModeToggle.setAttribute('persist', '');
// Forget the user's last color scheme choice
darkModeToggle.removeAttribute('persist');
```

## Configurable Options

```css
/* The main text color */
--dark-mode-toggle-color

/* The main background color */
--dark-mode-toggle-background-color

/* The font (in shorthand notation) of the legend */
--dark-mode-toggle-legend-font

/* The font (in shorthand notation) of the labels */
--dark-mode-toggle-label-font

/* The icon (in background-image notation) for the light state */
--dark-mode-toggle-light-icon

/* The icon (in background-image: notation) for the dark state */
--dark-mode-toggle-dark-icon

/* The filter (in filter: notation) for the dark icon */
--dark-mode-toggle-icon-filter

/* The background color for the active mode */
--dark-mode-toggle-active-mode-background-color
```

## Notes

This is not an official Google product.

## License

Apache 2.0.
