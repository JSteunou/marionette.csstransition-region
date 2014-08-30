/*
 * Greetings, adventurer!
 *
 * Are you looking to support animated regions in your app? That's awesome! However,
 * I don't suggest using this code. It's mostly untested code that I wrote really, really quickly
 * for the sole purpose of making the three examples work.
 *
 * Feel free to use this code for inspiration, but please – don't use it unless you
 * test it more thoroughly!
 *
 */

(function() {

    Marionette.CSSTransitionRegion = Marionette.Region.extend({

        // avoid property collision
        transitionRegion: {},

        detachedClassName: 'detached',

        // force preventDestroy: true if transitionOut
        // see [#1785](https://github.com/marionettejs/backbone.marionette/issues/1785)
        show: function(view, options) {
            if (view.transitionOut) {
                options = {} || options;
                options.preventDestroy = true;
            }
            Marionette.Region.prototype.show.call(this, view, options);
        },

        onBeforeSwap: function(view) {
            if (this.currentView && this.currentView.transitionOut) {
                // copy currentView properties before it get destroyed
                this.transitionRegion.transitionOut = this.currentView.transitionOut;
                var clonedNode = this.transitionRegion.clonedNode = this.currentView.el.cloneNode(true);

                // put the clone in front region
                clonedNode.classList.add(this.detachedClassName);
                this.el.parentNode.appendChild(clonedNode);

                // call empty manually see [#1785](https://github.com/marionettejs/backbone.marionette/issues/1785)
                this.empty();
            }
        },

        onSwap: function(view) {
            // if someone knows why I have to wrap this in a setTimeout for Firefox let me know
            setTimeout(function() {
                if (this.transitionRegion.transitionOut && this.transitionRegion.clonedNode) {
                    this.transitionRegion.clonedNode.classList.add(this.transitionRegion.transitionOut);
                    // TODO: prefix event name?
                    this.transitionRegion.clonedNode.addEventListener('transitionend', function(event) {
                        // hurra for node.remove & node.removeNode differences =_=
                        event.target.parentNode.removeChild(event.target);
                    }, false);
                    this.transitionRegion = {};
                }
            }.bind(this), 50);
        },

        onShow: function(view) {
            // if someone knows why I have to wrap this in a setTimeout for Firefox let me know
            setTimeout(function() {
                if (view.transitionIn) {
                    view.el.classList.add(view.transitionIn);
                }
            }.bind(this), 50);
        }

    });

})();
