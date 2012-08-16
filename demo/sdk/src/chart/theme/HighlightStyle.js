/**
 * @private
 *
 * @xtype marker
 */
Ext.define('Ext.chart.theme.HighlightStyle', {

    extend: 'Ext.chart.theme.Style',

    constructor: function (config) {
        this.callSuper(arguments);
    },

    /* ---------------------------------
     Methods needed for ComponentQuery
     ----------------------------------*/

    isXType: function (xtype) {
        return xtype === 'highlight';
    },

    getRefItems: function (deep) {
        return [];
    }
});



