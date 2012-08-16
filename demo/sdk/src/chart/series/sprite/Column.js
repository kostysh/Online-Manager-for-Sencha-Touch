/**
 *
 */
Ext.define("Ext.chart.series.sprite.Column", {
    alias: 'sprite.columnSeries',
    extend: 'Ext.chart.series.sprite.StackedCartesian',

    inheritableStatics: {
        def: {
            processors: {
                maxBarWidth: 'number',
                minGapWidth: 'number'
            },
            defaults: {
                maxBarWidth: 6,
                minGapWidth: 5,
                transformFillStroke: true
            }
        }
    },

    renderClipped: function (surface, ctx, clip) {
        var me = this,
            attr = me.attr,
            dataX = attr.dataX,
            dataY = attr.dataY,
            dataStartY = attr.dataStartY,
            startY, y,
            lineWidth = ctx.lineWidth || 1,
            offset = lineWidth * 0.5 - Math.floor(lineWidth * 0.5),
            matrix = attr.matrix,
            maxBarWidth = (dataX[dataX.length - 1] - dataX[0]) / (dataX.length - 1) * matrix.getXX() - lineWidth - attr.minGapWidth,
            barWidth = Math.ceil(Math.min(maxBarWidth, attr.maxBarWidth) * 0.5) + offset,
            center, i,
            xx = matrix.elements[0],
            dx = matrix.elements[4],
            yy = matrix.elements[3],
            dy = Math.round(matrix.elements[5]) + offset,
            start = Math.max(0, Math.floor(clip[0])),
            end = Math.min(dataX.length - 1, Math.ceil(clip[2]));

        ctx.beginPath();
        if (dataStartY) {
            for (i = start; i <= end; i++) {
                center = Math.round(dataX[i] * xx + dx);
                startY = dataStartY[i];
                y = dataY[i];
                ctx.moveTo(center - barWidth, Math.round(startY * yy + lineWidth) + dy);
                ctx.lineTo(center - barWidth, Math.round(y * yy + lineWidth) + dy);
                ctx.lineTo(center + barWidth, Math.round(y * yy + lineWidth) + dy);
                ctx.lineTo(center + barWidth, Math.round(startY * yy + lineWidth) + dy);
                ctx.lineTo(center - barWidth, Math.round(startY * yy + lineWidth) + dy);
            }
        } else {
            // dataStartY[i] == 0;
            for (i = start; i <= end; i++) {
                center = Math.round(dataX[i] * xx + dx);
                y = dataY[i];
                ctx.moveTo(center - barWidth, dy);
                ctx.lineTo(center - barWidth, Math.round(y * yy + lineWidth) + dy);
                ctx.lineTo(center + barWidth, Math.round(y * yy + lineWidth) + dy);
                ctx.lineTo(center + barWidth, dy);
                ctx.lineTo(center - barWidth, dy);
            }
        }
        ctx.fillStroke(attr)
    }
});
