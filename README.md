<p align="center">
    <img src="http://toomuchdesign.github.io/offside/demos/img/offside-logo.svg" width="150" alt="Offside.js shiny logo">
</p>

# Offside.js

[![Build Status][ci-img]][ci]

[ci-img]:                       https://travis-ci.org/toomuchdesign/offside.svg
[ci]:                           https://travis-ci.org/toomuchdesign/offside

**Offside.js** is a minimal JavaScript kit **without library dependencies** to push things off-canvas **using just class manipulation**. It's goal is to provide a super-lightweight, efficient and customizable way of handling off-canvas menus/elements on modern website and web applications.

**Offside.js** comes with its own default stylesheet which make use of **CSS 3D transform**, but **you can write your own CSS** hooking your style with Offside classes. This ensures **super flexibility** and completely **decouples Offside.js from your style/markup**.

## Demos

- [Single element](http://toomuchdesign.github.io/offside/demos/single-element)
- [Single element (without css 3dtransforms)](http://toomuchdesign.github.io/offside/demos/single-element-no-css-3d-transforms)
- [Multiple elements](http://toomuchdesign.github.io/offside/demos/multiple-elements)
- [Multiple elements (without css 3dtransforms)](http://toomuchdesign.github.io/offside/demos/multiple-elements-no-css-3d-transforms)
- [Typical setting](http://toomuchdesign.github.io/offside/demos/typical)

## Features:

- Minimal DOM manipulations
- No library dependencies
- Uses CSS3 3D transforms (if you want to)
- No injected style. Offside entirely relies on classes manipulations
- BEM-like style
- Degrades gracefully on browsers not supporting CSS3 3D transforms
- Handles multiple off-canvas elements
- Left/right off-canvas
- Style agnostic
- No need of extra classes or any specific markup.
- Consumable as `commonJS`/`ES` module with a `require('offside-js')`

## Browser Compatibility

All **modern browsers** and **ie9+**.

Offside.js relies on **EventTarget.addEventListener / removeEventListener** and **querySelector / querySelectorAll** methods without any fallback.

Check relative browser compatibility:
- [EventTarget.addEventListener / removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Browser_compatibility)
- [querySelector / querySelectorAll](http://caniuse.com/#search=queryselectorAll)

## Usage instructions

### Install:
You can install **Offside.js** as a [Bower](http://bower.io) or [NPM](http://www.npmjs.com) dependency.

```sh
# Bower
bower install offside --save

# NPM
npm install offside-js --save
```

### 1. Link files:

```html
  <!-- Put these into the <head> -->
  <link rel="stylesheet" href="dist/offside.css">
  <script src="dist/offside.js"></script>
```

...or import as a module:

```js
  import 'offside-js/dist/offside.css';
  import offside from 'offside-js';
```

### 2. Markup example:

```html
  <!-- Off-canvas toggle button -->
  <button type="button" id="my-button">Offside toggle</button>

  <!-- Off-canvas element  -->
  <nav id="my-menu">
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Projects</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>

  <!-- Your Content -->
  <div id="my-content-container">
    ...
  </div>
```

Offside.js is designed to work with your existing HTML.

It **doesn't pre-requires any specific markup**. When Offside initializes It just adds a few classes on existing DOM elements.


### 3. Hook up the plugin:

```html
<!-- Put this right before the </body> closing tag -->
  <script>

    //Offside.js minimal setup
    var myOffside = offside( '#my-menu', {

        slidingElementsSelector:'#my-content-container',
        buttonsSelector: '#my-button, .another-button',
    });
  </script>
```

#### What are "sliding elements"?

`slidingElementsSelector` is a selector list of all elements which slide out when an off-canvas element slides in. It's usually the page wrapper.

Use it only when you need your page to slide together with you off-canvas element.


### 4. Customizable options:

```javascript
  var myOffside = offside( '#my-menu', {

      // Global offside options: affect all offside instances
      slidingElementsSelector: '#my-content-container', // String: Sliding elements selectors ('#foo, #bar')
      disableCss3dTransforms: false,                    // Disable CSS 3d Transforms support (for testing purposes)
      debug: true,                                      // Boolean: If true, print errors in console

      // Offside instance options: affect only this offside instance
      buttonsSelector: '#my-button, .another-button',   // String: Offside toggle buttons selectors ('#foo, #bar')
      slidingSide: 'right',                             // String: Offside element pushed on left or right
      init: function(){},                               // Function: After init callback
      beforeOpen: function(){},                         // Function: Before open callback
      afterOpen: function(){},                          // Function: After open callback
      beforeClose: function(){},                        // Function: Before close callback
      afterClose: function(){},                         // Function: After close callback    

  });
```
**Global offside options** are set when first Offside instance is created. This happens because **Offside factory** is created when the first `offside()` call occurs.


## Public methods

Offside.js plays well with your application. Each Offside instance exposes the following methods:

`offsideInstance.toggle();`

`offsideInstance.open();`

`offsideInstance.close();`

`offsideInstance.closeAll();`

`offsideInstance.destroy();`


## How does it work?

When the first Offside element is initialized, a **singleton Offside factory** is created and used to return the first Offside instance. The factory keeps track of all initialized Offside elements.

Offside.js is entirely based on **classes injection** and **custom callbacks**. No style is DOM injected. Never!

Classes are injected in **just 3 elements**:
  - <code>body</code>
  - <code>off-canvas elements</code>
  - <code>sliding elements</code>

Here a brief explanation.

### 1. Initialization

#### Callbacks fired:
- <code>init()</code>

#### Injected classes:
```html
  <body class="offside-js--init">

    <!-- Off-canvas element -->
    <div class="offside offside--left">

    <!-- Sliding element -->
    <div class="offside-sliding-element>
```

### 2. First offside open

On first interaction with an Offside instance, <code>offside-js--interact</code> class is added to body. Sometime useful to avoid unexpected CSS behaviours on startup.

#### Injected classes:
```html
  <body class="offside-js--init offside-js--interact">
```

### 3. Offside open

#### Callbacks fired:
- <code>beforeOpen()</code>
- <code>afterOpen()</code>

#### Injected classes:
```html
  <body class="offside-js--init offside-js--transitions offside-js--is-open offside-js--is-left">

  <!-- Off-canvas element -->
  <div class="offside offside--left is-open">
```

### 4. Offside closed

#### Callbacks fired:
- <code>beforeClose()</code>
- <code>afterClose()</code>

#### Injected classes:
```html
  <body class="offside-js--init offside-js--transitions">

  <!-- Off-canvas element -->
  <div class="offside offside--left is-open">
```

## Tips and Tricks

- Set **off-canvas elements width** directly into `offside.css` stylesheet.
- Replace `offside.css` with `offside-no-css-3d-transforms.css` stylesheet and and set `disableCss3dTransforms` setting to `true` to try the fallback.

### Do you really need a JS plugin?
If you need to set up a simple off-canvas menu, you might not need JS! [This Chris Coyer's post](https://css-tricks.com/off-canvas-menu-with-css-target/) explains a nice solution which relies on **CSS :target selector**. ie9+ only!


## Known bugs

### Off-canvas elements blocked on the page

On some old mobile browsers ( as Android 2.2.2 FroYo ) off-canvas elements won't get out the page on page load.

This happens because their internal browser do not officially support CSS transforms (see [can I use chart](http://caniuse.com/#feat=transforms3d)), but, according to my experience, they only support it partially. Infact these browser are able to pass Offside CSS 3dTransform test and do not activate Offside fallback strategy.

Offside instances are normally set to `position: fixed` and these browser are not able to apply `translate3d` transform to fixed positioned element.

An easy - but simplistic - fix, is to switch `.offside` position to `absolute` and properly set a relative position to a parent element (of course, it might  have an impact on your page layout):

```css
.offside {
    position: absolute;
}
```

### Off-canvas elements inside a sliding element

Like this:

```html
  <!-- Sliding element -->
  <div id="my-page-wrapper">

    <!-- Off-canvas element  -->
    <nav id="my-offside-element">
      ...
    </nav>
    ...
  </div>
```

When an element receives a 3D transform style, It creates a containing block for all its descendants that have been set to `position: fixed` or `position: absolute`. Read more [here](http://meyerweb.com/eric/thoughts/2011/09/12/un-fixing-fixed-elements-with-css-transforms).


## To do's

Some ideas for the future. If you'd like to see any of the following realized, please contribute or open an issue.

- Expose Offside factory initialization method *(now called on first Offside instance initialization)*
- Customizable Offside classes
- Declare a different set of sliding elements for each Offside instance
- Add an option to let more than one Offside instance open at same time
- Replace GruntJS with npm script tasks
- Replace callbacks with global events *(maybe)*
- Remove CSS 3D Transform Support check *(maybe)*

## Working on the repository

Make sure you have **node** and **npm** on your machine. When ready, you can install Offside.js dependencies:

```sh
npm install
# or
npm run setup
```

Once everything is set up, work in `src` directory and build `dist` files using:

```sh
npm run watch
# or
npm run build
```

### Updating gh-pages branch (just a reminder)

```sh
git checkout gh-pages
git checkout master demos
git checkout master dist
```

## Versioning

Starting from version **1.3.0**, this library uses [semantic versioning](http://semver.org).

## Thanks to

- [Christopher Yee's pushy.js](https://github.com/christophery/pushy)
- [Viljami Salminen's responsive-nav.js](https://github.com/viljamis/responsive-nav.js)
