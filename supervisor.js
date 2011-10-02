;(function(global){
    
    function Supervisor(conf) {
        conf = conf || {};
        this.maxRestart = conf.maxRestart || 0;
        this.maxTime = conf.maxTime;
        this.onerror = function() {}
    }
    Supervisor.prototype.run = function(run) {
        this._run = run;
        this._start();
    }
    Supervisor.prototype._start = function() {
        var that = this;
        this._run(function() {
            if (that.maxRestart-- >= 0) that._start();
            else that.onerror.apply(this, arguments);
        })
    }
    // define the global
    global.Supervisor = Supervisor;

})(this);