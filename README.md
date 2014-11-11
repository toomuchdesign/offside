# Offside.js
**Offside.js** is minimal JavaScript kit to push things off-canvas using CSS 3D transforms & transitions.

## Features:
- Minimal DOM manipulations
- Uses CSS3 transitions
- CSS transitions NOT injected. They are just defined in a separate Stylesheet
- Degrades gracefully on old browsers 
- Handles multiple off-canvas elements
- Left/right off-canvas
- Style agnostic
- No need of extra classes or any specific markup.

##Requirements
- [jQuery 1.9+](http://jquery.com/)

## Demos
@TODO: add demos links.

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

`slidingElementsSelector` is a selector list of all elements which slide out when an off-canvas element slides-in. It's usually the page wrapper.

### 4. Customizable options:
```javascript
  var myOffside = $.offside( '#my-menu', {
      
      // Global offside options: affect all offside instances
      slidingElementsSelector: '#my-content-container', // String: Sliding elements selectors ('#foo, #bar')
      disableCss3dTransforms: false,                    // Disable CSS 3d Transforms support (for testing purposes)
      debug: true,                                      // Boolean: If true, print errors in console
      
      // Offside instance options: affect only this offside instance
      buttonsSelector: '#my-button, #another-button',   // String: Offside toggle buttons selectors ('#foo, #bar')
      slidingSide: 'left',                              // String: Offside element pushed on left or right
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
- Link `offside-no-css-3d-transforms.css` stylesheet and and set `disableCss3dTransforms` setting to `false` to try the fallback.


## To do's

- Remove JQuery dependency
- Expose Offside factory initialization method
- Set up Grunt->Jshint

## Working on the repository

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

##Thanks to

- [Christopher Yee's pushy.js](https://github.com/christophery/pushy)
- [Viljami Salminen's responsive-nav.js](https://github.com/viljamis/responsive-nav.js)
