/**
 * Cartesian sprite.
 */
Ext.define("Ext.chart.series.sprite.Cartesian", {
    extend: 'Ext.draw.sprite.Sprite',
    mixins: {
        markerHolder: "Ext.chart.series.sprite.MarkerHolder"
    },
    homogeneous: true,
    ascending: true,
    inheritableStatics: {
        def: {
            processors: {
                dataRange: 'default',
                dataY: function (n) {
                    if (n instanceof Float32Array) {
                        return n;
                    } else if (n) {
                        return new Float32Array(n);
                    }
                },
                dataX: 'default'
            },
            defaults: {
                dataY: null,
                dataX: null,
                dataRange: null
            },
            dirtyTriggers: {
                dataX: 'dataX,bbox',
                dataY: 'dataY,bbox',
                dataRange: 'bbox'
            },
            updaters: {
                'dataX': function (attrs) {
                    this.processDataX();
                    if (!attrs.dirtyFlags.dataY) {
                        attrs.dirtyFlags.dataY = [];
                    }
                    attrs.dirtyFlags.dataY.push('dataY');
                },
                'dataY': function () {
                    this.processDataY();
                }
            }
        }
    },

    processDataY: Ext.emptyFn,

    processDataX: Ext.emptyFn,

    getBBox: function (isWithoutTransform) {
        var attr = this.attr,
            matrix = attr.matrix,
            dataRange = attr.dataRange;
        if (dataRange) {
            if (isWithoutTransform) {
                return {
                    x: dataRange[0],
                    y: dataRange[1],
                    width: dataRange[2] - dataRange[0],
                    height: dataRange[3] - dataRange[1]
                };
            } else {
                return matrix.transformBBox({
                    x: dataRange[0],
                    y: dataRange[1],
                    width: dataRange[2] - dataRange[0],
                    height: dataRange[3] - dataRange[1]
                }, 0);
            }
        } else {
            return {x: 0, y: 0, width: 1, height: 1};
        }
    },

    render: function (surface, ctx, region) {
        var me = this,
            attr = me.attr,
            inverseMatrix = attr.inverseMatrix.clone();

        if (attr.dataX === null) {
            return;
        }
        if (attr.dataY === null) {
            return;
        }

        if (inverseMatrix.getXY() || inverseMatrix.getYX()) {
            console.log('Cartesian Series sprite does not support rotation/sheering');
            return;
        }
        inverseMatrix.postpendMatrix(surface.inverseMatrix);
        var clip = inverseMatrix.transformList([
            [region[0] - 1, region[3] + 1],
            [region[0] + region[2] + 1, -1]
        ]);

        clip = clip[0].concat(clip[1]);
        if (clip[2] < clip[0]) {
            console.log('Cartesian Series sprite does not supports flipped X.');
            // TODO: support it
            return;
        }
        me.renderClipped(surface, ctx, clip, region);
    },

    /**
     *
     * @param surface
     * @param ctx
     * @param clip
     * @param region
     */
    renderClipped: Ext.emptyFn
});