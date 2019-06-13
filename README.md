# `<dark-mode-toggle>` Element

A custom element that allows you to easily put a *Dark Mode 🌒* toggle or switch
on your site and that adds
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
<!-- ⚠️ Split your CSS in common, dark, and light, don't worry whether your -->
<!-- browser actually supports the media query. -->

<!-- <link rel="stylesheet" href="common.css"> -->
<!-- <link rel="stylesheet" href="light.css" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"> -->
<!-- <link rel="stylesheet" href="dark.css" media="(prefers-color-scheme: dark)"> -->

<!-- Include the custom element code -->
<!-- <script type="module" src="dark-mode-toggle.min.mjs"></script> -->

<!-- Use the custom element, see the demo for configuration options -->
<dark-mode-toggle></dark-mode-toggle>
```

## Demo

See the custom element in action in the
[interactive demo](https://tomayac.github.io/dark-mode-toggle/demo/).

## Properties

Properties can be set directly on the custom element at creation time, or
dynamically via JavaScript.

Note that the icons are set via CSS variables.

| Name | Required | Values | Default | Description |
| ---- | -------- | ------ | ------- | ----------- |
| `mode` | No | Any of `"dark"` or `"light"` | Defaults to whatever the user's preferred color scheme is according to `prefers-color-scheme`, or `"light"` if the user's browser doesn't support the media query. | If set overrides the user's preferred color scheme. |
| `appearance` | No | Any of `"toggle"` or `"switch"` | Defaults to `"toggle"`. | The `"switch"` appearance conveys the idea of a theme switcher (light/dark), whereas `"toggle"` conveys the idea of a dark mode toggle (on/off). |
| `persist` | No | `true` if present | Defaults to not persist the last choice. | If present persists the last selected mode (`"dark"` or `"light"`), which allows the user to persistently override their usual preferred color scheme. |
| `legend` | No | Any string | Defaults to no legend. | Any string value that represents the legend for the toggle or switch. |
| `light` | No | Any string | Defaults to no label. | Any string value that represents the label for the `"light"` mode. |
| `dark` | No | Any string | Defaults to no label. | Any string value that represents the label for the `"dark"` mode. |

## Events

- `colorschemechange`: Fired when the color scheme gets changed.

## Complete Example

Interacting with the custom element:

```js
/* On the page */
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

Reacting on color scheme changes:

```js
  /* On the page */
  document.addEventListener('colorschemechange', (e) => {
    console.log(`Color scheme changed to ${e.detail.colorScheme}.`);
  })
```

## Style Customization

| CSS Variable Name | Default | Description |
| ----------------- | ------- | ----------- |
| `--dark-mode-toggle-color` | User-Agent stylesheet text color | The main text color in `color:` notation. |
| `--dark-mode-toggle-background-color` | User-Agent stylesheet background color | The main background color in `background-color:` notation. |
| --dark-mode-toggle-legend-font | User-Agent `<legend>` font | The font of the legend in shorthand `font:` notation. |
| --dark-mode-toggle-label-font | User-Agent `<label>` font | The font of the labels in shorthand `font:` notation. |
| --dark-mode-toggle-light-icon | No icon | The icon for the light state in `background-image:` notation. |
| --dark-mode-toggle-dark-icon | No icon | The icon for the dark state in `background-image:` notation. |
| --dark-mode-toggle-icon-filter | No filter | The filter for the dark icon (so you can use all black or all white icons and just invert the dark icon) in `filter:` notation. |
| --dark-mode-toggle-active-mode-background-color | No background color | The background color for the currently active mode in `background-color:` notation. |

## Notes

This is not an official Google product.

## License

Copyright 2019 Thomas Steiner

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
