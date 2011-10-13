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
    sup.run(function(errback, data) {
        called++;
        if (called == 1) errback('test');
        else {
            start();
            equals('test', data);
        }
    });
});

test('should not restart the runnable fun if the maxRestart have been reached', function() {
    stop();
    var called = 0;
    var sup = new Supervisor({maxRestart: 1});
    sup.run(function(errback) {
        called++;
        if (called < 100) errback();
        if (called == 2) {
            setTimeout(function() {
                start();
                equals(called, 2);
            }, 1000);
        }
    });
});

test('should not call error callback if the delay between errors > maxTime', function() {
    stop();
    var called = 0;
    var sup = new Supervisor({maxRestart: 1,
                              maxTime: 1});
    sup.onerror = function() {
        start();
        ok(false, 'should not be called');
    }
    sup.run(function(errback) {
        called++;
        if (called == 1) errback();
        else if (called == 2) {
            setTimeout(function() {
                errback();
            }, 1100);
        } else {
            setTimeout(function() {
                start();
                equals(called, 3);
            }, 1000);
        }
    });
});


test('should call error callback if the delay between errors < maxTime', function() {
    stop();
    var called = 0;
    var sup = new Supervisor({maxRestart: 1,
                              maxTime: 1});
    sup.onerror = function() {
        start();
        ok(true, 'should not be called');
    }
    sup.run(function(errback) {
        called++;
        if (called == 1) errback();
        else if (called == 2) {
            setTimeout(function() {
                errback();
            }, 200);
        } else {
            start();
            ok(false, 'should not be called');
        }
    });
});
