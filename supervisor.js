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
        var now = +new Date();
        var numberToRemove = 0;
        for (var i=0; i<this.errors.length; i++) {
            if ((now - this.errors[i]) > this.maxTime * 1000) numberToRemove++;
            else break;
        }
        this.errors.splice(0, numberToRemove);
    }
    // define the global
    global.Supervisor = Supervisor;

})(this);
