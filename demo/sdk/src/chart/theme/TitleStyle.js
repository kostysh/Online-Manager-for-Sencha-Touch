/**
 * @private
 *
 * @xtype title
 */
Ext.define('Ext.chart.theme.TitleStyle', {

    extend: 'Ext.chart.theme.Style',

    constructor: function (config) {
        this.callSuper(arguments);
    },

    /* ---------------------------------
     Methods needed for ComponentQuery
     ----------------------------------*/

    isXType: function (xtype) {
        return xtype === 'title';
    }
});
