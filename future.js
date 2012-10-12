/*global require:false exports:false */
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
            _completed = false,
            _completed_args,
            completed_callbacks = [],
            exception_callbacks = [];
        
        // A private constructor for our future
        function Future() {
            this.then = function(callback) {
                if (_completed) {
                    callback.apply(this, _completed_args);
                } else {
                    completed_callbacks.push(callback);
                }
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
            
            if (!_completed) {    
                _completed = true;
                _completed_args = Array.prototype.slice.call(arguments, 0);
                
                for(i = 0; i < completed_callbacks.length; i++) {
                    // Execute with this args in the context of the future
                    completed_callbacks[i].apply(this.future(), _completed_args);
                }
            } else {
                throw new Error("Already completed. Cannot complete again.");
            }
            
            return this;
        };
        
        this.completeException = function() {
            var i;
            
            if (!_completed) {    
                for(i = 0; i < exception_callbacks.length; i++) {
                    // Execute with this args in the context of the future
                    exception_callbacks[i].apply(this.future(), arguments);
                }
            } else {
                throw new Error("Already completed. Cannot complete with exception.");
            }
            
            return this;
        };
    };
}.call(this));