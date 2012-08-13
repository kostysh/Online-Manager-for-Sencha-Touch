/**
 * @filename OnlineManager.js
 *
 * @name Online status manager
 * @fileOverview Utility for detection of the online status, and something else
 *
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120813
 * @version 1.0
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0
 * @requires Ext.ux.util.Intervalr https://github.com/kostysh/Intervalr-for-Sencha-Touch
 * 
 * Usage:
    
    // Add to application/controller or view config
    requires: ['Ext.ux.util.OnlineManager']
    
    OnlineManager.on({
        'onlinechange': function(mode) {// Action callback
            if (mode) {
                console.log('We are online');
            } else {
                console.log('We are offline');
            }
        }
    });
    
    OnlineManager.start();
        
 *
 */

/**
 * @event onlinechange
 * Fired when online mode is changed
 * @param {Boolean} Current online mode
 * @param {Object} OnlineManager object
 */

/**
 * @event beforeonline
 * Fired before when going online
 * @param {Object} OnlineManager object
 */

/**
 * @event beforeoffline
 * Fired before when going offline
 * @param {Object} OnlineManager object
 */

/**
 * @event online
 * Fired when going online
 * @param {Object} OnlineManager object
 */

/**
 * @event offline
 * Fired when going offline
 * @param {Object} OnlineManager object
 */

/**
 * @event exception
 * Fired when exception occured
 * @param {Object} Error
 * @param {Object} OnlineManager object
 */

Ext.define('Ext.ux.util.OnlineManager', {
    mixins: ['Ext.mixin.Observable'],
    alternateClassName: 'OnlineManager',
    singleton: true,
    
    requires: [
        'Ext.device.Connection',
        'Ext.data.Connection',
        'Ext.ux.util.Intervalr'
    ],   
    
    /**
     * Ext.data.Connection instance
     * @private
     */
    watcher: null,
    
    /**
     * OnlineManager status
     * @private
     */
    started: false,
    
    config: {
        
        /**
         * Current online status
         * @private
         */
        online: false,
        
        /**
         * Lookup timeout
         * @cfg {Integer} timeout
         */
        timeout: 3000,
        
        /**
         * Url for lookup. 
         * For native apps you should use absolute, direct URL with 'http'
         * @cfg {String} url
         */
        url: 'resources/online.php'
    },
    
    /**
     * @private
     */
    constructor: function(config) {
        var me = this;
        
        // <debug>
        me.on({
            scope: me,
            exception: function() {
                console.log('OnlineManager exception: ', arguments);
            }
        });
        // </debug>
        
        me.watcher = Ext.create('Ext.data.Connection', {
            useDefaultXhrHeader: false,
            method: 'POST'
        });
        
        Intervalr.add('checkonline', {
            sequential: true,
            timeout: 5000,
            times: -1,
            listeners: {
                scope: me,
                execute: me.doOnlineCheck,
                exception: function(err) {
                    me.fireEvent('exception', err, me);
                }
            }
        });
        
        me.initConfig();
        return me;
    },
    
    /**
     * @private
     */
    applyUrl: function(newUrl) {
        if (newUrl) {
            this.watcher.setUrl(newUrl);
        }
    },
    
    /**
     * @private
     */
    updateUrl: function(newUrl) {
        if (newUrl) {
            this.watcher.setUrl(newUrl);
        }
    },
    
    /**
     * @private
     */
    applyTimeout: function(newTimeout) {
        if (newTimeout) {
            this.watcher.setTimeout(newTimeout);
        }
    },
    
    /**
     * @private
     */
    updateTimeout: function(newTimeout) {
        if (newTimeout) {
            this.watcher.setTimeout(newTimeout);
        }
    },
    
    /**
     * @private
     */
    updateOnline: function(newStatus, oldStatus) {
        var me = this;
        
        if (newStatus !== oldStatus) {
            me.fireEvent('onlinechange', newStatus, me);
            
            if (newStatus) {
                me.fireEvent('online', me);
            } else {
                me.fireEvent('offline', me);
            }
            
        }
    },
    
    /**
     * Check current online status
     * @private
     */
    doOnlineCheck: function() {
        var me = this;
        
        if (Ext.device.Connection.isOnline()) {
            me.watcher.request({
                synchronous: false,
                callback: function() {
                    
                    // @todo Restore lookup timeout on success
                    
                    Intervalr.ready('checkonline');
                    var currMode = arguments[1];

                    if (currMode !== me.isOnline()) {
                        if (currMode) {
                            me.fireAction('beforeonline', [me], me.onGoingOnline);
                        } else {
                            me.fireAction('beforeoffline', [me], me.onGoingOffline);
                        }
                    }
                },
                failure: function(response) {
                    
                    // @todo Increase lookup timeout on failures

                    me.fireEvent('exception', {
                        message: 'Request to server is failed',
                        response: response
                    }, me);
                }
            });
        } else {
            Intervalr.ready('checkonline');
            me.fireAction('beforeoffline', [me], me.onGoingOffline);
        }   
    },
    
    /**
     * Online action
     * @private
     */
    onGoingOnline: function() {
        var me = this;
        me.setOnline(true);
    },
    
    /**
     * Offline action
     * @private
     */
    onGoingOffline: function() {
        var me = this;
        me.setOnline(false);
    },
    
    /**
     * Start OnlineManager
     * @method start
     */
    start: function() {
        var me = this;
        
        if (!me.started) {
            me.started = true;
            Intervalr.start('checkonline');
        }
    },
    
    /**
     * Stop OnlineManager
     * @method stop
     */
    stop: function() {
        var me = this;
        
        if (me.started) {
            me.started = false;
            
            // If OnlineManager not works then we think what we online
            me.setOnline(true);
            Intervalr.stop('checkonline');
        }
    },
    
    /**
     * Current online status
     * @method isOnline
     * @return {Boolean} Online status
     */
    isOnline: function() {
        return this.getOnline();
    }
});