future-js
=========

A JavaScript homage to the Dartlang Completer API.

Using it is simple. You create an asynchronous function of some sort. This
function creates a Completer which you use to track your progress, and
eventually complete the operation. From this funciton, return a future.

    var MyObj = function() {
        var _completer;
        
        // The asynchronous action performed
        this.startAsync = function(arg1, arg2) {
            _completer = new future.Completer();
            
            return _completer.future();
        };
        
        // Complete the action (perhaps as a callback)
        this.endAsync = function() {
            _completer.complete("SUCCESS", "CODE 9");
        };
    };

Code wishing to monitor the progress of the function can then use a really slick
API to monitor your progress.

    var my_obj = new MyObj();
    
    function handle_completion() {
        say("This is so awesome that we're done!");
    }
    
    function do_other_stuff(msg, code) {
        say("More incredible things happened, '" + msg + "'");
    }
    
    // Note we're saving the future for later use
    var future =
        my_obj.startAsync().then(handle_completion).then(do_other_stuff);
    
    // Completing the asynchronous funtion calls all our handlers
    my_obj.endAsync();
    
You're handlers will be called with the same arguments as to complete.

You can even add handlers after your work is done as long as you kept a
reference to the future.

    future.then(function() {
        say("We're calling this handler immediately since the operation is done.");
    });
    
There's lots more you can do with this, including handling exceptions. For
more examples check out the /spec/future-spec.js or index.html.