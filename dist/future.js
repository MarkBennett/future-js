/*! future - v0.0.1 - 2012-10-12
* http://github.com/MarkBennett/future-js
* Copyright (c) 2012 Mark Bennett; Licensed MIT */

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
            STATE = {
                INCOMPLETE : 1,
                COMPLETED: 2,
                COMPLETED_WITH_EXCEPTION: 3
            },
            _state = STATE.INCOMPLETE,
            _completed_args,
            completed_callbacks = [],
            exception_callbacks = [];
        
        // A private constructor for our future
        function Future() {
            this.then = function(callback) {
                switch (_state) {
                    case STATE.INCOMPLETE:
                        completed_callbacks.push(callback);
                        break;
                    case STATE.COMPLETED:
                        callback.apply(this, _completed_args);
                        break;
                    case STATE.COMPLETED_WITH_EXCEPTION:
                        break;
                }
                                
                return this;
            };
            
            this.handleException = function(callback) {
                if (_state === STATE.INCOMPLETE) {
                    exception_callbacks.push(callback);
                }                
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
            
            switch (_state) {
                case STATE.INCOMPLETE:
                    _state = STATE.COMPLETED;
                    _completed_args = Array.prototype.slice.call(arguments, 0);
                    
                    for(i = 0; i < completed_callbacks.length; i++) {
                        // Execute with this args in the context of the future
                        completed_callbacks[i].apply(this.future(), _completed_args);
                    }
                    
                    break;
                case STATE.COMPLETED:
                    throw new Error("Already completed. Cannot complete again.");
                case STATE.COMPLETED_WITH_EXCEPTION:
                    throw new Error("Already completed with exception. Cannot complete again.");
            }
            
            return this;
        };
        
        this.completeException = function() {
            var i;
            
            
            switch (_state) {
                case STATE.INCOMPLETE:    
                    _state = STATE.COMPLETED_WITH_EXCEPTION;
                    
                    for(i = 0; i < exception_callbacks.length; i++) {
                        // Execute with this args in the context of the future
                        exception_callbacks[i].apply(this.future(), arguments);
                    }
                    
                    break;
                case STATE.COMPLETED:
                    throw new Error("Already completed. Cannot complete with exception.");
                case STATE.COMPLETED_WITH_EXCEPTION:
                    throw new Error("Already completed with exception. Cannot complete again.");
            }
            
            return this;
        };
    };
}.call(this));