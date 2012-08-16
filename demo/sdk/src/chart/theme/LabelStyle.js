/**
 * @private
 *
 * @xtype label
 */
Ext.define('Ext.chart.theme.LabelStyle', {

    extend: 'Ext.chart.theme.Style',

    constructor: function (config) {
        this.callSuper(arguments);
    },

    /* ---------------------------------
     Methods needed for ComponentQuery
     ----------------------------------*/

    isXType: function (xtype) {
        return xtype === 'label';
    }
});
