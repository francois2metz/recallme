module('ReCallMe');

test('should define a Supervisor object', function() {
    ok(Supervisor);
});

test('should call the error callback if an error occurs (default behaviour)', function() {
    stop();
    callMe(function(errback) {
        errback('errdata', 'test');
    }).onError(function(data, data2) {
        start();
        equals(data, 'errdata');
        equals(data2, 'test');
    }).run();
});

test('should restart the runnable fun if the maxRestart is provided', function() {
    stop();
    var called = 0;
    callMe(function(errback, data) {
        called++;
        if (called == 1 || called == 2) {
            setTimeout(function() {
                errback('test');
            }, 1000);
        }
        else {
            start();
            equals('test', data);
        }
    }).max(2)
      .onError(function() {
        start();
        ok(false, "should not be called");
    }).run();
});

test('should not restart the runnable fun if the maxRestart have been reached', function() {
    stop();
    var called = 0;
    callMe(function(errback) {
        called++;
        if (called < 100) {
            setTimeout(function() {
                errback();
            }, 200);
        }
        if (called == 2) {
            setTimeout(function() {
                start();
                equals(called, 2);
            }, 1000);
        }
    }).max(1).run();
});

test('should not call error callback if the delay between errors > maxTime', function() {
    stop();
    var called = 0;
    callMe(function(errback) {
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
    }).onError(function() {
        start();
        ok(false, 'should not be called');
    }).max(1).seconds(1).run()
});


test('should call error callback if the delay between errors < maxTime', function() {
    stop();
    var called = 0;
    callMe(function(errback) {
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
    }).onError(function() {
        start();
        ok(true, 'should not be called');
    }).max(1).seconds(1).run();
});
