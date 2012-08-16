/**
 * TODO: Finish documentation
 *
 */
Ext.define('Ext.chart.series.Column', {

    extend: 'Ext.chart.series.StackedCartesian',

    alias: 'series.column',
    type: 'column',
    seriesType: 'columnSeries',

    requires: ['Ext.chart.series.sprite.Column'],

    config: {
        highlightCfg: {
            lineWidth: 3,
            stroke: '#55c',
            opacity: 0.8,
            color: '#f00'
        }
    }
});
