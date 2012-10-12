(function() {
    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root;
    
    if (typeof exports !== 'undefined') {
        // We're using node
        root = exports;
    } else {
        // We're in the browser
        this['future'] = {};
        root = this['future'];
    }
    
    root.VERSION = "0.0.1";
    
    root.Completer = function() {
        var _future,
            completed_callbacks = [],
            exception_callbacks = [];
        
        // A private constructor for our future
        function Future() {
            this.then = function(callback) {
                completed_callbacks.push(callback);
                return this;
            };
            this.handleException = function(callback) {
                exception_callbacks.push(callback);
                return this;
            };
        }
        
        // Return the future associated with this Completer
        this.future = function() {
            _future = _future || new Future();
            
            return _future;
        };
        
        // Complete this Completer, calling any associated callbacks
        this.complete = function() {
            var i;
            
            for(i = 0; i < completed_callbacks.length; i++) {
                completed_callbacks[i].apply(this, arguments);
            }
        };
        
        this.completeException = function() {
            var i;
            
            for(i = 0; i < exception_callbacks.length; i++) {
                exception_callbacks[i].apply(this, arguments);
            }
        };
    };
}).call(this);