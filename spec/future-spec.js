/*global jasmine:false describe:false it:false expect:false beforeEach:false require:false */
var future = require('../');

describe("Future-js", function() {
    it("should declare a version", function() {
        expect(future.VERSION).toEqual("0.0.1");
    });
    
    
    describe("Completer", function() {
        var completer;
        
        beforeEach(function() {
            completer = new future.Completer();
        });
        
        it("should let you create a Future", function() {
            expect(completer.future()).toBeDefined();
        });
        
        it("should call any the Future's handler with the arguments to complete()", function() {
            var future = completer.future(),
                completed_args = [1, 2, 3],
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
            var future = completer.future(),
                handler_1 = jasmine.createSpy('handler_1'),
                handler_2 = jasmine.createSpy('handler_2'),
                handler_3 = jasmine.createSpy('handler_3');
                
            future.then(handler_1).then(handler_2).then(handler_3);
            
            completer.complete();
            
            expect(handler_1).toHaveBeenCalled();
            expect(handler_2).toHaveBeenCalled();
            expect(handler_3).toHaveBeenCalled();
        });
        
        it("should all each of the exception handlers if something's gone wrong", function() {
            var future = completer.future(),
                exception_handler1 = jasmine.createSpy('exception_handler1'),
                exception_handler2 = jasmine.createSpy('exception_handler2'),
                error = new Error("Something bad");
                
                future.handleException(exception_handler1).
                    handleException(exception_handler2);
                    
                completer.completeException(error);
                
                expect(exception_handler1).toHaveBeenCalled();
                expect(exception_handler2).toHaveBeenCalled();
        });   
        
        it("should call any the Future's exception handlers with the arguments to completeException()", function() {
            var future = completer.future(),
                completed_args = [new Error("Bad")],
                handler_args;
                
            // Register a handler on the future
            future.handleException(function() {
                handler_args = Array.prototype.slice.call(arguments, 0);
            });
            
            // Complete the completer
            completer.completeException.apply(completer, completed_args);
            
            expect(handler_args).toEqual(completed_args);
        });
    });
});