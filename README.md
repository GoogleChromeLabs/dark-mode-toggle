# `<dark-mode-toggle>`

A custom element that allows you to easily add a *Dark Mode* 🌒 toggle or switch
to your site and that adds
[`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme)
support even to browsers that don't support the media feature natively.

## Demo

See the custom element in action in the [demo](https://tomayac.github.io/dark-mode-toggle/demo/).

## Usage

```html
<!-- ⚠️ Split your CSS in common, dark, and light, don't worry whether your browser supports the media query -->
<link rel="stylesheet" href="common.css">
<link rel="stylesheet" href="light.css" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)">
<link rel="stylesheet" href="dark.css" media="(prefers-color-scheme: dark)">

<!-- Include the custom element code -->
<script type="module" src="dark-mode-toggle.min.mjs"></script>

<!-- Use the custom element, see the demo for configuration options -->
<dark-mode-toggle></dark-mode-toggle>
```

## JavaScript API

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
