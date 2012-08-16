/**
 * Stacked cartesian sprite.
 */
Ext.define("Ext.chart.series.sprite.StackedCartesian", {
    extend: 'Ext.chart.series.sprite.Cartesian',
    inheritableStatics: {
        def: {
            processors: {
                dataStartY: function (n) {
                    if (n instanceof Float32Array) {
                        return n;
                    } else if (n) {
                        return new Float32Array(n);
                    }
                }
            },
            defaults: {
                dataStartY: null,
                transformFillStroke: true
            },
            dirtyTriggers: {
                dataStartY: 'dataY,bbox'
            }
        }
    }
});