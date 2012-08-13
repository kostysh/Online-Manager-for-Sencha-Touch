/**
 * @filename Intervalr.js
 * @name Intervals manager
 * @fileOverview Util to manage javascript intervals
 *
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120813
 * @version 1.1
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0
 * @requires Ext.mixin.Observable
 * @requires Ext.util.AbstractMixedCollection
 * @requires Ext.ux.util.Interval
 * 
 * Usage:
    
    // Setup path for custom components in app.js
    Ext.Loader.setPath({
        'Ext.ux': 'src/ux'
    });

    // Require Intervalr class in app.js
    requires: ['Ext.ux.util.Intervalr']
    
    // Create new interval
    Intervalr.add('yourinervalname', {
        timeout: 10000,// Timeout in milliseconds
        times: -1,     // Infinity
        listeners: {
            execute: function() {
                console.log('He dude!');
            },
            exception: function(err) {
                console.log('Error', err);
            }
        }
    });

    // Setup some extra listeners
    Intervalr.addListeners('yourinervalname', {
        scope: this,
        statuschange: this.onStatusChangeListener,
        finish: this.onFinishListener
    });

    // Start interval
    Intervalr.start('yourinervalname');
    
    // Set paused
    Intervalr.pause('yourinervalname');

    // Inverse paused value
    Intervalr.toggle('yourinervalname');
    
    // Remove interval
    Intervalr.remove('yourinervalname');
 
 *
 */

/**
 * @event beforeadd
 * Fired before when interval added to collection
 * @param {Object} Intervalr object
 */

/**
 * @event add
 * Fired when new interval added to collection
 * @param {Object} Interval object
 */

/**
 * @event remove
 * Fired when interval removed from collection
 * @param {Object} Interval object
 */

Ext.define('Ext.ux.util.Intervalr', {
    mixins: ['Ext.mixin.Observable'],
    alternateClassName: 'Intervalr',
    singleton: true,
    
    requires: [
        'Ext.ux.util.Interval',
        'Ext.util.AbstractMixedCollection'
    ],
    
    config: {
        times: -1,// Default times count [means infinity]
        timeout: 10000// Default timeout
    },
    
    collection: null,
    
    listeners: {
        add: 'onIntervalAdd',
        remove: 'onIntervalRemove'
    },
    
    /**
     * @private
     */
    constructor: function(config) {
        var me = this;
        
        me.collection = Ext.create('Ext.util.AbstractMixedCollection');
        me.collection.on(Ext.apply(me.listeners, {scope: me}));
        me.initConfig(config);
        return me;
    },
    
    /**
     * @private
     */
    onIntervalAdd: function(index, interval, name) {
        this.fireEvent('add', interval, name, index);                
    },
    
    /**
     * @private
     */
    onIntervalRemove: function(interval, key) {
        this.fireEvent('remove', interval, key);
    },
    
    /**
     * Add new interval to collection and start it
     * @param {String} name Interval name
     * @param {Object} config Interval configuration object
     */
    add: function(name, config) {
        var me = this;
        
        if (me.fireEvent('beforeadd') !== false) {
            var interval = me.collection.add(name, 
                Ext.create('Ext.ux.util.Interval', {
                    name: name,
                    sequential: config.sequential || false,
                    times: config.times || me.getTimes(),
                    timeout: config.timeout || me.getTimeout()
            }));
            
            if (Ext.isObject(config.listeners)) {
                interval.on(config.listeners);
            }            
        } else {
            me.fireEvent('exception', {
                message: 'Before add listener filed',
                time: new Date()
            }, me);
        }
    },
    
    /**
     * Start interval by name
     * @method start
     * @param {String} name Interval name
     */
    start: function(name) {
        this.collection.get(name).start();
    },
    
    /**
     * Stop interval by name
     * @method stop
     * @param {String} name Interval name
     */
    stop: function(name) {
        this.collection.get(name).stop();
    },
    
    /**
     * Pause interval by name
     * @method pause
     * @param {String} name Interval name
     */
    pause: function(name) {
        this.collection.get(name).pause();
    },
    
    /**
     * Resume interval by name
     * @method resume
     * @param {String} name Interval name
     */
    resume: function(name) {
        this.collection.get(name).resume();
    },
    
    /**
     * Set ready status for interval
     * @method ready
     * @param {String} name Interval name
     */
    ready: function(name) {
        this.collection.get(name).setReady(true);
    },
    
    /**
     * Inverse paused property value for interval
     * @method toggle
     * @param {string} name Interval name
     */
    toggle: function(name) {
        this.collection.get(name).toggle();
    },
    
    /**
     * Remove interval by name
     * @method remove
     * @param {String} name Interval name
     */
    remove: function(name) {
        this.collection.get(name).remove();
        this.collection.removeAtKey(name);
    },
    
    /**
     * Add listeners to interval
     * @method addListeners
     * @param {String/Object} name Interval name or config
     * @param {Object} config Listeners config
     */
    addListeners: function() {
        var me = this;
        var name, config;
        
        if (arguments.length === 1 && 
            Ext.isObject(arguments[0]) && 
            Ext.isDefined(arguments[0].name)) {
            
            name = arguments[0].name;
            config = arguments[0];
        } else if (arguments.length === 2) {
            name = arguments[0];
            config = arguments[1];
        } else {
            me.fireEvent('exception', {
                message: 'Wrong interval config',
                time: new Date()
            }, me);
            
            return;
        }
        
        var interval = me.collection.get(name);
        if (interval) {
            interval.on(config);
        } else {
            me.fireEvent('exception', {
                message: 'Interval with name: ['+name+'] not registered',
                time: new Date()
            }, me);
        }
    },
    
    /**
     * Shotrcut to addListeners
     * @method on
     */
    on: function() {
        this.addListeners.apply(this, arguments);
    },
    
    /**
     * Start all intervals
     * @method startAll
     * @param {String} name Interval name
     */
    startAll: function() {
        var me = this;
        
        me.collection.each(function(interval, index) {
            interval.start();
        });
    },
    
    /**
     * Stop all intervals
     * @method stopAll
     */
    stopAll: function() {
        var me = this;
        
        me.collection.each(function(interval, index) {
            interval.stop();
        });
    },
    
    /**
     * Clear all intervals
     * @method removeAll
     */
    removeAll: function() {
        var me = this;
        
        me.collection.each(function(interval, index) {
            interval.remove();
            me.collection.removeAt(index);
        });
    }
});