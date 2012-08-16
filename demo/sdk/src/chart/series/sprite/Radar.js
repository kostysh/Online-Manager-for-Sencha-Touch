/**
 * Cartesian sprite.
 */
Ext.define("Ext.chart.series.sprite.Radar", {
    alias: 'sprite.radar',
    extend: 'Ext.chart.series.sprite.Polar',

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
                bbox.transform = matrix.transformBBox(bbox.plain, 0)
            }
            return bbox.transform;
        }
    },

    render: function (surface, ctx, region) {
        var me = this,
            attr = me.attr,
            centerX = attr.centerX,
            centerY = attr.centerY,
            dataRange = attr.dataRange,
            minX = dataRange[0],
            minY = dataRange[1],
            maxX = dataRange[2],
            maxY = dataRange[3],
            dataX = attr.dataX,
            dataY = attr.dataY,
            endRho = attr.endRho,
            startRho = attr.startRho,
            baseRotation = attr.baseRotation,
            i, length = dataX.length,
            markerCfg = {},
            x, y, r, th;
        ctx.beginPath();
        for (i = 0; i < length; i++) {
            th = (dataX[i] - minX) / (maxX - minX) * 2 * Math.PI + baseRotation;
            r = dataY[i] / maxY * (endRho - startRho) + startRho;
            ctx.lineTo(x = centerX + Math.cos(th) * r, y = centerY + Math.sin(th) * r);
            markerCfg.translationX = x;
            markerCfg.translationY = y;
            me.putMarker('items', markerCfg);
        }
        ctx.closePath();
        ctx.fillStroke(attr);
    }
});