module('supervisor');

test('should define a Supervisor object', function() {
    ok(Supervisor);
});

test('should call the error callback if an error occurs (default behaviour)', function() {
    stop();
    var sup = new Supervisor();
    sup.onerror = function(data, data2) {
        start();
        equals(data, 'errdata');
        equals(data2, 'test');
    }
    sup.run(function(errback) {
        errback('errdata', 'test');
    });
});

test('should restart the runnable fun if the maxRestart is provided', function() {
    stop();
    var called = 0;
    var sup = new Supervisor({maxRestart: 1});
    sup.onerror = function() {
        start();
        ok(false, "should not be called");
    }
    sup.run(function(errback) {
        called++;
        if (called == 1) errback();
        else start();
    });
});

test('should not restart the runnable fun if the maxRestart have been reached', function() {
    stop();
    var called = 0;
    var sup = new Supervisor({maxRestart: 1});
    sup.run(function(errback) {
        called++;
        if (called < 100) errback();
        if (called == 3) {
            setTimeout(function() {
                start();
                equals(called, 3);
            }, 1000);
        }
    });
});
