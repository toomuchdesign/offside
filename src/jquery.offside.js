/* @@name @@version @@date
* @@description
* @@repository.url
*
* by Andrea Carraro
* Available under the MIT license
*/

/*jslint browser: true*/
/*jshint -W093 */
/*global jQuery */

;(function ( $, window, document, undefined ) {

    /*
    * The first time Offside is called, it creates a singleton-factory object
    * and place it into "window.offside".
    *
    * Offside factory serves the following purposes:
    * - DOM initialization
    * - Centralized Offside instances management and initialization
    */

    'use strict';

    $.fn.offside = (function () {

        // Global Offside singleton-factory constructor
        function initOffsideFactory( options ) {

            var i,
                factorySettings,                                    // Offside factory private settings
                factorySharedProperties;                            // Offside factory setting shared with each Offside instance

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
            var initClass = 'offside-init',                         // Class appended to body when Offside is intialized
                slidingElementsClass = 'offside-sliding-element',   // Class appended to sliding elements
                transitionsClass = 'offside-transitions',           // Class appended to body when ready to turn on Offside CSS transitions (Added when first menu interaction happens)
                instantiatedOffsides = [],                          // Array containing all instantiated offside elements
                firstInteraction = 1,                               // Keep track of first Offside interaction
                has3d = factorySettings.disableCss3dTransforms ? false : _has3d(),       // Browser supports CSS 3d Transforms
                openOffsideId;                                      // Tracks opened Offside instances

            // Factory properties shared with each Offside instance
            factorySharedProperties = {

                $body: $( 'body' ),
                $slidingElements: $( factorySettings.slidingElementsSelector ),         // Sliding elements
                debug: factorySettings.debug,
            };

            // Offside singleton-factory Dom initialization
            // It's called just once on Offside singleton-factory init.
            function _factoryDomInit() {

                // Add class to sliding elements
                factorySharedProperties.$slidingElements.addClass( slidingElementsClass );

                // DOM Fallbacks when CSS transform 3d not available
                if( !has3d ) {

                    // No CSS 3d Transform fallback
                    $('html').addClass( 'no-csstransforms3d' ); //Adds Modernizr-like class when CSS 3D Transforms not available
                }

                // Add init class to body
                factorySharedProperties.$body.addClass( initClass );
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

            // Append a class to body in order to turn on elements CSS 3D transitions
            // only when happens the first interation with an Offside instance.
            // Otherwise we would see Offside instances being smoothly pushed
            // out of the screen during DOM initialization.
            function _turnOnCssTransitions() {
                factorySharedProperties.$body.addClass( transitionsClass );
            }

            // Offside instances constructor
            // Set up and initialize a new Offside instance
            // Called trough Offside factory "getOffsideInstance()" method
            function OffsideInstance( el, factorySharedProperties, options, offsideId ){

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
                };

                // User defined Offside instance settings
                for ( i in options ) {
                    if ( offsideSettings.hasOwnProperty( i ) ){
                        offsideSettings[i] = options[i];
                    }
                }

                // Offside instance private properties
                var $body = factorySharedProperties.$body,                                      // Get body reference from factory
                    $offside = $( el || '.offside' ),                                           // Hello, I'm the Offside instance
                    $offsideButtons = $(offsideSettings.buttonsSelector),                       // Offside toggle buttons 
                    $slidingElements = factorySharedProperties.$slidingElements,                // Get sliding elements reference from Offside factory

                    slidingSide = offsideSettings.slidingSide === 'right' ? 'right' : 'left',   // Sanitize slidingSide var
                    offsideClass = 'offside offside-' + slidingSide,                            // Class added to Offside instance it is intialized (eg. offside offside-left)
                    offsideOpenClass = 'offside-open',                                          // Class appended to Offside instance when open
                    offsideBodyOpenClass = offsideOpenClass + '-' + slidingSide,                // Class appended to body when Offside instance is open (offside-left-open / offside-right-open)

                    id = offsideId || 0;                                                               // Set Offside instance id

                // Offside instance private methods

                function _toggleOffside() {

                    // Check if there is any open Offside
                    !isNaN( factorySharedProperties.openOffsideId ) ? window.offside.closeOpenOffside() : _openOffside();
                }

                function _openOffside() {

                    // Before open callback
                    offsideSettings.beforeOpen();

                    // If another Offside instance is already open,
                    // close it before going on
                    window.offside.setOpenOffsideId( id );

                    //Reset body active class and add body active class
                    $body
                        .removeClass( 'offside-open-left offside-open-right' )
                        .addClass( offsideBodyOpenClass );

                    //Add Offside instance open class
                    $offside.addClass( offsideOpenClass );

                    //Update open Offside instances tracker
                    factorySharedProperties.openOffsideId = id;

                    // After open callback
                    offsideSettings.afterOpen();
                }

                function _closeOffside() {

                    // Before close callback
                    offsideSettings.beforeClose();

                    // Reset body active class
                    $body.removeClass( 'offside-open-left offside-open-right' );

                    // Remove Offside instance open class
                    $offside.removeClass( offsideOpenClass );

                    // Update open Offside instance tracker (use undefined!!)
                    factorySharedProperties.openOffsideId = undefined;

                    // Before close callback
                    offsideSettings.afterClose();
                }

                /*
                // Get Offside instance unique ID
                function _getId() {
                    return id;
                }
                */

                // Initialize Offside instance in the DOM
                function _offsideInit() {

                    if ( factorySharedProperties.debug ) {
                        _offsideCheckElements();
                    }

                    //Add classes to Offside instance (.offside and .offside{slidingSide})
                    $offside.addClass( offsideClass );

                    // Toggle Offside
                    $offsideButtons.on('click', function() {
                        _toggleOffside();
                    });

                    // Init callback
                    offsideSettings.init();
                }

                // Fire console errors if DOM elements are missing
                function _offsideCheckElements() {

                    if( !$offside.length ) {
                        console.error( 'Offside alert: "offside" selector could not match any element' );
                    }

                    if( !$offsideButtons.length ) {
                        console.error( 'Offside alert: "buttonsSelector" selector could not match any element' );
                    }

                    if( !$slidingElements.length ) {
                        console.error( 'Offside alert: "slidingElements" selector could not match any element' );
                    }
                }

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

                // Ok, init Offside instance
                _offsideInit();

            } // OffsideInstance constructor end


            // DOM initialization
            _factoryDomInit();

            // This is the actual returned Offside factory
            return {

                //Offside factory public methods

                //@TODO solve logic problems here
                setOpenOffsideId: function( offsideId ) {

                    // If there are no open offside
                    if ( !isNaN( offsideId ) ) {
                        openOffsideId = offsideId;
                    }

                    // Turn on CSS transitions on first interaction with an Offside instance
                    if ( firstInteraction ) {

                        firstInteraction = 0;
                        _turnOnCssTransitions();
                    }
                },

                // Check if there is an open Offside instance
                // If so close it.
                closeOpenOffside: function() {

                    // Look for an open Offside id
                    if ( !isNaN( openOffsideId ) ) {
                        instantiatedOffsides[ openOffsideId ].close();
                    }
                },

                // This is the method responsible for creating a new Offside instance
                // and register it into "instantiatedOffsides" array
                getOffsideInstance: function( el, options ) {

                    // Get length of instantiated Offsides array
                    var offsideId = instantiatedOffsides.length || 0;

                    // Instantiate new Offside instance,
                    // push it into "instantiatedOffsides" array and return it
                    return instantiatedOffsides[ offsideId ] = new OffsideInstance( el, factorySharedProperties, options, offsideId );
                }

            };

        } // initOffsideFactory() end
     
        return {

            // Get the Singleton instance if one exists
            // or create one if it doesn't
            getInstance: function ( el, options ) {

                if ( !window.offside ) {
                    window.offside = initOffsideFactory( options );
                }

                return window.offside.getOffsideInstance( el, options );
            }
        };
     
    })();

    // Store in window a reference to the Offside singleton factory
    window.offside;

    // Jquery function wrapper
    $.offside = function( el, options ) {
        return $.fn.offside.getInstance( el, options );
    };

})( jQuery, window, document );