;(function(global){
    
    function Supervisor(conf) {
        conf = conf || {};
        this.maxRestart = conf.maxRestart || 0;
        this.maxTime = conf.maxTime || 0;
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
        var fun = this.onerror;
        if (this.maxRestart >= this.errors.length) fun = this._start;
        fun.apply(this, arguments);
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
        var conf = {maxRestart: 0, maxTime: 0};
        var caller = {
            onError: function(err) {
                error = err;
                return this;
            },
            max: function(times) {
                conf.maxRestart = times;
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
