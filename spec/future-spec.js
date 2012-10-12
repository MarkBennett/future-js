/*global jasmine:false describe:false it:false expect:false beforeEach:false require:false */
var future = require('../');

describe("Future-js", function() {
    
    var f = future;
    
    it("should declare a version", function() {
        expect(future.VERSION).toEqual("0.0.1");
    });
    
    
    describe("Completer", function() {
        var completer,
            future;
        
        beforeEach(function() {
            completer = new f.Completer();
            future = completer.future();
        });
        
        it("should let you create a Future", function() {
            expect(future).toBeDefined();
        });
        
        it("should call any the Future's handler with the arguments to complete()", function() {
            var completed_args = [1, 2, 3],
                handler_args;
                
            // Register a handler on the future
            future.then(function() {
                handler_args = Array.prototype.slice.call(arguments, 0);
            });
            
            // Complete the completer
            completer.complete.apply(completer, completed_args);
            
            expect(handler_args).toEqual(completed_args);
        });
        
        it("should call each of the handlers associated with the Future", function() {
            var handler_1 = jasmine.createSpy('handler_1'),
                handler_2 = jasmine.createSpy('handler_2'),
                handler_3 = jasmine.createSpy('handler_3');
                
            future.then(handler_1).then(handler_2).then(handler_3);
            
            completer.complete();
            
            expect(handler_1).toHaveBeenCalled();
            expect(handler_2).toHaveBeenCalled();
            expect(handler_3).toHaveBeenCalled();
        });
        
        it("should all each of the exception handlers if something's gone wrong", function() {
            var exception_handler1 = jasmine.createSpy('exception_handler1'),
                exception_handler2 = jasmine.createSpy('exception_handler2'),
                error = new Error("Something bad");
                
                future.handleException(exception_handler1).
                    handleException(exception_handler2);
                    
                completer.completeException(error);
                
                expect(exception_handler1).toHaveBeenCalled();
                expect(exception_handler2).toHaveBeenCalled();
        });   
        
        it("should call any the Future's exception handlers with the arguments to completeException()", function() {
            var completed_args = [new Error("Bad")],
                handler_args;
                
            // Register a handler on the future
            future.handleException(function() {
                handler_args = Array.prototype.slice.call(arguments, 0);
            });
            
            // Complete the completer
            completer.completeException.apply(completer, completed_args);
            
            expect(handler_args).toEqual(completed_args);
        });
        
        it("should raise an exception when completing after already completed", function() {
            expect(function() { completer.complete().complete(); }).toThrow(new Error("Already completed. Cannot complete again."));
        });
        
        it("should immediately call handlers with args once completed", function() {
            var handler = jasmine.createSpy("handler");
                
            completer.complete(1, "a", "b");
            
            future.then(handler);
            
            expect(handler).toHaveBeenCalledWith(1, "a", "b");      
        });
        
        it("should raise an exception when completing with exception after completed", function() {
            expect(function() { completer.complete().completeException(); }).
                toThrow(new Error("Already completed. Cannot complete with exception."));
        });
        
        it("should immediately call handlers with args once completed", function() {
            var handler = jasmine.createSpy("handler");
                
            completer.complete(1, "a", "b");
            
            future.then(handler);
            
            expect(handler).toHaveBeenCalledWith(1, "a", "b");      
        });
    });
});