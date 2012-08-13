/**
 * @filename Interval.js
 * @name Interval object
 * @fileOverview Interval object class
 *
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120813
 * @version 1.1
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0
 * @requires Ext.mixin.Observable
 * @rewuires Ext.Base
 * 
 */

/**
 * @event beforeexecute
 * Fired before when interval executed
 * @param {Object} Interval object
 */

/**
 * @event execute
 * Fired each time interval executed
 * @param {Object} Interval object
 */

/**
 * @event exception
 * Fired when exception occured
 * @param {Object} Interval object
 */

/**
 * @event start
 * Fired when interval is started or resumed
 * @param {Object} Interval object
 */

/**
 * @event stop
 * Fired when interval is stopped
 * @param {Object} Interval object
 */

/**
 * @event resume
 * Fired when interval is resummed
 * @param {Object} Interval object
 */

/**
 * @event statuschange
 * Fired when interval paused status is changed
 * @param {Object} Interval object
 */

/**
 * @event remove
 * Fired when interval is removed
 * @param {Object} Interval object
 */

/**
 * @event finish
 * Fired when interval is finished
 * @param {Object} Interval object
 */

Ext.define('Ext.ux.util.Interval', {
    extend: 'Ext.Base',
    mixins: ['Ext.mixin.Observable'],
    
    interval: null,
    
    config: {
        /**
         * Interval name
         * @cfg {String} name
         */
        name: '',
        
        /**
         * Sequential interval mode flag
         * @cfg {Boolean} sequential
         */
        sequential: false,
        
        /**
         * Ready flag for sequential mode
         * @cfg {Boolean} ready
         * @private
         */
        ready: true,
        
        /**
         * Is interval started flag
         * @cfg {Boolean} started
         * @private
         */
        started: false,
        
        /**
         * Is interval paused flag
         * @cfg {Boolean} paused
         * @private
         */
        paused: true,
        
        /**
         * Is interval removed flag
         * @cfg {Boolean} removed
         * @private
         */
        removed: false,
        
        /**
         * How many time interval should be fired
         * @cfg {Numeric} times -1 for infinity
         */
        times: -1,
        
        /**
         * Interval timeout
         * @cfg {Integer} timeout Milliseconds
         */
        timeout: 1000
    },
    
    /**
     * @private
     */
    constructor: function(config) {
        var me = this;
        me.initConfig(config);
        return me;
    },
    
    /**
     * Create interval
     * @method create
     * @param {Integer} timeout
     */
    create: function(timeout) {
        var me = this;
        me.interval = window.setInterval(function() {
            me.doExecute.call(me);
        }, timeout);
    },
    
    /**
     * Remove interval
     * @method remove
     */
    remove: function() {
        var me = this;
        
        me.stop();
        window.clearInterval(me.interval);
        me.interval = null;
        me.setRemoved(true);
        me.fireEvent('remove', me);
    },
    
    /**
     * Start interval
     * @method start
     */
    start: function() {
        var me = this;
        me.setPaused(false);
        me.doExecute();
    },
    
    /**
     * Stop interval
     * @method stop
     */
    stop: function() {
        this.setPaused(true);
    },
    
    /**
     * Pause interval. Shortcut to stop method
     * @method pause
     */
    pause: function() {
        this.stop();
    },
    
    /**
     * Restore times value and start interval
     * @method resume
     */
    resume: function() {
        var me = this;
        var config = me.getInitialConfig();
        me.setTimes(config.times);
        me.fireAction('resume', [me], me.start);
    },
    
    /**
     * Toggle start/stop status
     * @method toggle
     */
    toggle: function() {
        var me = this;
        var paused = me.getPaused();
        
        if (paused) {
            me.start();
        } else {
            me.pause();
        }
    },
    
    /**
     * @private
     */
    updateTimeout: function(newTimeout, oldTimeout) {
        var me = this;
        
        if (oldTimeout) {
            me.remove();
        }
        
        if (newTimeout) {
            me.create(newTimeout);
        }
    },
    
    /**
     * @private
     */
    updateStarted: function(started) {
        var me = this;
        
        if (started) {
            me.fireEvent('start', me);
        } else {
            me.fireEvent('stop', me);
        }
    },
    
    /**
     * @private
     */
    updatePaused: function(paused) {
        var me = this;
        
        me.fireEvent('statuschange', paused, me);
        
        if (paused) {
            me.fireEvent('pause', me);
            me.setStarted(false);
        } else {
            me.setStarted(true);
        }
    },
    
    /**
     * Execute action for interval
     * @method doExecute
     * @private
     */
    doExecute: function() {
        var me = this;
        
        if (me.getPaused() || me.getRemoved()) {
            return;
        }
        
        if (me.getSequential() && !me.getReady()) {
            return;
        }
        
        if (me.fireEvent('beforeexecute', me) !== false) {
            me.fireAction('execute', [me], me.changeTimes);
        } else {
            me.setStarted(false);
            me.setPaused(true);
            me.fireEvent('exception', {
                message: 'Before execution listener filed',
                time: new Date()
            }, me);
        }
    },
    
    /**
     * Change current times property
     * @method changeTimes
     */
    changeTimes: function() {
        var me = this;
        
        if (me.getSequential()) {
            me.setReady(false);
        }
        
        var times = me.getTimes();
        
        if (times !== -1) {
            if (times > 0) {
                me.setTimes(times - 1);
            } else {
                me.fireAction('finish', [me], me.stop);
            }
        } 
    }
});