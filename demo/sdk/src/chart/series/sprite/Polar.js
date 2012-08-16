/**
 * Polar sprite.
 */
Ext.define("Ext.chart.series.sprite.Polar", {
    mixins: {
        markerHolder: "Ext.chart.series.sprite.MarkerHolder"
    },
    extend: 'Ext.draw.sprite.Sprite',
    inheritableStatics: {
        def: {
            processors: {
                dataRange: 'default',
                dataY: function(n) {
                    if (n instanceof Float32Array) {
                        return n;
                    } else if (n) {
                        return new Float32Array(n);
                    }
                },
                dataX: 'default',
                centerX: 'number',
                centerY: 'number',
                startAngle: "number",
                endAngle: "number",
                startRho: "number",
                endRho: "number",
                baseRotation: "number"
            },
            defaults: {
                dataY: null,
                dataX: null,
                dataRange: null,
                centerX: 0,
                centerY: 0,
                startAngle: 0,
                endAngle: Math.PI,
                startRho: 0,
                endRho: 150,
                baseRotation: 0
            },
            dirtyTriggers: {
                dataX: 'bbox',
                dataY: 'bbox',
                dataRange: 'bbox',
                centerX: "bbox",
                centerY: "bbox",
                startAngle: "bbox",
                endAngle: "bbox",
                startRho: "bbox",
                endRho: "bbox",
                baseRotation: "bbox"
            }
        }
    },

    getBBox: function (isWithoutTransform) {
        var attr = this.attr,
            matrix = attr.matrix,
            bbox = attr.bbox;
        if (!bbox.plain) {
            bbox.plain = {
                x: attr.centerX - attr.endRho,
                y: attr.centerY + attr.endRho,
                width: attr.endRho * 2,
                height: attr.endRho * 2
            };
        }
        if (isWithoutTransform) {
            return bbox.plain;
        } else {
            if (!bbox.transform) {
                bbox.transform = matrix.transformBBox(bbox.plain, 0);
            }
            return bbox.transform;
        }
    }
});