/* @@name @@version @@date
* @@description
* @@repository.url
*
* by Andrea Carraro
* Available under the MIT license
*/

/*jslint browser: true*/
/*jshint -W093 */

;(function ( window, document, undefined ) {

    /*
    * The first time Offside is called, it creates a singleton-factory object
    * and place it into "window.offside.factory".
    *
    * Offside factory serves the following purposes:
    * - DOM initialization
    * - Centralized Offside instances management and initialization
    */

    'use strict';

    // Self-invoking function returning the object which contains
    // the "getInstance" method used for initializing
    // the Offside sigleton factory
    var offside = (function () {

        // Global Offside singleton-factory constructor
        function initOffsideFactory( options ) {

            var i,
                factorySettings;                                    // Offside factory private settings

            // Default factory settings
            factorySettings = {

                slidingElementsSelector: 'offside-sliding-element', // String: Sliding elements selectors ('#foo, #bar')
                disableCss3dTransforms: false,                      // Disable CSS 3d Transforms support (for testing purposes)
                debug: true,                                        // Boolean: If true, print errors in console
            };

            // User defined factory settings
            for ( i in options ) {
                if ( factorySettings.hasOwnProperty( i ) ) {
                    factorySettings[i] = options[i];
                }
            }

            // Private factory properties
            var globalClass = 'offside-js',                         // Global Offside classes namespace
                initClass = globalClass + '--init',                 // Class appended to body when Offside is intialized
                slidingElementsClass = 'offside-sliding-element',   // Class appended to sliding elements
                transitionsClass = globalClass + '--interact',      // Class appended to body when ready to turn on Offside CSS transitions (Added when first menu interaction happens)
                instantiatedOffsides = [],                          // Array containing all instantiated offside elements
                firstInteraction = 1,                               // Keep track of first Offside interaction
                has3d = factorySettings.disableCss3dTransforms ? false : _has3d(),       // Browser supports CSS 3d Transforms
                openOffsideId,                                      // Tracks opened Offside instances
                body = document.body,
                slidingElements = document.querySelectorAll( factorySettings.slidingElementsSelector ),         // Sliding elements
                debug = factorySettings.debug;

            // Offside singleton-factory Dom initialization
            // It's called just once on Offside singleton-factory init.
            function _factoryDomInit() {

                // Add class to sliding elements
                forEach( slidingElements, function( item ){
                    addClass( item, slidingElementsClass );
                });

                // DOM Fallbacks when CSS transform 3d not available
                if( !has3d ) {
                    // No CSS 3d Transform fallback
                    addClass( document.documentElement, 'no-csstransforms3d' ); //Adds Modernizr-like class to HTML element when CSS 3D Transforms not available
                }

                // Add init class to body
                addClass( body, initClass );
            }

            // Private Offside factory methods

            // Testing for CSS 3D Transform Support
            // https://gist.github.com/lorenzopolidori/3794226
            function _has3d() {
                var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform':'-webkit-transform',
                    'OTransform':'-o-transform',
                    'msTransform':'-ms-transform',
                    'MozTransform':'-moz-transform',
                    'transform':'transform'
                };

                // Add it to the body to get the computed style
                document.body.insertBefore(el, null);

                for( var t in transforms ){
                    if( el.style[t] !== undefined ){
                        el.style[t] = 'translate3d(1px,1px,1px)';
                        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                    }
                }

                document.body.removeChild(el);

                return ( has3d !== undefined && has3d.length > 0 && has3d !== 'none' );
            }

            // Check for an open Offside instance. If so close it.
            var closeOpenOffside = function() {

                // Look for an open Offside id
                if ( !isNaN( openOffsideId ) ) {
                    instantiatedOffsides[ openOffsideId ].close();
                }
            },

            // Append a class to body in order to turn on elements CSS 3D transitions
            // only when happens the first interation with an Offside instance.
            // Otherwise we would see Offside instances being smoothly pushed
            // out of the screen during DOM initialization.
            turnOnCssTransitions = function() {
                addClass( body, transitionsClass );
            },

            // Utility functions
            // Shared among factory and Offside instances, too

            addClass = function( el, c ) {
                if( el.classList ) {
                    el.classList.add(c);
                }else {
                    el.className = ( el.className + ' ' + c ).trim();
                }
            },

            removeClass = function( el, c ) {
                if( el.classList ) {
                    el.classList.remove(c);
                }else {
                    el.className = el.className.replace( new RegExp( '(^|\\b)' + c.split(' ').join('|') + '(\\b|$)', 'gi' ), ' ' );
                }
            },

            addEvent = function( el, eventName, eventHandler ) {
                el.addEventListener( eventName, eventHandler );
            },

            removeEvent = function( el, eventName, eventHandler ) {
                el.removeEventListener( eventName, eventHandler );
            },

            //forEach method shared
            forEach = function( array, fn ) {
                for ( var i = 0; i < array.length; i++ ) {
                    fn( array[i], i );
                }
            };

            // Offside constructor
            // Set up and initialize a new Offside instance
            // Called by Offside factory "getOffsideInstance()" method
            function OffsideInstance( el, options, offsideId ) {

                var i,
                    offsideSettings;

                // Default Offside instance settings
                offsideSettings = {

                    buttonsSelector: '',                // String: Offside toggle buttons selectors ('#foo, #bar')
                    slidingSide: 'left',                // String: Offside element pushed on left or right
                    init: function(){},                 // Function: After init callback
                    beforeOpen: function(){},           // Function: Before open callback
                    afterOpen: function(){},            // Function: After open callback
                    beforeClose: function(){},          // Function: Before close callback
                    afterClose: function(){},           // Function: After close callback
                    beforeDestroy: function(){},        // Function: After destroy callback
                    afterDestroy: function(){},         // Function: After destroy callback
                };

                // User defined Offside instance settings
                for ( i in options ) {
                    if ( offsideSettings.hasOwnProperty( i ) ) {
                        offsideSettings[i] = options[i];
                    }
                }

                // Offside instance private properties
                var offside = document.querySelector(el) || document.querySelector( '.offside' ),  // Hello, I'm the Offside instance
                    offsideButtons = document.querySelectorAll( offsideSettings.buttonsSelector ), // Offside toggle buttons 

                    slidingSide = offsideSettings.slidingSide === 'right' ? 'right' : 'left',      // Sanitize slidingSide var
                    offsideClass = 'offside',                                                      // Class added to Offside instance it is intialized (eg. offside offside-left)
                    offsideSideClass = offsideClass + '--' + slidingSide,                          // Class added to Offside instance it is intialized (eg. offside offside-left)
                    offsideOpenClass = 'is-open',                                                  // Class appended to Offside instance when open
                    offsideBodyOpenClass = globalClass + '--' + 'is-open',                         // Class appended to body when Offside instance is open (offside-left-open / offside-right-open)
                    offsideBodyOpenSideClass = globalClass + '--is-' + slidingSide,                // Class appended to body when Offside instance is open (offside-left-open / offside-right-open)

                    id = offsideId || 0;                                                           // Set Offside instance id

                // Offside instance private methods

                var _toggleOffside = function() {

                    // Premise: Just 1 Offside instance at time can be open.
                    // If currently toggling Offside is not already open
                    id !== openOffsideId ? _openOffside() : _closeOffside();
                },

                _openOffside = function() {

                    // Before open callback
                    offsideSettings.beforeOpen();

                    // Turn on CSS transitions on first interaction with an Offside instance
                    if ( firstInteraction ) {
                        firstInteraction = 0;
                        turnOnCssTransitions();
                    }

                    // If another Offside instance is already open,
                    // close it before going on
                    closeOpenOffside();

                    // Set global body active class for current Offside instance
                    addClass( body, offsideBodyOpenClass );
                    addClass( body, offsideBodyOpenSideClass );

                    // Add Offside instance open class
                    addClass( offside, offsideOpenClass );

                    // Update open Offside instances tracker
                    openOffsideId = id;

                    // After open callback
                    offsideSettings.afterOpen();
                },

                _closeOffside = function() {

                    // Before close callback
                    offsideSettings.beforeClose();

                    // Remove global body active class for current Offside instance
                    removeClass( body, offsideBodyOpenClass );
                    removeClass( body, offsideBodyOpenSideClass );

                    // Remove Offside instance open class
                    removeClass( offside, offsideOpenClass );

                    // Update open Offside instance tracker (use undefined!!)
                    openOffsideId = undefined;

                    // Before close callback
                    offsideSettings.afterClose();
                },

                _destroyOffside = function() {

                    // Before destroy callback
                    offsideSettings.beforeDestroy();

                    //Close Offside intance before destroy
                    _closeOffside();

                    // Remove click event from Offside buttons
                    forEach( offsideButtons, function( item ) {
                        removeEvent( item, 'click', _onButtonClick );
                    });

                    // Destroy Offside instance
                    delete instantiatedOffsides[id];

                    // After destroy callback
                    offsideSettings.afterDestroy();
                },

                // Offside buttons click handler
                _onButtonClick = function( e ) {

                    e.preventDefault();
                    _toggleOffside();
                },

                /*
                // Get Offside instance unique ID
                _getId = function() {
                    return id;
                }
                */
               
                // Set up and initialize a new Offside instance
                _offsideInit = function() {

                    if ( debug ) {
                        _offsideCheckElements();
                    }

                    //Add classes to Offside instance (.offside and .offside{slidingSide})
                    addClass( offside, offsideClass );
                    addClass( offside, offsideSideClass );

                    // Toggle Offside on click event
                    forEach( offsideButtons, function( item ) {
                        addEvent( item, 'click', _onButtonClick );
                    });

                    // Init callback
                    offsideSettings.init();
                },

                // Fire console errors if DOM elements are missing
                _offsideCheckElements = function() {

                    if( !offside ) {
                        console.error( 'Offside alert: "offside" selector could not match any element' );
                    }

                    if( !offsideButtons.length ) {
                        console.error( 'Offside alert: "buttonsSelector" selector could not match any element' );
                    }

                    if( !slidingElements.length ) {
                        console.error( 'Offside alert: "slidingElements" selector could not match any element' );
                    }
                };

                // Offside instances public methods
                this.toggle = function() {
                    _toggleOffside();
                };

                this.open = function() {
                    _openOffside();
                };

                this.close = function() {
                    _closeOffside();
                };

                this.destroy = function() {
                    _destroyOffside();
                };

                // Ok, init Offside instance
                _offsideInit();

            } // OffsideInstance constructor end


            // DOM initialization
            _factoryDomInit();

            // This is the actual returned Offside factory
            return {

                //Offside factory public methods
                closeOpenOffside: function() {
                    closeOpenOffside();
                },

                // This is the method responsible for creating a new Offside instance
                // and register it into "instantiatedOffsides" array
                getOffsideInstance: function( el, options ) {

                    // Get length of instantiated Offsides array
                    var offsideId = instantiatedOffsides.length || 0;

                    // Instantiate new Offside instance,
                    // push it into "instantiatedOffsides" array and return it
                    return instantiatedOffsides[ offsideId ] = new OffsideInstance( el, options, offsideId );
                }

            };

        } // initOffsideFactory() end

        return {

            // Get the Singleton instance if one exists
            // or create one if it doesn't
            getInstance: function ( el, options ) {

                if ( !window.offside.factory ) {
                    window.offside.factory = initOffsideFactory( options );
                }

                return window.offside.factory.getOffsideInstance( el, options );
            }
        };
     
    })();

    // Store in window a reference to the Offside singleton factory
    if ( typeof module !== "undefined" && module.exports ) {
        module.exports = offside.getInstance;
    } else {
        window.offside = offside.getInstance;
    }

})( window, document );