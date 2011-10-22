;(function(global){

    // to be compatible with both commonJS and the browser
    if (typeof exports !== 'undefined') {
        global = exports;
    }

    function Supervisor(conf) {
        conf = conf || {};
        this.maxRestart = conf.maxRestart || 0;
        this.maxTime = conf.maxTime || 0;
        this.delay = conf.delay || function() {return 0;}
        this.onerror = function() {};
        this.errors = [];
    }
    /**
     * Ensure the function 'run' will be recalled in case of error
     */
    Supervisor.prototype.run = function(run) {
        this._run = run;
        this._start();
    }
    Supervisor.prototype._start = function() {
        var that = this;
        var errback = function() {
            that.errors.push(+new Date());
            that._restartOrError.apply(that, arguments)
        };
        var args = Array.prototype.slice.call(arguments);
        this._run.apply(this, [errback].concat(args));
    }
    Supervisor.prototype._restartOrError = function() {
        this._cleanup();
        // recall the function, with an optional delay
        if (this.maxRestart >= this.errors.length) {
            var that = this;
            var args = arguments;
            setTimeout(function() {
                that._start.apply(that, args);
            }, this.delay(this.errors.length) * 1000);
        // error, we stop
        } else this.onerror.apply(this, arguments);
    }
    /**
     * Cleanup old errors
     */
    Supervisor.prototype._cleanup = function() {
        if (this.maxTime == 0)
            return;
        var now = +new Date();
        var numberToRemove = 0;
        for (var i=0; i<this.errors.length; i++) {
            if ((now - this.errors[i]) > this.maxTime) numberToRemove++;
            else break;
        }
        this.errors.splice(0, numberToRemove);
    }
    // define the global
    global.Supervisor = Supervisor;
    global.callMe = function(run) {
        var error = function() {};
        var conf = {maxRestart: 0, maxTime: 0, delay: null};
        var caller = {
            onError: function(err) {
                error = err;
                return this;
            },
            max: function(times) {
                conf.maxRestart = times;
                return this;
            },
            delay: function(fun) {
                conf.delay = fun;
                return this;
            },
            run: function() {
                var sup = new Supervisor(conf);
                sup.onerror = error;
                sup.run(run);
            }
        };
        function toTime(fun) {
            return function(time) {
                conf.maxTime = fun(time);
                return caller;
            }
        }
        caller.seconds = toTime(function(time) { return time * 1000; });
        caller.minutes = toTime(function(time) { return time * 1000 * 60; });
        caller.hours   = toTime(function(time) { return time * 1000 * 3600; });
        return caller;
    }

})(this);
