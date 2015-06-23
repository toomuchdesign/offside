# Offside.js
**Offside.js** is a minimal JavaScript kit to push things off-canvas using CSS 3D transforms & transitions. It's goal is to provide a super-lightweigth, efficient and customizable way of handling off-canvas menus/elements on modern website and web applications.

**Offside.js** comes with its own default stylesheet, but you can write your own CSS hooking your style with Offside classes. This ensures super flexibility and completely decouples Offside.js from your page style/markup.

## Demos
- [Single element](http://toomuchdesign.github.io/offside/demos/single-element)
- [Single element (without css 3dtransforms)](http://toomuchdesign.github.io/offside/demos/single-element-no-css-3d-transforms)
- [Multiple elements](http://toomuchdesign.github.io/offside/demos/multiple-elements)
- [Multiple elements (without css 3dtransforms)](http://toomuchdesign.github.io/offside/demos/multiple-elements-no-css-3d-transforms)

## Features:
- Minimal DOM manipulations
- Uses CSS3 3D transitions
- No injected style. Offside entirely relies on classes manipulations
- Degrades gracefully on old browsers 
- Handles multiple off-canvas elements
- Left/right off-canvas
- Style agnostic
- No need of extra classes or any specific markup.

##Requirements
- [jQuery 1.7+](http://jquery.com/)


## Usage instructions

### 1. Link files:

```html
  <!-- Put these into the <head> -->
  <link rel="stylesheet" href="offside.css">
  <script src="offside.js"></script>
```


### 2. Markup example:

```html
  
  <!-- Off-canvas toggle button -->
  <button type="button" id="my-button">Offside toggle</button>
   
  <!-- Off-canvas element  -->
  <nav id="my-offside">
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

Offside is designed to work with your existing HTML.

It **doesn't pre-requires any specific markup**. When Offside initializes It just adds a few classes on existing DOM elements.


### 3. Hook up the plugin:

```html
<!-- Put this right before the </body> closing tag -->
  <script>

    //Offside minimal setup
    var myOffside = $.offside( '#my-menu', {
        
        slidingElementsSelector:'#my-content-container',
        buttonsSelector: '#my-button',
    });
  </script>
```

#### What "sliding elements" are?
`slidingElementsSelector` is a selector list of all elements which slide out when an off-canvas element slides in. It's usually the page wrapper.


### 4. Customizable options:
```javascript
  var myOffside = $.offside( '#my-menu', {
      
      // Global offside options: affect all offside instances
      slidingElementsSelector: '#my-content-container', // String: Sliding elements selectors ('#foo, #bar')
      disableCss3dTransforms: false,                    // Disable CSS 3d Transforms support (for testing purposes)
      debug: true,                                      // Boolean: If true, print errors in console
      
      // Offside instance options: affect only this offside instance
      buttonsSelector: '#my-button, #another-button',   // String: Offside toggle buttons selectors ('#foo, #bar')
      slidingSide: 'right',                             // String: Offside element pushed on left or right
      init: function(){},                               // Function: After init callback
      beforeOpen: function(){},                         // Function: Before open callback
      afterOpen: function(){},                          // Function: After open callback
      beforeClose: function(){},                        // Function: Before close callback
      afterClose: function(){},                         // Function: After close callback    
  
  });
  
```
**Global offside options** are set when first Offside instance is created. This happens because **Offside factory** is created when the first `$.offside()` call occurs.

## Public methods

Offside plays well with your application. Each Offside instance exposes the following methods:

`myOffside.toggle();`

`myOffside.open();`

`myOffside.close();`


## Tips and Tricks

- Set **off-canvas elements** width directly into `offside.css` stylesheet.
- Link `offside-no-css-3d-transforms.css` stylesheet and and set `disableCss3dTransforms` setting to `true` to try the fallback.

## Known bugs
### Off-canvas elements blocked on the page

On some old mobile browsers ( as Android 2.2.2 FroYo ) off-canvas elements won't get out the page on page load.

This happens because their internal browser do not officially support CSS transitions (see [can I use chart](http://caniuse.com/#feat=transforms3d)), but, according to my experience, they only support it partially. Infact these browser are able to pass Offside CSS 3dTransform test and do not activate Offside fallback strategy.

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

- Remove JQuery dependency
- Expose Offside factory initialization method

## Working on the repository

Contributions and ideas to make Offside.js a better tool are welcome.

[GruntJS](http://gruntjs.com/) is used for the build process, which means node and npm are required. If you already have those on your machine, you can install Grunt and all dependencies required for the build using:

```sh
npm install -g grunt-cli
npm install
```

Once everything is set up, work in `src` directory and let Grunt build `dist` files using:

```sh
grunt
# or
grunt build
```

### Updating gh-pages branch (just a reminder)
```sh
git checkout gh-pages
git checkout master demos
git checkout master dist
```

##Thanks to

- [Christopher Yee's pushy.js](https://github.com/christophery/pushy)
- [Viljami Salminen's responsive-nav.js](https://github.com/viljamis/responsive-nav.js)
